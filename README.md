# Swipe Pad dApp

## Features

- Dynamic Labs Integration: Seamless wallet connection and authentication
- Modern UI: Built with React and Tailwind CSS + shadcn/ui
- Real-time Updates: Socket.io integration for live data
- Type Safety: Full TypeScript support
- Form Handling: React Hook Form with Zod validation
- State Management: Jotai for global state
- Routing: TanStack Router for type-safe routing
- API Integration: TanStack Query for data fetching

## Tech Stack

- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Blockchain**: 
  - Dynamic Labs SDK
  - Wagmi
- **State Management**: Jotai
- **Routing**: TanStack Router
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form
- **Real-time**: Socket.io Client
- **Development Tools**:
  - Biome (Linting & Formatting)
  - Vite
  - SVGR for SVG handling
  - Orval for API generation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Bun (recommended) or npm

### Installation

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd front-end
bun install
```

2. Set up environment variables:
Create a `.env` file in the root directory with the necessary configuration.

### Development

Start the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build for different environments:

```bash
# Production build
bun run build:prod

# Staging build
bun run build:staging
```

### Other Commands

- `bun run lint`: Run Biome linter
- `bun run format`: Format code with Biome
- `bun run preview`: Preview production build locally
- `bun run add:ui`: Add new shadcn/ui components
- `bun run generate:api`: Generate API types using Orval
- `bun run generate:sc`: Generate smart contract types

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # React components
├── constants/      # Application constants
├── features/       # Feature-specific components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── routes/        # Application routes
├── services/      # API services
├── smart-contracts/# Smart contract interactions
├── styles/        # Global styles
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

