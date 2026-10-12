# VedacureMe – Hospital Management System

VedacureMe is a web-based hospital management application designed to simplify doctor appointments and patient management. It provides separate dashboards for administrators, doctors, and patients.

This project is submitted as part of the **Future Interns Full Stack Web Development Internship – Task 2**.

## Features

### Admin
- Admin login and dashboard
- Manage doctors and patients
- Manage appointments
- View reports and clinic settings

### Doctor
- Doctor dashboard
- Manage appointments
- Manage availability

### Patient
- Patient registration and login
- Browse and search doctors by name or specialization
- Book appointments
- View personal appointments

## Technologies Used

**Frontend**
- React.js
- JavaScript
- CSS
- Vite

**Backend**
- Node.js
- Express.js
- REST APIs

**Database**
- MongoDB
- Mongoose

## Project Structure

```text
Task-2-Mini-CRM/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB running locally or a MongoDB Atlas database

### 1. Clone the repository

```bash
git clone https://github.com/Rohit-Rao0/FUTURE_FS_01.git
cd FUTURE_FS_01/Task-2-Mini-CRM
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your own configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
```

Use the actual environment variable names required by your backend code. Never commit your `.env` file or publish credentials.

Start the backend using the command configured in `backend/package.json`, for example:

```bash
npm start
```

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Security

- Keep database credentials and secret keys in environment variables.
- Do not commit `.env` files or `node_modules`.
- Use authorized access to protect patient information.

## Future Improvements

- Patient enquiry and lead tracking
- Lead status management: New, Contacted, Converted
- Notes and follow-up reminders for leads
- Search and filtering for leads
- Improved dashboard analytics

## Internship

**Program:** Future Interns – Full Stack Web Development  
**Task:** Task 2 – Mini CRM / Client Lead Management System

## Author

**Rohit Yadav**

GitHub: https://github.com/Rohit-Rao0

Repository: https://github.com/Rohit-Rao0/FUTURE_FS_01
