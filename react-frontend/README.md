# Email Reply Generator

A React and Vite frontend that turns incoming email content into a polished reply. Select a tone, submit the email, and copy the generated response for use in your inbox.

## Features

- Generate replies from email content using Professional, Casual, or Friendly tones
- Loading and error states for API requests
- Copy generated replies to the clipboard
- Material UI components with a responsive layout

## Tech Stack

- React 19
- Vite
- Material UI
- JavaScript

## Local Setup

Requirements: Node.js 18 or newer and npm.

```bash
npm install
```

The frontend calls the deployed backend directly, so no API key or local backend configuration is required.

## Backend API

`POST https://automated-email-writer.onrender.com/api/email/generate`

Request body:

```json
{
	"emailContent": "The incoming email text",
	"tone": "Professional"
}
```

The backend returns the generated reply as plain text. Backend credentials and AI provider keys remain server-side and are not included in this project.

## Run the Project

Start the development server:

```bash
npm run dev
```

Run a production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```
