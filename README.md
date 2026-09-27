# Workout Generator

Workout Generator is a responsive fitness-planning web application for building personalized workout sessions. It includes configurable training splits, exercise selection, saved workouts, body-profile tracking, and a light/dark interface.

## Features

- Generate workouts by training split, focus, experience level, available equipment, and duration
- Choose from push/pull/legs, upper/lower, bro split, full-body, and custom routines
- Edit generated sessions, warm-ups, and cooldowns
- Browse an exercise library and training guides
- Save workouts and body-profile details locally in the browser
- Switch between light and dark themes with an animated theme control
- Responsive information pane and dashboard navigation

## Tech Stack

- React 19
- Next.js 16 and Vinext
- TypeScript
- Tailwind CSS
- shadcn/ui and Radix UI
- Cloudflare Workers tooling
- Drizzle ORM scaffolding for optional D1 persistence

## Getting Started

### Prerequisites

- Node.js 22.13 or newer
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Preview the production Worker locally
npm run lint      # Run ESLint
```

## Project Structure

```text
app/          Application routes and global styles
components/   Reusable application and UI components
data/         Exercise data
db/           Optional database schema and helpers
public/       Static assets
scripts/      Local development and build helpers
```

## Local Data

Saved workouts, profile information, and theme preferences are stored in the browser's local storage. No account is required for the current MVP.

## License

No license has been specified.
