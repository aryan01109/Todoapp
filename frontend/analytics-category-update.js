/*
  TaskFlow AI — dynamic category distribution

  Replace the existing `function analytics()` in frontend/app.js with this
  code. It reads the same `tasks` array already loaded by your application.
*/

function getCategoryDistribution() {
  const palette = ['#7c3aed', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];
  const counts = tasks.reduce((result, task) => {
    const category = String(task.category || 'Uncategorized').trim() || 'Uncategorized';
    result[category] = (result[category] || 0) + 1;
    return result;
  }, {});

  const total = tasks.length;
  return Object.entries(counts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([name, count], index) => ({
      name,
      count,
      percent: total ? (count / total) * 100 : 0,
      color: palette[index % palette.length]
    }));
}

function categoryDistributionChart() {
  const categories = getCategoryDistribution();

  if (!categories.length) {
    return `<div class="empty" style="padding:46px"><span><i data-lucide="pie-chart"></i></span><p>Add tasks to see your category distribution.</p></div>`;
  }

  let start = 0;
  const segments = categories.map(category => {
    const end = start + category.percent;
    const segment = `${category.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    start = end;
    return segment;
  });
  const gradient = `conic-gradient(${segments.join(', ')})`;

  return `<div class="donut" role="img" aria-label="Task categories: ${categories.map(category => `${category.name} ${Math.round(category.percent)} percent`).join(', ')}" style="background:${gradient}"></div>
    <div class="legend category-legend" style="justify-content:center;flex-wrap:wrap">
      ${categories.map(category => `<span><i style="background:${category.color}"></i>${category.name} ${category.count} (${Math.round(category.percent)}%)</span>`).join('')}
    </div>`;
}

function analytics() {
  return `<div class="page"><div class="page-title"><div><h1>Analytics</h1><p class="sub">See how your work is adding up.</p></div><button class="date-select"><i data-lucide="calendar"></i> Last 30 days <i data-lucide="chevron-down"></i></button></div>${stats()}<div class="analytics-grid"><section class="panel chart-panel"><div class="panel-head"><h2>Weekly productivity</h2><div class="legend"><span><i></i>Completed</span></div></div><div class="linechart"><svg viewBox="0 0 600 175" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7c3aed" stop-opacity=".2"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></linearGradient></defs><path d="M0 133 C48 128,60 91,105 108 S170 137,211 90 S282 38,326 76 S384 121,432 80 S510 30,600 49 L600 175 L0 175Z" fill="url(#g)"/><path d="M0 133 C48 128,60 91,105 108 S170 137,211 90 S282 38,326 76 S384 121,432 80 S510 30,600 49" fill="none" stroke="#7c3aed" stroke-width="3"/></svg></div></section><section class="panel chart-panel"><div class="panel-head"><h2>Category distribution</h2><button class="link">Details</button></div>${categoryDistributionChart()}</section><section class="panel chart-panel"><div class="panel-head"><h2>Completion trend</h2><button class="link">Monthly</button></div><div class="chart">${[39,51,64,55,80,74,91].map((height, index) => `<div class="bar-group"><div class="bar ${index === 6 ? 'active' : ''}" style="height:${height}%"></div></div>`).join('')}</div></section><section class="panel chart-panel"><div class="panel-head"><h2>Priority distribution</h2></div><div class="empty" style="padding:46px"><span><i data-lucide="pie-chart"></i></span><p>7 high · 11 medium · 6 low priority tasks</p></div></section></div></div>`;
}

// When loaded after app.js, this activates the replacement automatically.
if (typeof pages !== 'undefined') {
  pages.analytics = analytics;
}
