
![image](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqbHB5oIg9Jt7EO1CZgwypemE9YLpZSPKWkg&s)
---

## 📌 Index
- [Description](#-description)
- [Setup Instruction](#-setup-instruction)
- [Envs](#-environment-variables)
- [API Endpoints](#-api-endpoint)
- [Write-up](#-short-write-up)
---

## 📖 Description

Demo e-commerce application designed for high performance and real-time updates. The backend is built using Node.js (Express) with a MongoDB and Redis stack, while the frontend is built using React (Next.js) and Zustand for state management.

---
## 📖 Setup Instruction

### 🐳 Run using docker

```bash
git clone https://github.com/akzc0d3/Magppie-Store.git
cd Magppie-Store
docker-compose up --build
```

🌐 Go to: `http://localhost:3000`

> ⚠️ Note: First build may take some time

---

### 🧑‍💻 Run development server

#### 📦 Prerequisite
- MongoDB (Replica Set mode required for transaction support)
- Redis

```bash
git clone https://github.com/akzc0d3/Magppie-Store.git
cd Magppie-Store
```

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

🌐 Go to: `http://localhost:3000`

---

### 🧑‍💻 Seed Database
- Populate your database using the files located in the `/data` directory.

---

## ⚙ Environment Variables

```env
PORT=
MONGO_URI=
REDIS_URI=
ENCRYPTION_KEY=
JWT_SECRET=
ACCESS_TOKEN_TTL=600
REFRESH_TOKEN_TTL=86400
CACHE_TTL=60
ALLOWED_ORIGINS=
```

---

## 🔗 API Endpoint

Detailed API documentation can be found here: [API_DOC](backend/API_DOC/Magppie)

---

## 🧠 Short Write-up

---

### 1️⃣ Architectural Decisions & Tradeoffs

#### 🏗️ Architecture
- Monolithic architecture was adopted over microservices  
  - Reason: Simpler to build and maintain for small-to-medium scale systems.

- Search is currently basic (word-based) without auto-suggestions  
  - Reason: Would require additional infrastructure like Elasticsearch.

- Caching Strategy:
  - Product listings & search results cached in Redis (TTL: 60s)
  - Manual cache invalidation on CRUD operations ensures consistency  
  ⚠️ Tradeoff: Slight increase in controller complexity

---

### 🔐 Security

- JWT-based authentication (access + refresh tokens)  
    - Stateless, scalable authentication approach

- Rate Limiting: Endpoints are protected against abuse via rate-limiting policies.

- Token TTL:
  - Access Token: 10 min
  - Refresh Token: 24 hours

- Token-Rotation enabled on refresh

- Refresh tokens are SHA256 hashed before being stored in the DB to prevent theft.  

- Basic role-based access control  
  ⚠️ Tradeoff: Not fine-grained, but sufficient for MVP scale

---

### 🗄️ Database

- MongoDB with indexing for frequently queried fields
- Flexible schema design for dynamic product data

⚠️ Tradeoff:
- Complex joins are less efficient compared to SQL at large scale

---

## 🚀 2) If you had 2 more days, what would you improve?

- 🔍 Improve search (auto-suggestions, prefix matching)
- 🔐 Add OTP-based login (2FA)
- 👥 Granular permission system (role-based feature control)
- 📊 Add structured logging (file-based / centralized logs)
- 📈 Add performance monitoring (Prometheus integration)
- 🎨 Improve UI/UX polish

---

## 📈 3) Scaling to 10,000 concurrent users

### ⚖️ Horizontal Scaling
- Move to microservices architecture
- Independently scalable services

### ⚡ Load Balancing
- Multiple Node.js instances behind Nginx / cloud load balancer

### 🗄️ Database Scaling
- MongoDB replica set
- Data sharding for horizontal scaling

### ⚡ Redis Scaling
- Redis cluster for distributed caching

### 🔌 Real-time Layer
- Use Socket.io Redis adapter for cross-instance sync

### 🌍 Static Assets
- Serve via CDN for reduced backend load

---
