# HelpDesk AI – Ticketing System

A simplified **HelpDesk Ticketing Application** built as part of the **Wexa AI Fresher Assignment**.  
The system allows users to create support tickets, agents/admins to manage them, and integrates AI suggestions for faster resolution.

---

## 📌 Features

- **Authentication** (JWT-based Login & Register)  
- **Role-based access** (User, Agent, Admin)  
- **Tickets**  
  - Create, view, list tickets  
  - AI suggestion + confidence score  
  - Audit log timeline  
  - Mark as resolved  
- **Knowledge Base (KB)**  
  - List articles  
  - Add/edit (Admin only)  
- **Dashboards**  
  - User → Manage own tickets  
  - Agent → Resolve pending tickets  
  - Admin → View stats + all tickets  
- **Settings Page** → Confidence threshold (simple toggle for AI suggestions)

---

## ⚙️ Tech Stack

- **Frontend**: React (Vite) + TailwindCSS  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB (Mongoose)  
- **Auth**: JWT  
- **AI**: Stub workflow (easily replaceable with Gemini/OpenAI API)

---

## 🚀 Project Setup

### 1️⃣ Backend

cd server
npm install
Create a .env file:

MONGO_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=supersecret
PORT=5000
Start server: npm run dev

---

### 2️⃣ Frontend

bash
Copy
Edit
cd client
npm install
npm run dev
App will run on:
👉 Frontend: http://localhost:5173
👉 Backend: http://localhost:5000

🏗️ System Architecture
mermaid
Copy
Edit
flowchart TD
    U[User] -->|Login/Register| A[Auth API]
    U -->|Create Ticket| T[Tickets API]
    A --> DB[(MongoDB)]
    T --> AI[AI Suggestion Stub]
    T --> KB[Knowledge Base API]
    T --> AUD[Audit Log API]
    AG[Agent/Admin] -->|Manage Tickets| T
    AG -->|View KB| KB
    AG -->|Resolve Tickets| T
🧪 Testing
Run backend tests:

bash
Copy
Edit
cd server
npm test
Run frontend:

bash
Copy
Edit
cd client
npm run dev
Postman collection included (for API testing).

🐳 Docker (Optional)
bash
Copy
Edit
docker-compose up --build
📹 Demo Video
👉 [Demo Video Link Here] (upload Loom/Drive/YouTube)

🌐 Deployment
Frontend (Vercel/Netlify) → [URL here]

Backend (Render/Heroku) → [URL here]

Database (MongoDB Atlas)

✅ Checklist (as per PDF)
 User Auth (Login/Register)

 Tickets CRUD + AI Suggestion

 Audit Logs

 Knowledge Base

 Role-based dashboards (User/Agent/Admin)

 Settings page (Confidence toggle)

 Deployment ready

 Demo video recorded

👨‍💻 Developed by: Viraj Mulik
📅 Submission Date: 22 Aug 2025