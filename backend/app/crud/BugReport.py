from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from ..models.BugReport import BugReport, BugReportStatusEnum
from ..schemas.BugReport import BugReportCreate, BugReportUpdate, BugReportResolve

def get_bug_report(db: Session, bug_id: int):
    return db.query(BugReport).filter(BugReport.bug_id == bug_id).first()

def get_bug_reports(db: Session, skip: int = 0, limit: int = 100):
    return db.query(BugReport).offset(skip).limit(limit).all()

def get_bug_reports_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(BugReport).filter(BugReport.user_id == user_id).offset(skip).limit(limit).all()

def get_bug_reports_by_status(db: Session, status: BugReportStatusEnum, skip: int = 0, limit: int = 100):
    return db.query(BugReport).filter(BugReport.status == status).offset(skip).limit(limit).all()

def get_bug_reports_by_agent(db: Session, agent_id: int, skip: int = 0, limit: int = 100):
    return db.query(BugReport).filter(BugReport.resolved_by_agent_id == agent_id).offset(skip).limit(limit).all()

def create_bug_report(db: Session, bug_report: BugReportCreate):
    db_bug_report = BugReport(
        user_id=bug_report.user_id,
        title=bug_report.title,
        description=bug_report.description
    )
    db.add(db_bug_report)
    db.commit()
    db.refresh(db_bug_report)
    return db_bug_report

def update_bug_report(db: Session, bug_id: int, bug_report: BugReportUpdate):
    db_bug_report = db.query(BugReport).filter(BugReport.bug_id == bug_id).first()
    if db_bug_report:
        update_data = bug_report.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_bug_report, field, value)
        db.commit()
        db.refresh(db_bug_report)
    return db_bug_report

def update_bug_report_status(db: Session, bug_id: int, status: BugReportStatusEnum):
    db_bug_report = db.query(BugReport).filter(BugReport.bug_id == bug_id).first()
    if db_bug_report:
        db_bug_report.status = status
        db.commit()
        db.refresh(db_bug_report)
    return db_bug_report

def resolve_bug_report(db: Session, bug_id: int, resolve_data: BugReportResolve):
    db_bug_report = db.query(BugReport).filter(BugReport.bug_id == bug_id).first()
    if db_bug_report:
        db_bug_report.status = BugReportStatusEnum.resolved
        db_bug_report.resolved_by_agent_id = resolve_data.resolved_by_agent_id
        db_bug_report.resolved_at = func.current_date()
        db_bug_report.resolution_note = resolve_data.resolution_note
        db.commit()
        db.refresh(db_bug_report)
    return db_bug_report

def delete_bug_report(db: Session, bug_id: int):
    db_bug_report = db.query(BugReport).filter(BugReport.bug_id == bug_id).first()
    if db_bug_report:
        db.delete(db_bug_report)
        db.commit()
    return db_bug_report