from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/banners",
    tags=["banners"],
)

@router.get("/", response_model=List[schemas.Banner])
def read_banners(db: Session = Depends(database.get_admin_db)):
    banners = db.query(models.Banner).filter(models.Banner.is_active == True).order_by(models.Banner.sort_order).all()
    return banners
