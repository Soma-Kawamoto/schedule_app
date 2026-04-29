import sqlite3
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from fastapi import FastAPI

app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
    )


######データベースの初期化を行う######
def init_db():
    conn = sqlite3.connect("local.db")
    cursor = conn.cursor()
    # timeとcontentを保存するtextsテーブルを作成（すでに存在する場合はスキップ）
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS texts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            time TEXT NOT NULL,
            content TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db() # ファイル読み込み時に実行
####################################

class UserTextData(BaseModel):
    content: str
    time: str

@app.get("/")  # ユーザー目線で, get
async def root():
    return {"message": "Hello World"}

@app.post("/text")  # http://127.0.0.1:8000/text
async def text_input(data: UserTextData):
    test_texts = data.content
    input_time = data.time

    conn = sqlite3.connect("local.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO texts (time, content) VALUES (?, ?)", (input_time, test_texts))
    conn.commit()
    conn.close()

    print(f"入力された文字：{test_texts}, 入力時間：{input_time}")  # backend側のターミナルに出力
    return {
        "status": "success",
        "text": test_texts,
        "time": input_time
    }

@app.get("/texts")
def get_texts():
    conn = sqlite3.connect("local.db")
    cursor = conn.cursor()
    cursor.execute("SELECT time, content FROM texts ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()

    text_l = [{"time":r[0], "content":r[1]} for r in rows]
    return {"texts": text_l}
