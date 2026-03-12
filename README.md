# 📊 Agent Dashboard

[![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)]()
[![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A real-time AI agent monitoring dashboard built with vanilla HTML, CSS, and JavaScript. No build tools, no frameworks — just open `index.html` in a browser.

## Features

- 📈 **Real-time Metrics** — CPU, memory, request rate, and error tracking
- 🤖 **Agent Status Grid** — At-a-glance view of all running agents
- 📊 **Interactive Charts** — Request/response time history with Canvas charts
- 🔴 **Health Indicators** — Color-coded status (healthy, degraded, offline)
- 📋 **Activity Log** — Live feed of agent events and actions
- 🎨 **Dark Theme** — Easy on the eyes for long monitoring sessions
- 📱 **Responsive** — Works on desktop and mobile

## Quick Start

```bash
# Just open it!
open index.html

# Or serve it
npx serve .
```

No npm install, no build step, no dependencies.

## Screenshot

```
┌─────────────────────────────────────────────────────┐
│  🤖 Agent Dashboard                    ● Connected  │
├──────────┬──────────┬──────────┬───────────────────┤
│ Agents   │ Requests │ Avg Resp │ Errors            │
│    12    │  45,231  │  124ms   │   3 (0.01%)       │
├──────────┴──────────┴──────────┴───────────────────┤
│  ● Agent-01  ● Agent-02  ● Agent-03  ○ Agent-04   │
│  ● Agent-05  ● Agent-06  ● Agent-07  ● Agent-08   │
│  ● Agent-09  ● Agent-10  ● Agent-11  ● Agent-12   │
├─────────────────────────────────────────────────────┤
│  [Request Volume Chart]    [Response Time Chart]    │
├─────────────────────────────────────────────────────┤
│  Activity Log                                       │
│  20:14 Agent-04 went offline (timeout)              │
│  20:13 Agent-07 processed 150 requests              │
│  20:12 System health check passed                   │
└─────────────────────────────────────────────────────┘
```

## Configuration

Edit `js/mock-data.js` to connect to your real data source:

```javascript
// Replace mock data with your API endpoint
const DATA_SOURCE = 'ws://your-server:8080/agents';
```

## Structure

```
agent-dashboard/
├── index.html          # Main dashboard page
├── css/style.css       # Dashboard styles (dark theme)
├── js/app.js           # Dashboard logic and charts
├── js/mock-data.js     # Mock data generator (replace with real API)
├── LICENSE             # MIT License
└── README.md           # This file
```

## License

MIT License — see [LICENSE](LICENSE) for details.
