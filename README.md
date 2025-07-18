# Colophon API 📚

> A full-stack social platform for readers to discover new books, organize their virtual bookshelves, and share their literary journey.

**Project Status:** In Development 🚧

---

## Table of Contents

- [About The Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Features](#api-features)
- [Live Demo](#live-demo)
- [Contact](#contact)

---

## About The Project

Colophon is a social network dedicated to book lovers. The platform allows users to create virtual bookshelves to organize their readings (read, currently reading, and want to read), write reviews, give ratings, and share their progress with friends.

This repository contains the code for the **back-end API**, built with Node.js, Express, Prisma, and TypeScript. It is responsible for all business logic, database interactions, and user authentication.

---

## Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **Prisma** (ORM for MongoDB)
- **MongoDB**
- **JWT** (JSON Web Tokens for Authentication)
- **Bcrypt.js** (for Password Hashing)
- **Jest & Supertest** (for API Testing)

---

## Getting Started

Follow these steps to get a local copy up and running.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Olliver-0/colophon-api.git](https://github.com/Olliver-0/colophon-api.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd colophon-api
    ```
3.  **Install NPM packages:**
    ```bash
    npm install
    ```
4.  **Set up Environment Variables:**
    - Create a `.env` file in the root of the project by copying the `.env.example` file.
    - Add the required environment variables:
      ```env
      DATABASE_URL=PASTE_YOUR_MONGODB_CONNECTION_STRING_HERE
      JWT_SECRET=PASTE_A_GENERATED_SECURE_RANDOM_STRING_HERE
      ```
5.  **Apply the database schema:**
    ```bash
    npx prisma db push
    ```
6.  **Start the development server:**
    `bash
npm run dev
`
    The API will be running on `http://localhost:3000` (or the port you configure).

---

## API Features

### MVP (Version 1.0)

- [ ] User Authentication (JWT-based login and registration).
- [ ] API endpoint for searching books via the Google Books API.
- [ ] CRUD endpoints for managing user bookshelves ('Read', 'Reading', 'Want to Read').
- [ ] Endpoints to fetch book details and manage ratings/reviews.

### Future Roadmap

- [ ] Endpoints to support a social activity feed.
- [ ] Endpoints for managing user profiles and reading statistics.
- [ ] Implement rate limiting and enhanced security.

---

## Live Demo

(Link to the deployed API on Render - not available yet)

---

## Contact

Natã Gabriel de Oliveira - nata.gabriel.de.oliveira@gmail.com

Project Link: `https://github.com/Olliver-0/colophon-api`
