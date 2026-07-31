const test = require('node:test');
const assert = require('node:assert');
const { server, getTaskSummary, tasks } = require('./server');

let port = 3100;
let baseUrl = `http://127.0.0.1:${port}`;

function startServer() {
  return new Promise(resolve => {
    server.listen(port, '127.0.0.1', () => resolve());
  });
}

test('GET /health returns ok', async () => {
  await startServer();
  const response = await fetch(`${baseUrl}/health`);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(payload, { status: 'ok' });
  await new Promise(resolve => server.close(resolve));
});

test('GET /api/tasks returns task list and summary', async () => {
  await startServer();
  const response = await fetch(`${baseUrl}/api/tasks`);
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(payload.tasks));
  assert.equal(payload.summary.total, payload.tasks.length);
  assert.equal(payload.summary.pending, payload.tasks.filter(task => !task.completed).length);
  await new Promise(resolve => server.close(resolve));
});

test('POST /api/tasks adds a task and summary updates', async () => {
  await startServer();
  const response = await fetch(`${baseUrl}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Write backend docs', description: 'Docs', category: 'Study', priority: 'high', time: 'Tonight', dueDate: '2026-08-10' })
  });
  const payload = await response.json();
  assert.equal(response.status, 201);
  assert.equal(payload.title, 'Write backend docs');
  assert.equal(payload.dueDate, '2026-08-10');
  assert.ok(tasks.some(task => task.id === payload.id));
  assert.equal(getTaskSummary().total, tasks.length);
  await new Promise(resolve => server.close(resolve));
});

test('POST /api/tasks preserves a valid ISO dueDate value', async () => {
  await startServer();
  const response = await fetch(`${baseUrl}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Review roadmap', description: 'Roadmap', category: 'Work', priority: 'medium', time: 'Tomorrow', dueDate: '2026-08-12' })
  });
  const payload = await response.json();
  assert.equal(response.status, 201);
  assert.equal(payload.dueDate, '2026-08-12');
  await new Promise(resolve => server.close(resolve));
});
