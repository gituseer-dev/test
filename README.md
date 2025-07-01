# Image Checker React + OpenAI

## Overview
This is a simple React app that allows users to upload up to 4 images, enter a question, and get individual responses for each image from OpenAI's API. It uses basic inline styles for simplicity and focuses on core functionality.

## Features
- Upload up to 4 product images
- Enter a single query
- Submit query to OpenAI for each image
- Display each response associated with its image in a chat-like UI
- Basic error handling and user feedback

## Setup & Run
1. Clone or unzip project.
2. Run `npm install` to install dependencies.
3. Create `.env` file in project root with your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run the app:
   ```
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

## Notes
- This app uses Vite and React for rapid development.
- Tailwind CSS is intentionally omitted to keep setup simple and avoid issues.
- The app sends base64 encoded images to OpenAI Chat API for processing.
- For demonstration, error handling is minimal but can be extended.

## GenAI Tools Used
- ChatGPT-4o-mini for code generation assistance.
