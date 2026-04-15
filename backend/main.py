import sqlite3
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI

app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_methods=["*"]
    )

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/save")
def save_text(text: str = Form(...)):
    conn = sqlite3.connect("local.db")
    cursor = conn.cursor()

    cursor.execute("INSERT INTO texts (content) VALUES (?)", (text,))

    conn.commit()
    conn.close()

    return {"status": "ok", "saved": text}    