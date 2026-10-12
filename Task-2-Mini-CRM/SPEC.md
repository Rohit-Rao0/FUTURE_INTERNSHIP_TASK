# Hospital Management System - VedacureMe

## Project Overview
- **Project Name**: HMS-VedacureMe (Hospital Management System)
- **Type**: Full-stack Web Application (MERN Stack)
- **Core Functionality**: A comprehensive hospital management system with role-based access for Administrators, Doctors, and Patients
- **Target Users**: Hospital administrators, doctors, and patients

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: Custom CSS with CSS Variables

---

## Database Schema

### 1. User Model
```
javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed),
  role: String (enum: 'admin', 'doctor', 'patient'),
  firstName: String,
  lastName: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Doctor Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  specialization: String,
  qualification: String,
  experience: Number,
  consultationFee: Number,
  availability: [{
    day: String,
    startTime: String,
    endTime: String,
    maxAppointments: Number
  }],
  dailyAppointmentLimit: Number,
  isAvailable: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Patient Model
```
javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  dateOfBirth: Date,
  gender: String,
  bloodGroup: String,
  address: String,
  emergencyContact: String,
  medicalHistory: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Appointment Model
```
javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient),
  doctorId: ObjectId (ref: Doctor),
  appointmentDate: Date,
  timeSlot: String,
  status: String (enum: 'scheduled', 'completed', 'cancelled', 'no-show'),
  symptoms: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Clinic Model
```
javascript
{
  _id: ObjectId,
  name: String,
  address: String,
  phone: String,
  email: String,
  workingHours: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Module Specifications

### 1. Administrator Module
**Features:**
- Manage clinic administrators, doctors, and patients
- CRUD operations for doctor profiles
- CRUD operations for clinic details
- Set doctor availability and consultation timings
- Set daily appointment limits for doctors
- Track and view all appointments
- View patient visit history
- Generate basic reports
- Role-based access management

**Admin Dashboard Pages:**
- `/admin/dashboard` - Overview stats
- `/admin/doctors` - Manage doctors
- `/admin/patients` - Manage patients
- `/admin/appointments` - View all appointments
- `/admin/clinic` - Manage clinic settings
- `/admin/reports` - Generate reports

### 2. Doctor Module
**Features:**
- Secure login
- View assigned appointments
- View daily schedules
- Access basic patient visit details
- Update consultation times
- Modify availability
- Track appointment status

**Doctor Dashboard Pages:**
- `/doctor/dashboard` - Overview
- `/doctor/appointments` - Manage appointments
- `/doctor/schedule` - View/manage schedule
- `/doctor/availability` - Set availability

### 3. Patient Module
**Features:**
- Secure registration and login
- View clinic information
- Browse doctor profiles
- Check available time slots
- Book appointments online
- Cancel appointments
- View appointment history
- Receive status updates

**Patient Dashboard Pages:**
- `/patient/dashboard` - Overview
- `/patient/doctors` - Browse doctors
- `/patient/book-appointment` - Book appointment
- `/patient/appointments` - View history

### 4. Authentication & Authorization Module
**Features:**
- JWT-based authentication
- Secure password hashing
- Login validation
- Session management
- Role-based access control (RBAC)
- Protected routes

**Auth Routes:**
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### 5. Appointment Management Module
**Features:**
- Time slot management
- Double booking prevention
- Appointment status tracking
- Daily appointment records
- Appointment notifications (status updates)

**Appointment Routes:**
- POST `/api/appointments` - Create appointment
- GET `/api/appointments` - Get all appointments
- GET `/api/appointments/:id` - Get single appointment
- PUT `/api/appointments/:id` - Update appointment
- DELETE `/api/appointments/:id` - Cancel appointment
- GET `/api/appointments/doctor/:doctorId` - Doctor's appointments
- GET `/api/appointments/patient/:patientId` - Patient's appointments

### 6. Reporting & Dashboard Module
**Features:**
- Daily appointment summary
- Doctor-wise schedule reports
- Patient visit history
- Overall system performance metrics
- Simple visual charts

**Dashboard Stats:**
- Total appointments today
- Total doctors
- Total patients
- Appointments by status
- Recent appointments

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/doctors` - List all doctors
- `POST /api/admin/doctors` - Create doctor
- `PUT /api/admin/doctors/:id` - Update doctor
- `DELETE /api/admin/doctors/:id` - Delete doctor
- `GET /api/admin/patients` - List all patients
- `PUT /api/admin/patients/:id` - Update patient
- `DELETE /api/admin/patients/:id` - Delete patient
- `GET /api/admin/reports` - Generate reports

### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/:id/availability` - Update availability

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/slots/:doctorId/:date` - Get available slots

---

## UI/UX Specification

### Color Palette
- **Primary**: `#0D9488` (Teal)
- **Primary Dark**: `#0F766E`
- **Secondary**: `#6366F1` (Indigo)
- **Accent**: `#F59E0B` (Amber)
- **Background**: `#F8FAFC` (Light gray)
- **Card Background**: `#FFFFFF`
- **Text Primary**: `#1E293B`
- **Text Secondary**: `#64748B`
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`
- **Border**: `#E2E8F0`

### Typography
- **Primary Font**: 'Poppins', sans-serif
- **Heading Font**: 'Playfair Display', serif
- **Body Font**: 'Inter', sans-serif

### Font Sizes
- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- H4: 1.25rem (20px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### Spacing System
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### Layout
- Sidebar width: 260px
- Header height: 64px
- Card border-radius: 12px
- Button border-radius: 8px

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## Project Structure

```
HMS-VedacureMe/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── doctorController.js
│   │   ├── patientController.js
│   │   └── appointmentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Patient.js
│   │   ├── Appointment.js
│   │   └── Clinic.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── patientRoutes.js
│   │   └── appointmentRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── Common/
│   │   │   └── Dashboard/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Admin/
│   │   │   ├── Doctor/
│   │   │   └── Patient/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Acceptance Criteria

### Authentication
- [ ] Users can register with email and password
- [ ] Users can login with valid credentials
- [ ] Invalid credentials show appropriate error
- [ ] JWT token is stored and used for subsequent requests
- [ ] Role-based access is enforced on all routes

### Admin Module
- [ ] Admin can view dashboard with stats
- [ ] Admin can add/edit/delete doctors
- [ ] Admin can view all patients
- [ ] Admin can view all appointments
- [ ] Admin can set doctor availability
- [ ] Admin can generate reports

### Doctor Module
- [ ] Doctor can login securely
- [ ] Doctor can view their appointments
- [ ] Doctor can update appointment status
- [ ] Doctor can manage availability

### Patient Module
- [ ] Patient can register and login
- [ ] Patient can browse doctors
- [ ] Patient can view doctor availability
- [ ] Patient can book appointments
- [ ] Patient can cancel appointments
- [ ] Patient can view appointment history

### Appointment Management
- [ ] Time slots are displayed correctly
- [ ] Double booking is prevented
- [ ] Appointment status can be updated
- [ ] All appointments are tracked

### Reports & Dashboard
- [ ] Dashboard shows correct statistics
- [ ] Reports are generated accurately
- [ ] Data is displayed in organized manner
