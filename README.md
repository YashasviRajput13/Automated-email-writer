# AI Email Writer Assistant

AI-powered email reply generation for Gmail, backed by a Spring Boot API and Groq's OpenAI-compatible Chat Completions API.

## Features

- Generates professional email replies from existing email content.
- Supports a requested tone such as professional, friendly, or concise.
- Keeps the generated response free of a subject line.
- Provides a Gmail Chrome extension button for inserting generated replies into Gmail.
- Keeps the Groq API key on the backend and out of browser code.

## Tech Stack

- Java 21
- Spring Boot 4.1.1
- Spring Web and WebFlux `WebClient`
- Maven
- Groq Chat Completions API
- Chrome Extension Manifest V3

## Project Architecture

```text
Gmail Chrome Extension
        |
        | POST /api/email/generate
        | { emailContent, tone }
        v
Spring Boot backend :8080
        |
        | Authorization: Bearer GROQ_API_KEY
        v
Groq Chat Completions API
```

The repository contains the Spring Boot backend and the Gmail extension in the `chrome-extension` directory. The extension can be loaded into Chrome as an unpacked extension.

## Local Setup

Prerequisites:

- JDK 21 or newer
- Git
- Chrome, if using the Gmail extension
- A Groq API key

Create a local `.env` file in the project root. Never commit this file.

```properties
GROQ_API_KEY=your-groq-api-key
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_MODEL=openai/gpt-oss-20b
```

The backend reads these values through `application.properties`. `GROQ_API_KEY` is required when calling the generation endpoint. The API key is never required in React or extension code.

## Run Spring Boot

From the project root:

```cmd
mvnw.cmd clean test
mvnw.cmd spring-boot:run
```

The backend listens on `http://localhost:8080`.

## API

### Generate an email reply

```http
POST http://localhost:8080/api/email/generate
Content-Type: application/json
```

Request body:

```json
{
  "emailContent": "Could we reschedule our meeting to next Tuesday?",
  "tone": "professional"
}
```

The response body is the generated reply text. The endpoint returns `400` for empty email content, `503` when `GROQ_API_KEY` is missing, and `502` when Groq cannot be reached or returns an upstream/invalid response.

## Gmail Extension Setup

1. Start the Spring Boot backend on port `8080`.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Choose **Load unpacked**.
5. Select the `chrome-extension` directory.
6. Open Gmail, open or reply to an email, and use the **AI Reply** button.

The extension reads the latest email content from Gmail and sends this JSON to the backend:

```json
{
  "emailContent": "...",
  "tone": "professional"
}
```

The backend adds the email-generation prompt, calls Groq with the server-side API key, extracts `choices[0].message.content`, and returns only the reply text. The extension inserts that text into the Gmail compose box. No Groq credentials are sent to Gmail or the extension.

## Deployment Preparation

- Set `GROQ_API_KEY`, `GROQ_API_URL`, and `GROQ_MODEL` as deployment environment variables or secret-manager values.
- Do not deploy `.env`, commit secrets, or put API keys in extension/frontend files.
- Update the extension's backend URL and Chrome host permissions for the deployed HTTPS API.
- Restrict CORS to the deployed extension/frontend origin instead of using a wildcard.
- Add HTTPS, authentication/rate limiting, monitoring, and request-size limits before public deployment.
- Run `mvnw.cmd clean test` in CI before deployment.