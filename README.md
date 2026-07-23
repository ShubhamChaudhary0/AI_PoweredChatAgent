# AI Powered Chatbot

This project is a simple MERN-style chatbot starter with:

- a Node.js + Express backend in the server folder
- a React + Vite frontend in the client folder
- a basic chat UI that sends messages to the backend and displays bot replies

## Run locally

1. Start the backend:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend in a second terminal:
   ```bash
   cd client
   npm run dev
   ```

3. Open http://localhost:3000

## Notes

- The backend uses a local fallback response engine by default.
- If you add an OpenAI API key in the server environment, the backend can route requests to OpenAI instead.
