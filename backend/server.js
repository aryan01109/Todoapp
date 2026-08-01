const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Bind publicly in cloud hosts; localhost still works for local development.
const hostname = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

let tasks = [
  {
    id: 1,
    title: 'Finalize landing page design',
    description: 'Design system • 2 subtasks',
    category: 'Work',
    priority: 'high',
    time: '10:30 AM',
    completed: false
  },
  {
    id: 2,
    title: 'Review Q1 product strategy',
    description: 'Planning • 4 subtasks',
    category: 'Work',
    priority: 'medium',
    time: '12:00 PM',
    completed: false
  },
  {
    id: 3,
    title: 'Study React Server Components',
    description: 'Learning • 1 subtask',
    category: 'Study',
    priority: 'low',
    time: '03:30 PM',
    completed: false
  },
  {
    id: 4,
    title: 'Gym & evening run',
    description: 'Health • 45 min',
    category: 'Health',
    priority: 'medium',
    time: '06:00 PM',
    completed: false
  }
];

const usingMongo = Boolean(process.env.MONGODB_URI);
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Personal' },
  priority: { type: String, default: 'medium' },
  time: { type: String, default: 'Today' },
  dueDate: { type: String, default: null },
  completed: { type: Boolean, default: false }
}, { timestamps: true });
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

function serializeTask(task) {
  const item = task.toObject ? task.toObject() : task;
  return { ...item, id: String(item._id || item.id), _id: undefined, __v: undefined };
}

async function getTasks() {
  if (!usingMongo) return tasks;
  const documents = await Task.find().sort({ createdAt: -1 }).lean();
  return documents.map(serializeTask);
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, statusCode, payload) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function serveStaticFile(res, filePath) {
  setCorsHeaders(res);
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml'
  };

  const frontendDir = path.join(__dirname, '..', 'frontend');
  const resolvedPath = path.join(frontendDir, filePath);
  fs.readFile(resolvedPath, (err, content) => {
    if (err) {
      sendJson(res, 404, { error: 'File not found' });
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

function getTaskSummary(taskList = tasks) {
  return {
    total: taskList.length,
    completed: taskList.filter(task => task.completed).length,
    pending: taskList.filter(task => !task.completed).length,
    overdue: 2
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/tasks') {
    const currentTasks = await getTasks();
    sendJson(res, 200, { tasks: currentTasks, summary: getTaskSummary(currentTasks) });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/tasks/summary') {
    const currentTasks = await getTasks();
    sendJson(res, 200, getTaskSummary(currentTasks));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/tasks') {
    const body = await readBody(req);
    const data = body ? JSON.parse(body) : {};
    const taskData = {
      title: data.title || 'Untitled task',
      description: data.description || '',
      category: data.category || 'Personal',
      priority: data.priority || 'medium',
      time: data.time || 'Today',
      dueDate: data.dueDate || null,
      completed: Boolean(data.completed)
    };
    if (usingMongo) {
      const task = serializeTask(await Task.create(taskData));
      sendJson(res, 201, task);
    } else {
      const task = { id: Date.now(), ...taskData };
      tasks.unshift(task);
      sendJson(res, 201, task);
    }
    return;
  }

  if (req.method === 'PATCH' && url.pathname.startsWith('/api/tasks/')) {
    const id = url.pathname.split('/').pop();
    const body = await readBody(req);
    const data = body ? JSON.parse(body) : {};
    const task = usingMongo
      ? await Task.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      : tasks.find(item => item.id === Number(id));

    if (!task) {
      sendJson(res, 404, { error: 'Task not found' });
      return;
    }

    if (!usingMongo) Object.assign(task, data);
    sendJson(res, 200, usingMongo ? serializeTask(task) : task);
    return;
  }

  if (req.method === 'DELETE' && url.pathname.startsWith('/api/tasks/')) {
    const id = url.pathname.split('/').pop();
    if (usingMongo) {
      const result = await Task.deleteOne({ _id: id });
      if (!result.deletedCount) {
        sendJson(res, 404, { error: 'Task not found' });
        return;
      }
    } else {
      tasks = tasks.filter(task => task.id !== Number(id));
    }
    sendJson(res, 200, { success: true, id });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { status: 'ok' });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/') {
    serveStaticFile(res, 'index.html');
    return;
  }

  if (req.method === 'GET') {
    const filePath = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '');
    serveStaticFile(res, filePath);
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

async function startServer() {
  if (usingMongo) {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected');
  } else {
    console.warn('MONGODB_URI is not set; running with temporary in-memory data.');
  }
  server.listen(port, hostname, () => console.log(`TaskFlow backend running on port ${port}`));
}

if (require.main === module) {
  startServer().catch(error => {
    console.error('Unable to start TaskFlow:', error.message);
    process.exit(1);
  });
}

module.exports = { server, getTaskSummary, tasks };
