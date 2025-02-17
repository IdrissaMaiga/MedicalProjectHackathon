from fastapi import FastAPI
from routers import extract,process
app = FastAPI(title="AI Study Material Generator")
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify your frontend's origin here (e.g., ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include API endpoints for extraction
app.include_router(extract.router)
app.include_router(process.router)
@app.get("/")
def home():
    return {"message": "Welcome to the AI-powered study material creator!"}

# Run with: uvicorn main:app --reload
