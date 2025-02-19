# AI Study Material Generator

## 🚀 Overview
We're developing a web or desktop solution that helps medical students generate structured learning materials from various sources like PDFs, lectures, PowerPoints, notes, and transcripts. This tool automates organization and formatting, making studying more efficient.

## 🛠 Installation Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/IdrissaMaiga/MedicalProjectHackathon.git
```

### 2️⃣ Create and Activate a Virtual Environment (venv)
Before installing dependencies, set up a virtual environment to manage packages efficiently.

#### Windows:
```bash
cd PyBackend
python -m venv venv
venv\Scripts\activate
```

#### macOS/Linux:
```bash
cd PyBackend
python3 -m venv venv
source venv/bin/activate
```

### 3️⃣ Install Dependencies
Once the virtual environment is activated, install the required dependencies:
```bash
pip install -r requirements.txt
```

### Environment variables
Create your .env from .env.example.

### 4️⃣ Install Tesseract OCR
Tesseract OCR is required for text extraction from images.

#### Windows:
1. Download and install Tesseract OCR from [this link](https://github.com/UB-Mannheim/tesseract/wiki).
2. Add the installation path (e.g., `C:\Program Files\Tesseract-OCR`) to your system environment variables.

#### macOS:
```bash
brew install tesseract
```

#### Linux (Debian/Ubuntu-based):
```bash
sudo apt update
sudo apt install tesseract-ocr
```

#### Manually Configure Path (if needed)
If Tesseract is not automatically detected, set the path in Python:
```python
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
```

### 5️⃣ Run the Backend Server
```bash
uvicorn main:app --reload
```
The backend will be available at:
```
http://localhost:8000
```

### 6️⃣ Set Up and Run the Frontend
Navigate into the frontend directory and install dependencies:
```bash
cd NextJsFrontEnd
npm install
```
Run the frontend server:
```bash
npm run dev
```
The frontend will be available at:
```
http://localhost:3000
```

## 🧠 AI Features
- Extracts and structures content from PDFs, images, and other sources.
- Converts handwritten notes and printed text into digital, editable formats.
- Generates well-organized study materials.
- Automates formatting for quick review and revision.

## ⚙️ Usage
Once both the backend and frontend are running:
1. Open the web application at `http://localhost:3000`.
2. Upload your PDFs, PowerPoints, lecture transcripts, or notes.
3. The AI will process and structure the content.
4. Download the organized study material in a preferred format (text, PDF, etc.).

## 🔒 Security
- Your uploaded files are processed locally, ensuring privacy.
- No sensitive data is stored.

## 📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

## 💬 Contributing
Contributions are welcome! Feel free to fork this repository, submit issues, and send pull requests.

## 📧 Contact
For questions or suggestions, reach out at: [maigadrisking@gmail.com](mailto:maigadrisking@gmail.com).

---

### 🔥 Future Enhancements
- Advanced AI summarization for study materials.
- Integration with popular note-taking apps.
- Improved OCR accuracy for handwritten notes.
- Cloud-based synchronization for seamless access across devices.
