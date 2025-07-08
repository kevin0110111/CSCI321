from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db

from ..models.Account import Account
from ..models.Role import Role

router = APIRouter(prefix="/accounts/{account_id}/roles", tags=["account-roles"])

@router.post("/{role_id}")
def assign_role_to_account(
    account_id: int,
    role_id: int,
    db: Session = Depends(get_db)
):
    # Get account and role
    account = db.query(Account).filter(Account.account_id == account_id).first()
    role = db.query(Role).filter(Role.role_id == role_id).first()
    
    if not account or not role:
        raise HTTPException(status_code=404, detail="Account or Role not found")
    
    # Assign role (SQLAlchemy handles the association table)
    account.role.append(role)
    db.commit()
    return {"message": f"Role {role.role_name} assigned to account {account.username}"}

@router.delete("/{role_id}")
def remove_role_from_account(
    account_id: int,
    role_id: int,
    db: Session = Depends(get_db)
):
    account = db.query(Account).filter(Account.account_id == account_id).first()
    role = db.query(Role).filter(Role.role_id == role_id).first()
    
    if not account or not role:
        raise HTTPException(status_code=404, detail="Account or Role not found")
    
    # Remove role
    account.role.remove(role)
    db.commit()
    return {"message": f"Role {role.role_name} removed from account {account.username}"}