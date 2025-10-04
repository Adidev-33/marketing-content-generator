import os
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from sqlalchemy.orm import Session
import models
import database

database.Base.metadata.create_all(bind=database.engine)

load_dotenv()
app = FastAPI()

origins = ["http://localhost:3000", "https://marketing-content-generator-tjuh.vercel.app/"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

try:
    client = Groq()
except Exception:
    raise RuntimeError("Failed to initialize Groq client. Is GROQ_API_KEY set in .env?")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ProductRequest(BaseModel):
    product_name: str
    product_description: str

@app.get("/")
def read_root():
    return {"message": "Marketing Content Generator API (Groq) is running!"}

@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    history_items = db.query(models.History).order_by(models.History.id.desc()).all()
    return history_items

@app.post("/generate-content")
async def generate_content(request: ProductRequest, db: Session = Depends(get_db)):
    try:
        chat_completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": """
                    You are an expert marketing copywriter. Your task is to generate compelling marketing text for a product.
                    The output should be a single block of text, structured as follows:
                    A catchy and attractive headline.
                    A short, engaging paragraph (2-3 sentences) describing the product's main benefit.
                    A bulleted list of 3 key features, starting each with a relevant emoji.
                    A strong call-to-action at the end. Do not use JSON or markdown formatting. Just provide the raw text.
                    """
                },
                {"role": "user", "content": f"Product Name: {request.product_name}\nProduct Description: {request.product_description}"}
            ],
        )
        generated_text = chat_completion.choices[0].message.content

        history_entry = models.History(
            product_name=request.product_name,
            product_description=request.product_description,
            generated_content=generated_text
        )
        db.add(history_entry)
        db.commit()
        return {"marketing_text": generated_text}
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")

@app.delete("/history/{item_id}")
def delete_history_item(item_id: int, db: Session = Depends(get_db)):
    item_to_delete = db.query(models.History).filter(models.History.id == item_id).first()
    if item_to_delete is None:
        raise HTTPException(status_code=404, detail="History item not found")
    
    db.delete(item_to_delete)
    db.commit()
    return {"message": "History item deleted successfully"}

@app.delete("/history")
def clear_all_history(db: Session = Depends(get_db)):
    try:
        num_rows_deleted = db.query(models.History).delete()
        db.commit()
        return {"message": f"Successfully deleted {num_rows_deleted} history items."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred while clearing history: {str(e)}")