from sqlalchemy.orm import Session
from passlib.context import CryptContext
from ..models.Account import Account
from ..models.Profile import Profile
from ..schemas.Account import AccountCreate, AccountUpdate, AccountWithProfileCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_account(db: Session, account_id: int):
    return db.query(Account).filter(Account.account_id == account_id).first()

def get_account_by_email(db: Session, email: str):
    return db.query(Account).filter(Account.email == email).first()

def get_account_by_username(db: Session, username: str):
    return db.query(Account).filter(Account.username == username).first()

def get_accounts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Account).offset(skip).limit(limit).all()

def create_account(db: Session, account: AccountCreate):
    hashed_password = pwd_context.hash(account.password)
    db_account = Account(
        username=account.username,
        email=account.email,
        avatar_url=account.avatar_url,
        region=account.region,
        password=hashed_password,
        state=account.state,
        is_premium=account.is_premium,
        subscription_expiry=account.subscription_expiry
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def create_account_with_profile(db: Session, account_data: AccountWithProfileCreate):
    # Create account first
    hashed_password = pwd_context.hash(account_data.password)
    account = Account(
        username=account_data.username,
        email=account_data.email,
        avatar_url=account_data.avatar_url,
        region=account_data.region,
        password=hashed_password,
        is_premium=account_data.is_premium,
        subscription_expiry=account_data.subscription_expiry
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    
    # Create profile with account_id
    profile = Profile(
        account_id=account.account_id,
        name=account_data.name,
        dob=account_data.dob,
        job=account_data.job,
        institution=account_data.institution,
        reason_foruse=account_data.reason_foruse,
        preferred_language=account_data.profile_preferred_language
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    return account

def update_account(db: Session, account_id: int, account: AccountUpdate):
    db_account = db.query(Account).filter(Account.account_id == account_id).first()
    if db_account:
        update_data = account.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_account, field, value)
        db.commit()
        db.refresh(db_account)
    return db_account

def delete_account(db: Session, account_id: int):
    db_account = db.query(Account).filter(Account.account_id == account_id).first()
    if db_account:
        db.delete(db_account)
        db.commit()
    return db_account