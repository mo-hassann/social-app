![alt text](https://github.com/mo-hassann/my-portfolio/blob/master/public/projects-imgs/social.png)
# Social Media App

A modern social media application built using Next.js, Hono, Drizzle ORM, and React Query. This app allows users to connect, share posts, and engage with a community.

## 📃 Table of Contents

- [✨ Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Authentication**: Secure sign-up and login with Auth JS.
- **User Profiles**: Customizable profiles with avatars and bio.
- **Posts**: Create, edit, and delete posts.
- **Comments**: Comment on posts and engage with the community.
- **Real-time Notifications**: Stay updated with real-time notifications for likes, comments, and new followers.
- **Search**: Find users and posts using the search feature.

## 👩‍💻 Tech Stack

- **Next.js**: A React framework for building server-side rendering and static web applications.
- **Auth.js**: Free and open source Authentication for the Web.
- **Hono**: A lightweight web framework for building server-side applications with TypeScript.
- **Drizzle ORM**: TypeScript-first ORM for type-safe database access.
- **React Query**: Data-fetching library for managing server-state in React applications.
- **Bun**: A fast JavaScript runtime that includes a package manager, task runner, and more.

## 💻 Getting Started

To get a local copy of this project up and running, follow these steps.

### ✔ Prerequisites

- **Bun**: Ensure you have Bun installed. Follow the [official Bun installation guide](https://bun.sh/docs/installation).
- PostgreSQL (or another supported SQL database)

### ✔ Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/mo-hassann/social-app.git
    cd social-app
    ```

2. **Install dependencies:**

    Using Bun:

    ```bash
    bun install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    DATABASE_URL=your_database_url
    DATABASE_SECRET=your_database_secret
    DRIZZLE_DATABASE_URL=your_database_url_for_drizzle
    AUTH_SECRET=any_random_secret
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4. **Run database migrations:**

    Ensure your database is running and then run:

    ```bash
    bun run migrate
    ```

5. **Start the development server:**

    ```bash
    bun dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.


## 📈 Usage

### ✔ Running the app

- **Development mode:** `bun dev`
- **Production mode:** `bun run build && bun start`

## 💚 Contributing

We welcome contributions to this project. Please follow these steps to contribute:

1. **Fork the repository.**
2. **Create a new branch** (`git checkout -b feature/your-feature-name`).
3. **Make your changes** and commit them (`git commit -m 'Add some feature'`).
4. **Push to the branch** (`git push origin feature/your-feature-name`).
5. **Open a pull request**.

Please make sure to update tests as appropriate.

## License

Distributed under the MIT License. See [License](/LICENSE) for more information.
