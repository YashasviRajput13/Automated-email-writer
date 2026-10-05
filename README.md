
# ✉️ AI Email Writer

> An AI-powered email assistant that generates professional email replies using Groq AI and integrates directly with Gmail through a Chrome Extension.

---

## 🚀 Overview

AI Email Writer is an AI-powered application that helps users generate email replies automatically.

Instead of manually writing a response, the user can:

1. Open an email in Gmail.
2. Click the **✨ AI Reply** button.
3. The extension extracts the email content.
4. The content is sent to the Spring Boot backend.
5. The backend creates an AI prompt.
6. Groq generates the reply.
7. The generated response is returned to the extension.
8. The reply is automatically inserted into the Gmail compose box.

The project also includes a standalone **React web interface** where users can paste an email and generate a reply without using Gmail.

---

# 🎯 Problem Statement

Writing email replies repeatedly can be time-consuming, especially when users need to maintain a professional tone.

For example:

- Professional emails
- Internship emails
- Business communication
- Customer responses
- College communication
- Follow-up emails

The goal of this project is to reduce the time required to write such responses by using AI to generate context-aware replies.

---

# 💡 Solution

The system provides an AI-powered email generation workflow.

Instead of:

```text
Read Email
    ↓
Think About Response
    ↓
Write Response
    ↓
Edit Response
    ↓
Send
````

The system provides:

```text
Open Email
    ↓
Click AI Reply
    ↓
AI Generates Response
    ↓
Review Response
    ↓
Send
```

---

# ✨ Features

* 🤖 AI-powered email reply generation
* 📧 Gmail integration
* ✨ AI Reply button inside Gmail
* 🎯 Professional email generation
* 🎨 Multiple tone support
* ⚡ Fast AI response generation
* 🌐 Standalone React web interface
* 🔐 Backend-based API key protection
* 🐳 Dockerized Spring Boot backend
* ☁️ Backend deployed on Render
* 🔄 Dynamic Gmail UI detection using `MutationObserver`
* 📋 Automatic insertion of generated replies into Gmail

---

# 🏗️ Complete System Architecture

The project consists of four major components:

```text
                         ┌─────────────────────┐
                         │       USER          │
                         └──────────┬──────────┘
                                    │
                         Opens Gmail / Web App
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
          ┌─────────────────┐             ┌─────────────────┐
          │  Gmail Website  │             │  React Web App  │
          └────────┬────────┘             └────────┬────────┘
                   │                               │
                   ▼                               │
          ┌─────────────────┐                      │
          │ Chrome Extension│                      │
          └────────┬────────┘                      │
                   │                               │
                   └───────────────┬───────────────┘
                                   │
                              HTTPS / REST
                                   │
                                   ▼
                       ┌─────────────────────┐
                       │   Spring Boot API   │
                       │      Backend        │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │ Email Generator     │
                       │ Service Layer       │
                       └──────────┬──────────┘
                                  │
                                  │ API Request
                                  ▼
                       ┌─────────────────────┐
                       │      Groq API      │
                       │    AI Model         │
                       └──────────┬──────────┘
                                  │
                                  │ Generated Reply
                                  ▼
                       ┌─────────────────────┐
                       │   Spring Boot API   │
                       └──────────┬──────────┘
                                  │
                                  ▼
                         Chrome Extension
                                  │
                                  ▼
                         Gmail Compose Box
```

---

# 🔄 Gmail Extension Architecture

The Gmail integration works using a Chrome Extension.

```text
                    GMAIL
                      │
                      │
                      ▼
              Content Script
                content.js
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
   Detect Compose            Extract Email
   Window                    Content
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
                AI Reply Button
                      │
                  User Click
                      │
                      ▼
                fetch() POST
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
              content.js
                      │
                      ▼
             Gmail Compose Box
```

---

# 🧩 Component Architecture

## 1. Chrome Extension

The Chrome Extension is responsible for integrating the AI functionality directly into Gmail.

Main responsibilities:

* Detect Gmail compose windows
* Inject the AI Reply button
* Extract email content
* Send requests to the backend
* Receive AI-generated responses
* Insert the generated reply into Gmail

Main files:

```text
email-writer-ext/
│
├── manifest.json
├── content.js
├── content.css
│
└── icons/
    └── logo.png
```

---

# 🔍 MutationObserver Architecture

Gmail is a dynamic web application.

The compose window may not exist when the Gmail page initially loads.

Therefore, the extension uses `MutationObserver`.

```text
Gmail Page Loads
       │
       ▼
Content Script Starts
       │
       ▼
MutationObserver
       │
       │ Watches DOM
       ▼
Gmail Creates Compose Window
       │
       ▼
Observer Detects New Elements
       │
       ▼
injectButton()
       │
       ▼
✨ AI Reply Button
```

The observer watches:

```javascript
observer.observe(document.body, {
    childList: true,
    subtree: true
});
```

### Why MutationObserver?

A normal page-load event is not sufficient because Gmail can dynamically create a compose window after the page has already loaded.

`MutationObserver` allows the extension to react to these DOM changes.

---

# 📧 Email Content Extraction

The extension identifies the email content using Gmail's DOM.

Conceptually:

```text
Gmail Conversation
        │
        ├── Email 1
        ├── Email 2
        ├── Email 3
        └── Latest Email
                │
                ▼
          Extract Text
                │
                ▼
          innerText.trim()
```

The latest email is selected so the AI can generate a reply based on the most recent message.

---

# 🖥️ React Frontend Architecture

The project also contains a standalone React application.

```text
              React Application
                     │
                     ▼
              User Interface
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
   Email Content             Tone
      Input                 Selection
          │                     │
          └──────────┬──────────┘
                     │
                     ▼
              Generate Reply
                     │
                     ▼
                 fetch()
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
              React UI Output
```

The React application does **not** communicate directly with Groq.

It communicates with the Spring Boot backend.

---

# ⚙️ Backend Architecture

The backend follows a layered architecture.

```text
             HTTP Request
                  │
                  ▼
       ┌────────────────────┐
       │ REST Controller    │
       │                    │
       │ EmailGenerator     │
       │ Controller         │
       └─────────┬──────────┘
                 │
                 ▼
       ┌────────────────────┐
       │ Service Layer      │
       │                    │
       │ EmailGenerator     │
       │ Service            │
       └─────────┬──────────┘
                 │
                 ▼
       ┌────────────────────┐
       │ Groq API Client    │
       └─────────┬──────────┘
                 │
                 ▼
            Groq API
                 │
                 ▼
          AI Generated Text
                 │
                 ▼
            Controller
                 │
                 ▼
          HTTP Response
```

---

# 🎛️ Controller Layer

The controller exposes the REST API.

Endpoint:

```text
POST /api/email/generate
```

Example:

```http
POST /api/email/generate
Content-Type: application/json
```

Request:

```json
{
  "emailContent": "Hello, thank you for reaching out to us.",
  "tone": "professional"
}
```

Response:

```text
Thank you for reaching out. I appreciate your message...
```

---

# 🧠 Service Layer

The service layer contains the main AI logic.

Responsibilities:

* Receive email content
* Receive selected tone
* Build AI prompt
* Send request to Groq
* Process Groq response
* Return generated reply

Architecture:

```text
EmailRequest
     │
     ├── emailContent
     │
     └── tone
          │
          ▼
   Prompt Construction
          │
          ▼
       Groq API
          │
          ▼
    AI Generated Reply
```

---

# 🤖 Groq Integration

The backend communicates with the Groq API using the OpenAI-compatible chat completion API.

Endpoint:

```text
https://api.groq.com/openai/v1/chat/completions
```

The backend sends:

```text
Model
   +
System Prompt
   +
Email Content
   +
Tone
   ↓
Groq
```

Groq returns:

```text
AI Generated Response
```

The backend extracts the generated content and sends it back to the client.

---

# 🔐 Security Architecture

One of the important design decisions in this project is keeping the AI API key on the backend.

### ❌ Not used

```text
Chrome Extension
      │
      ▼
   Groq API
      ▲
      │
  API KEY EXPOSED
```

This would expose the API key to users.

### ✅ Actual architecture

```text
Chrome Extension
      │
      │ No Groq Key
      ▼
Spring Boot Backend
      │
      │ GROQ_API_KEY
      ▼
Groq API
```

The key is stored using an environment variable:

```properties
groq.api.key=${GROQ_API_KEY:}
```

The actual key is configured on Render and is never committed to GitHub.

---

# 🔄 Complete Request Flow

When a user clicks **AI Reply**:

```text
1. User opens Gmail
          ↓
2. Chrome Extension loads
          ↓
3. MutationObserver monitors Gmail
          ↓
4. Compose window appears
          ↓
5. AI Reply button is injected
          ↓
6. User clicks AI Reply
          ↓
7. Latest email is extracted
          ↓
8. Extension creates JSON request
          ↓
9. POST /api/email/generate
          ↓
10. Spring Boot receives request
          ↓
11. Controller passes request to Service
          ↓
12. Service creates AI prompt
          ↓
13. Backend sends request to Groq
          ↓
14. Groq generates reply
          ↓
15. Backend extracts generated content
          ↓
16. Response returned to Extension
          ↓
17. Extension receives generated reply
          ↓
18. Gmail compose box is located
          ↓
19. Generated reply is inserted
          ↓
20. User reviews and sends email
```

---

# 🌐 Deployment Architecture

The backend is containerized using Docker and deployed on Render.

```text
                    GitHub
                      │
                      │ Source Code
                      ▼
                Docker Build
                      │
                      ▼
           Java 21 Docker Image
                      │
                      ▼
                Spring Boot
                      │
                      ▼
                   Render
                      │
                      │ HTTPS
                      ▼
       automated-email-writer.onrender.com
                      │
                      ▼
                  Groq API
```

---

# 🐳 Docker Architecture

The backend uses Java 21.

Docker workflow:

```text
Dockerfile
     │
     ▼
Java 21 Base Image
     │
     ▼
Copy Maven Project
     │
     ▼
Maven Build
     │
     ▼
Spring Boot JAR
     │
     ▼
Run Application
```

The application is exposed through port:

```text
8080
```

Render provides the production port through the `PORT` environment variable.

---

# ☁️ Production Architecture

```text
                        INTERNET
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       Gmail + Extension           React Web App
              │                         │
              │ HTTPS                   │ HTTPS
              └────────────┬────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │      Render          │
                │                      │
                │   Spring Boot API    │
                └──────────┬───────────┘
                           │
                           │ HTTPS
                           ▼
                ┌──────────────────────┐
                │       Groq API       │
                │                      │
                │    AI Model          │
                └──────────────────────┘
```

---

# 🛠️ Technology Stack

| Layer               | Technology       |
| ------------------- | ---------------- |
| Frontend            | React            |
| UI                  | Material UI      |
| Backend             | Spring Boot      |
| Language            | Java 21          |
| AI                  | Groq API         |
| Browser Integration | Chrome Extension |
| Extension           | Manifest V3      |
| HTTP Communication  | REST API         |
| Containerization    | Docker           |
| Deployment          | Render           |
| Version Control     | Git + GitHub     |
| Development         | VS Code          |

---

# 📁 Project Structure

The project is divided into three repositories.

## Backend

```text
Automated-email-writer/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/email/writer/app/
│       │       │
│       │       ├── EmailGeneratorController.java
│       │       ├── EmailGeneratorService.java
│       │       ├── EmailRequest.java
│       │       └── ...
│       │
│       └── resources/
│           └── application.properties
│
├── Dockerfile
├── pom.xml
├── mvnw
├── .gitignore
└── README.md
```

---

## React Frontend

```text
email-writer-react/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── public/
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

---

## Chrome Extension

```text
email-writer-ext/
│
├── manifest.json
├── content.js
├── content.css
│
└── icons/
    └── logo.png
```

---

# 🔌 API Documentation

## Generate Email Reply

### Endpoint

```text
POST /api/email/generate
```

### Local

```text
http://localhost:8080/api/email/generate
```

### Production

```text
https://automated-email-writer.onrender.com/api/email/generate
```

### Headers

```http
Content-Type: application/json
```

### Request

```json
{
  "emailContent": "Hello, I wanted to follow up regarding the internship opportunity.",
  "tone": "professional"
}
```

### Response

```text
Thank you for following up regarding the internship opportunity...
```

---

# 🎨 Supported Tones

The frontend currently supports tones such as:

```text
Professional
Casual
Friendly
```

The tone is sent to the backend and incorporated into the AI generation process.

---

# 🚀 Running the Backend Locally

## 1. Clone Repository

```bash
git clone https://github.com/YashasviRajput13/Automated-email-writer.git
```

```bash
cd Automated-email-writer
```

## 2. Configure Environment Variables

Create a `.env` file or configure the environment variable:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_MODEL=openai/gpt-oss-20b
```

Do not commit the `.env` file.

## 3. Run with Maven

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

---

# ⚛️ Running React Frontend

```bash
git clone <YOUR_REACT_REPOSITORY>
```

```bash
cd email-writer-react
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

# 🧩 Installing Chrome Extension Locally

Since the extension is a Chrome Extension, it can be loaded manually for development.

### Step 1

Open Chrome.

### Step 2

Go to:

```text
chrome://extensions
```

### Step 3

Enable:

```text
Developer mode
```

### Step 4

Click:

```text
Load unpacked
```

### Step 5

Select:

```text
email-writer-ext/
```

### Step 6

Open Gmail:

```text
https://mail.google.com
```

Open an email and click:

```text
✨ AI Reply
```

---

# 🧪 Testing

The backend can be tested using Postman.

Example request:

```http
POST https://automated-email-writer.onrender.com/api/email/generate
```

Body:

```json
{
  "emailContent": "Thank you for your application. We will get back to you soon.",
  "tone": "professional"
}
```

Expected result:

```text
An AI-generated email reply
```

---

# 🔒 Security Considerations

The project follows a backend-mediated AI architecture.

### API Key

The Groq API key is stored as:

```text
GROQ_API_KEY
```

It is not stored in:

* React code
* Chrome Extension
* GitHub repository
* Client-side JavaScript

### Recommended future improvements

For production-scale usage, the project should also implement:

* Authentication
* API rate limiting
* Request validation
* Abuse prevention
* Usage monitoring
* Logging
* CORS restrictions
* User-specific API quotas

---

# ⚠️ Current Limitations

Because Gmail is a third-party application, its internal DOM structure can change.

The extension currently depends on Gmail DOM selectors such as:

```text
.btC
.ADH
.a3s.aiL
[g_editable="true"]
```

If Gmail changes these selectors, the extension may require updates.

Other limitations:

* Backend free-tier hosting may have cold starts.
* AI responses depend on the selected Groq model.
* Very long emails may require prompt/token management.
* Multiple users would require backend rate limiting and authentication.

---

# 🔮 Future Improvements

Potential future versions could include:

### 1. Multiple AI tones

```text
Professional
Friendly
Casual
Formal
Apologetic
Persuasive
Concise
```

### 2. Reply length control

```text
Short
Medium
Detailed
```

### 3. Multi-language support

Generate replies in:

```text
English
Hindi
Spanish
French
German
etc.
```

### 4. Gmail-aware context

Use conversation history to generate more context-aware responses.

### 5. Authentication

Allow users to create accounts and maintain personal preferences.

### 6. Rate Limiting

Prevent abuse of the public API.

### 7. Chrome Web Store Distribution

Publish the extension officially for easier installation.

### 8. AI Reply Suggestions

Instead of generating one response:

```text
┌────────────────────────────┐
│ Professional Reply         │
├────────────────────────────┤
│ Friendly Reply             │
├────────────────────────────┤
│ Short Reply                │
└────────────────────────────┘
```

---

# 🧠 Key Engineering Decisions

## Why Spring Boot?

Spring Boot provides:

* REST API development
* Clean layered architecture
* Dependency injection
* Easy integration with external APIs
* Production-ready Java backend

---

## Why React?

React provides:

* Component-based UI
* Fast development
* Easy API integration
* Good ecosystem
* Reusable UI components

---

## Why Chrome Extension?

A normal web application cannot directly modify Gmail's interface.

The Chrome Extension allows the project to interact with Gmail's page and provide an integrated AI experience.

---

## Why MutationObserver?

Gmail dynamically creates UI elements.

`MutationObserver` allows the extension to detect those changes without continuously polling the DOM.

---

## Why Groq?

Groq provides a fast inference API and supports an OpenAI-compatible chat completion interface.

---

## Why Docker?

Docker makes the backend environment reproducible.

Instead of depending on the deployment server's Java configuration:

```text
Application
    +
Dependencies
    +
Java Runtime
        ↓
    Docker Image
```

The same container can be deployed consistently.

---

# 🔥 Key Technical Highlights

The major technical concepts demonstrated by this project are:

```text
Chrome Extension Development
        +
DOM Manipulation
        +
MutationObserver
        +
REST API
        +
Spring Boot
        +
Layered Architecture
        +
External AI API Integration
        +
Environment Variables
        +
Docker
        +
Cloud Deployment
        +
React
```

---

# 📊 Complete Data Flow

```text
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Gmail     │
└──────┬───────┘
       │
       │ Email Content
       ▼
┌──────────────────┐
│ Chrome Extension │
│                  │
│ MutationObserver │
│       +          │
│ Content Script   │
└────────┬─────────┘
         │
         │ HTTPS POST
         │
         ▼
┌──────────────────────┐
│   Spring Boot API    │
│                      │
│ EmailGenerator       │
│ Controller           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Service Layer      │
│                      │
│ Prompt Construction  │
└──────────┬───────────┘
           │
           │ HTTPS
           ▼
┌──────────────────────┐
│       Groq API       │
│                      │
│      AI Model        │
└──────────┬───────────┘
           │
           │ Generated Text
           ▼
┌──────────────────────┐
│   Spring Boot API    │
└──────────┬───────────┘
           │
           │ HTTP Response
           ▼
┌──────────────────────┐
│  Chrome Extension    │
└──────────┬───────────┘
           │
           │ Insert Text
           ▼
┌──────────────────────┐
│ Gmail Compose Box    │
└──────────────────────┘
```

---

# 🌐 Production URLs

### Backend API

```text
https://automated-email-writer.onrender.com
```

### API Endpoint

```text
https://automated-email-writer.onrender.com/api/email/generate
```

---

# 📦 Repository Structure

The project is maintained using separate repositories:

### Backend

```text
Automated-email-writer
```

GitHub:

```text
https://github.com/YashasviRajput13/Automated-email-writer
```

### React Frontend

```text
email-writer-react
```

### Chrome Extension

```text
email-writer-ext
```

---

# 👨‍💻 Author

**Yashasvi Rajput**

B.Tech — Artificial Intelligence & Machine Learning

Interested in:

* Artificial Intelligence
* Machine Learning
* Agentic AI
* Backend Development
* Full Stack Development
* AI-powered applications

---

# ⭐ Project Highlights

> **AI-powered email generation + Gmail integration + Chrome Extension + Spring Boot + React + Groq + Docker + Cloud Deployment**

The project demonstrates how an AI service can be integrated into an existing application such as Gmail while keeping the AI credentials protected behind a backend API.

---

# 📜 License

This project is intended for educational and demonstration purposes.

````

### One change I strongly recommend

For your **GitHub README**, put a visual architecture diagram near the top rather than relying only on ASCII diagrams.

Your README structure should visually look like:

```text
AI Email Writer
       ↓
Project Demo / GIF
       ↓
Features
       ↓
Architecture Diagram ⭐
       ↓
How It Works
       ↓
Chrome Extension Architecture
       ↓
Backend Architecture
       ↓
React Architecture
       ↓
API Documentation
       ↓
Security
       ↓
Docker + Deployment
       ↓
Installation
       ↓
Future Improvements
       
