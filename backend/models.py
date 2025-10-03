from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, index=True)
    product_description = Column(String)
    generated_content = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())