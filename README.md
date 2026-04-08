# Hindsight

Hindsight is a nightly regret logging tool designed for end-of-day reflection and pattern recognition. It helps users track their decisions, mood, and regret intensity over time to identify emotional patterns and grow through mindful reflection.

## Features

- **Nightly Ritual**: A guided step-by-step process to log your day, mood, and significant decisions.
- **Molly Character**: Your wise, empathetic companion who guides you through the reflection process.
- **Dashboard Insights**:
  - **Regret Decay Chart**: Visualize how your regret intensity changes over 30 days.
  - **Category Breakdown**: See which areas of your life (Money, Work, Social, etc.) carry the most emotional weight.
  - **Pattern Recognition**: Identify your "toughest day" of the week and how your mood correlates with regret.
- **Journal**: A historical timeline of your past reflections and decisions.
- **Privacy First**: All data is stored locally in your browser's storage.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository (once exported to GitHub)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

The project uses a retro-inspired UI with custom Tailwind configurations. The core logic for insights and streak calculations can be found in `src/components/Dashboard.tsx`.

## License

Apache-2.0
