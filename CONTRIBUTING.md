# Contributing Guidelines

Thank you for contributing to the **Fileschool Use Cases** project! To maintain code quality, consistency, and clean architecture across the monorepo, please follow the guidelines outlined below.

---

## 📂 Repository Structure

Our workspace is structured as a Turborepo monorepo:

- **`apps/`**: Contains standalone Next.js applications (`fs-filesharing`, `fs-realestate`).
- **`packages/`**: Shared development configurations (`eslint-config`, `typescript-config`) and reusable design-system assets (`ui`).

Ensure any new application or shared library follows this top-level separation.

---

## 🎨 Architectural Standards & Design Patterns

We follow strict frontend architecture patterns. Every contribution must adhere to the following rules:

### 1. File Structure & Placement

Keep components organized in their designated directories within each Next.js app:

- **Components**: Put general feature components inside `components/features/`.
- **Forms**: **ALL** form components must go in the `forms/` directory (e.g., `ListingForm.tsx`), even forms displayed inside modals.
- **Modals / Dialogs**: **ALL** modal/dialog components must go in the `modals/` directory (e.g., `AuthModal.tsx`).
- **Interfaces**: Declare TypeScript interfaces in the `interfaces/` folder (e.g., `listing.interface.ts`). Avoid inline type declarations in component files.
- **State Stores**: Keep Zustand stores in `store/` (not `stores`).

### 2. Naming Conventions

- **Components**: Use **PascalCase** for component filenames and exports (e.g., `ListingCard.tsx` exporting `ListingCard`).
- **Interfaces**: Use `I` prefixes for interfaces (e.g., `IListingCardProps`, `IUser`).
- **Functions & Hooks**: Use **camelCase** for helper functions and custom hooks (e.g., `useAuth`).

### 3. Component Design

- **Single Responsibility**: Each component must do one thing well. Keep files clean and under **200 lines**. If a component grows beyond this, break it down into smaller sub-components.
- **Exports**: Prefer **Named Exports** over default exports to allow better IDE autocomplete and refactoring support:
  ```typescript
  export const ListingCard: FC<IListingCardProps> = ({ listing }) => { ... }
  ```
- **State Management**:
  - Keep local UI state in `useState`.
  - Use **Zustand** for complex global client state (e.g., UI theme, user session, or interactive guides).
  - Use **React Query** for all server/API state fetching and synchronization. Never duplicate server state inside Zustand or Context.

---

## 🛠️ Contribution Workflow

### 1. Development Process

1. **Branch Naming**: Create a descriptive branch from the latest `main` (or designated development branch):
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/your-bugfix-name
   ```
2. **Local Environment**:
   - Install dependencies: `npm install`
   - Run the development build: `npm run dev`

### 2. Code Quality & Verification

Before pushing your changes or opening a PR, run the local quality checks:

- **Format check**: Ensure the code formatting is consistent.
  ```bash
  npm run format
  ```
- **Linting**: Ensure there are no static analysis warnings or errors.
  ```bash
  npm run lint
  ```
- **Compilation check**: Check that TypeScript compiles without errors.
  ```bash
  npm run check-types
  ```

### 3. Submitting a Pull Request

1. Commit your changes with descriptive commit messages following the Conventional Commits format (e.g., `feat: add filestack transformation playground` or `fix: resolve auth modal rendering bug`).
2. Push your branch to GitHub.
3. Open a Pull Request pointing to the `main` branch.
4. Describe your changes clearly in the PR description, referencing any related issues.
