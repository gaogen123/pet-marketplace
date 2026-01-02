from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/categories",
    tags=["categories"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[schemas.Category])
def read_categories(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(database.get_admin_db)
):
    categories = db.query(models.Category).filter(models.Category.is_active == True).order_by(models.Category.sort_order).offset(skip).limit(limit).all()
    return categories
