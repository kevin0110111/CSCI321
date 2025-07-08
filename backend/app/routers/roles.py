from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud
from ..schemas.Role import RoleCreate, RoleUpdate, RoleResponse
from ..database import get_db

router = APIRouter(prefix="/roles", tags=["roles"])

@router.post("/", response_model=RoleResponse)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    # Check if role name already exists
    db_role = crud.get_role_by_name(db, role_name=role.role_name)
    if db_role:
        raise HTTPException(
            status_code=400,
            detail="Role name already exists"
        )
    return crud.create_role(db=db, role=role)

@router.get("/", response_model=List[RoleResponse])
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    roles = crud.get_roles(db, skip=skip, limit=limit)
    return roles

@router.get("/{role_id}", response_model=RoleResponse)
def read_role(role_id: int, db: Session = Depends(get_db)):
    db_role = crud.get_role(db, role_id=role_id)
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return db_role

@router.get("/by-name/{role_name}", response_model=RoleResponse)
def read_role_by_name(role_name: str, db: Session = Depends(get_db)):
    db_role = crud.get_role_by_name(db, role_name=role_name)
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return db_role

@router.put("/{role_id}", response_model=RoleResponse)
def update_role(role_id: int, role: RoleUpdate, db: Session = Depends(get_db)):
    # Check if role name already exists (if being updated)
    if role.role_name:
        db_role = crud.get_role_by_name(db, role_name=role.role_name)
        if db_role and db_role.role_id != role_id:
            raise HTTPException(
                status_code=400,
                detail="Role name already exists"
            )
    
    db_role = crud.update_role(db, role_id=role_id, role=role)
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return db_role

@router.delete("/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    db_role = crud.delete_role(db, role_id=role_id)
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return {"message": "Role deleted successfully"}