from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud
from app.schemas.BugReport import (
    BugReportCreate, 
    BugReportUpdate, 
    BugReportResponse, 
    BugReportResolve,
    BugReportStatusUpdate,
    BugReportStatusEnum
)
from ..database import get_db

router = APIRouter(prefix="/bugreports", tags=["bugreports"])

@router.post("/", response_model=BugReportResponse)
def create_bug_report(bug_report: BugReportCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = crud.get_account(db, account_id=bug_report.user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    return crud.create_bug_report(db=db, bug_report=bug_report)

@router.get("/", response_model=List[BugReportResponse])
def read_bug_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    bug_reports = crud.get_bug_reports(db, skip=skip, limit=limit)
    return bug_reports

@router.get("/{bug_id}", response_model=BugReportResponse)
def read_bug_report(bug_id: int, db: Session = Depends(get_db)):
    db_bug_report = crud.get_bug_report(db, bug_id=bug_id)
    if db_bug_report is None:
        raise HTTPException(status_code=404, detail="Bug report not found")
    return db_bug_report

@router.get("/user/{user_id}", response_model=List[BugReportResponse])
def read_bug_reports_by_user(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = crud.get_account(db, account_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    bug_reports = crud.get_bug_reports_by_user(db, user_id=user_id, skip=skip, limit=limit)
    return bug_reports

@router.get("/status/{status}", response_model=List[BugReportResponse])
def read_bug_reports_by_status(status: BugReportStatusEnum, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    bug_reports = crud.get_bug_reports_by_status(db, status=status, skip=skip, limit=limit)
    return bug_reports

@router.get("/agent/{agent_id}", response_model=List[BugReportResponse])
def read_bug_reports_by_agent(agent_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Check if agent exists
    db_agent = crud.get_account(db, account_id=agent_id)
    if not db_agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found"
        )
    
    bug_reports = crud.get_bug_reports_by_agent(db, agent_id=agent_id, skip=skip, limit=limit)
    return bug_reports

@router.put("/{bug_id}", response_model=BugReportResponse)
def update_bug_report(bug_id: int, bug_report: BugReportUpdate, db: Session = Depends(get_db)):
    db_bug_report = crud.update_bug_report(db, bug_id=bug_id, bug_report=bug_report)
    if db_bug_report is None:
        raise HTTPException(status_code=404, detail="Bug report not found")
    return db_bug_report

@router.patch("/{bug_id}/status", response_model=BugReportResponse)
def update_bug_report_status(bug_id: int, status_update: BugReportStatusUpdate, db: Session = Depends(get_db)):
    db_bug_report = crud.update_bug_report_status(db, bug_id=bug_id, status=status_update.status)
    if db_bug_report is None:
        raise HTTPException(status_code=404, detail="Bug report not found")
    return db_bug_report

@router.post("/{bug_id}/resolve", response_model=BugReportResponse)
def resolve_bug_report(bug_id: int, resolve_data: BugReportResolve, db: Session = Depends(get_db)):
    # Check if agent exists
    db_agent = crud.get_account(db, account_id=resolve_data.resolved_by_agent_id)
    if not db_agent:
        raise HTTPException(
            status_code=404,
            detail="Agent not found"
        )
    
    db_bug_report = crud.resolve_bug_report(db, bug_id=bug_id, resolve_data=resolve_data)
    if db_bug_report is None:
        raise HTTPException(status_code=404, detail="Bug report not found")
    return db_bug_report

@router.delete("/{bug_id}")
def delete_bug_report(bug_id: int, db: Session = Depends(get_db)):
    db_bug_report = crud.delete_bug_report(db, bug_id=bug_id)
    if db_bug_report is None:
        raise HTTPException(status_code=404, detail="Bug report not found")
    return {"message": "Bug report deleted successfully"}