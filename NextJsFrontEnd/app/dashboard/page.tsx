"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function GmailPage() {
  const [userCommand, setUserCommand] = useState("");
  const [responseMessage, setResponseMessage] = useState<string | JSX.Element>("");

  const handleCommandSubmit = async () => {
    const res = await fetch("/api/gmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userCommand }),
    });

    const data = await res.json();

    if (data.results) {
      const retrieveResults = data.results.find((r: any) => r.command === "retrieve");

      if (retrieveResults && Array.isArray(retrieveResults.result)) {
        const retrievedEmails = retrieveResults.result.map((email: any) => (
          <motion.div 
            key={email.id} 
            className="bg-white shadow-lg rounded-lg p-4 mt-3 w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-bold text-lg text-blue-600">{email.subject}</h3>
            <p className="text-sm text-gray-500">From: {email.from}</p>
            <p className="mt-2 text-gray-700">{email.body}</p>
          </motion.div>
        ));
        setResponseMessage(retrievedEmails.length > 0 ? retrievedEmails : "No emails found.");
      } else {
        const otherResults = data.results.map((r: any, index: number) => (
          <motion.p 
            key={index} 
            className="text-green-600 text-lg font-semibold mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {r.result || "Action completed successfully."}
          </motion.p>
        ));
        setResponseMessage(otherResults);
      }
    } else {
      setResponseMessage(data.error || "No response");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
      <motion.div 
        className="bg-white shadow-xl rounded-xl p-6 w-full max-w-xl text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-gray-800">📩 Gmail AI Assistant</h1>
        <p className="text-gray-500 mt-2">Type a command to manage your Gmail inbox.</p>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={userCommand}
            onChange={(e) => setUserCommand(e.target.value)}
            placeholder="Enter a command..."
            className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleCommandSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Execute
          </button>
        </div>

        <div className="mt-6">{responseMessage}</div>
      </motion.div>
    </div>
  );
}
