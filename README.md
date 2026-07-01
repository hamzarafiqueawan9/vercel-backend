# Full-stack React + Express + MongoDB Atlas app

## Deploy to Vercel

1. Push this project to GitHub.
2. Import it into Vercel.
3. Add these environment variables in Vercel:
   - `MONGODB_URI`: your MongoDB Atlas connection string
   - `VITE_API_URL`: your deployed backend URL, for example `https://your-backend.vercel.app/api`
4. Deploy.

## Local development

- Frontend: `npm run dev`
- Backend: `npm run server`

## Backend env

Copy [backend/.env.example](backend/.env.example) to `backend/.env` and fill in your Atlas URI.
