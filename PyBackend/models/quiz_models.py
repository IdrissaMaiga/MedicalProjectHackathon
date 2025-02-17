from pydantic import BaseModel
from typing import List, Dict

class QuizGenerationRequest(BaseModel):
    extracted_data: List[str]
  

class QuizResponse(BaseModel):
    status: str
    quizzes: List[Dict[str, str]]
