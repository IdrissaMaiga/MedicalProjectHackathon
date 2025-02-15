from fastapi import FastAPI
from routers import extract

app = FastAPI(title="AI Study Material Generator")

# Include API endpoints for extraction
app.include_router(extract.router)

@app.get("/")
def home():
    return {"message": "Welcome to the AI-powered study material creator!"}

# Run with: uvicorn main:app --reload
