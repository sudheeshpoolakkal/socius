# Server

This directory contains the Node.js and Express-based backend for the Spiritus project. It serves as the central API for all frontend applications, handling business logic, database interactions, and authentication.

## Table of Contents

- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Usage](#usage)
  - [Running the Server](#running-the-server)
  - [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Testing](#testing)

## Configuration

### Environment Variables

The server requires a `.env` file for configuration. Create a file named `.env` in the `server/` directory and add the following variables:

```
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# JSON Web Token
JWT_SECRET=your_jwt_secret_key

# Server Port
PORT=3000

# Cloudinary Configuration (if used)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Configuration (if used)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Nodemailer Configuration (if used)
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

**Note:** Ensure that you have a running MongoDB instance and provide its connection string in the `MONGODB_URI` variable.

## Installation

1. **Navigate to the server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Usage

### Running the Server

To start the server in development mode with automatic restarts, run:

```bash
npm run server
```

This command uses `nodemon` to watch for file changes and restart the server automatically. The server will run on the port specified in your `.env` file (defaults to 3000).

Alternatively, you can run the monolithic `server.js` file with:
```bash
npm start
```

### Available Scripts

- `npm run server`: Starts the server in development mode using `index.js`.
- `npm start`: Starts the server using the `server.js` file.
- `npm test`: Runs the test suite using Mocha.

## API Documentation

The detailed documentation for all API endpoints, controllers, models, and utility functions is available in the `DOCS.md` file. This file provides a comprehensive overview of the server's source code.

## Testing

The server uses [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/) for testing. The tests are located in the `test/` directory.

To run the test suite, use the following command:

```bash
npm test
```

This command will execute all test files ending in `.test.js` within the `test/` directory. The test environment uses an in-memory MongoDB server, so no separate database configuration is required for testing.