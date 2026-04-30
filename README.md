# Nord Finance

Premium auto financing web app built with Next.js.

## Getting started

```bash
npm install
```

## Development (desktop only)

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

> **Note:** `next dev` uses Turbopack HMR scripts that reference `localhost` — this breaks React hydration on any device other than your laptop. Do not use it for mobile testing.

## Testing on mobile

Run a development build:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3002
```

Run a production build:

```bash
npm run build && npm run start
```

Find your laptop's local IP:

```bash
ipconfig getifaddr en0
```
Kill all processes on port 3002:

```bash
lsof -ti:3002 | xargs kill -9
```

Open `http://[your-ip]:3000` on your phone. Both devices must be on the same Wi-Fi network.
