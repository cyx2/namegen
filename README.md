# Name Generator

A Next.js application that generates random names in the "adjective-noun" format. Includes comprehensive testing, accessibility, security, and error handling.

## Features

- 🎲 Simple frontend with name generation and copy functionality
- 🔌 RESTful API routes:
  - `GET /api/name` - Returns a generated name
  - `POST /api/log` - Client-side logging endpoint
- ♿ Full accessibility support (ARIA labels, keyboard navigation, screen reader support)
- 🛡️ Security headers configured (CSP, HSTS, X-Frame-Options, etc.)
- 🧪 Comprehensive test suite (unit, integration) with Vitest
- 📝 Structured logging (server-side and client-side)
- 🎨 Modern UI with loading states and user feedback
- 🔒 Error boundaries for graceful error handling

## Tech Stack

- **Framework**: Next.js 16
- **React**: 19
- **TypeScript**: 5.9
- **Testing**: Vitest, Testing Library
- **Styling**: Tailwind CSS 4
- **Code Quality**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm 9+

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage
- `pnpm type-check` - Type check without emitting files

## API Usage

### Endpoints

#### GET /api/name

Generates a random name in adjective-noun format.

**Response:**

Success (200):

```json
{
  "name": "swift-eagle"
}
```

Error (500):

```json
{
  "error": "Failed to generate name"
}
```

#### POST /api/log

Receives client-side logs and forwards them to server-side logging. Used internally by the client-side logger.

**Request Body:**

```json
{
  "level": "info",
  "message": "User action",
  "source": "ui",
  "event": "button_click"
}
```

**Response:**

Success (200):

```json
{
  "success": true
}
```

Error (400):

```json
{
  "success": false
}
```

**Log Levels:** `info`, `warn`, `error`, `debug`

## Development

### Code Quality

This project follows strict code quality standards:

- TypeScript strict mode enabled
- ESLint with Next.js recommended rules
- Prettier for consistent formatting
- Comprehensive test coverage
- Type checking with `pnpm type-check`

### Testing

Run the test suite:

```bash
pnpm test
```

View test coverage:

```bash
pnpm test:coverage
```

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── log/           # POST /api/log endpoint
│   │   └── name/          # GET /api/name endpoint
│   ├── __tests__/         # App tests
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── __tests__/         # Component tests
│   └── ErrorBoundary.tsx  # Error boundary component
├── lib/                    # Utility functions
│   ├── __tests__/         # Library tests
│   ├── clientLogger.ts    # Client-side logging
│   ├── constants.ts       # App constants
│   ├── env.ts             # Environment config
│   ├── logger.ts          # Server-side logging
│   └── nameGenerator.ts   # Name generation logic
├── .github/                # GitHub workflows
│   └── workflows/         # CI/CD pipelines
├── coverage/               # Test coverage reports
└── vitest.setup.ts         # Vitest configuration
```

## Security

- Security headers configured (CSP, HSTS, X-Frame-Options, etc.)
- Input validation
- Environment variable validation
- Regular dependency updates

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT
