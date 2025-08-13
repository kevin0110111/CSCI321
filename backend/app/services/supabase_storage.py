# app/services/supabase_storage.py
import os
from supabase import create_client, Client
from fastapi import HTTPException, UploadFile
import uuid
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class SupabaseStorageService:
    def __init__(self):
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required")
        
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.models_bucket = "models"
        self.images_bucket = "images"
    
    async def upload_model_file(self, file: UploadFile, model_name: str, version: str) -> str:
        """
        Upload a model file to Supabase storage
        Returns the file path in storage
        """
        try:
            # Generate a unique filename
            file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
            unique_filename = f"{model_name}_{version}_{uuid.uuid4()}.{file_extension}"
            file_path = f"models/{unique_filename}"
            
            # Read file content
            file_content = await file.read()
            
            # Upload to Supabase storage
            try:
                result = self.supabase.storage.from_(self.models_bucket).upload(
                    file_path, 
                    file_content,
                    file_options={"content-type": file.content_type or "application/octet-stream"}
                )
                
                logger.info(f"Upload result: {result}")
                
                # Check the result structure
                if hasattr(result, 'error') and result.error:
                    raise Exception(f"Upload failed: {result.error}")
                
                return file_path
                
            except Exception as upload_error:
                error_msg = str(upload_error)
                logger.error(f"Upload error: {error_msg}")
                
                # Try alternative upload method or handle specific errors
                if "already exists" in error_msg.lower():
                    # Generate a new unique filename and try again
                    unique_filename = f"{model_name}_{version}_{uuid.uuid4()}_{uuid.uuid4().hex[:8]}.{file_extension}"
                    file_path = f"models/{unique_filename}"
                    
                    result = self.supabase.storage.from_(self.models_bucket).upload(
                        file_path, 
                        file_content,
                        file_options={"content-type": file.content_type or "application/octet-stream"}
                    )
                    return file_path
                else:
                    raise HTTPException(
                        status_code=500, 
                        detail=f"Failed to upload file: {error_msg}"
                    )
                
        except Exception as e:
            logger.error(f"File upload failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"File upload failed: {str(e)}"
            )
    
    async def upload_image_file(self, file: UploadFile, user_id: int) -> tuple[str, str]:
        """
        Upload an image file to Supabase storage
        Returns the file path and detected format
        """
        try:
            # Get file extension and validate it's an image
            if not file.filename:
                raise HTTPException(status_code=400, detail="No filename provided")
            
            file_extension = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
            allowed_formats = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff", "svg"]
            
            if file_extension not in allowed_formats:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Unsupported image format. Allowed formats: {', '.join(allowed_formats)}"
                )
            
            # Generate a unique filename
            original_name = file.filename.rsplit('.', 1)[0]  # Remove extension
            unique_filename = f"{user_id}_{original_name}_{uuid.uuid4()}.{file_extension}"
            file_path = f"images/{unique_filename}"
            
            # Read file content
            file_content = await file.read()
            
            # Determine content type based on extension
            content_type_map = {
                "jpg": "image/jpeg", "jpeg": "image/jpeg",
                "png": "image/png", "gif": "image/gif",
                "bmp": "image/bmp", "webp": "image/webp",
                "tiff": "image/tiff", "svg": "image/svg+xml"
            }
            content_type = content_type_map.get(file_extension, "image/jpeg")
            
            # Upload to Supabase storage
            try:
                result = self.supabase.storage.from_(self.images_bucket).upload(
                    file_path, 
                    file_content,
                    file_options={"content-type": content_type}
                )
                
                logger.info(f"Image upload result: {result}")
                
                # Check the result structure
                if hasattr(result, 'error') and result.error:
                    raise Exception(f"Upload failed: {result.error}")
                
                return file_path, file_extension
                
            except Exception as upload_error:
                error_msg = str(upload_error)
                logger.error(f"Image upload error: {error_msg}")
                
                if "already exists" in error_msg.lower():
                    # Generate a new unique filename and try again
                    unique_filename = f"{user_id}_{original_name}_{uuid.uuid4()}_{uuid.uuid4().hex[:8]}.{file_extension}"
                    file_path = f"images/{unique_filename}"
                    
                    result = self.supabase.storage.from_(self.images_bucket).upload(
                        file_path, 
                        file_content,
                        file_options={"content-type": content_type}
                    )
                    return file_path, file_extension
                else:
                    raise HTTPException(
                        status_code=500, 
                        detail=f"Failed to upload image: {error_msg}"
                    )
                
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Image upload failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Image upload failed: {str(e)}"
            )
    
    def get_image_url(self, file_path: str) -> str:
        """
        Get the public URL for an image file in Supabase storage
        """
        try:
            url = self.supabase.storage.from_(self.images_bucket).get_public_url(file_path)
            return url
        except Exception as e:
            logger.error(f"Failed to get image URL: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get image URL: {str(e)}"
            )
    
    async def delete_image_file(self, file_path: str) -> bool:
        """
        Delete an image file from Supabase storage
        """
        try:
            result = self.supabase.storage.from_(self.images_bucket).remove([file_path])
            logger.info(f"Image delete result: {result}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete image {file_path}: {str(e)}")
            return False
    
    def get_file_url(self, file_path: str) -> str:
        """
        Get the public URL for a file in Supabase storage
        """
        try:
            url = self.supabase.storage.from_(self.models_bucket).get_public_url(file_path)
            return url
        except Exception as e:
            logger.error(f"Failed to get file URL: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get file URL: {str(e)}"
            )
    
    async def delete_file(self, file_path: str) -> bool:
        """
        Delete a file from Supabase storage
        """
        try:
            result = self.supabase.storage.from_(self.models_bucket).remove([file_path])
            logger.info(f"Delete result: {result}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete file {file_path}: {str(e)}")
            return False

# Create a global instance
storage_service = SupabaseStorageService()