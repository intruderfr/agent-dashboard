/**
 * Agent Dashboard - Main Application Logic
 *
 * Handles UI updates, chart rendering, and real-time data display.
 */

// State
let requestHistory = [];
let responseHistory = [];
let logEntries = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(updateDashboard, 1000);
  updateDashboard();
});

function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}

function updateDashboard() {
  const data = generateSnapshot(); // from mock-data.js

  // Update summary cards
  const activeCount = data.agents.filter(a => a.status === 'healthy').length;
  document.getElementById('active-agents').textContent = activeCount;
  document.getElementById('total-agents').textContent = `of ${data.agents.length} total`;
  document.getElementById('total-requests').textContent = formatNumber(data.totalRequests);
  document.getElementById('requests-rate').textContent = `${data.requestsPerMin}/min`;
  document.getElementById('avg-response').textContent = `${data.avgResponse}ms`;
  document.getElementById('p99-response').textContent = `p99: ${data.p99Response}ms`;
  document.getElementById('error-rate').textContent = `${data.errorRate}%`;
  document.getElementById('error-count').textContent = `${data.errorCount} errors`;

  // Update agent grid
  updateAgentGrid(data.agents);

  // Update charts
  requestHistory.push(data.requestsPerMin);
  responseHistory.push(data.avgResponse);
  if (requestHistory.length > 60) requestHistory.shift();
  if (responseHistory.length > 60) responseHistory.shift();
  drawChart('request-chart', requestHistory, '#58a6ff');
  drawChart('response-chart', responseHistory, '#3fb950');

  // Add log entries
  if (data.events.length > 0) {
    for (const event of data.events) {
      addLogEntry(event);
    }
  }
}

function updateAgentGrid(agents) {
  const grid = document.getElementById('agent-grid');
  grid.innerHTML = '';

  for (const agent of agents) {
    const card = document.createElement('div');
    card.className = `agent-card ${agent.status}`;
    const statusIcon = agent.status === 'healthy' ? '●' :
                       agent.status === 'degraded' ? '◐' : '○';
    card.innerHTML = `
      <div class="agent-name">${statusIcon} ${agent.name}</div>
      <div class="agent-status">${agent.status}</div>
      <div class="agent-stats">
        ${agent.requests} req · ${agent.responseTime}ms · ${agent.cpu}% CPU
      </div>
    `;
    grid.appendChild(card);
  }
}

function drawChart(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const padding = 30;

  ctx.clearRect(0, 0, w, h);

  if (data.length < 2) return;

  const max = Math.max(...data) * 1.2 || 1;
  const min = 0;
  const xStep = (w - padding * 2) / (data.length - 1);

  // Grid lines
  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (h - padding * 2) * (i / 4);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#8b949e';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    const val = Math.round(max - (max - min) * (i / 4));
    ctx.fillText(val, padding - 5, y + 3);
  }

  // Data line
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  for (let i = 0; i < data.length; i++) {
    const x = padding + i * xStep;
    const y = padding + (h - padding * 2) * (1 - (data[i] - min) / (max - min));
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Fill under curve
  const lastX = padding + (data.length - 1) * xStep;
  const lastY = padding + (h - padding * 2) * (1 - (data[data.length - 1] - min) / (max - min));
  ctx.lineTo(lastX, h - padding);
  ctx.lineTo(padding, h - padding);
  ctx.closePath();
  ctx.fillStyle = color.replace(')', ', 0.1)').replace('rgb', 'rgba');
  // Simple alpha fill
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = color;
  ctx.fill();
  ctx.globalAlpha = 1.0;
}

function addLogEntry(event) {
  const entry = {
    timestamp: new Date().toLocaleTimeString(),
    level: event.level || 'info',
    source: event.source || 'system',
    message: event.message,
  };
  logEntries.unshift(entry);
  if (logEntries.length > 200) logEntries.pop();
  renderLog();
}

function renderLog() {
  const container = document.getElementById('activity-log');
  const filtered = currentFilter === 'all'
    ? logEntries
    : logEntries.filter(e => e.level === currentFilter);

  container.innerHTML = filtered.slice(0, 50).map(entry => `
    <div class="log-entry ${entry.level}">
      <span class="timestamp">${entry.timestamp}</span>
      <span class="source">[${entry.source}]</span>
      ${entry.message}
    </div>
  `).join('');
}

function clearLog() {
  logEntries = [];
  renderLog();
}

function filterLog() {
  currentFilter = document.getElementById('log-filter').value;
  renderLog();
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
