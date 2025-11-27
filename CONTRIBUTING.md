# Contributing Guide

Thank you for your interest in contributing to this project!

## Development Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run development server: `pnpm dev`
4. Run tests: `pnpm test`

## Code Standards

### Code Style

- Use Prettier for formatting: `pnpm format`
- Follow ESLint rules: `pnpm lint`
- TypeScript strict mode is enabled

### Testing

- Write tests for all new features
- Maintain test coverage above 80%
- Run tests before committing: `pnpm test`

### Commit Messages

Follow conventional commits:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `test:` for test changes
- `refactor:` for code refactoring
- `chore:` for maintenance tasks

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Update documentation if needed
5. Submit a pull request with a clear description

## Code Review

All pull requests require:

- Passing CI checks
- Code review approval
- No linter errors
- Adequate test coverage
