
import asyncio
import re
from groq import Groq
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# API Key and Model
GROQ_API_KEY = os.getenv("AI_API_KEY")
MODEL_NAME = "deepseek-r1-distill-llama-70b"

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)

async def fetch_groq_response(user_prompt: str):
    """Fetch AI-generated quiz data from Groq API using streaming."""
    completion = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "system", "content": "You are an AI assistant that generates quizzes."},
                  {"role": "user", "content": user_prompt}],
        temperature=0.6,
        max_completion_tokens=4096,
        top_p=0.95,
        stream=True,
    )

    
    async def async_generator():
        for chunk in completion:
            content = chunk.choices[0].delta.content or ""
            yield content  # Yielding small parts of the response
            await asyncio.sleep(0.01)  # Prevent event loop blocking

    return async_generator()

async def evaluate_quiz_quality(quiz: str):
    """Use AI to evaluate the quiz quality."""
    prompt = f"""
    Evaluate the quality of the following quiz question based on:
    1. **Clarity** (Is the question well-formed and unambiguous?)
    2. **Difficulty** (Is it appropriately challenging?)
    3. **Distractor Quality** (Are the wrong answers reasonable and not obviously incorrect?)
    give an  output with no explanation please just like  this  "{{ "clarity": 9,"difficulty":8,"distractor_quality":7 }}" nothing else 
    **Quiz:**
    {quiz}


    
    
     do not explain just give me a json
    """

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.6,
        max_completion_tokens=500,
        top_p=0.95
    )

    return response.choices[0].message.content.strip()



async def generate_quizzes_controller(extracted_data: list[str]):
    """Generates quizzes based on the input user prompt."""
    # Get the streamed response from Groq API
    user_prompt = "\n".join(map(str, extracted_data)) + (
    "\n\nGenerate a structured quiz for each subtopic with the following formats:\n"
    "For each subtopic, generate:\n"
    "- Question in the format: 'Question <number>: <question text>'\n"
    "- 5 multiple-choice options, labeled a), b), c), d), e)\n"
    "- After all questions, list the correct answers in the format: 'Question <number>: <correct answer letter>'\n"
    "\nMake sure the structure is consistent across all questions, and include 4 incorrect distractors for each question."
    )

    # Fetch AI-generated quiz questions
    stream = await fetch_groq_response(user_prompt)
    
   

    # Collect the streamed response
    quiz_text = ""
    async for chunk in stream:
        quiz_text += chunk

    # Remove <think>...</think> tags from the collected quiz text
    cleaned_quiz_text = re.sub(r"<think>[\s\S]*?</think>", "", quiz_text).strip()

    # Evaluate quiz quality
    evaluation = await evaluate_quiz_quality(cleaned_quiz_text)

   
    # Clean evaluation response by removing <think> tags and markdown
    cleaned_evaluation = re.sub(r"<think>[\s\S]*?</think>", "", evaluation).strip()
    cleaned_evaluation = re.sub(r"```json\n|\n```", "", cleaned_evaluation).strip()
    cleaned_evaluation=json.dumps(cleaned_evaluation)
    # Debugging: Print cleaned evaluation to check if it has content
    print("Cleaned Evaluation:", repr(cleaned_evaluation))

    # Ensure cleaned evaluation is not empty before attempting to parse
    if not cleaned_evaluation:
        raise ValueError("The cleaned evaluation is empty and cannot be parsed.")

   
    try:
        # Parse the cleaned evaluation string into a Python dictionary (JSON object)
        parsed_evaluation = json.loads(cleaned_evaluation)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse evaluation: {str(e)}")

    # Return the quiz and evaluation as a dictionary
    return {"quiz": cleaned_quiz_text, "evaluation": parsed_evaluation}


async def text_streamer(text: str, chunk_size: int = 100):
    """Stream AI response in chunks for better UX."""
    cleaned_text = re.sub(r"<think>[\s\S]*?</think>", "", text).strip()

    for i in range(0, len(cleaned_text), chunk_size):
        yield cleaned_text[i: i + chunk_size]
        await asyncio.sleep(0.01)
