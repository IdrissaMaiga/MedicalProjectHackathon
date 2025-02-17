"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Link as LinkIcon, Trash } from "lucide-react";

// Define the response type
interface ProcessResponse {
  message: string;
  extractedTexts: { source: string; text: string }[];
  quizData: { quizzes: { quiz: string; evaluation: string }[] };
}

export default function FileLinkUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles([...files, ...Array.from(e.target.files)]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleAddLink = () => {
    if (newLink) setLinks([...links, newLink]);
    setNewLink("");
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("links", JSON.stringify(links));

    try {
      const res = await fetch("/api/data", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 5) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <Card className="p-4">
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-semibold">Upload Files and Links</h1>
          
          <div className="flex items-center space-x-4">
            <Input type="file" multiple onChange={handleFileChange} className="flex-1" />
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" /> Add Files
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input 
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="Enter link"
            />
            <Button onClick={handleAddLink} variant="outline">
              <LinkIcon className="w-4 h-4" /> Add Link
            </Button>
          </div>

          <div>
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm text-gray-700">
                <span>{file.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(idx)}>
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
            {links.map((link, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm text-blue-500 underline">
                <span>{link}</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveLink(idx)}>
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Processing..." : "Submit"}
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h2 className="text-lg font-semibold">Result</h2>
              {result.extractedTexts && result.extractedTexts.length > 0 && (
                <div>
                  <h3 className="font-medium">Extracted Texts</h3>
                  {result.extractedTexts.map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-700">{item.source}: {item.text}</p>
                  ))}
                </div>
              )}

              {result.quizData?.quizzes?.map((quiz, idx) => (
                <div key={idx} className="mt-4 p-3 border rounded-md">
                  <h3 className="font-medium">Quiz</h3>
                  <p className="text-sm text-gray-700">{quiz.quiz}</p>
                  {quiz.evaluation && (
                    <div className="mt-2">
                      <h4 className="font-medium">Evaluation:</h4>
                      {Object.entries(JSON.parse(quiz.evaluation) as Record<string, number>).map(([key, value]) => (
                        <p key={key} className={`text-sm ${getColor(value)}`}>
                          {key}: {value}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}