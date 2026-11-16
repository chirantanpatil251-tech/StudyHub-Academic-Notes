# 📚 StudyHub – Student Notes & Resource Sharing Platform

> A full-stack academic learning and collaboration ecosystem where students can discover, upload, organize, bookmark, rate, and discuss subject-wise study materials, solved university question papers, and lab manuals.

Built for the **Full Stack Development (FSD) Mini Project**.

---

## 🌟 Highlights & Key Features

### 1. 🔐 User Authentication & Authorization (JWT + bcrypt)
- Student registration with department and semester selection.
- Password hashing with `bcryptjs`.
- Secure JWT Bearer authentication and protected dashboard routes.
- **1-Click Quick Demo Login** on the login page for both **Student** and **Faculty Admin**.

### 2. 📊 Student Dashboard
- Personalized greeting showing student department and semester.
- Real-time statistics: Total Uploads, Bookmarks Saved, Downloads Received, and Document Views.
- List of uploaded notes with instant delete and management options.
- Bookmarks quick preview and semester study recommendations.

### 3. 📤 Notes Upload System
- Drag & Drop file uploader for PDFs, images, PPT slides, and lab guides (up to 25MB).
- Support for external resource links (Google Drive, GitHub repositories, lecture video URLs).
- Metadata tagging: Subject name, Subject code (e.g. CS201), Department, Semester (1-8), Resource Category, and custom tags.

### 4. 🔍 Intelligent Search & Multi-Level Filtering
- Real-time search by keyword across title, description, subject, and tags.
- Filter by **Department** (CSE, IT, AI&DS, ECE, Mechanical, Civil).
- Filter by **Semester** (Semester 1 through Semester 8).
- Filter by **Resource Category** (Handwritten Notes, Previous Year Papers, Lab Manuals, PPT Slides, Syllabus & Reference, Tutorials & Code, Video Lectures).
- Sort options: *Newest First*, *Most Downloaded*, *Highest Rated*, and *Oldest*.

### 5. 📑 Document Previewer Modal
- High-fidelity in-browser PDF previewer with zoom, page navigation, and fullscreen triggers.
- Direct download counter tracking.

### 6. ⭐ Star Ratings & Peer Reviews
- Interactive 5-star rating system with student feedback comments.
- Dynamic recalculation of average rating and total review count.

### 7. 💬 Discussion & Doubt Clearing Thread
- Dedicated question-and-answer section under each resource for students to ask doubts and exchange study tips.

### 8. 🤖 AI PDF Intelligence & Study Suite (`/ai-assistant`)
- **Upload PDF & Generate Summary:** Parses any PDF document and synthesizes an academic overview, key takeaways, and difficulty level.
- **Extract Important Topics:** Automatically identifies high-priority syllabus topics with exam relevance descriptions and page references.
- **Generate Revision Notes:** Produces high-yield cheat notes, core formulas, key differences/trade-offs, and exam scoring strategies.
- **Ask Questions with Page References:** Chat directly with the uploaded PDF. The assistant grounds its responses in the document and cites exact page numbers (e.g. `[Page 1]`, `[Page 2]`) and includes concrete examples (such as Deadlock with Process P1, Process P2, Tape Drive, and Printer).
- **Interactive 3D Flashcards:** Generates flip cards with question/answer, difficulty tags, and a mastery progress tracker.
- **Practice Questions & Quizzes:** Generates interactive Multiple Choice Questions (with instant check and explanations) and university-style 5/10-mark descriptive questions with model answers.
- **Powered by Google Gemini API & Semantic Engine:** Supports `GEMINI_API_KEY` for live generative AI with automatic fallback to the internal semantic parser for offline evaluation.

### 9. 🛡️ Faculty Admin Dashboard
- Complete platform governance & metrics overview.
- **Pending Approvals Queue**: 1-click Approve or Reject student submissions.
- **Resource Management**: Browse, preview, and permanently remove duplicate or violating notes.
- **Student Directory**: Inspect registered students, departments, and semesters.
- **Reported Materials Queue**: Resolve or dismiss student-flagged content.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | Interactive component-driven user interface |
| **Styling** | Tailwind CSS | Responsive academic UI with navy/indigo aesthetic |
| **Icons** | Lucide React | High quality SVG vector iconography |
| **Routing** | React Router DOM v6 | Client-side page navigation |
| **HTTP Client** | Axios | REST API requests with auth interceptors |
| **Backend** | Node.js + Express.js (ES Modules) | High-performance RESTful API endpoints |
| **Database** | MongoDB + Mongoose | Structured document models & schemas |
| **Resilience Engine** | In-Memory / File Fallback | Seamless zero-crash execution if MongoDB is offline |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs | Token-based auth & salted password hashing |
| **File Handling** | Multer | Multipart form-data handling & local file storage |

---

## 🗄️ Database Design (Mongoose Models)

1. **`User`**: `name`, `email`, `password`, `role` (student/admin), `department`, `semester`, `bio`, `avatar`, `bookmarks` (ref: Resource).
2. **`Subject`**: `name`, `code`, `department`, `semester`, `description`, `icon`.
3. **`Resource`**: `title`, `description`, `subject`, `subjectCode`, `department`, `semester`, `category`, `fileUrl`, `fileType`, `fileSize`, `tags`, `uploadedBy` (ref: User), `status` (approved/pending/rejected), `downloads`, `views`, `rating`, `totalRatings`.
4. **`Review`**: `resource` (ref: Resource), `user` (ref: User), `userName`, `rating` (1-5), `comment`.
5. **`Comment`**: `resource` (ref: Resource), `user` (ref: User), `userName`, `content`.
6. **`Report`**: `resource` (ref: Resource), `reportedBy` (ref: User), `reason`, `details`, `status` (pending/resolved).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher installed)
- npm (v9 or higher installed)
- *(Optional)* Local MongoDB or MongoDB Atlas URI (If not running, the system automatically uses the built-in fallback store so it works immediately!)

### 1. Run Development Server
From the root project directory:
```bash
npm run dev
```
This runs both the backend server and frontend client concurrently:
- 🌐 **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- 🚀 **Backend REST API**: [http://localhost:5001](http://localhost:5001)
- 📚 **API Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 🔑 Demo Credentials (For Evaluation & Grading)

You can click the **1-Click Demo Login** buttons on `/login` or enter manually:

| Account Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | `student@studyhub.edu` | `student123` | Browse, upload, bookmark, rate, discuss |
| **Faculty Admin** | `admin@studyhub.edu` | `admin123` | Review pending approvals, moderate content, view users |

---

## 📂 Project Structure

```text
FSD mini project/
├── package.json             # Root workspace runner (concurrently)
├── README.md                # Project documentation & presentation guide
├── backend/
│   ├── package.json
│   ├── server.js            # Express application entrypoint
│   ├── .env                 # Environment configuration
│   ├── config/
│   │   ├── db.js            # Mongoose connection with fallback handling
│   │   └── store.js         # Pre-seeded academic data & resilience store
│   ├── models/
│   │   ├── User.js          # Student & admin schema
│   │   ├── Subject.js       # Curriculum subjects
│   │   ├── Resource.js      # Notes, PYQs, and manuals
│   │   ├── Review.js        # Star ratings & comments
│   │   ├── Comment.js       # Discussion threads
│   │   └── Report.js        # Content moderation queue
│   ├── controllers/         # Business logic for all endpoints
│   ├── routes/              # Express API routers
│   ├── middleware/          # JWT auth & Multer file upload
│   └── uploads/             # Static PDF & document file storage
└── frontend/
    ├── package.json
    ├── vite.config.js       # Vite build & proxy config
    ├── tailwind.config.js   # Custom academic color theme
    ├── index.html           # HTML template
    └── src/
        ├── App.jsx          # Route declarations
        ├── main.jsx         # React DOM mounting
        ├── context/         # AuthContext state management
        ├── services/        # Axios API client
        ├── components/      # Navbar, Footer, ResourceCard, Modals, Ratings
        └── pages/
            ├── Home.jsx             # Hero, popular notes, metrics
            ├── Login.jsx            # Sign in with 1-click demo logins
            ├── Register.jsx         # Student signup
            ├── Dashboard.jsx        # Personal student overview
            ├── Resources.jsx        # Multi-filter search catalog
            ├── ResourceDetails.jsx  # PDF preview, ratings & comments
            ├── UploadResource.jsx   # Drag & drop upload form
            ├── Bookmarks.jsx        # Saved study collection
            ├── Profile.jsx          # Student profile & contributions
            └── AdminDashboard.jsx   # Faculty moderation panel
```
