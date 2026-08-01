const icon = () => window.lucide && lucide.createIcons();

let currentPage = 'dashboard';
let tasks = [];
let summary = { total: 0, completed: 0, pending: 0, overdue: 2 };
const offlineStarterTasks = [
  { id: 1, title: 'Finalize landing page design', description: 'Design system · 2 subtasks', category: 'Work', priority: 'high', time: '10:30 AM', completed: false },
  { id: 2, title: 'Review Q1 product strategy', description: 'Planning · 4 subtasks', category: 'Work', priority: 'medium', time: '12:00 PM', completed: false },
  { id: 3, title: 'Study React Server Components', description: 'Learning · 1 subtask', category: 'Study', priority: 'low', time: '03:30 PM', completed: false },
  { id: 4, title: 'Gym & evening run', description: 'Health · 45 min', category: 'Health', priority: 'medium', time: '06:00 PM', completed: false }
];

function calculateSummary(taskList = tasks) {
  return {
    total: taskList.length,
    completed: taskList.filter(task => task.completed).length,
    pending: taskList.filter(task => !task.completed).length,
    overdue: 0
  };
}

function saveOfflineTasks() {
  localStorage.setItem('taskflow-offline-tasks', JSON.stringify(tasks));
}

function loadOfflineTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem('taskflow-offline-tasks'));
    tasks = Array.isArray(savedTasks) && savedTasks.length ? savedTasks : offlineStarterTasks.map(task => ({ ...task }));
  } catch {
    tasks = offlineStarterTasks.map(task => ({ ...task }));
  }
  summary = calculateSummary();
}

function buildTaskRows(limit = 4) {
  const visible = tasks.slice(0, limit);
  if (!visible.length) {
    return '<div class="task-row"><div class="task-name">No tasks yet. Add one to get started.<small>Your tasks will appear here instantly.</small></div></div>';
  }

  return visible.map(task => {
    const completedClass = task.completed ? 'done' : '';
    const badgeClass = task.category?.toLowerCase() || 'personal';
    const priorityLabel = (task.priority || 'medium').charAt(0).toUpperCase() + (task.priority || 'medium').slice(1);

    return `<div class="task-row"><button class="check ${completedClass}" data-task-id="${task.id}" data-action="toggle"></button><div class="task-name">${task.title}<small>${task.description || 'No description yet'}</small></div><span class="badge ${badgeClass}">${task.category || 'Personal'}</span><span class="priority ${task.priority || 'medium'}">${priorityLabel}</span><span class="time">${task.time || 'Today'}</span></div>`;
  }).join('');
}

function stats() {
  return `<section class="stats"><article class="stat"><span class="stat-icon purple"><i data-lucide="list-todo"></i></span><label>Total tasks</label><strong>${summary.total}</strong><small><span class="up">↗ 12%</span> vs last week</small></article><article class="stat"><span class="stat-icon green"><i data-lucide="circle-check-big"></i></span><label>Completed</label><strong>${summary.completed}</strong><small><span class="up">↗ 8%</span> vs last week</small></article><article class="stat"><span class="stat-icon orange"><i data-lucide="clock-3"></i></span><label>Pending</label><strong>${summary.pending}</strong><small>${summary.pending} due today</small></article><article class="stat"><span class="stat-icon red"><i data-lucide="circle-alert"></i></span><label>Overdue</label><strong>${summary.overdue}</strong><small><span style="color:#ef4444">Needs attention</span></small></article></section>`;
}

function dashboard() {
  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const eyebrow = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

  return `<div class="page"><div class="page-title"><div><div class="eyebrow">${eyebrow}</div><h1>${greeting}, Aryan <span>👋</span></h1><p class="sub">Let's make today productive.</p></div><button class="date-select"><i data-lucide="calendar"></i> This week <i data-lucide="chevron-down"></i></button></div>${stats()}<div class="dashboard-grid"><div><section class="panel"><div class="panel-head"><h2>Today's tasks <span style="color:#a19cac;font-weight:500"> · ${summary.pending} remaining</span></h2><button class="link" data-page="tasks">View all tasks →</button></div>${buildTaskRows(4)}</section><section class="panel weekly"><div class="panel-head"><div><h2>Weekly productivity</h2><p class="sub" style="margin-top:5px">Tasks completed this week</p></div><div class="legend"><span><i></i>Completed</span><span><i style="background:#e7e2f4"></i>Target</span></div></div><div class="chart">${[['Mon',54],['Tue',71],['Wed',46],['Thu',83],['Fri',61],['Sat',34],['Sun',48]].map(([d,h])=>`<div class="bar-group"><div class="bar ${d==='Thu'?'active':''}" style="height:${h}%"></div><span class="day">${d}</span></div>`).join('')}</div><div class="chart-label"></div></section></div><aside><section class="panel score-panel"><h2>Productivity score</h2><div class="ring"><span>76<small>/ 100</small></span></div><p class="score-sub">You're doing <b style="color:#25ad55">great!</b> Keep it up.</p><div class="mini-metrics"><div class="mini-metric"><span class="metric-icon orange"><i data-lucide="flame"></i></span><b>12 days</b><small>Current streak</small></div><div class="mini-metric"><span class="metric-icon purple"><i data-lucide="clock-3"></i></span><b>4h 25m</b><small>Focus time</small></div></div></section><section class="focus-card"><p>READY TO FOCUS?</p><b>Start a Pomodoro session</b><br><button data-page="pomodoro">Start focus timer →</button></section></aside></div></div>`;
}

function taskPage() {
  const rows = tasks.map(task => {
    const completedClass = task.completed ? 'done' : '';
    return `<div class="trow"><button class="check ${completedClass}" data-task-id="${task.id}" data-action="toggle"></button><div><b>${task.title}</b><div class="description">${task.description || 'No description yet'}</div></div><span class="badge ${task.category?.toLowerCase() || 'personal'}">${task.category || 'Personal'}</span><span class="priority ${task.priority || 'medium'}">${(task.priority || 'medium').charAt(0).toUpperCase() + (task.priority || 'medium').slice(1)}</span><span class="time">${task.time || 'Today'}</span><span class="badge" style="background:#eeeaff;color:#7252cc">${task.completed ? 'Done' : 'To do'}</span><div class="actions"><button data-task-id="${task.id}" data-action="delete"><i data-lucide="trash-2"></i></button></div></div>`;
  }).join('');

  return `<div class="page"><div class="page-title"><div><h1>My tasks</h1><p class="sub">Keep track of everything you need to do.</p></div><button class="primary-btn add-task-btn"><i data-lucide="plus"></i> Add task</button></div><div class="utility-bar"><label class="search"><i data-lucide="search"></i><input placeholder="Search tasks..." /></label><button class="outline-btn"><i data-lucide="sliders-horizontal"></i> Filter</button><button class="outline-btn"><i data-lucide="arrow-down-up"></i> Sort</button></div><section class="panel table"><div class="thead"><span></span><span>TASK</span><span>CATEGORY</span><span>PRIORITY</span><span>DUE DATE</span><span>STATUS</span><span></span></div>${rows || '<div class="task-row"><div class="task-name">No tasks yet. Add one to begin.</div></div>'}</section></div>`;
}

function calendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const todayKey = TaskFlowDateUtils.getDateKey(today);

  const days = Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - firstWeekday + 1;
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
    const date = new Date(year, month, dayNumber);
    const dayClass = isCurrentMonth && TaskFlowDateUtils.getDateKey(date) === todayKey ? 'today' : '';
    const dateLabel = isCurrentMonth ? dayNumber : '';
    const dayKey = TaskFlowDateUtils.getDateKey(date);
    const events = isCurrentMonth
      ? tasks.filter(task => TaskFlowDateUtils.getDateKey(task.dueDate) === dayKey).slice(0, 2).map(task => `<div class="event ${task.priority === 'high' ? 'purp' : task.priority === 'low' ? 'green' : 'blue'}">${task.title}</div>`).join('')
      : '';

    return `<div class="cal-day ${dayClass}"><b>${dateLabel}</b>${events}</div>`;
  }).join('');

  const upcoming = tasks
    .filter(task => TaskFlowDateUtils.getDateKey(task.dueDate))
    .sort((a, b) => TaskFlowDateUtils.getDateKey(a.dueDate).localeCompare(TaskFlowDateUtils.getDateKey(b.dueDate)))
    .slice(0, 4)
    .map((task, index) => {
      const date = TaskFlowDateUtils.parseDateInput(task.dueDate);
      const label = date ? `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${task.title}` : `${task.title}`;
      return `<div class="agenda-item"><b>${label}</b><span><i data-lucide="${index === 1 ? 'users' : 'calendar'}" style="width:10px;vertical-align:middle"></i> ${task.completed ? 'Done' : 'Upcoming'}</span></div>`;
    }).join('');

  return `<div class="page"><div class="page-title"><div><h1>Calendar</h1><p class="sub">Plan your time and stay in flow.</p></div><button class="primary-btn"><i data-lucide="plus"></i> Quick add event</button></div><div class="calendar-layout"><section class="panel calendar-panel"><div class="calendar-head"><div style="display:flex;gap:8px;align-items:center"><button class="icon-btn"><i data-lucide="chevron-left"></i></button><h2>${monthLabel}</h2><button class="icon-btn"><i data-lucide="chevron-right"></i></button></div><div style="display:flex;gap:7px"><button class="outline-btn">Today</button><button class="outline-btn">Month <i data-lucide="chevron-down"></i></button></div></div><div class="cal-grid">${days}</div></section><aside class="panel"><div class="panel-head"><h2>Upcoming</h2><button class="link">View all</button></div>${upcoming || '<div class="agenda-item"><b>No upcoming tasks</b><span><i data-lucide="calendar" style="width:10px;vertical-align:middle"></i> Add one to see it here</span></div>'}</aside></div></div>`;
}

function analytics() {
  return `<div class="page"><div class="page-title"><div><h1>Analytics</h1><p class="sub">See how your work is adding up.</p></div><button class="date-select"><i data-lucide="calendar"></i> Last 30 days <i data-lucide="chevron-down"></i></button></div>${stats()}<div class="analytics-grid"><section class="panel chart-panel"><div class="panel-head"><h2>Weekly productivity</h2><div class="legend"><span><i></i>Completed</span></div></div><div class="linechart"><svg viewBox="0 0 600 175" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7c3aed" stop-opacity=".2"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></linearGradient></defs><path d="M0 133 C48 128,60 91,105 108 S170 137,211 90 S282 38,326 76 S384 121,432 80 S510 30,600 49 L600 175 L0 175Z" fill="url(#g)"/><path d="M0 133 C48 128,60 91,105 108 S170 137,211 90 S282 38,326 76 S384 121,432 80 S510 30,600 49" fill="none" stroke="#7c3aed" stroke-width="3"/></svg></div></section><section class="panel chart-panel"><div class="panel-head"><h2>Category distribution</h2><button class="link">Details</button></div><div class="donut"></div><div class="legend" style="justify-content:center"><span><i></i>Work</span><span><i style="background:#3b82f6"></i>Study</span><span><i style="background:#22c55e"></i>Health</span></div></section><section class="panel chart-panel"><div class="panel-head"><h2>Completion trend</h2><button class="link">Monthly</button></div><div class="chart">${[39,51,64,55,80,74,91].map((h,i)=>`<div class="bar-group"><div class="bar ${i===6?'active':''}" style="height:${h}%"></div></div>`).join('')}</div></section><section class="panel chart-panel"><div class="panel-head"><h2>Priority distribution</h2></div><div class="empty" style="padding:46px"><span><i data-lucide="pie-chart"></i></span><p>7 high · 11 medium · 6 low priority tasks</p></div></section></div></div>`;
}

function pomodoro() {
  return `<div class="page pomodoro"><div class="eyebrow">FOCUS MODE</div><h1>Make time for what matters.</h1><p class="sub">One focused session at a time.</p><div class="timer-ring"><div class="timer-inner"><small>FOCUS SESSION</small><strong>25:00</strong></div></div><div class="timer-actions"><button class="primary-btn"><i data-lucide="play"></i> Start</button><button class="outline-btn"><i data-lucide="rotate-ccw"></i> Reset</button></div><div class="mini-metrics" style="max-width:470px;margin:38px auto"><div class="mini-metric"><span class="metric-icon purple"><i data-lucide="circle-check"></i></span><b>3 sessions</b><small>Completed today</small></div><div class="mini-metric"><span class="metric-icon orange"><i data-lucide="flame"></i></span><b>1h 15m</b><small>Today's focus time</small></div></div></div>`;
}

function archive() {
  return `<div class="page"><div class="page-title"><div><h1>Archive</h1><p class="sub">Your completed and deleted tasks, kept out of the way.</p></div></div><div class="archive-tabs"><button class="active">Completed tasks <span>${summary.completed}</span></button><button>Deleted tasks <span>2</span></button></div><div class="utility-bar"><label class="search"><i data-lucide="search"></i><input placeholder="Search archive..." /></label><button class="outline-btn"><i data-lucide="calendar"></i> Filter by date</button></div><section class="panel">${tasks.filter(task => task.completed).slice(0, 3).map(task => `<div class="task-row" style="opacity:.72"><i data-lucide="circle-check" style="color:#22c55e;width:17px"></i><div class="task-name" style="text-decoration:line-through">${task.title}<small>Completed recently</small></div><span class="badge ${task.category?.toLowerCase() || 'personal'}">${task.category || 'Personal'}</span><button class="link">Restore</button></div>`).join('') || '<div class="task-row"><div class="task-name">Nothing archived yet.</div></div>'}</section></div>`;
}

function profile() {
  return `<div class="page"><div class="page-title"><div><h1>Profile</h1><p class="sub">Your productivity identity at a glance.</p></div></div><section class="profile-card"><span class="avatar">AS</span><div><h2>Aryan Sharma</h2><p>aryan@taskflow.ai · <b style="color:#7c3aed">Level 12 Planner</b></p><span class="badge study">✨ Early adopter</span></div><button class="outline-btn"><i data-lucide="pencil"></i> Edit profile</button></section><div style="margin-top:25px">${stats()}</div><section class="panel"><div class="panel-head"><h2>Achievements</h2></div><div class="mini-metrics" style="grid-template-columns:repeat(4,1fr)">${[['🔥','12 day streak'],['⚡','Focus master'],['✅','Task crusher'],['🌱','Early adopter']].map(x=>`<div class="mini-metric" style="text-align:center"><b style="font-size:22px">${x[0]}</b><small>${x[1]}</small></div>`).join('')}</div></section></div>`;
}

function settings() {
  return `<div class="page"><div class="page-title"><div><h1>Settings</h1><p class="sub">Manage your TaskFlow experience.</p></div></div><section class="panel settings-list"><div class="setting"><div><b>Dark mode</b><small>Use a dark, low-light interface.</small></div><button class="toggle"><i></i></button></div><div class="setting"><div><b>Notifications</b><small>Receive task reminders and daily digests.</small></div><button class="toggle on"><i></i></button></div><div class="setting"><div><b>Language</b><small>English (United States)</small></div><button class="outline-btn" style="margin-left:auto">Change</button></div><div class="setting"><div><b>Email preferences</b><small>Choose which updates arrive in your inbox.</small></div><button class="outline-btn" style="margin-left:auto">Manage</button></div><div class="setting"><div><b>Password & security</b><small>Update password and manage connected devices.</small></div><button class="outline-btn" style="margin-left:auto">Manage</button></div><div class="setting"><div><b style="color:#e34d4d">Delete account</b><small>Permanently delete your TaskFlow account and data.</small></div><button class="outline-btn" style="margin-left:auto;color:#e34d4d">Delete</button></div></section></div>`;
}

const pages = { dashboard, tasks: taskPage, calendar, analytics, pomodoro, archive, profile, settings };

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = `<i data-lucide="check-circle-2"></i> ${message}`;
  toast.classList.add('show');
  icon();
  setTimeout(() => toast.classList.remove('show'), 2500);
}

async function loadTasks() {
  try {
    const response = await fetch('/api/tasks');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    const payload = await response.json();
    tasks = payload.tasks || [];
    summary = payload.summary || { total: 0, completed: 0, pending: 0, overdue: 2 };
    render(currentPage);
  } catch (error) {
    // Direct file opening has no /api/tasks endpoint. Keep the app fully usable
    // with browser storage in that case.
    loadOfflineTasks();
    render(currentPage);
    showToast('Running in offline mode — tasks save in this browser');
  }
}

async function addTask(taskInput) {
  const payload = typeof taskInput === 'string'
    ? { title: taskInput, description: 'Added from the app', category: 'Personal', priority: 'medium', time: 'Today', dueDate: null }
    : {
        title: taskInput.title || '',
        description: taskInput.description || 'Added from the app',
        category: taskInput.category || 'Personal',
        priority: taskInput.priority || 'medium',
        time: taskInput.time || 'Today',
        dueDate: taskInput.dueDate || null
      };

  if (!payload.title) return false;
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Could not create task');
    await loadTasks();
    showToast('Task added to your inbox');
    return true;
  } catch (error) {
    const task = { ...payload, id: Date.now(), completed: false };
    tasks.unshift(task);
    summary = calculateSummary();
    saveOfflineTasks();
    render(currentPage);
    showToast('Task added to your inbox');
    return true;
  }
}

async function toggleTask(id) {
  const task = tasks.find(item => String(item.id) === String(id));
  if (!task) return;
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    });
    if (!response.ok) throw new Error('Could not update task');
    await loadTasks();
  } catch (error) {
    task.completed = !task.completed;
    summary = calculateSummary();
    saveOfflineTasks();
    render(currentPage);
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Could not delete task');
    await loadTasks();
    showToast('Task removed');
  } catch (error) {
    tasks = tasks.filter(task => String(task.id) !== String(id));
    summary = calculateSummary();
    saveOfflineTasks();
    render(currentPage);
    showToast('Task removed');
  }
}

function bindPageActions() {
  document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', () => {
      const page = button.dataset.page;
      if (page) {
        render(page);
        document.getElementById('sidebar').classList.remove('open');
      }
    });
  });

  document.querySelectorAll('.toggle').forEach(toggle => {
    toggle.addEventListener('click', () => toggle.classList.toggle('on'));
  });

  document.querySelectorAll('[data-action="toggle"]').forEach(button => {
    button.addEventListener('click', async () => {
      await toggleTask(button.dataset.taskId);
    });
  });

  document.querySelectorAll('[data-action="delete"]').forEach(button => {
    button.addEventListener('click', async () => {
      await deleteTask(button.dataset.taskId);
    });
  });

  document.querySelectorAll('.add-task-btn').forEach(button => {
    button.addEventListener('click', () => openTaskModal());
  });

  const addTaskButton = document.getElementById('addTask');
  if (addTaskButton && !addTaskButton.dataset.bound) {
    addTaskButton.addEventListener('click', () => openTaskModal());
    addTaskButton.dataset.bound = 'true';
  }

  const taskForm = document.getElementById('taskForm');
  if (taskForm && !taskForm.dataset.bound) {
    taskForm.addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const payload = {
        title: document.getElementById('taskTitle').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        category: document.getElementById('taskCategory').value,
        priority: document.getElementById('taskPriority').value,
        time: document.getElementById('taskTime').value.trim() || 'Today',
        dueDate: document.getElementById('taskDueDate').value || null
      };

      if (!payload.title) {
        showToast('Please add a task title');
        return;
      }

      const created = await addTask(payload);
      if (created) {
        form.reset();
        closeTaskModal();
      }
    });
    taskForm.dataset.bound = 'true';
  }

  const closeModalButton = document.getElementById('closeTaskModal');
  if (closeModalButton && !closeModalButton.dataset.bound) {
    closeModalButton.addEventListener('click', closeTaskModal);
    closeModalButton.dataset.bound = 'true';
  }

  const cancelModalButton = document.getElementById('cancelTaskModal');
  if (cancelModalButton && !cancelModalButton.dataset.bound) {
    cancelModalButton.addEventListener('click', closeTaskModal);
    cancelModalButton.dataset.bound = 'true';
  }

  const modalBackdrop = document.getElementById('taskModalBackdrop');
  if (modalBackdrop && !modalBackdrop.dataset.bound) {
    modalBackdrop.addEventListener('click', event => {
      if (event.target === modalBackdrop) {
        closeTaskModal();
      }
    });
    modalBackdrop.dataset.bound = 'true';
  }

  if (!document.body.dataset.modalKeybound) {
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeTaskModal();
      }
    });
    document.body.dataset.modalKeybound = 'true';
  }
}

function render(page = 'dashboard') {
  currentPage = page;
  document.getElementById('content').innerHTML = pages[page]();
  const crumbTarget = document.querySelector(`[data-page="${page}"] > span`);
  const crumbLabel = crumbTarget?.textContent || page;
  document.getElementById('crumb').textContent = crumbLabel;
  document.querySelector('.date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.page === page));
  icon();
  bindPageActions();
}

function openTaskModal(defaultTitle = '') {
  const modal = document.getElementById('taskModalBackdrop');
  const titleField = document.getElementById('taskTitle');
  if (!modal || !titleField) return;
  titleField.value = defaultTitle;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  setTimeout(() => titleField.focus(), 50);
}

function closeTaskModal() {
  const modal = document.getElementById('taskModalBackdrop');
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
}

document.getElementById('menuBtn').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

loadTasks();
