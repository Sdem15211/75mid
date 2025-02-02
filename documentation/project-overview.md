# 75 Mid Challenge Web App Development Guide

This guide outlines the steps and functionalities required to build the "75 Mid" challenge web application. The app allows you and your friends to track your progress and manage tasks for a 75-day physical challenge. Below is an overview of the project structure, key features, and implementation strategies using the specified tech stack.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [1. Project Setup](#1-project-setup)
4. [2. Database Design with Prisma](#2-database-design-with-prisma)
5. [3. Authentication with NextAuth.js](#3-authentication-with-nextauthjs)
6. [4. API Routes and Data Fetching with TanStack Query](#4-api-routes-and-data-fetching-with-tanstack-query)
7. [5. UI Components with Tailwind CSS and Shadcn](#5-ui-components-with-tailwind-css-and-shadcn)
8. [6. Implementing Core Features](#6-implementing-core-features)
9. [7. Deployment Considerations](#7-deployment-considerations)
10. [File Structure Overview](#file-structure-overview)
11. [Additional Enhancements](#additional-enhancements)

---

## Project Overview

The "75 Mid" challenge is a customizable version of the "75 Hard" challenge, comprising a set of daily tasks aimed at personal development and physical fitness over 75 consecutive days. The web application facilitates task tracking, progress monitoring, and collaborative engagement among users.

## Tech Stack

- **Frontend & Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Backend & Database**: Supabase PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js (Next-Auth) with Google login
- **State Management & Data Fetching**: TanStack React Query
- **Styling**: Tailwind CSS, Shadcn UI components

---

## 1. Project Setup

### Initialize the Next.js Project

Start by setting up a new Next.js project configured with TypeScript. This forms the foundation for your application, providing a robust framework for building both frontend and backend functionalities.

### Install Dependencies

Install all necessary dependencies, including Prisma for ORM, Supabase for the PostgreSQL database, NextAuth.js for authentication, TanStack React Query for data handling, and Tailwind CSS with Shadcn for styling and UI components.

### Configure Tailwind CSS

Set up Tailwind CSS by configuring the `tailwind.config.js` file to specify the content paths and extend the default theme as needed. Initialize global styles to incorporate Tailwind's base, components, and utilities.

---

## 2. Database Design with Prisma

### Initialize Prisma

Initialize Prisma within your project to manage database interactions. This involves setting up Prisma Client and configuring the connection to your Supabase PostgreSQL database through environment variables.

### Define the Database Schema

Design a Prisma schema that includes models for `User`, `Account`, `Session`, `VerificationToken`, and `DailyCheckin`. This schema defines the relationships and data structures required to support user authentication, task tracking, and check-ins.

### Migrate the Database

Run Prisma migrations to apply the defined schema to your Supabase PostgreSQL database. This ensures that your database tables are correctly set up based on the Prisma schema.

---

## 3. Authentication with NextAuth.js

### Configure NextAuth

Set up NextAuth.js to handle user authentication, integrating Google as the authentication provider. Utilize the Prisma adapter to connect NextAuth.js with your Prisma-managed database models.

### Initialize Prisma Client

Create a singleton instance of Prisma Client to manage database operations efficiently across your application.

### Add Session Provider

Wrap your application with NextAuth's `SessionProvider` to provide session management capabilities throughout your React component tree, enabling access to authentication state.

---

## 4. API Routes and Data Fetching with TanStack Query

### Create API Endpoints

Develop Next.js API routes to handle CRUD operations for daily check-ins. These endpoints facilitate fetching, creating, and updating user check-in data based on user ID and date.

### Setup React Query

Initialize TanStack React Query in your application to manage data fetching, caching, and state synchronization between the client and server. This enhances the performance and responsiveness of your application.

### Create Hooks for Data Fetching

Develop custom React hooks using React Query to encapsulate data fetching logic for daily check-ins and friends' check-ins. These hooks simplify data interactions within your components.

---

## 5. UI Components with Tailwind CSS and Shadcn

### Create a Checklist Component

Design a reusable checklist component that displays daily tasks with checkboxes. This component allows users to toggle task completion statuses dynamically throughout the day.

### Create Calendar View

Implement a calendar view to visualize the challenge timeline. Use a library like `react-calendar` or build a custom component to highlight completed days and navigate through the challenge timeline.

### Create Friends View

Develop a friends view component that displays the status of each participant. This component shows friends' avatars and names, allowing users to view each other's progress without modifying it.

---

## 6. Implementing Core Features

### User Authentication

Ensure that only authenticated users can access the application's main features. Provide sign-in and sign-out functionalities, leveraging Google authentication for user convenience.

### Daily Checklist Logic

Implement the logic for managing daily check-ins, allowing users to check and uncheck tasks at any time during the day. Persist task statuses in the database and reflect updates in real-time.

### Displaying Friends' Check-ins

Fetch and display friends' check-in data, enabling users to see each other's progress. Ensure that users can view but not modify their friends' task lists.

### Calendar Integration

Integrate the calendar view with user data to mark completed days. Provide navigation through different dates to review past check-ins and visualize overall progress.

---

## 7. Deployment Considerations

### Environment Variables

Securely manage all necessary environment variables, including database URLs, authentication secrets, and API keys. Ensure these variables are correctly configured for both development and production environments.

### Hosting

Choose a hosting platform that supports Next.js deployments, such as Vercel, which offers seamless integration and optimized performance for Next.js applications.

### Database Hosting

Use Supabase to host your PostgreSQL database, ensuring reliable and scalable database operations. Update the `DATABASE_URL` in your environment variables to connect to the Supabase instance.

---

## File Structure Overview

Organize your project with a clear and maintainable file structure. Below is an overview based on the implementation strategy:

---

## Additional Enhancements

1. **Friend Management**: Implement features to add or remove friends within the app, enhancing the collaborative aspect of the challenge.
2. **Notifications**: Introduce notifications to alert users when friends complete their tasks, fostering motivation and accountability.
3. **Responsive Design**: Ensure the application is fully responsive, providing a seamless experience across various devices and screen sizes.
4. **Error Handling**: Incorporate comprehensive error handling for both API routes and UI components to improve reliability and user experience.
5. **Optimistic Updates**: Enhance the user interface with optimistic updates using React Query to provide immediate feedback and a smoother interaction flow.
6. **Progress Analytics**: Add analytics and visualizations to track individual and group progress over time, offering insights into performance and consistency.
7. **Customization Options**: Allow users to customize their task lists and challenge parameters, making the app adaptable to different goals and preferences.
8. **Accessibility Improvements**: Ensure that the application adheres to accessibility standards, making it usable for a wider range of users.

---

## Conclusion

This guide provides a comprehensive roadmap for developing the "75 Mid" challenge web application. By following these steps and leveraging the outlined technologies, you can create a functional and engaging platform for tracking and supporting your 75-day challenge with friends. Feel free to expand upon this foundation to tailor the application to your specific needs and preferences.

For further assistance or questions, feel free to reach out!
