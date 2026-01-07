# Todo API (Express + MongoDB)

Simple production-style Todo API built with Express.js, Mongoose, and MongoDB.

## Setup
- Install dependencies: `npm install`
- Copy environment file: `cp .env.example .env` (set `MONGO_URL`, JWT secrets, and optional `PORT`)
- Run in dev with reload: `npm run dev`
- Run in prod mode: `npm start`
- Run with Docker Compose (includes MongoDB):
  - `docker-compose up --build`
  - Compose sets `MONGO_URL=mongodb://mongo:27017/todo_api`; app on `http://localhost:3001`

## API
Base URL: `http://localhost:3001`

### Auth
- Register  
  `curl -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'`

- Login  
  `curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'`

- Refresh access token (refresh token is stored in an httpOnly cookie)  
  `curl -X POST http://localhost:3001/api/auth/refresh`

- Logout  
  `curl -X POST http://localhost:3001/api/auth/logout`

- Me  
  `curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3001/api/auth/me`

### Tasks (require Authorization: Bearer <ACCESS_TOKEN>)
- Create task  
  `curl -X POST http://localhost:3001/api/tasks -H "Authorization: Bearer <ACCESS_TOKEN>" -H "Content-Type: application/json" -d '{"title":"Write docs","description":"Add README","deadline":"2024-12-31T00:00:00.000Z"}'`

- List tasks (filter/sort/paginate)  
  `curl -H "Authorization: Bearer <ACCESS_TOKEN>" "http://localhost:3001/api/tasks?status=TODO&sort=deadline&page=1&limit=5"`

- Get task by id  
  `curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3001/api/tasks/<TASK_ID>`

- Update task  
  `curl -X PATCH http://localhost:3001/api/tasks/<TASK_ID> -H "Authorization: Bearer <ACCESS_TOKEN>" -H "Content-Type: application/json" -d '{"status":"IN_PROGRESS"}'`

- Delete task  
  `curl -X DELETE http://localhost:3001/api/tasks/<TASK_ID> -H "Authorization: Bearer <ACCESS_TOKEN>"`

## Notes
- Health check: `GET /health`
- Task statuses: `TODO`, `IN_PROGRESS`, `DONE`
- Pagination response includes `meta` with `page`, `limit`, `total`, and `pages`.
- Tasks are scoped to the authenticated user.
