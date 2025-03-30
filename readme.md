# 🔗 URL Shortener

A full-stack URL shortener built with modern TypeScript, React, FeathersJS v5, PostgreSQL, Redis, and Docker.

## 🚀 Getting Started

Clone the repository and spin up the app:

```bash
git clone https://github.com/jordandenison/url-shortener
cd url-shortener
docker compose up
```

That's it! The app will be available on [http://localhost:3000](http://localhost:3000).

---

## 📦 Replacing the `backend-client` Package

If you've made changes to the backend and need to update the shared client used by the frontend:

1. In the `backend/` directory, run the bundling script:

```bash
npm run bundle:client
```

2. Copy the generated package into the frontend's local packages directory:

```bash
cp backend/public/backend-0.0.0.tgz frontend/local-packages/
```

3. In the `frontend/` directory, install the updated package:

```bash
cd frontend
npm install
```

---

## 🧪 Running Tests

To run tests inside the Docker containers:

### Frontend Tests

```bash
docker exec -it url-shortener-frontend-1 npm test
```

### Backend Tests

```bash
docker exec -it url-shortener-backend-1 npm test
```

### Backend Tests with Code Coverage

```bash
docker exec -it url-shortener-backend-1 npm run coverage
```

---

## 🛠️ Tech Stack

- **Frontend**: React, Redux, Bootstrap 5, React-Bootstrap, react-hook-form
- **Backend**: FeathersJS v5, PostgreSQL, Redis, AJV (TypeBox)
- **Auth**: JWT
- **Infra**: Docker Compose, Redis caching, self-healing cache system
- **Validation**: Type-safe schemas with custom format validation

---

## ✨ Features

- Authenticated URL shortening per user
- Fully responsive dashboard UI
- Light/Dark theme toggle with persistent user preference
- Clean RESTful API
- Strict schema validation (AJV with custom `strict-uri` support)
- Redis-based caching layer with auto-reconnect
- Friendly error reporting and tests

---

## 💡 Tips

- Update your backend-client bundle after every schema or typing change
- Use `.env` and `config/default.json` for configuration management

---

## 📬 License

MIT © Jordan Denison
