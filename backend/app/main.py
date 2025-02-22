from fastapi import FastAPI
from app.database import engine, Base
from app.routes import users, tweets, auth  
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

Base.metadata.create_all(bind=engine)

app.include_router(users.router)
app.include_router(tweets.router)
app.include_router(auth.router)  

@app.get("/")
def read_root():
    return {"message": "Bienvenido a Twitter Clone API"}
