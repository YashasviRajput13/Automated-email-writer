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
