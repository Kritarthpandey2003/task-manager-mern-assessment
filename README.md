# 📝 MERN Task Manager Application

A full-stack, responsive Task Management application built with the MERN stack and PostgreSQL. This application allows users to create, track, and manage daily tasks with a modern, mobile-first user interface.

### 🚀 **[Live Demo Link](https://task-manager-mern-assessment.vercel.app)**

---

## ✨ Key Features

* **Create & Manage Tasks:** Easily add new tasks to your daily list.
* **Task Status:** Mark tasks as completed with a single click (strikethrough visual feedback).
* **Responsive Design:** optimized for both desktop and mobile devices.
* **Robust Backend:** Built with Node.js and PostgreSQL for reliable data persistence.
* **Auto-generated Metadata:** Automatic handling of UUIDs and timestamps.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, CSS3 (Mobile-first design)
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (hosted on **NeonDB**)
* **ORM:** Prisma
* **Deployment:**
    * Frontend: Vercel
    * Backend: Render

---

## ⚙️ Technical Highlights

### 🛡️ Database Integrity & Triggers
To ensure robustness and prevent data inconsistencies during high-load or incomplete API requests, this project implements **PostgreSQL Triggers** at the database level.

A custom `BEFORE INSERT` trigger functions as a safety net to automatically:
1.  **Generate UUIDs:** If the application layer fails to provide an ID, the database generates a secure `gen_random_uuid()`.
2.  **Timestamping:** Automatically assigns `NOW()` to `updatedAt` fields if missing.
3.  **User Assignment:** Ensures all orphaned tasks are assigned to a default system user to prevent constraint violations.

```sql
-- Example of the implemented safety logic
CREATE OR REPLACE FUNCTION force_generate_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.id IS NULL THEN
    NEW.id := gen_random_uuid()::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

Local Setup Instructions

1. Clone the Repository
git clone [https://github.com/your-username/task-manager-assessment.git](https://github.com/your-username/task-manager-assessment.git)
cd task-manager-assessment

2. Backend Setup
cd backend
npm install

# Create a .env file and add your database URL
# DATABASE_URL="postgresql://user:password@host/dbname"

npm start

3. Frontend Setup
cd ../frontend
npm install
npm start

Project Structure
├── frontend/          # React Application
│   ├── src/
│   │   ├── components/
│   │   └── App.js
├── backend/           # Express Server
│   ├── prisma/        # Database Schema
│   ├── controllers/   # Task Logic
│   └── server.js      # Entry point
└── README.md
