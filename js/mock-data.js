/**
 * Agent Dashboard - Mock Data Generator
 *
 * Replace this file with your real data source (WebSocket, API polling, etc.)
 * This generates realistic demo data for the dashboard.
 */

const AGENT_NAMES = [
  'orchestrator', 'classifier', 'embedder', 'retriever',
  'summarizer', 'translator', 'moderator', 'router',
  'cache-mgr', 'rate-limiter', 'logger', 'monitor'
];

let _totalRequests = 142857;
let _errorCount = 23;
let _tick = 0;

/**
 * Generate a snapshot of the current system state.
 * In production, replace this with your real API call.
 */
function generateSnapshot() {
  _tick++;

  // Simulate request growth
  const requestBurst = Math.floor(Math.random() * 80) + 20;
  _totalRequests += requestBurst;

  // Occasional errors
  if (Math.random() < 0.05) {
    _errorCount += Math.floor(Math.random() * 3) + 1;
  }

  // Agent states
  const agents = AGENT_NAMES.map((name, i) => {
    let status = 'healthy';
    const rand = Math.random();

    // Agent #4 sometimes goes offline
    if (i === 3 && _tick % 30 < 5) {
      status = 'offline';
    } else if (rand < 0.03) {
      status = 'offline';
    } else if (rand < 0.1) {
      status = 'degraded';
    }

    const baseResponse = 80 + i * 10;
    const jitter = Math.floor(Math.random() * 40) - 20;

    return {
      name: name,
      status: status,
      requests: status === 'offline' ? 0 : Math.floor(Math.random() * 200) + 50,
      responseTime: status === 'offline' ? 0 :
                    status === 'degraded' ? baseResponse + 200 + jitter :
                    baseResponse + jitter,
      cpu: status === 'offline' ? 0 :
           status === 'degraded' ? Math.floor(Math.random() * 30) + 70 :
           Math.floor(Math.random() * 40) + 15,
      memory: status === 'offline' ? 0 : Math.floor(Math.random() * 30) + 40,
      uptime: status === 'offline' ? '0s' : formatUptime(86400 + _tick - (i * 3600)),
    };
  });

  // Random events
  const events = [];
  if (Math.random() < 0.3) {
    const eventTypes = [
      { level: 'info', message: `${randomAgent()} processed ${Math.floor(Math.random() * 200) + 50} requests` },
      { level: 'info', message: `Cache hit ratio: ${(Math.random() * 20 + 80).toFixed(1)}%` },
      { level: 'info', message: `System health check passed` },
      { level: 'warning', message: `${randomAgent()} response time above threshold (${Math.floor(Math.random() * 200) + 300}ms)` },
      { level: 'warning', message: `Memory usage at ${Math.floor(Math.random() * 10) + 85}% on ${randomAgent()}` },
      { level: 'error', message: `${randomAgent()} request timeout after 30s` },
      { level: 'info', message: `Rate limiter throttled ${Math.floor(Math.random() * 10) + 1} requests` },
      { level: 'info', message: `New model version deployed to ${randomAgent()}` },
    ];
    const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    event.source = randomAgent();
    events.push(event);
  }

  const avgResponse = Math.floor(
    agents.filter(a => a.status !== 'offline')
          .reduce((sum, a) => sum + a.responseTime, 0) /
    agents.filter(a => a.status !== 'offline').length
  );

  return {
    agents,
    totalRequests: _totalRequests,
    requestsPerMin: requestBurst * 6,
    avgResponse: avgResponse,
    p99Response: avgResponse + Math.floor(Math.random() * 100) + 100,
    errorRate: (_errorCount / _totalRequests * 100).toFixed(3),
    errorCount: _errorCount,
    events,
  };
}

function randomAgent() {
  return AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)];
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
