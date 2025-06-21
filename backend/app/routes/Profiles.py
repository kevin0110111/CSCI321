from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.Profile import Profile, ProfileCreate, ProfileUpdate
from app.database import get_database

router = APIRouter()

@router.post("/", response_model=Profile)
async def create_profile(profile: ProfileCreate, db=Depends(get_database)):
    try:
        """Create a new profile"""
        profile_dict = profile.model_dump()
        
        # Check if profile_name already exists
        existing_profile = await db.profiles.find_one({"profile_name": profile_dict["profile_name"]})
        if existing_profile:
            raise HTTPException(status_code=400, detail="Profile name already exists")
        
        result = await db.profiles.insert_one(profile_dict)
        created_profile = await db.profiles.find_one({"_id": result.inserted_id})
        
        # Convert MongoDB _id to profile_id for response
        created_profile["profile_id"] = str(created_profile["_id"])
        created_profile.pop("_id", None)
        
        return Profile(**created_profile)

    except HTTPException:
        raise
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

@router.get("/", response_model=List[Profile])
async def get_profiles(db=Depends(get_database)):
    """Get all profiles"""
    profiles = []
    async for profile in db.profiles.find():
        profile["profile_id"] = str(profile["_id"])
        profile.pop("_id", None)
        profiles.append(Profile(**profile))
    return profiles

@router.get("/{profile_id}", response_model=Profile)
async def get_profile(profile_id: str, db=Depends(get_database)):
    """Get a specific profile by ID"""
    from bson import ObjectId
    
    if not ObjectId.is_valid(profile_id):
        raise HTTPException(status_code=400, detail="Invalid profile ID format")
    
    profile = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    if profile:
        profile["profile_id"] = str(profile["_id"])
        profile.pop("_id", None)
        return Profile(**profile)
    raise HTTPException(status_code=404, detail="Profile not found")

@router.put("/{profile_id}", response_model=Profile)
async def update_profile(profile_id: str, profile_update: ProfileUpdate, db=Depends(get_database)):
    """Update a specific profile"""
    from bson import ObjectId
    
    if not ObjectId.is_valid(profile_id):
        raise HTTPException(status_code=400, detail="Invalid profile ID format")
    
    # Only include fields that are not None
    update_data = {k: v for k, v in profile_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # Check if profile_name already exists (if being updated)
    if "profile_name" in update_data:
        existing_profile = await db.profiles.find_one({
            "profile_name": update_data["profile_name"],
            "_id": {"$ne": ObjectId(profile_id)}
        })
        if existing_profile:
            raise HTTPException(status_code=400, detail="Profile name already exists")
    
    result = await db.profiles.update_one({"_id": ObjectId(profile_id)}, {"$set": update_data})
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    updated_profile = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    updated_profile["profile_id"] = str(updated_profile["_id"])
    updated_profile.pop("_id", None)
    
    return Profile(**updated_profile)

@router.delete("/{profile_id}")
async def delete_profile(profile_id: str, db=Depends(get_database)):
    """Delete a specific profile"""
    from bson import ObjectId
    
    if not ObjectId.is_valid(profile_id):
        raise HTTPException(status_code=400, detail="Invalid profile ID format")
    
    # Check if any accounts are associated with this profile
    account_count = await db.accounts.count_documents({"profile_id": ObjectId(profile_id)})
    if account_count > 0:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete profile. There are accounts associated with this profile."
        )
    
    result = await db.profiles.delete_one({"_id": ObjectId(profile_id)})
    if result.deleted_count:
        return {"message": "Profile deleted successfully", "deleted_id": profile_id}
    raise HTTPException(status_code=404, detail="Profile not found")

@router.get("/{profile_id}/accounts", response_model=List[dict])
async def get_profile_accounts(profile_id: str, db=Depends(get_database)):
    """Get all accounts associated with a specific profile"""
    from bson import ObjectId
    
    if not ObjectId.is_valid(profile_id):
        raise HTTPException(status_code=400, detail="Invalid profile ID format")
    
    # First check if profile exists
    profile = await db.profiles.find_one({"_id": ObjectId(profile_id)})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    accounts = []
    async for account in db.accounts.find({"profile_id": ObjectId(profile_id)}):
        account["account_id"] = str(account["_id"])
        account["profile_id"] = str(account["profile_id"])
        account.pop("_id", None)
        # Remove password from response for security
        account.pop("password", None)
        accounts.append(account)
    
    return accounts