# Feedback Collection Platform

A full-stack MERN application that lets businesses create custom feedback forms, share public links, and analyse the responses in a clean dashboard.



---

## ✨ Features

| Role | Capability |
|------|------------|
| **Admin / Business** | • Register / Login (JWT)<br>• Create feedback forms (title + 3-5 questions, text or MCQ – multi-select supported)<br>• Share public URL (slug based)<br>• View responses + summary charts / counts<br>• Export CSV (one-click)<br>• Mobile-friendly dashboard |
| **Customer / User** | • Open public form without login<br>• Submit answers anonymously |

Bonus UX: modern MUI UI, slide-in route transitions, responsive cards, gradient auth pages.

---

## 🗄️ Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JSON Web Tokens + bcrypt
- **Frontend:** React + Vite, React Router 6, Material-UI (v5)
- **State / HTTP:** Axios, React Context
- **Containerisation:** Docker (for MongoDB in development)

---

## 💡 Why This Design?

1. **Separation of Concerns** – backend (`/server`) strictly handles API & auth, while frontend (`/client`) focuses on UX.  This keeps each layer small and testable.
2. **Schema Flexibility** – question objects carry their own type/option metadata, so adding new field types later (rating, date, etc.) only requires UI tweaks.
3. **Optimised for Mobile-first** – inputs sized ≥ 48 px, cards stack at `xs`, buttons span full width, making it thumb-friendly without extra code.
4. **Dockerised DB** – reviewers boot the project with _one_ command; no global Mongo install headaches.
5. **Security by Default** – hashed passwords, HTTP-only auth header, CORS whitelist, .env secrets.

---

## 📂 Project Structure

```
assigment/
├── server/           # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/ (User, Form, Response)
│   │   ├── routes/  (auth, form, public)
│   │   └── utils/
│   └── package.json
├── client/           # React app
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/ (Dashboard, FormBuilder …)
│   │   └── styles/
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Prerequisites

* **Node.js** ≥ 18
* **Docker Desktop** (or local MongoDB)

### 2. Clone & Install

```bash
# clone repo
git clone <your-repo-url>
cd assigment

# backend deps
cd server && npm install

# frontend deps
cd ../client && npm install
```

### 3. Start MongoDB with Docker (recommended)

```bash
docker run -d --name mongo -p 27017:27017 mongo:6
```

### 4. Environment Variables

Create `server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/feedback_platform
JWT_SECRET=supersecret123
PORT=5000
```

### 5. Run the Apps (two terminals)

```bash
# Terminal A – backend
cd server
npm run dev            # nodemon on http://localhost:5000

# Terminal B – frontend
cd client
npm run dev            # Vite on http://localhost:3000 (5173 if 3000 busy)
```

Visit the printed URL ➜ **Register** an admin account ➜ **Create a form** ➜ open public link in incognito ➜ **Submit feedback** ➜ check **Dashboard → Responses → Summary**.

---

## 🧪 Testing / QA Checklist

| Scenario | Expected |
|----------|----------|
| Register as admin | Auto-login → Dashboard |
| Create a form with 3 text + 2 MCQ Qs | Slug appears, dashboard card created |
| Open public link in incognito | Form loads without auth |
| Submit answers (multi-select MCQ) | “Thank you” message, response count +1 |
| Export CSV | Browser downloads `responses_<slug>.csv` |
| Invalid JWT on protected route | 401 JSON error |

Run through the matrix on desktop (Chrome) & mobile (Chrome Android / Safari) – all pass.

---

## ❓ FAQ

**Q:** _How can I change the default ports?_

> Edit `server/.env` (`PORT=`) and `client/vite.config.js` (`server.port`).

**Q:** _Where do I plug in production MongoDB / Render / Atlas URI?_

> Same `.env` key `MONGO_URI`. The client only needs the API base URL changed if the domain differs.

**Q:** _Can I add more than 5 questions?_  
> “Max 5” was an assignment constraint; raise the limit in `FormBuilder.jsx` validation and backend controller.

---

## 🛠️ Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| `server` | `npm run dev` | Start API with nodemon |
| `client` | `npm run dev` | Start Vite dev server |
| `client` | `npm run build` | Production build |

---

## 🔒 Security Notes

* Passwords hashed with **bcryptjs**.
* JWT secret stored in environment variable.
* Protected routes enforce token middleware.

---

## 📐 Design Decisions

1. **MERN** stack keeps the learning curve low and codebase cohesive.
2. **MUI** chosen for speedy, accessible UI & responsive breakpoints.
3. **Slug links** via `nanoid` – short, collision-safe URLs.
4. **Responses Schema** keeps answers flexible (supports any question type).
5. **Dockerised MongoDB** eases onboarding – no local install required.

---

## 📄 Assignment Checklist

- [x] Admin auth & dashboard
- [x] Create 3-5 question forms
- [x] Public submission link
- [x] View & summarise responses
- [x] CSV export
- [x] Mobile-responsive UI
- [x] README with instructions (this file)

Enjoy!
