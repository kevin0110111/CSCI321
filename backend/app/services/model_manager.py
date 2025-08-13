# backend/app/services/model_manager_image.py
import os
import io
import asyncio
import torch
import numpy as np
from PIL import Image
from app.services.supabase_storage import storage_service
from app.database import SessionLocal
from app.crud.Model import get_models
from torchvision import transforms
from ultralytics import YOLO

class DetectModelManager:
    def __init__(self):
        self._detect_model = None
        self._disease_model = None
        self._count_model = None
        self._lock = asyncio.Lock()
        self._ready = False

    def is_ready(self) -> bool:
        return self._ready and self._count_model is not None and self._disease_model is not None

    async def init_async(self):
        """load all model to cache"""
        async with self._lock:
            count_path  = await self._resolve_active_model_path("count")
            disease_path = await self._resolve_active_model_path("disease")
            detect_path = await self._resolve_active_model_path("detect")
            count_local = await self._download_to_cache(count_path)
            self._count_model = YOLO(count_local)
            self._disease_model = self._load_full_pt(await self._download_to_cache(disease_path))
            self._detect_model  = self._load_full_pt(await self._download_to_cache(detect_path))
            self._ready = True

    async def _ensure_loaded(self, task: str):
        """兜底：首次推理时加载模型"""
        if task == "detect" and self._detect_model is None:
            detect_path = await self._resolve_active_model_path("detect")
            self._detect_model = self._load_full_pt(await self._download_to_cache(detect_path))
        if task == "disease" and self._disease_model is None:
            disease_path = await self._resolve_active_model_path("disease")
            self._disease_model = self._load_full_pt(await self._download_to_cache(disease_path))
        if task == "count" and self._count_model is None:
            count_path = await self._resolve_active_model_path("count")
            self._count_model = self._load_full_pt(await self._download_to_cache(count_path))

    '''async def predict_bytes(self, image_bytes: bytes, task: str) -> dict:
        """统一推理入口"""
        await self._ensure_loaded(task)
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        input_tensor = self._preprocess(img)

        if task == "detect":
            if self._detect_model is None:
                raise RuntimeError("Detect model is not loaded.")
            with torch.no_grad():
                output = self._detect_model(input_tensor)
                pred = output.argmax(1).item()
            return {"result": "maize" if pred == 1 else "others"}
        
        elif task == "disease":
            if self._disease_model is None:
                raise RuntimeError("Disease model is not loaded.")
            with torch.no_grad():
                output = self._disease_model(input_tensor)
                pred = output.argmax(1).item()
            return {"result": f"disease_{pred}"}
        
        elif task == "count":
            if self._count_model is None:
                raise RuntimeError("Count model is not loaded.")
            with torch.no_grad():
                output = self._count_model(input_tensor)
                count = int(output.item())
            return {"result": count}
        
        else:
            raise ValueError("Unknown task type")'''

    async def _resolve_active_model_path(self, kind: str) -> str:
        target_name = kind
        db = SessionLocal()
        try:
            rows = get_models(db)
            # 精确匹配 name，其次包含匹配
            candidates = [m for m in rows if (str(m.name) == target_name and bool(m.is_active))]
            if not candidates:
                candidates = [m for m in rows if (target_name in str(m.name or "")) and bool(m.is_active)]
            # 按上传时间/ID 取最新
            candidates.sort(key=lambda x: getattr(x, "upload_time", None) or getattr(x, "model_id", 0), reverse=True)
            if candidates:
                return getattr(candidates[0], "file_path")
            raise RuntimeError(f"No active model found for kind: {kind}")
        finally:
            db.close()

    def _cache_path(self, storage_path: str) -> str:
        """本地缓存路径"""
        cache_dir = "/tmp/models"
        os.makedirs(cache_dir, exist_ok=True)
        return os.path.join(cache_dir, os.path.basename(storage_path))

    async def _download_to_cache(self, storage_path: str) -> str:
        """从 Supabase 下载模型到本地缓存"""
        cache_path = self._cache_path(storage_path)
        if not os.path.exists(cache_path):
            url = storage_service.get_file_url(storage_path)
            import requests
            resp = requests.get(url)
            with open(cache_path, "wb") as f:
                f.write(resp.content)
        return cache_path

    def _load_full_pt(self, local_path: str):
        """加载模型"""
        m = torch.load(local_path, map_location="cpu", weights_only=False)
        return m.eval()

    def _Resnet_preprocess(self, img):
        """图像预处理（需根据你的模型实际调整）"""
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406],
                                 [0.229, 0.224, 0.225])
        ])
        return transform(img).unsqueeze(0)

model_manager = DetectModelManager()
