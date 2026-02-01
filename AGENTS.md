# Agent Guidelines

## Project Overview

| Technology       | Version | Purpose           |
| ---------------- | ------- | ----------------- |
| TypeScript       | 5.9.x   | Primary language  |
| Electron         | 38.x    | Desktop framework |
| React            | 19.x    | UI library        |
| esbuild          | 0.25.x  | Bundler           |
| electron-builder | 26.x    | Distribution      |

## Project Structure

```
src/
├── assets/          # Static assets (icons, images)
├── electron/        # Main process code (backend)
│   ├── main.ts      # Application entry point
│   ├── preload.ts   # Context bridge & IPC exposure
│   └── electron-env.d.ts
└── ui/              # Renderer process code (frontend)
    ├── index.html   # HTML entry point
    ├── index.tsx    # React entry point
    ├── App.tsx      # Root component
    └── *.css        # Styles
types/               # Shared TypeScript declarations
```

## Quick Reference

### Commands

| Command              | Description                      |
| -------------------- | -------------------------------- |
| `npm run start:dev`  | Development mode with hot reload |
| `npm run build:prod` | Production build                 |
| `npm run lint:fix`   | Fix linting issues               |
| `npm run format:fix` | Format code with Prettier        |
| `npm run dist:linux` | Build Linux distribution         |
| `npm run dist:win`   | Build Windows distribution       |
| `npm run dist:mac`   | Build macOS distribution         |

### Path Aliases

- `@src/*` → `./src/*`

---

## Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

**Examples:**

- `feat(ui): add dark mode toggle`
- `fix(ipc): resolve channel typing issue`
- `refactor(main): extract window creation logic`

---

## Code Style Guidelines

### General Principles

1. **TypeScript first** — Never use JavaScript; always use TypeScript
2. **Avoid `any`** — Use proper types, generics, or `unknown` when type is uncertain
3. **Keep it simple** — Prefer readability and maintainability over cleverness
4. **Clean code patterns** — Apply SOLID principles where applicable

### Before Writing Code

1. Check `package.json` for dependency versions
2. Reference official documentation for those specific versions
3. Verify compatibility with Electron's security model

### TypeScript Conventions

- Create **interfaces/types in separate files** under `types/` or colocated `*.types.ts` files
- Use **PascalCase** for types/interfaces: `UserProfile`, `IpcChannels`
- Use **camelCase** for variables/functions: `getUserData`, `handleClick`
- Export types explicitly: `export type { UserProfile }`

### File Naming

| Type       | Convention            | Example         |
| ---------- | --------------------- | --------------- |
| Components | PascalCase            | `UserCard.tsx`  |
| Utilities  | camelCase             | `formatDate.ts` |
| Types      | camelCase with suffix | `user.types.ts` |
| Constants  | camelCase             | `constants.ts`  |
| Hooks      | camelCase with prefix | `useAuth.ts`    |

---

## Electron Architecture

### Main Process (`src/electron/`)

- **All business logic goes here**
- Handle file system, native APIs, and external services
- Manage application lifecycle and windows
- Define IPC handlers with proper typing

### Preload Script (`src/electron/preload.ts`)

- Bridge between main and renderer processes
- Expose **only necessary APIs** via `contextBridge`
- Keep the exposed surface minimal for security
- **All channels and methods must be typed**

### Renderer Process (`src/ui/`)

- **Display only** — No business logic
- React components for UI
- Call preload-exposed APIs for any backend operations
- Keep lightweight and focused on presentation

### IPC Communication

**Always type your IPC channels:**

```typescript
// types/ipc.types.ts
export interface IpcChannels {
  'user:get': { request: { id: string }; response: UserProfile };
  'file:save': { request: { path: string; data: string }; response: boolean };
}
```

**Type-safe preload exposure:**

```typescript
// electron/preload.ts
declare global {
  interface Window {
    api: {
      getUser: (id: string) => Promise<UserProfile>;
      saveFile: (path: string, data: string) => Promise<boolean>;
    };
  }
}
```

---

## Security Guidelines

1. **Context Isolation** — Always enabled (`contextIsolation: true`)
2. **Node Integration** — Always disabled (`nodeIntegration: false`)
3. **Sandbox** — Enabled in production
4. **Web Security** — Always enabled (`webSecurity: true`)
5. **Validate IPC inputs** — Never trust renderer data blindly
6. **Minimal preload surface** — Only expose what's needed

---

## Dependencies Policy

1. **Minimize external dependencies** — Use native APIs when possible
2. **Open source only** — Check license compatibility (prefer MIT, Apache 2.0)
3. **Active maintenance** — Verify the repository has recent commits
4. **Security audit** — Run `npm audit` before adding new packages
5. **Bundle size** — Consider impact on application size

**Before adding a dependency, ask:**

- Can this be done with native Node.js/Electron/Browser APIs?
- Is the package actively maintained (commits in last 6 months)?
- Does it have known security vulnerabilities?
- What's the bundle size impact?

---

## Testing Guidelines

- Place tests adjacent to source files: `Component.test.tsx`
- Test IPC handlers in isolation
- Mock Electron APIs in renderer tests
- Focus on business logic coverage in main process

---

## Common Patterns

### Creating a new IPC handler

1. Define types in `types/ipc.types.ts`
2. Implement handler in `src/electron/main.ts`
3. Expose via `src/electron/preload.ts`
4. Update `electron-env.d.ts` with window type augmentation
5. Use in renderer with full type safety

### Adding a new React component

1. Create `ComponentName.tsx` in `src/ui/`
2. Create `ComponentName.css` if styles needed
3. Export types in separate file if complex
4. Keep component focused on presentation only
