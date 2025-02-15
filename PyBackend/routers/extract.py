from fastapi import APIRouter, File, UploadFile
from services.text_extraction import extract_text_from_pdf_bytes, extract_text_from_image_bytes

router = APIRouter()

# Route to handle PDF text extraction
@router.post("/extract_pdf/")
async def extract_pdf(file: UploadFile = File(...)):
    pdf_bytes = await file.read()  # Read file content
    text = extract_text_from_pdf_bytes(pdf_bytes)  # Extract text
    return {"extracted_text": text}

# Route to handle image (OCR) text extraction
@router.post("/extract_image/")
async def extract_image(file: UploadFile = File(...)):
    image_bytes = await file.read()  # Read file content
    text = extract_text_from_image_bytes(image_bytes)  # Extract text from image
    return {"extracted_text": text}
