from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.Account import Account, AccountCreate, AccountUpdate, AccountLogin, AccountResponse
from app.database import get_database
from passlib.context import CryptContext
from datetime import datetime

router = APIRouter()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/", response_model=AccountResponse)
async def create_account(account: AccountCreate, db=Depends(get_database)):
    """Create a new account"""
    from bson import ObjectId
    
    account_dict = account.model_dump(by_alias=True)
    
    # Check if profile exists
    profile = await db.profiles.find_one({"_id": ObjectId(str(account_dict["profile_id"]))})
    if not profile:
        raise HTTPException(status_code=400, detail="Profile not found")
    
    # Check if username already exists
    existing_username = await db.accounts.find_one({"username": account_dict["username"]})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Check if email already exists
    existing_email = await db.accounts.find_one({"email": account_dict["email"]})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Hash the password
    account_dict["password"] = hash_password(account_dict["password"])
    
    # Convert profile_id to ObjectId for MongoDB storage
    account_dict["profile_id"] = ObjectId(str(account_dict["profile_id"]))

    # Convert date fields to datetime
    account_dict["dob"] = datetime.combine(account_dict["dob"], datetime.min.time())
    if "subscription_expiry" in account_dict and account_dict["subscription_expiry"]:
        account_dict["subscription_expiry"] = datetime.combine(account_dict["subscription_expiry"], datetime.min.time())
    account_dict["createDate"] = datetime.combine(account_dict["createDate"], datetime.min.time())
    
    result = await db.accounts.insert_one(account_dict)
    created_account = await db.accounts.find_one({"_id": result.inserted_id})
    
    # Convert ObjectIds to strings for response
    created_account["account_id"] = str(created_account["_id"])
    created_account["profile_id"] = str(created_account["profile_id"])
    created_account.pop("_id", None)
    created_account.pop("password", None)  # Remove password from response
    
    return AccountResponse(**created_account)

@router.get("/", response_model=List[AccountResponse])
async def get_accounts(db=Depends(get_database)):
    """Get all accounts"""
    accounts = []
    async for account in db.accounts.find():
        account["account_id"] = str(account["_id"])
        account["profile_id"] = str(account["profile_id"])
        account.pop("_id", None)
        account.pop("password", None)  # Remove password from response
        accounts.append(AccountResponse(**account))
    return accounts

@router.get("/{account_id}", response_model=AccountResponse)
async def get_account(account_id: str, db=Depends(get_database)):
    """Get a specific account by ID"""
    from bson import ObjectId
    
    if not ObjectId.is_valid(account_id):
        raise HTTPException(status_code=400, detail="Invalid account ID format")
    
    account = await db.accounts.find_one({"_id": ObjectId(account_id)})
    if account:
        account["account_id"] = str(account["_id"])
        account["profile_id"] = str(account["profile_id"])
        account.pop("_id", None)
        account.pop("password", None)  # Remove password from response
        return AccountResponse(**account)
    raise HTTPException(status_code=404, detail="Account not found")

@router.put("/{account_id}", response_model=AccountResponse)
async def update_account(account_id: str, account_update: AccountUpdate, db=Depends(get_database)):
    """Update a specific account"""
    from bson import ObjectId
    
    if not ObjectId.is_valid(account_id):
        raise HTTPException(status_code=400, detail="Invalid account ID format")
    
    # Only include fields that are not None
    update_data = {k: v for k, v in account_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # Check uniqueness constraints if username or email are being updated
    if "username" in update_data:
        existing_username = await db.accounts.find_one({
            "username": update_data["username"],
            "_id": {"$ne": ObjectId(account_id)}
        })
        if existing_username:
            raise HTTPException(status_code=400, detail="Username already exists")
    
    if "email" in update_data:
        existing_email = await db.accounts.find_one({
            "email": update_data["email"],
            "_id": {"$ne": ObjectId(account_id)}
        })
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already exists")
    
    # Hash password if it's being updated
    if "password" in update_data:
        update_data["password"] = hash_password(update_data["password"])
    
    result = await db.accounts.update_one({"_id": ObjectId(account_id)}, {"$set": update_data})
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Account not found")
    
    updated_account = await db.accounts.find_one({"_id": ObjectId(account_id)})
    updated_account["account_id"] = str(updated_account["_id"])
    updated_account["profile_id"] = str(updated_account["profile_id"])
    updated_account.pop("_id", None)
    updated_account.pop("password", None)  # Remove password from response
    
    return AccountResponse(**updated_account)

@router.delete("/{account_id}")
async def delete_account(account_id: str, db=Depends(get_database)):
    """Delete a specific account"""
    from bson import ObjectId
    
    if not ObjectId.is_valid(account_id):
        raise HTTPException(status_code=400, detail="Invalid account ID format")
    
    result = await db.accounts.delete_one({"_id": ObjectId(account_id)})
    if result.deleted_count:
        return {"message": "Account deleted successfully", "deleted_id": account_id}
    raise HTTPException(status_code=404, detail="Account not found")

@router.post("/login")
async def login(credentials: AccountLogin, db=Depends(get_database)):
    """Authenticate user login"""
    account = await db.accounts.find_one({"username": credentials.username})
    
    if not account:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    if not verify_password(credentials.password, account["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    if account["state"] == "suspended":
        raise HTTPException(status_code=403, detail="Account is suspended")
    
    # Return account info without password
    account["account_id"] = str(account["_id"])
    account["profile_id"] = str(account["profile_id"])
    account.pop("_id", None)
    account.pop("password", None)
    
    return {
        "message": "Login successful",
        "account": AccountResponse(**account)
    }

@router.post("/{account_id}/suspend")
async def suspend_account(account_id: str, db=Depends(get_database)):
    """Suspend an account"""
    from bson import ObjectId
    
    if not ObjectId.is_valid(account_id):
        raise HTTPException(status_code=400, detail="Invalid account ID format")
    
    result = await db.accounts.update_one(
        {"_id": ObjectId(account_id)}, 
        {"$set": {"state": "suspended"}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return {"message": "Account suspended successfully", "account_id": account_id}

@router.post("/{account_id}/activate")
async def activate_account(account_id: str, db=Depends(get_database)):
    """Activate a suspended account"""
    from bson import ObjectId
    
    if not ObjectId.is_valid(account_id):
        raise HTTPException(status_code=400, detail="Invalid account ID format")
    
    result = await db.accounts.update_one(
        {"_id": ObjectId(account_id)}, 
        {"$set": {"state": "active"}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return {"message": "Account activated successfully", "account_id": account_id}

@router.post("/{account_id}/premium")
async def upgrade_to_premium(account_id: str, subscription_expiry: datetime, db=Depends(get_database)):
    """Upgrade account to premium"""
    from bson import ObjectId
    
    if not ObjectId.is_valid(account_id):
        raise HTTPException(status_code=400, detail="Invalid account ID format")
    
    result = await db.accounts.update_one(
        {"_id": ObjectId(account_id)}, 
        {"$set": {"is_premium": True, "subscription_expiry": subscription_expiry}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return {
        "message": "Account upgraded to premium successfully", 
        "account_id": account_id,
        "subscription_expiry": subscription_expiry
    }