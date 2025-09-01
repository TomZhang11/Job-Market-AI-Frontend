# Job Market AI - Frontend

An AI agent that answers tech job market questions and recommends skills to learn based on your resume and a corpus of real job postings.

It combines an agentic LLM with hybrid retrieval (dense + BM25) over a PGVector database of job postings, plus an optional live web search fallback for freshest results.

> **Demo:**  
> See the animation below for a demonstration of the Job Market AI.

![Demo of Job Market AI](demo.gif)

## Features

- **Tech job market Q&A**: Ask about trends, popular frameworks, and technology stacks.
- **Resume-driven skill gaps**: Upload a PDF resume; get 1-3 high-impact technical skills that synergize with your background.
- **Hybrid retrieval**: Ensemble of dense vector search and BM25 keyword search, with multi-query expansion via LLM.
- **Agent tools**: Vector DB search tool for postings and Google search tool for recent news.
- **FastAPI backend + React (Vite) frontend** with a clean chat UI and a web-search toggle.

## Prerequisites

- Node.js 18+ and npm

## Run the Frontend (Vite + React)

```
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Deploying on AWS

- Frontend: Host the Vite build on S3 + CloudFront or serve from an EC2/Amplify app. Update CORS in `backend/main.py` to your CloudFront/Amplify domain.


