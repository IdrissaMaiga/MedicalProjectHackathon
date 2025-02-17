import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = 'http://127.0.0.1:8000';
;  // Replace with your backend URL

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "No access token found" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const links = JSON.parse(formData.get("links") as string || "[]");

    const extractedTexts = [];
   
    // Process files
    if (files.length > 0) {
      const fileTexts = await Promise.all(files.map(file => extractTextFromFile(file)));
     
      extractedTexts.push(...fileTexts);
      console.log("something")
    }

    // Process links
    if (links.length > 0) {
      const linkTexts = await Promise.all(
        links.map((link: string) => extractTextFromLink(link)) // Explicitly type `link`
      );
      extractedTexts.push(...linkTexts);
    }
    

    // Generate quiz
    const quizResponse = await fetch(`${API_URL}/quiz/generate/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ extracted_data: extractedTexts.map(t => t.text) }),
    });

    if (!quizResponse.ok) {
      throw new Error("Failed to generate quizzes.");
    }

    const quizData = await quizResponse.json();

    return NextResponse.json({
      message: "Processing complete.",
      extractedTexts,
      quizData,
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to process.", details: error.message }, { status: 500 });
  }
}

// Function to extract text from files
async function extractTextFromFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  let endpoint = "";
  switch (file.type) {
    case "application/pdf":
      endpoint = "/extract_pdf/";
      break;
    case "image/jpeg":
    case "image/png":
      endpoint = "/extract_image/";
      break;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      endpoint = "/extract_docx/";
      break;
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      endpoint = "/extract_pptx/";
      break;
    case "text/plain":
      endpoint = "/extract_txt/";
      break;
    default:
      throw new Error("Unsupported file type");
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, { method: "POST", body: formData });
    console.log("Response object:", response);

    // Read and log the response text for debugging
    const responseText = await response.text();
    console.log("Response text:", responseText);

    if (!response.ok) {
      throw new Error(`Failed to extract text from ${file.name}`);
    }

    // Attempt to parse the response text as JSON
    const data = JSON.parse(responseText);
    return { source: file.name, text: data.extracted_text };
  } catch (error) {
    console.error("Error in extractTextFromFile:", error);
    throw error;
  }
}

// Function to extract text from links
async function extractTextFromLink(link: string) {
  let endpoint = link.includes("youtube.com") ? "/extract_youtube_transcript/" : "/extract_url/";

  const response = await fetch(`${API_URL}${endpoint}?url=${encodeURIComponent(link)}`, { method: "GET" });

  if (!response.ok) throw new Error(`Failed to extract text from ${link}`);

  const data = await response.json();
  return { source: link, text: data.extracted_text };
}
