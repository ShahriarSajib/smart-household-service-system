# FixMate – Home Service Platform

FixMate is a full-stack web platform that connects users with skilled workers such as electricians, plumbers, and mechanics.
Users can create service requests, workers can manage assigned jobs, and admins supervise platform activity.

---

## Features

### User Features

- Register and login
- Create service requests
- Upload problem images (Base64)
- Automatically assign nearest available worker
- Optionally select a worker manually
- Track request status
- Cancel requests
- Rate workers after completion

### Worker Features

- Accept or reject assigned requests
- Update profile information
- Update availability status
- Update GPS location
- View assigned service requests
- View received ratings

### Admin Features

- Approve or reject worker registrations
- View and manage all service requests
- Manage admin profile

---

## Technology Stack

**Frontend:** HTML, CSS, JavaScript (ES Modules)
**Backend:** Node.js, Express.js
**Database:** MySQL
**Authentication:** JWT
**Image Upload:** Base64 encoded string
**Email Service:** Gmail SMTP
**Additional Logic:** Haversine distance calculation for nearest worker detection

---

## API Base URL

```
http://localhost:5000/api
```

---

## API Endpoints

### Authentication

```
POST /auth/register/user
POST /auth/register/worker
POST /auth/login
POST /auth/logout
POST /auth/verify-email
POST /auth/resend-verification
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/change-password
```

### User

```
GET  /users/profile/:id
PUT  /users/profile/update/:id
```

### Worker

```
GET  /workers/profile/:id
PUT  /workers/profile/update/:id
PUT  /workers/:id/status
PUT  /workers/:id/location
GET  /workers/:id/requests
GET  /workers/:id/ratings
GET  /workers/nearby
```

### Service Requests

```
POST /requests
GET  /requests/user/:id
GET  /requests/worker/:id
PUT  /requests/:id/accept
PUT  /requests/:id/reject
PUT  /requests/:id/cancel
PUT  /requests/:id/complete
```

### Ratings

```
POST /ratings
GET  /ratings/worker/:id
```

### Admin

```
GET  /admin/workers/pending
PUT  /admin/workers/:id/approve
PUT  /admin/workers/:id/reject
GET  /admin/work-requests
GET  /admin/profile
PUT  /admin/profile/update
```

---

## Environment Configuration (`.env`)

```
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASS=webtech
DB_NAME=fixmate_db

JWT_SECRET=yourSecretKey
BASE_URL=http://localhost:5000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=mohaiminulislam20000@gmail.com
SMTP_PASS=kgaw mdjp vfyb jnsm
SMTP_FROM="FixMate <no-reply@fixmate.local>"
```

---

## Running the Project

### Backend

```bash
cd backend
npm install
node server
```

### Frontend

Open:

```
frontend/index.html
```

or use a Live Server extension.
