# TaskTrack

TaskTrack is a focused MERN task board built for the LessTaxi Software Engineer Intern technical assignment. It supports secure user authentication, role-based permissions, task ownership and assignment, and a persistent three-stage workflow.

## Features

- Register, log in, and log out with JWT authentication
- Password hashing with bcrypt
- User and administrator roles enforced by the API
- Task creation, editing, deletion, and self-assignment
- Exactly three workflow columns: To Do, Doing, and Done
- Drag-and-drop status updates persisted to MongoDB
- Optimistic board updates with rollback and feedback on API errors
- Admin user list, all-task view, assignment/reassignment/unassignment, and status controls
- Responsive frontend for desktop and mobile screens

## Technology

- Frontend: React, Vite, React Router, Axios, DnD Kit, plain CSS
- Backend: Node.js, Express, MongoDB, Mongoose, bcryptjs, JSON Web Tokens
- Database: MongoDB Atlas or any compatible MongoDB deployment

## Architecture

The frontend and backend are independent projects. The Express backend uses routes, controllers, Mongoose models, and authentication/authorization middleware. The React frontend uses an authentication context, protected routes, reusable board components, and one Axios API client.

```text
tasktrack/
|-- frontend/
|   |-- src/api/
|   |-- src/components/
|   |-- src/context/
|   `-- src/pages/
|-- backend/
|   |-- scripts/seedAdmin.js
|   `-- src/
|       |-- config/
|       |-- controllers/
|       |-- middleware/
|       |-- models/
|       `-- routes/
`-- screenshots/
```

## Permissions

Normal users can create tasks; view their created or assigned tasks and eligible unassigned tasks; self-assign an unassigned task; and manage tasks they created or that are assigned to them. They cannot create administrators, assign tasks to other people, list all users, or call admin endpoints.

Administrators can view all users and tasks, create/edit/delete tasks, change task statuses, and assign, reassign, or unassign tasks. Admin accounts are created only with the seed script.

## Local setup

Prerequisites: Node.js 20 or newer and a MongoDB connection string.

1. Install dependencies:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. Copy `backend/.env.example` to `backend/.env`, then replace the placeholders. The required private values are `MONGODB_URI` and `JWT_SECRET`. Set the `ADMIN_*` values before seeding.

3. Copy `frontend/.env.example` to `frontend/.env`. For local development it can remain:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Create the administrator once:

   ```bash
   cd backend
   npm run seed:admin
   ```

5. Run both projects in separate terminals:

   ```bash
   cd backend
   npm run dev
   ```

   ```bash
   cd frontend
   npm run dev
   ```

6. Open `http://localhost:5173`.

Real `.env` files are ignored. Never commit the database URI, JWT secret, or administrator password.

## MongoDB Atlas

Create a database user, allow your development IP in Atlas Network Access, and copy the Node.js driver URI. Put `tasktrack` after `.mongodb.net/`, then save the complete URI only as `MONGODB_URI` in `backend/.env`. MongoDB creates the database on the first write.

## API

All protected requests use `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a normal user |
| POST | `/api/auth/login` | Public | Log in |
| GET | `/api/auth/me` | Authenticated | Load current user |
| GET | `/api/tasks` | Authenticated | List accessible tasks |
| POST | `/api/tasks` | Authenticated | Create a task |
| PATCH | `/api/tasks/:id` | Permitted user | Edit task details |
| DELETE | `/api/tasks/:id` | Permitted user | Delete a task |
| PATCH | `/api/tasks/:id/status` | Permitted user | Change status |
| PATCH | `/api/tasks/:id/assign-self` | User | Self-assign an unassigned task |
| GET | `/api/admin/users` | Admin | List users |
| GET | `/api/admin/tasks` | Admin | List every task |
| PATCH | `/api/admin/tasks/:id/assign` | Admin | Assign or unassign a task |

The health endpoint is `GET /api/health`.

## Deployment

### Backend (Render or Railway)

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Configure `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, and `NODE_ENV=production` in the provider dashboard.
- Run the admin seed locally against the production database or as a one-off provider command.

### Frontend (Vercel or Netlify)

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Configure `VITE_API_URL=https://YOUR_BACKEND_HOST/api`.
- Configure SPA history fallback to `index.html` if the provider does not detect Vite automatically.

After deployment, set backend `CLIENT_URL` to the exact frontend origin and redeploy the backend.

## Submission details

- Repository: `<REPOSITORY_URL>`
- Deployed application: `<FRONTEND_URL>`
- Administrator email: provide privately to the reviewer
- Administrator password: provide privately to the reviewer
- Candidate contact: `<CONTACT_INFORMATION>`

## Screenshots

Add final deployment screenshots to `screenshots/` as `login.png`, `register.png`, `user-board.png`, and `admin-page.png`, then embed them here before submission. Screenshots should be captured after real environment values are configured and the application is running.
