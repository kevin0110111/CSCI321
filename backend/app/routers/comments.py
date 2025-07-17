from app.models import Comment
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List

from .. import crud
from app.schemas.Comment import CommentCreate, CommentUpdate, CommentResponse, CommentReply
from ..database import get_db

router = APIRouter(prefix="/comments", tags=["comments"])

@router.post("/", response_model=CommentResponse)
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = crud.get_account(db, account_id=comment.user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Validate rating range (assuming 1-5 scale)
    if comment.rating < 1 or comment.rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )
    
    return crud.create_comment(db=db, comment=comment)

@router.get("/count")
def get_comments_count(db: Session = Depends(get_db)):
    count = db.query(func.count(Comment.comment_id)).scalar()
    return {"total": count}

@router.get("/", response_model=List[CommentResponse])
def read_comments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    comments = crud.get_comments(db, skip=skip, limit=limit)
    return comments

@router.get("/{comment_id}", response_model=CommentResponse)
def read_comment(comment_id: int, db: Session = Depends(get_db)):
    db_comment = crud.get_comment(db, comment_id=comment_id)
    if db_comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    return db_comment

@router.get("/user/{user_id}", response_model=List[CommentResponse])
def read_comments_by_user(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = crud.get_account(db, account_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    comments = crud.get_comments_by_user(db, user_id=user_id, skip=skip, limit=limit)
    return comments

@router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(comment_id: int, comment: CommentUpdate, db: Session = Depends(get_db)):
    # Validate rating range if provided
    if comment.rating and (comment.rating < 1 or comment.rating > 5):
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )
    
    db_comment = crud.update_comment(db, comment_id=comment_id, comment=comment)
    if db_comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    return db_comment

@router.post("/{comment_id}/reply", response_model=CommentResponse)
def reply_to_comment(comment_id: int, reply: CommentReply, db: Session = Depends(get_db)):
    # Check if agent exists
    db_agent = crud.get_account(db, account_id=reply.replied_agent_id)
    if not db_agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found"
        )
    
    db_comment = crud.reply_to_comment(db, comment_id=comment_id, reply=reply)
    if db_comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    return db_comment

@router.delete("/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    db_comment = crud.delete_comment(db, comment_id=comment_id)
    if db_comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Comment deleted successfully"}