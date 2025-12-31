# Spiritus Admin Dashboard

Admin dashboard for managing the Spiritus platform, built with React and Vite.

## Features

- Course management (create, read, update, delete)
- User management
- Role-based access control
- Authentication and authorization

## Technology Stack

- **React** - UI library
- **Vite** - Build tool and dev server with Hot Module Replacement (HMR)
- **ESLint** - Code linting

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the backend API endpoint in your environment configuration.

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Vite Plugins

This project uses the official Vite plugins for React:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) - Uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) - Uses [SWC](https://swc.rs/) for Fast Refresh

## Admin Access

To access the admin dashboard, you need admin-level credentials. See the [backend README](../spiritus/backend/README.md) for information on creating an admin account.

## Additional Resources

For backend API documentation, see [../spiritus/backend/README.md](../spiritus/backend/README.md).
