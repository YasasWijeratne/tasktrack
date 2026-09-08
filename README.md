# TaskTrack

TaskTrack is a full-stack task management application developed for the LessTaxi Software Engineer Intern technical assignment.

The application provides a task board with three workflow stages:

- To Do
- Doing
- Done

It supports secure authentication, role-based permissions, task assignment, and drag-and-drop task movement with persistent database updates.

---

## Features

### Normal Users

- Register and log in
- Create tasks
- View permitted tasks
- Edit and delete permitted tasks
- Assign eligible unassigned tasks to themselves
- Move tasks between To Do, Doing, and Done
- Task status changes remain after refresh

### Administrators

- Log in using an administrator account
- View all users
- View all tasks
- Assign tasks to users
- Reassign tasks between users
- Unassign tasks
- Edit and delete tasks
- Change task statuses

Administrator accounts cannot be created through public registration.

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- DnD Kit
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Tokens
- CORS

---

## Project Structure

```text
tasktrack/
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       └── pages/
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       └── routes/
│
├── screenshots/
└── README.md
```

The frontend and backend are maintained as separate applications and communicate through REST APIs.

---

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

For local development:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## Deployment

- Frontend deployed on **Vercel**
- Backend deployed on **Render**
- Database hosted on **MongoDB Atlas**

---
