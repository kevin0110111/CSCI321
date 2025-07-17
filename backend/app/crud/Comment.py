from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql import func
from ..models.Comment import Comment
from ..schemas.Comment import CommentCreate, CommentUpdate, CommentReply

def get_comment(db: Session, comment_id: int):
    return db.query(Comment).filter(Comment.comment_id == comment_id).first()

def get_comments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Comment).offset(skip).limit(limit).all()

def get_comments_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Comment).filter(Comment.user_id == user_id).offset(skip).limit(limit).all()

def get_comments_by_agent(db: Session, agent_id: int, skip: int = 0, limit: int = 100):
    return db.query(Comment).filter(Comment.replied_agent_id == agent_id).offset(skip).limit(limit).all()

def create_comment(db: Session, comment: CommentCreate):
    db_comment = Comment(
        user_id=comment.user_id,
        content=comment.content,
        rating=comment.rating,
        is_anonymous=comment.is_anonymous
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def update_comment(db: Session, comment_id: int, comment: CommentUpdate):
    db_comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
    if db_comment:
        update_data = comment.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_comment, field, value)
        db.commit()
        db.refresh(db_comment)
    return db_comment

def reply_to_comment(db: Session, comment_id: int, reply: CommentReply):
    db_comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
    if db_comment:
        db_comment.reply_content = reply.reply_content
        db_comment.replied_agent_id = reply.replied_agent_id
        db_comment.replied_at = func.current_date()
        db.commit()
        db.refresh(db_comment)
    return db_comment

def delete_comment(db: Session, comment_id: int):
    db_comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
    if db_comment:
        db.delete(db_comment)
        db.commit()
    return db_comment