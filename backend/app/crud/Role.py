from sqlalchemy.orm import Session
from ..models.Role import Role
from ..schemas.Role import RoleCreate, RoleUpdate

def get_role(db: Session, role_id: int):
    return db.query(Role).filter(Role.role_id == role_id).first()

def get_role_by_name(db: Session, role_name: str):
    return db.query(Role).filter(Role.role_name == role_name).first()

def get_roles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Role).offset(skip).limit(limit).all()

def create_role(db: Session, role: RoleCreate):
    db_role = Role(
        role_name=role.role_name,
        description=role.description,
        state=role.state
    )
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def update_role(db: Session, role_id: int, role: RoleUpdate):
    db_role = db.query(Role).filter(Role.role_id == role_id).first()
    if db_role:
        update_data = role.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_role, field, value)
        db.commit()
        db.refresh(db_role)
    return db_role

def delete_role(db: Session, role_id: int):
    db_role = db.query(Role).filter(Role.role_id == role_id).first()
    if db_role:
        db.delete(db_role)
        db.commit()
    return db_role