# CLAUDE.md - Guidelines for Working with this Codebase

## Build & Development Commands
- Build: `npm run build`
- Development: `npm run dev`
- Preview: `npm run preview`
- Lint: `npm run lint` (includes eslint & oxlint)
- Test: `npm run test:unit` (Vitest)
- Single test: `npx vitest run <test-file-path>` or `npx vitest --testNamePattern="<test-name>"`

## Code Style Guidelines
- **Framework**: Vue.js 3.5+ with Vue Router and Pinia for state management
- **Formatting**: ESLint with Vue plugin (see eslint.config.js)
- **Imports**: Use ES modules (type: "module" in package.json)
- **Components**: Follow Vue 3 Composition API patterns
- **Naming**: 
  - PascalCase for components
  - camelCase for variables/functions
  - kebab-case for files
- **TypeScript**: When adding types, follow existing patterns in nearby files
- **Error Handling**: Use try/catch blocks for async operations
- **CSS**: Tailwind CSS is used for styling

## Project Structure
- Standard Vue structure with components, assets, and views
- Key libraries: Vue Router, Pinia, Tailwind CSS, Vitest