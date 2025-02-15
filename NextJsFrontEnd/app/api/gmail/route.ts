
  import { NextRequest, NextResponse } from "next/server";
  import { google } from "googleapis";
  import { cookies } from "next/headers";
  import oauth2Client from "../../lib/google-oauth";
  import Groq from "groq-sdk";
  
  // Initialize Groq
  const groq = new Groq({
    apiKey: process.env["AI_API_KEY"] || "",
  });
  
  const modelName = "deepseek-r1-distill-llama-70b";
  
  if (!groq.apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable");
  }
  
  export async function POST(req: NextRequest) {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("google_access_token")?.value;
  
    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }
  
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  
    const body = await req.json();
    const { userCommand } = body;
  
    try {
      const parsedActions = await aiCommandMap(userCommand);
      const results = await executeCommands(parsedActions, gmail);
     // const aifeedback=await aiProcessEmail(`${results}`)
      return NextResponse.json({ message: "Commands executed successfully.", results });
    } catch (error: any) {
      return NextResponse.json({ error: "Failed to process command.", details: error.message }, { status: 500 });
    }
  }
  
  // AI Maps User Input to Commands using Groq
  const aiCommandMap = async (userInput: string) => {
    const prompt = `
      Only give the array no other text because I going to give your answer to a function
      Map the following user input to one or more actions, and always return the result as an array of commands.
      The only valid commands are: 
      "retrieve", "read", "send", "reply", "delete", "archive", "mark_read", "mark_unread", "get_starred", "ai_process".
      
      Examples:
  
      1. "Show me unread emails" → [{ "command": "retrieve", "params": { "query": "is:unread" } }]
      2. "Send an email to john@example.com with subject 'Meeting' and message 'Let's discuss tomorrow'" 
         → [{ "command": "send", "params": { "to": "john@example.com", "subject": "Meeting", "message": "Let's discuss tomorrow" } }]
      3. "Mark all emails from yesterday as read" 
         → [
              { "command": "retrieve", "params": { "query": "after:yesterday" } }, 
              { "command": "mark_read", "params": { "emailId": "<emailId>" } }
            ]
      4. "Reply to email with ID 98765 with message 'Got it!'" 
         → [{ "command": "reply", "params": { "emailId": "98765", "message": "Got it!" } }]
      5. "Delete the email with ID 56789" 
         → [{ "command": "delete", "params": { "emailId": "56789" } }]
      6. "Archive the email with ID 12345" 
         → [{ "command": "archive", "params": { "emailId": "12345" } }]
      7. "Mark the email with ID 67890 as unread" 
         → [{ "command": "mark_unread", "params": { "emailId": "67890" } }]
      8. "Retrieve my starred emails" 
         → [{ "command": "get_starred", "params": {} }]
      9. "Process this email content with AI: 'Please summarize the key points from this meeting'" 
         → [{ "command": "ai_process", "params": { "content": "Please summarize the key points from this meeting" } }]
      10. "Show all emails with subject 'Invoice'" 
          → [{ "command": "retrieve", "params": { "query": "subject:Invoice" } }]
      11. "Reply to email ID 23456 with message 'Thanks for the update!'" 
          → [{ "command": "reply", "params": { "emailId": "23456", "message": "Thanks for the update!" } }]
      12. "Delete all emails from 'spam@example.com'" 
          → [
              { "command": "retrieve", "params": { "query": "from:spam@example.com" } },
              { "command": "delete", "params": { "emailId": "<emailId>" } }
            ]
      
      User Input: "${userInput}"
  
      Please map this user input to a corresponding action(s) and return the result as an array of commands using only the valid commands listed above I do not want explanation just give the array.
    `;
  
    const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: modelName,
        temperature: 0.6,
        max_completion_tokens: 4096,
        top_p: 0.95,
      });
      
      console.log(response.choices[0].message.content);
      
      try {
        // Convert function declaration to a function expression (arrow function)
        const extractLastJsonArray = (text: string): any => {
          // Ensure text is not null or undefined before matching
          if (!text) {
            return null; // or handle the null case as needed
          }
          const matches = text.match(/\[\s*\{[\s\S]*?\}\s*\]/g);
          return matches ? JSON.parse(matches[matches.length - 1]) : null;
        };
      
        // Ensure response content is not null or empty
        const content = response.choices[0].message.content || '';
        const lastJsonArray = extractLastJsonArray(content) || [];
        console.log(lastJsonArray);
        
        return lastJsonArray;
      } catch (error) {
        console.error(error);
        return [];
      }
      
      
  };
  
  // Execute Commands Based on AI Processing
  // Execute Commands Based on AI Processing
const executeCommands = async (actions: any[], gmail: any) => {
    const results = [];
  
    for (const action of actions) {
      const { command, params } = action;
      if (commandMap[command]) {
        try {
          const result = await commandMap[command](params, gmail);
          results.push({ command, result: result }); // Stringify the result
        } catch (error: any) {
          results.push({ command, error: error.message || "Execution failed" });
        }
      } else {
        results.push({ command, error: "Unknown command" });
      }
    }
  
    return results;
  };
  
  
  // Command Map
  const commandMap: Record<string, (params: any, gmail: any) => Promise<any>> = {
    retrieve: async ({ query }, gmail) => getEmails(query ?? "", gmail),
    read: async ({ emailId }, gmail) => getEmailDetails(emailId ?? "", gmail),
    send: async ({ to, subject, message }, gmail) => sendEmail(to ?? "", subject ?? "", message ?? "", gmail),
    reply: async ({ emailId, message }, gmail) => replyToEmail(emailId ?? "", message ?? "", gmail),
    delete: async ({ emailId }, gmail) => deleteEmail(emailId ?? "", gmail),
    archive: async ({ emailId }, gmail) => archiveEmail(emailId ?? "", gmail),
    mark_read: async ({ emailId }, gmail) => markEmailAsRead(emailId ?? "", gmail),
    mark_unread: async ({ emailId }, gmail) => markEmailAsUnread(emailId ?? "", gmail),
    get_starred: async (_, gmail) => getStarredEmails(gmail),
    ai_process: async ({ content }) => aiProcessEmail(content),
  };
  
 // AI Email Processing with Groq
async function aiProcessEmail(content: string) {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `What are these emails about? ${content}`,
        },
      ],
      model: modelName,
      temperature: 0.6,
      max_completion_tokens: 4096,
      top_p: 0.95,
    });
  
    return response.choices[0].message.content;
  }
  
  




// Gmail API Functions
export async function getEmails(query: string, gmail: any) {
    try {
        // Fetch the list of message IDs based on the query
        const response = await gmail.users.messages.list({
            userId: "me",
            q: query,
            maxResults: 10,
        });

        // If no messages, return an empty array
        if (!response.data.messages) {
            return [];
        }

        // Fetch detailed information for each email
        const emails = await Promise.all(
            response.data.messages.map(async (message: { id: string }) => {
                const emailDetails = await gmail.users.messages.get({
                    userId: "me",
                    id: message.id,
                });

                const headers = emailDetails.data.payload.headers;
                const subject = headers.find((header: { name: string; value: string }) => header.name === "Subject")?.value;
                const from = headers.find((header: { name: string; value: string }) => header.name === "From")?.value;
                const contentType = headers.find((header: { name: string; value: string }) => header.name === "Content-Type")?.value;

                // Extract email body
                const body = getEmailBody(emailDetails.data.payload);

                // Filter out emails containing HTML, XML, or styles
                if (
                    contentType?.includes("text/html") ||
                    contentType?.includes("multipart/alternative") ||
                    /<html|<style|<xml/i.test(body)
                ) {
                    return null; // Exclude this email
                }

                return {
                    id: message.id,
                    subject,
                    from,
                    body,
                };
            })
        );

        // Filter out null values (excluded emails)
        return emails.filter(email => email !== null);
    } catch (error) {
        console.error("Error fetching emails:", error);
        return [];
    }
}

// Helper function to extract the email body
function getEmailBody(payload: any) {
    try {
        let body = "";

        if (payload.parts && Array.isArray(payload.parts)) {
            body = payload.parts
                .map((part: any) => {
                    if (
                        part.mimeType === "text/plain" && // Ensure it's plain text
                        part.body &&
                        part.body.data
                    ) {
                        return decodeBase64(part.body.data);
                    }
                    return "";
                })
                .join("");
        } else if (payload.body && payload.body.data) {
            body = decodeBase64(payload.body.data);
        }

        return body;
    } catch (error) {
        console.error("Error decoding email body:", error);
        return "";
    }
}

// Decode base64-encoded string
function decodeBase64(encoded: string) {
    try {
        return atob(encoded.replace(/-/g, "+").replace(/_/g, "/")); // Handle URL-safe base64 encoding
    } catch (error) {
        console.error("Error decoding base64 string:", error);
        return "";
    }
}
export async function getEmailDetails(id: string, gmail: any) {
    try {
      const response = await gmail.users.messages.get({ userId: "me", id });
      return response.data;
    } catch (error) {
      console.error("Error fetching email details:", error);
      return "Failed to fetch email details.";
    }
  }
  
  export async function sendEmail(to: string, subject: string, message: string, gmail: any) {
    const emailContent = `To: ${to}\nSubject: ${subject}\n\n${message}`;
    const encodedMessage = Buffer.from(emailContent).toString("base64");
  
    try {
      await gmail.users.messages.send({ userId: "me", requestBody: { raw: encodedMessage } });
      return `Email successfully sent to ${to}.`;
    } catch (error) {
      console.error("Error sending email:", error);
      return "Failed to send email.";
    }
  }
  
  export async function replyToEmail(id: string, message: string, gmail: any) {
    const emailDetails = await getEmailDetails(id, gmail);
    if (!emailDetails || !emailDetails.payload) return "Failed to retrieve email details for reply.";
  
    type EmailHeader = { name: string; value: string };
    const headers: EmailHeader[] = emailDetails.payload.headers as EmailHeader[];
  
    const to = headers.find((header) => header.name === "From")?.value;
    const subject = headers.find((header) => header.name === "Subject")?.value || "";
  
    if (!to) return "Recipient not found.";
  
    const replySubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;
    const emailContent = `To: ${to}\nSubject: ${replySubject}\nIn-Reply-To: ${id}\nReferences: ${id}\n\n${message}`;
    const encodedMessage = Buffer.from(emailContent).toString("base64");
  
    try {
      await gmail.users.messages.send({ userId: "me", requestBody: { raw: encodedMessage } });
      return `Reply successfully sent to ${to}.`;
    } catch (error) {
      console.error("Error replying to email:", error);
      return "Failed to send reply.";
    }
  }
  
  export async function deleteEmail(id: string, gmail: any) {
    try {
      await gmail.users.messages.delete({ userId: "me", id });
      return "Email successfully deleted.";
    } catch (error) {
      console.error("Error deleting email:", error);
      return "Failed to delete email.";
    }
  }
  
  export async function archiveEmail(id: string, gmail: any) {
    try {
      await gmail.users.messages.modify({ userId: "me", id, requestBody: { removeLabelIds: ["INBOX"] } });
      return "Email successfully archived.";
    } catch (error) {
      console.error("Error archiving email:", error);
      return "Failed to archive email.";
    }
  }
  
  export async function markEmailAsRead(id: string, gmail: any) {
    try {
      await gmail.users.messages.modify({ userId: "me", id, requestBody: { removeLabelIds: ["UNREAD"] } });
      return "Email marked as read.";
    } catch (error) {
      console.error("Error marking email as read:", error);
      return "Failed to mark email as read.";
    }
  }
  
  export async function markEmailAsUnread(id: string, gmail: any) {
    try {
      await gmail.users.messages.modify({ userId: "me", id, requestBody: { addLabelIds: ["UNREAD"] } });
      return "Email marked as unread.";
    } catch (error) {
      console.error("Error marking email as unread:", error);
      return "Failed to mark email as unread.";
    }
  }
  
  export async function getStarredEmails(gmail: any) {
    try {
      const response = await gmail.users.messages.list({ userId: "me", q: "is:starred", maxResults: 10 });
      return response.data.messages || "No starred emails found.";
    } catch (error) {
      console.error("Error fetching starred emails:", error);
      return "Failed to fetch starred emails.";
    }
  }
  