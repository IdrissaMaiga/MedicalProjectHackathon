# GmailAiAssistance

This project leverages AI to automate the management of your Gmail account, performing a wide range of operations seamlessly. Using **Next.js**, **Google OAuth**, and the **DeepSeek R1 API** with its 70-billion distill model, this AI-powered agent optimizes email workflows by interacting with your Gmail account in a smart, efficient way.

## 🚀 Features

- **Email Management**: Read, send, organize, and delete emails automatically.
- **Next.js Integration**: Built with Next.js for fast, server-side rendering and seamless performance.
- **Google OAuth Authentication**: Secure user authentication with Google's OAuth for easy access to Gmail.
- **AI-Powered Operations**: Utilizes DeepSeek's 70-billion distill model to enhance email management with advanced AI capabilities.

## 🔧 Technologies Used

- **Next.js**: Framework for building React applications with server-side rendering.
- **Google OAuth**: For authenticating and accessing Gmail data.
- **DeepSeek R1 API**: A powerful API that helps process email data using the 70-billion distill model for deep insights and automation.
- **JavaScript / TypeScript**: For application development.

## 📦 Installation

To get started with this project locally, follow the steps below:


### 2. Install Dependencies
Navigate into the project directory and install the necessary dependencies:

```bash
npm install
```

### 3. Set Up Google OAuth
1. Go to the [Google Developer Console](https://console.cloud.google.com/).
2. Create a new project.
3. Enable the Gmail API for your project.
4. Set up OAuth 2.0 credentials (you'll need the `client_id` and `client_secret`).
5. Add your credentials to the `.env` file:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Run the Project Locally
Once everything is set up, you can run the application locally:

```bash
npm run dev
```

This will start the development server, and you can access the app at `http://localhost:3000`.

## 🧠 AI Features
The core AI functionalities are powered by the DeepSeek R1 API with its 70-billion distill model, which allows the agent to:

- Understand email content intelligently.
- Perform actions based on email analysis (such as organizing emails or flagging important ones).
- Learn from your interactions to improve future email management.

## ⚙️ Usage
Once the application is running, follow these steps:

1. Sign in with your Google account using OAuth.
2. Grant permissions to access your Gmail account.
3. Start managing your emails! The AI agent will assist in reading, sending, and organizing your inbox automatically.

## 🔒 Security
This project uses Google OAuth for authentication, ensuring that your email data is securely handled. No email data is stored locally, and all interactions are done through secure API calls.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Contributing
Contributions are welcome! Feel free to fork this repository, submit issues, and send pull requests.

## 🤖 Future Enhancements
The future of this project will focus on:

- Enhancing the AI’s ability to understand and categorize emails more effectively.
- Integrating additional APIs for email-related actions like smart replies and auto-sorting.
- Continuous improvements to speed and accuracy using cutting-edge AI technologies.

## 📧 Contact
For questions or suggestions, feel free to reach out to me at [maigadrisking@gmail.com](mailto:maigadrisking@gmail.com).

