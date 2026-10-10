
const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient({
  url: 'redis://redis-db:6379'
});

client.on('error', (err) => {
  console.error('Redis error:', err.message);
});

app.get('/health', (req, res) => {
  res.status(client.isReady ? 200 : 503).json({
    status: client.isReady ? 'healthy' : 'unhealthy',
    application: 'Node.js + Express',
    redis: client.isReady ? 'connected' : 'disconnected'
  });
});

app.get('/', async (req, res) => {
  try {
    const visits = await client.incr('visits');

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Node + Redis | Infrastructure Lab</title>
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      font-family: Inter, "Segoe UI", Arial, sans-serif;
      color: #e8eefc;
      background:
        radial-gradient(ellipse at top left, #173b70 0, transparent 45%),
        linear-gradient(135deg, #081120, #101b30 65%, #111827);
    }

    .dashboard { width: 100%; max-width: 760px; }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
    }

    .brand { font-size: 14px; font-weight: 700; letter-spacing: 1px; }
    .brand span { color: #60a5fa; }

    .badge {
      font-size: 12px;
      color: #86efac;
      border: 1px solid #276749;
      background: #123126;
      border-radius: 999px;
      padding: 8px 12px;
      white-space: nowrap;
    }

    .card {
      padding: 38px;
      border: 1px solid #293950;
      border-radius: 24px;
      background: rgba(17, 29, 49, 0.94);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
    }

    .eyebrow {
      color: #60a5fa;
      font-size: 12px;
      font-weight: 700;

      text-transform: uppercase;
    }

    h1 { font-size: clamp(30px, 5vw, 44px); margin: 14px 0; }
    .description { color: #a8b6cc; line-height: 1.7; }

    .counter {
      margin: 30px 0;
      padding: 26px;
      border: 1px solid #294a76;
      border-radius: 18px;
      background: linear-gradient(135deg, #152b49, #14223a);
      text-align: center;
    }

    .counter-label { color: #b6c8e2; font-size: 14px; }
    .number { color: #7db8ff; font-size: clamp(56px, 10vw, 78px); font-weight: 800; margin: 8px 0; }
    .hint { color: #8fa3bf; font-size: 13px; }

    .services {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 22px;
    }

    .service {
      padding: 17px 12px;
      border: 1px solid #2b3b52;
      border-radius: 14px;
      background: #111f34;
    }

    .service-icon { font-size: 22px; }
    .service-name { font-size: 13px; font-weight: 700; margin: 10px 0 6px; }
    .service-detail { color: #9aabc3; font-size: 12px; line-height: 1.5; }

    .footer {
      margin-top: 24px;
      color: #8394ad;
      font-size: 12px;
      text-align: center;
    }

    @media (max-width: 540px) {
      .card { padding: 24px 18px; }
      .services { grid-template-columns: 1fr; }
      .service { display: flex; align-items: center; gap: 12px; }
      .service-name { margin: 0 0 4px; }
      .topbar { align-items: flex-start; flex-direction: column; }
    }
  </style>
</head>
<body>
  <main class="dashboard">
    <header class="topbar">
      <div class="brand">INFRA<span>LAB</span> / DOCKER</div>
      <div class="badge">● Application Running</div>
    </header>

    <section class="card">
      <div class="eyebrow">Multi-container application</div>
      <h1>Node.js + Redis</h1>
      <p class="description">
        A live demonstration of containerized services communicating
        through a custom Docker bridge network.
      </p>

      <div class="counter">
        <div class="counter-label">TOTAL PAGE VISITS</div>
        <div class="number">${visits}</div>
        <div class="hint">Refresh this page to increment the counter</div>
      </div>

      <div class="eyebrow">Infrastructure overview</div>
      <div class="services">
        <div class="service">
          <div class="service-icon">◈</div>
          <div>
            <div class="service-name">Node.js</div>
            <div class="service-detail">Web application · Port 3000</div>
          </div>
        </div>


        <div class="service">

          <div class="service-icon">▤</div>

          <div>
            <div class="service-name">Redis 7</div>
            <div class="service-detail">Counter storage · Port 6379</div>
          </div>
        </div>

        <div class="service">
          <div class="service-icon">⇄</div>
          <div>
            <div class="service-name">Docker Network</div>
            <div class="service-detail">Bridge · app-net</div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      BUILT WITH NODE.JS · EXPRESS · REDIS · DOCKER
    </footer>
  </main>
</body>
</html>`);
  } catch (err) {
    console.error('Counter error:', err.message);
    res.status(500).send('Unable to load the dashboard. Please try again.');
  }
});

async function startServer() {
  await client.connect();

  app.listen(3000, '0.0.0.0', () => {
    console.log('App running on port 3000');
  });
}

startServer().catch((err) => {
  console.error('Failed to start application:', err.message);
  process.exit(1);
});
