# AI Email Writer Assistant

AI-powered email reply generation for Gmail, backed by a Spring Boot REST API and Groq's OpenAI-compatible Chat Completions API.

The project provides an AI-powered email writing workflow that can generate contextual email replies directly inside Gmail through a Chrome Extension, while also providing a separate React web interface.

---

## Overview

AI Email Writer Assistant helps users generate professional and contextual email replies without manually writing the response from scratch.

The system consists of three main components:

1. **Spring Boot Backend** — Handles API requests and communicates securely with Groq AI.
2. **React Frontend** — Provides a standalone web interface for generating email replies.
3. **Chrome Extension** — Integrates directly with Gmail and automatically inserts AI-generated replies into the Gmail compose box.

The Groq API key is kept securely on the backend and is never exposed to the React frontend or Chrome Extension.

---

# Problem Statement

Writing email replies repeatedly can be time-consuming, especially when users need to respond to multiple professional emails.

Users often have to:

- Read the email
- Understand the context
- Decide the appropriate tone
- Write the response
- Copy and paste the response into Gmail

This project automates the response-generation part of the workflow while keeping the user in control of the final email.

---

# Solution

The AI Email Writer Assistant allows users to generate an email reply using AI.

For Gmail users, the process is:

```text
Open Email
     ↓
Click "AI Reply"
     ↓
Chrome Extension
     ↓
Extract Email Content
     ↓
HTTP POST Request
     ↓
Spring Boot REST API
     ↓
Groq AI
     ↓
Generated Reply
     ↓
Spring Boot Response
     ↓
Chrome Extension
     ↓
Gmail Compose Box

The user can then review, edit, and send the generated email.

Complete System Architecture
                         ┌──────────────────────┐
                         │        Gmail         │
                         │                      │
                         │   Incoming Email     │
                         └──────────┬───────────┘
                                    │
                                    │ Email Content
                                    ▼
                         ┌──────────────────────┐
                         │   Chrome Extension   │
                         │                      │
                         │  AI Reply Button     │
                         │  MutationObserver    │
                         │  Gmail DOM Access    │
                         └──────────┬───────────┘
                                    │
                                    │ HTTPS POST
                                    │ /api/email/generate
                                    ▼
                         ┌──────────────────────┐
                         │   Spring Boot API    │
                         │                      │
                         │ Controller           │
                         │ Service              │
                         │ WebClient            │
                         └──────────┬───────────┘
                                    │
                                    │ Prompt + Email
                                    ▼
                         ┌──────────────────────┐
                         │       Groq AI        │
                         │                      │
                         │ OpenAI-Compatible    │
                         │ Chat Completions API │
                         └──────────┬───────────┘
                                    │
                                    │ Generated Reply
                                    ▼
                         ┌──────────────────────┐
                         │   Spring Boot API    │
                         └──────────┬───────────┘
                                    │
                                    │ Response
                                    ▼
                         ┌──────────────────────┐
                         │   Chrome Extension   │
                         └──────────┬───────────┘
                                    │
                                    │ Insert Reply
                                    ▼
                         ┌──────────────────────┐
                         │        Gmail         │
                         │                      │
                         │  Compose Box         │
                         │  + AI Generated Text │
                         └──────────────────────┘
Project Architecture

This repository follows a monorepo structure:

Automated-email-writer/
│
├── spring-boot-backend/
│   ├── .mvn/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── email/
│   │   │   │           └── writer/
│   │   │   │               ├── EmailWriterSbApplication.java
│   │   │   │               ├── HomeController.java
│   │   │   │               └── app/
│   │   │   │                   ├── EmailGeneratorController.java
│   │   │   │                   ├── EmailGeneratorService.java
│   │   │   │                   ├── EmailRequest.java
│   │   │   │                   └── WebClientConfig.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── Dockerfile
│   ├── mvnw
│   ├── mvnw.cmd
│   └── pom.xml
│
├── react-frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── index.html
│
├── chrome-extension/
│   ├── icons/
│   │   └── logo.png
│   ├── content.js
│   ├── content.css
│   └── manifest.json
│
├── .gitignore
├── .gitattributes
└── README.md
1. Spring Boot Backend

The Spring Boot backend is the central server-side component of the application.

It receives email content and tone information from the client, builds the AI request, communicates with Groq, and returns the generated response.

Backend Responsibilities
Expose REST API
Receive email content
Receive requested tone
Construct AI prompt
Communicate with Groq
Handle API errors
Return generated email reply
Keep Groq credentials secure
Support frontend and Chrome Extension clients
Backend Architecture
Client
  │
  │ POST /api/email/generate
  ▼
EmailGeneratorController
  │
  ▼
EmailGeneratorService
  │
  ▼
WebClient
  │
  ▼
Groq API
  │
  ▼
Generated Response
  │
  ▼
EmailGeneratorService
  │
  ▼
EmailGeneratorController
  │
  ▼
Client
Backend API
Generate Email Reply
Endpoint
POST /api/email/generate
Local URL
http://localhost:8080/api/email/generate
Production URL
https://automated-email-writer.onrender.com/api/email/generate
Request
{
  "emailContent": "Hello, thank you for reaching out to us.",
  "tone": "friendly"
}
Parameters
Parameter	Type	Description
emailContent	String	Original email content
tone	String	Desired tone of the reply
Example Response
Thank you for reaching out. I really appreciate your message and look forward to discussing this further.

The response is returned as plain text.

Supported Tones

The React frontend currently supports:

Professional
Casual
Friendly

The Chrome Extension currently sends:

professional

as the default tone.

Groq AI Integration

The backend communicates with Groq using its OpenAI-compatible Chat Completions API.

Configuration:

groq.api.url=${GROQ_API_URL:https://api.groq.com/openai/v1/chat/completions}
groq.api.key=${GROQ_API_KEY:}
groq.api.model=${GROQ_MODEL:openai/gpt-oss-20b}

The API key is provided through an environment variable.

GROQ_API_KEY

The key is never stored in:

React frontend
Chrome Extension
GitHub repository
Client-side JavaScript
2. Chrome Extension

The Chrome Extension provides direct Gmail integration.

It adds an:

✨ AI Reply

button to the Gmail compose interface.

The extension detects Gmail's dynamically rendered compose interface and injects the AI Reply button.

Chrome Extension Architecture
Gmail
  │
  ▼
MutationObserver
  │
  ▼
Detect Compose Window
  │
  ▼
Inject AI Reply Button
  │
  ▼
User Clicks AI Reply
  │
  ▼
Extract Email Content
  │
  ▼
POST Request
  │
  ▼
Spring Boot Backend
  │
  ▼
Groq AI
  │
  ▼
Generated Reply
  │
  ▼
Gmail Compose Box
MutationObserver Architecture

Gmail dynamically renders its interface.

Because compose windows can appear after the initial page load, the extension uses JavaScript's MutationObserver.

Gmail Page
    │
    ▼
DOM Changes
    │
    ▼
MutationObserver
    │
    ▼
Detect Compose Elements
    │
    ▼
Find Compose Toolbar
    │
    ▼
Inject AI Reply Button

This allows the extension to work with Gmail's dynamically generated UI.

Email Extraction

When the user clicks the AI Reply button, the extension searches for the latest email content using Gmail's rendered DOM.

The extension extracts the latest available email content and sends it to the Spring Boot API.

The request contains:

{
  "emailContent": "Original email content",
  "tone": "professional"
}
Generated Reply Insertion

After the backend returns the generated response:

Groq
  ↓
Spring Boot
  ↓
Chrome Extension
  ↓
Gmail Compose Editor

The extension inserts the generated reply into the Gmail compose editor.

The user can then:

Review the response
Edit the response
Add additional information
Send the email
Chrome Extension Structure
chrome-extension/
│
├── manifest.json
├── content.js
├── content.css
│
└── icons/
    └── logo.png
Chrome Extension Installation

The extension can be installed locally using Chrome's Developer Mode.

Step 1

Open:

chrome://extensions
Step 2

Enable:

Developer mode
Step 3

Click:

Load unpacked
Step 4

Select:

chrome-extension/

from this repository.

Step 5

Open Gmail and open an email.

The:

✨ AI Reply

button should appear in the compose interface.

3. React Frontend

The project also includes a standalone React frontend.

The React application allows users to enter an email manually and generate an AI reply without using Gmail.

React Architecture
React UI
   │
   ▼
User enters email
   │
   ▼
Select tone
   │
   ▼
Generate Reply
   │
   ▼
HTTP POST
   │
   ▼
Spring Boot API
   │
   ▼
Groq AI
   │
   ▼
Generated Reply
   │
   ▼
React UI
   │
   ▼
Copy to Clipboard
React Features
Email content input
Tone selection
AI reply generation
Loading state
Error handling
Generated response display
Copy to clipboard
REST API integration
React Setup

Navigate to:

react-frontend/

Install dependencies:

npm install

Run development server:

npm run dev

Build production version:

npm run build
4. Complete User Workflow
Gmail Workflow

The complete Gmail workflow is:

1. User opens Gmail
          ↓
2. User opens an email
          ↓
3. Gmail renders the compose interface
          ↓
4. MutationObserver detects the compose window
          ↓
5. Chrome Extension injects AI Reply button
          ↓
6. User clicks AI Reply
          ↓
7. Extension extracts email content
          ↓
8. Extension sends HTTP POST request
          ↓
9. Spring Boot receives the request
          ↓
10. Spring Boot constructs AI request
          ↓
11. Backend sends request to Groq
          ↓
12. Groq generates email reply
          ↓
13. Groq response returns to Spring Boot
          ↓
14. Spring Boot returns generated reply
          ↓
15. Chrome Extension receives response
          ↓
16. Extension inserts response into Gmail
          ↓
17. User reviews and edits the reply
          ↓
18. User sends the email
React Workflow
User
  ↓
React Frontend
  ↓
Email + Tone
  ↓
Spring Boot REST API
  ↓
Groq AI
  ↓
Generated Reply
  ↓
React Frontend
  ↓
Copy Response
Security Architecture

One of the important architectural decisions in this project is keeping the Groq API key on the backend.

Secure Flow
React / Chrome Extension
          │
          │ Email Content
          ▼
Spring Boot Backend
          │
          │ GROQ_API_KEY
          ▼
Groq API

The client never communicates directly with Groq.

The API key is stored as an environment variable on the backend.

Environment Variables

The backend uses environment variables for sensitive configuration.

Example:

GROQ_API_KEY=your_api_key
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_MODEL=openai/gpt-oss-20b

Do not commit .env files to GitHub.

The .gitignore file excludes environment files.

Local Backend Setup

Navigate to:

spring-boot-backend/

Set the required environment variables.

Then run:

./mvnw spring-boot:run

On Windows:

mvnw.cmd spring-boot:run

The backend runs on:

http://localhost:8080
Maven Build

To build the Spring Boot application:

./mvnw clean package

Windows:

mvnw.cmd clean package
Docker

The Spring Boot backend is Dockerized.

Dockerfile location:

spring-boot-backend/Dockerfile

Build the image from the backend directory:

docker build -t automated-email-writer .

Run the container:

docker run -p 8080:8080 \
  -e GROQ_API_KEY=your_api_key \
  automated-email-writer
Deployment Architecture

The production architecture is:

                    Internet
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
   React Frontend             Gmail + Extension
          │                         │
          │                         │
          └──────────┬──────────────┘
                     │
                     ▼
             Render Backend
                     │
                     ▼
              Spring Boot API
                     │
                     ▼
                  Groq AI
Production Backend

The Spring Boot backend is deployed on Render.

Production API:

https://automated-email-writer.onrender.com

Generate endpoint:

https://automated-email-writer.onrender.com/api/email/generate

The Groq API key is configured through Render environment variables.

Render Configuration

The backend is located inside:

spring-boot-backend/

For deployment, the backend service should use:

Root Directory:
spring-boot-backend

The backend uses:

server.port=${PORT:8080}

This allows Render to provide the production port through the PORT environment variable.

Technology Stack
Backend
Java 21
Spring Boot
Spring Web
REST API
WebClient
Maven
Lombok
AI
Groq API
OpenAI-compatible Chat Completions API
openai/gpt-oss-20b
Frontend
React
JavaScript
Vite
Material UI
Chrome Extension
JavaScript
Chrome Extension Manifest V3
MutationObserver
Gmail DOM integration
DevOps
Docker
Render
Git
GitHub
Maven
npm
API Request Flow
Client
  │
  │
  │ POST /api/email/generate
  │
  ▼
Spring Boot Controller
  │
  ▼
EmailGeneratorService
  │
  ▼
WebClient
  │
  ▼
Groq API
  │
  ▼
AI Generated Reply
  │
  ▼
Spring Boot
  │
  ▼
Client
Example API Request
POST /api/email/generate
Content-Type: application/json
{
  "emailContent": "Hello Yashasvi, we would like to schedule an interview for the AI/ML internship.",
  "tone": "professional"
}

Example generated response:

Dear Rahul,

Thank you for reaching out regarding the AI/ML internship opportunity. I appreciate the opportunity and would be happy to discuss my experience and availability.

Please let me know a convenient date and time for the interview.

Best regards,
Yashasvi
Testing
Backend Testing

The API can be tested using:

Postman
cURL
React frontend
Chrome Extension

Example:

curl -X POST \
  https://automated-email-writer.onrender.com/api/email/generate \
  -H "Content-Type: application/json" \
  -d "{\"emailContent\":\"Thank you for contacting me.\",\"tone\":\"friendly\"}"
React Testing

Run:

npm install
npm run dev

Then open the Vite development URL shown in the terminal.

Test:

Enter email
    ↓
Select tone
    ↓
Generate Reply
    ↓
AI Response
    ↓
Copy to Clipboard
Chrome Extension Testing

Open:

chrome://extensions

Enable Developer Mode and load:

chrome-extension/

Then:

Open Gmail
    ↓
Open an email
    ↓
Open compose/reply
    ↓
Click AI Reply
    ↓
Wait for generation
    ↓
Generated response appears
Error Handling

The backend handles errors from the AI service and returns appropriate HTTP responses.

The Chrome Extension also handles:

Missing email content
Missing Gmail compose box
Backend errors
API errors
Network errors

The React frontend handles:

API errors
Loading states
Failed requests
Empty input
Current Limitations

The current implementation has some limitations:

Gmail DOM selectors may change if Gmail changes its interface.
Chrome Extension currently uses a default professional tone.
Authentication is not implemented.
Rate limiting is not implemented.
User-specific conversation history is not implemented.
The backend currently does not maintain persistent email history.
Render's free service may experience cold starts after inactivity.
AI-generated responses should always be reviewed before sending.
Security Considerations

The project follows a backend-centered AI architecture.

Important security principles:

API keys are stored only on the backend.
Secrets are managed through environment variables.
.env files are excluded from Git.
Groq credentials are never exposed to the browser.
React communicates with Spring Boot instead of directly communicating with Groq.
Chrome Extension communicates with the backend instead of directly communicating with Groq.

For a public production release, additional security features should be added.

Future Improvements

Planned improvements include:

User authentication
User accounts
Multiple AI models
Custom reply styles
Better context awareness
Conversation history
Gmail thread understanding
Rate limiting
Request logging
Usage analytics
Improved Gmail DOM handling
Better error recovery
Streaming AI responses
Production monitoring
Chrome Web Store publication
Key Engineering Decisions
Backend-Centered AI Communication

The Groq API is accessed through Spring Boot instead of directly from the frontend.

This prevents exposing the API key and provides a centralized place for:

Prompt construction
Validation
Error handling
Authentication
Rate limiting
AI provider changes
Chrome Extension for Gmail Integration

The Chrome Extension handles Gmail-specific functionality.

The backend remains independent of Gmail's DOM.

Gmail Integration
       ↓
Chrome Extension
       ↓
REST API
       ↓
Spring Boot
       ↓
AI Provider

This separation keeps responsibilities clear.

React as a Separate Client

The React frontend provides an independent interface for the same backend API.

Both clients use the same backend:

                    ┌───────────────┐
                    │ Spring Boot   │
                    │ REST API      │
                    └───────┬───────┘
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
      React Frontend               Chrome Extension

This allows the backend to serve multiple clients.

Complete Data Flow
                    USER
                     │
                     ▼
                  Gmail
                     │
                     ▼
            Chrome Extension
                     │
             Extract Email
                     │
                     ▼
              HTTP Request
                     │
                     ▼
          Spring Boot Backend
                     │
              Build Prompt
                     │
                     ▼
                 Groq AI
                     │
            Generate Reply
                     │
                     ▼
          Spring Boot Backend
                     │
              HTTP Response
                     │
                     ▼
            Chrome Extension
                     │
             Insert Response
                     │
                     ▼
                  Gmail
                     │
                     ▼
               User Review
                     │
                     ▼
              Send Email
Production Workflow
Gmail
  ↓
Chrome Extension
  ↓
HTTPS
  ↓
Render
  ↓
Spring Boot
  ↓
Groq API
  ↓
Spring Boot
  ↓
Chrome Extension
  ↓
Gmail
Repository

GitHub:

https://github.com/YashasviRajput13/Automated-email-writer
Project Goals

The main goals of this project are:

Reduce the time required to write email replies.
Provide contextual AI-generated responses.
Integrate AI directly into Gmail.
Keep AI credentials secure.
Demonstrate a complete full-stack AI application.
Demonstrate REST API architecture.
Demonstrate Chrome Extension development.
Demonstrate AI API integration.
Demonstrate Docker-based backend deployment.
Maintain a scalable separation between clients and backend services.
Author

Yashasvi Rajput

B.Tech — Artificial Intelligence & Machine Learning

Project Summary

AI Email Writer Assistant combines:

React
   +
Spring Boot
   +
Groq AI
   +
Chrome Extension
   +
Gmail
   +
Docker
   +
Render

to create an AI-powered email reply generation system.

The core workflow remains:

Open Email
     ↓
Click AI Reply
     ↓
Extension extracts email
     ↓
Spring Boot REST API
     ↓
Groq AI
     ↓
Generated Reply
     ↓
Automatically inserted into Gmail
     ↓
User reviews and sends
