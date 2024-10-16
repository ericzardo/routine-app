# API

## About
This is the back-end API of the Routine App. It manages the logic for alarms and document management.

## Technologies

- **Framework:** Fastify
- **ORM:** Prisma ORM
- **Validation:** Zod
- **Language:** TypeScript

## Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- MySQL

## Installation

To run this project locally, follow the steps below. Ensure you are in the root directory of the project before proceeding to set up the front-end and back-end.

### Prerequisites

Before setting up the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- [MySQL](https://www.mysql.com/downloads/) (for database, if applicable)

### Setup

1. **Navigate to the api directory of the project:**

  ```bash
  cd ./api
  ```

2. **Install dependencies:**

  ```bash
  npm install
  ```

3. **Create a `.env` file in the root directory with the following variables:**

  ```bash
  touch .env
  ```

  *Example `env`:*
  ```.env
  DATABASE_URL="mysql://DATABASE_USER:DATABASE_PASS@localhost:3306/routine-app"
  JWT_SECRET="jwt_secret_key"
  COOKIE_SECRET="cookie_secret_key"

  PORT=3333
  ```

4. **Run Prisma migrations to set up the database:**

  ```bash
  npx prisma migrate dev
  ```
5. **Start the API server:**

  ```bash
  npm start
  ```

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/ericzardo/routine-app/blob/main/LICENSE 'See project license') file for details.
