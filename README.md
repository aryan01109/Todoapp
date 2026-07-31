# TaskFlow 

TaskFlow is a modern task-management web application designed to help users plan work, track productivity, and stay focused. It includes a responsive dashboard, live task management, calendar planning, analytics, Pomodoro focus mode, and an AI-assistant interface.

## Features

- Create, complete, and delete tasks
- Assign task categories, priorities, dates, and times
- Live dashboard statistics for total, completed, and pending tasks
- Dynamic category-distribution donut chart
- Monthly calendar with due-date events
- Pomodoro focus timer interface
- Archive, profile, and settings pages
- Responsive design for desktop, tablet, and mobile
- Offline mode using browser local storage when the API is unavailable

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Icons: Lucide
- Backend: Node.js built-in HTTP server
- Data: In-memory API data with browser-storage fallback

## Project Structure

```text
taskflow-ai/
├── backend/
│   ├── server.js                 # HTTP server and task API
│   └── server.test.js            # Backend API tests
├── frontend/
│   ├── index.html                # Application shell
│   ├── app.js                    # App UI and task interactions
│   ├── analytics-category-update.js # Dynamic category chart
│   ├── date-utils.js             # Date helpers
│   └── styles.css                # Responsive UI styles
├── Dockerfile                    # Docker deployment configuration
├── render.yaml                   # Render deployment configuration
├── package.json
└── DEPLOYMENT.md
```

## Run Locally

### Requirements

- Node.js 18 or newer

### Start the app

```bash
npm install
npm start
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.

You can also open `frontend/index.html` directly. In this mode, TaskFlow AI automatically uses browser local storage for tasks.

## Test the API

```bash
npm test
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Health-check endpoint |
| `GET` | `/api/tasks` | Get all tasks and summary statistics |
| `POST` | `/api/tasks` | Create a task |
| `PATCH` | `/api/tasks/:id` | Update a task, including completion status |
| `DELETE` | `/api/tasks/:id` | Delete a task |

## Deploy

The project includes `render.yaml` for deployment on Render.

1. Push this project to a GitHub repository.
2. In Render, select **New +** → **Blueprint**.
3. Connect and select your GitHub repository.
4. Apply the detected `render.yaml` configuration.

For Docker-compatible hosts such as Railway or Fly.io, deploy using the included `Dockerfile`.

## License

This project is available for personal and portfolio use.
