from fastapi import APIRouter, HTTPException
from models.quiz_models import QuizGenerationRequest, QuizResponse
from services.quiz_controller import generate_quizzes_controller

router = APIRouter(prefix="/quiz", tags=["Quiz Generation"])

@router.post("/generate/", response_model=QuizResponse)
async def generate_quizzes(request: QuizGenerationRequest):
    """API endpoint to generate quizzes."""
    try:
        response = await generate_quizzes_controller(request.extracted_data)
        return QuizResponse(status="success", quizzes=[{"quiz": response["quiz"], "evaluation": response["evaluation"]}])
    except HTTPException as http_error:
        raise http_error
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


