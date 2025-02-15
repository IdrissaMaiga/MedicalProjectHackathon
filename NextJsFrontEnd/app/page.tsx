import crypto from "crypto";
import Link from "next/link";
import oauth2Client from "./lib/google-oauth";
import { Button } from "@/components/ui/button";

export default function Home() {
  const SCOPE = [
    "https://www.googleapis.com/auth/gmail.readonly",  // Read Gmail messages
    "https://www.googleapis.com/auth/gmail.modify",    // Modify Gmail messages (mark as read/unread, label messages)
    "https://www.googleapis.com/auth/gmail.send",      // Send emails
    "https://www.googleapis.com/auth/gmail.labels",    // Manage Gmail labels
    "https://www.googleapis.com/auth/gmail.compose",   // Compose new messages
    "https://www.googleapis.com/auth/gmail.insert",    // Insert a message into Gmail (e.g., forward a message)
    "https://www.googleapis.com/auth/gmail.settings.basic",  // Manage basic Gmail settings
    "https://www.googleapis.com/auth/gmail.settings.sharing", // Manage sharing settings
    
    // Add the following scope for personal info from Google People API
    "https://www.googleapis.com/auth/userinfo.profile", // Access user's basic profile (name, photo, etc.)
    "https://www.googleapis.com/auth/userinfo.email",   // Access user's email address
    "https://www.googleapis.com/auth/plus.me"           // Access user's Google+ profile (includes birth date and other details)
  ];

  // Where do I store this state?
  const state = crypto.randomBytes(16).toString("hex");

  // Generate the URL
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPE,
    state,
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-400">
      <div className="text-center p-10 rounded-3xl bg-white bg-opacity-80 shadow-2xl max-w-lg w-full transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-4">
          Integrate with Gmail
        </h1>
        <p className="text-lg font-medium text-gray-700 mb-6">
          Easily manage your Gmail account with full control over your emails, labels, and more.
        </p>
        <Link href={authorizationUrl}>
          <Button className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-600 hover:scale-105">
            Login with Google
          </Button>
        </Link>
      </div>
    </div>
  );
}
