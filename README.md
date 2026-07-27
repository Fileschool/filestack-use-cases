# Filestack Use Cases & Demos (Fileschool)

Welcome to the **Fileschool Use Cases** monorepo. This repository contains production-grade, highly interactive demo applications demonstrating the power of [Filestack](https://www.filestack.com/) integrations inside modern web applications.

It is structured as a [Turborepo](https://turbo.build/) monorepo with multiple apps and shared configurations.

---

## 🚀 Applications Inside

### 1. 📂 Fireshare (`apps/fs-filesharing`)

An instant file-sharing application (limited to 500 KB per file) built with Next.js, Tailwind CSS, Turso (SQLite/Drizzle), and Filestack.

- **Features**: Instantly upload any file using Filestack's Picker, view upload history, generate shareable links, and perform on-the-fly transformations on images.
- **Key Tech**: Next.js, Drizzle ORM, Turso DB, Filestack SDK, Tailwind CSS.

### 2. 🏠 Horizon Pro Real Estate (`apps/fs-realestate`)

A complete real estate listing and management platform showcasing premium visuals and complex interactive UI components.

- **Features**: Property listings search and filters, admin dashboard for listing creation and management, interactive walkthrough tours, image gallery management, and an interactive **Filestack Transformation Playground** for cropping, resizing, and filtering property photos.
- **Key Tech**: Next.js, Zustand (global state management), Tailwind CSS v4, Lucide Icons, Filestack JS SDK.
---

## 🛠️ Monorepo Structure

```text
fileschool/
├── apps/
│   ├── fs-filesharing/      # Next.js filesharing application
│   └── fs-realestate/       # Next.js real estate application (Horizon Pro)
├── packages/
│   ├── eslint-config/       # Shared ESLint configuration
│   ├── typescript-config/   # Shared TypeScript configuration
│   └── ui/                  # Shared UI component library
├── package.json             # Root package.json (monorepo workspaces setup)
└── turbo.json               # Turborepo task pipeline configuration
```

---

## 🏁 Getting Started

### 📋 Prerequisites

- **Node.js**: `v18` or higher
- **npm**: `v10` or higher (package manager used in this monorepo)

### 💻 Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Fileschool/filestack-use-cases.git
   cd filestack-use-cases
   ```

2. **Install dependencies** from the root:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Both apps require environment configuration. Create `.env` or `.env.local` files in the respective directories:

   - **For `apps/fs-filesharing`**:
     Create `apps/fs-filesharing/.env` and configure:

     ```env
     NEXT_PUBLIC_FILESTACK_API_KEY=your_filestack_api_key
     TURSO_DATABASE_URL=your_turso_db_url
     TURSO_AUTH_TOKEN=your_turso_auth_token
     ```

   - **For `apps/fs-realestate`**:
     Create `apps/fs-realestate/.env` and configure:
     ```env
     NEXT_PUBLIC_FILESTACK_API_KEY=your_filestack_api_key
     ```

---

## 🦄 Development & Build Commands

This repository uses Turborepo to orchestrate tasks across all packages and apps.

### Running all apps locally (development mode)

Start the development servers for all apps concurrently:

```bash
npm run dev
```

### Building all apps for production

```bash
npm run build
```

### Running commands for a specific app

You can target a specific app using Turborepo's `--filter` option:

- **Start Only Real Estate (Horizon Pro)**:
  ```bash
  npx turbo dev --filter=fs-realestate
  ```
- **Start Only Filesharing (Fireshare)**:
  ```bash
  npx turbo dev --filter=fs-filesharing
  ```

---

## 📐 Code Quality and Conventions

Ensure your workspace remains clean by using these utility commands:

- **Format**: Format all code using Prettier:
  ```bash
  npm run format
  ```
- **Lint**: Run ESLint across all apps and packages:
  ```bash
  npm run lint
  ```
- **Type Check**: Validate TypeScript types across the codebase:
  ```bash
  npm run check-types
  ```

For information on contributing, code structure guidelines, and naming conventions, please refer to [CONTRIBUTING.md](./CONTRIBUTING.md).
