# AudioApp Server Documentation

## Overview

The **AudioApp Server** is a full-stack web application built using **Node.js**, **TypeScript**, and **PostgreSQL**. The server provides a backend API for managing users, user profiles, and audio files. It also includes user authentication, data storage, and file upload capabilities.

### Core Features:

- **Authentication**: User login and authentication via JWT (JSON Web Token).
- **User Profile**: Users can create and update their profiles with personal information like bio and email.
- **Audio File Management**: Users can upload, update, and delete audio files, as well as make them public or private.
- **Music Genre**: Multiple music genres are supported for each audio file.
- **Pagination**: API endpoints that support pagination for fetching audio files.
- **Security**: Password hashing with Argon2 for secure password storage.

## System Architecture

The server follows a **Modular Architecture** with a clean separation between different services and layers:

### 1. **User Authentication Service**

- Handles user login and registration.
- Implements JWT-based authentication.
- Manages password hashing with **Argon2**.

### 2. **Profile Service**

- Manages user profiles, including personal information (bio, email, etc.).
- Supports updating and fetching public/private profiles.
- Private profiles are only accessible to authenticated users.

### 3. **Audio Service**

- Manages audio file storage and metadata.
- Allows users to view, stream, upload, update, and delete audio files.
- Supports making files public or private.
- Audio files are stored locally in the `/uploads/audio` directory.
- Audio files are associated with genres and other metadata.

### 4. **Database**

- **PostgreSQL** is used for data storage.
- The server utilizes **Prisma** ORM for database interaction.
- Data models include:
  - **User**: Stores user information like username, email, bio, and authentication details.
  - **AudioFile**: Stores information related to audio files, including name, file path, genres, and visibility settings.

### 5. **Endpoints**

- The server exposes a RESTful API for interacting with the system.
- A postman collection **`AudioApp.postman_collection.json`** is available in the file repository.
  - `Authentication ( loginUser, registerUser )`
  - `User profile management ( getProfile, updateProfile, deleteProfile )`
  - `Audio file management ( listAudio, getAudioData, streamAudio, uploadAudio, updateAudio, deleteAudio )`

## .env File
- For the .env file, it requires the following:
  - `PORT - Any port for hosting the server on, I used 3000`
  - `AUTH_KEY - for the JWT, any string will do`
  - `UPLOAD_DIR - Directory in root that the uploaded audio files will go to. I used "uploads/audio/"`
  - `DATABASE_URL - For prisma. This used PostgreSQL, so the url goes something like this: "postgresql://username:password@localhost:5432/audioapp?schema=audioapp"`
- Other changes not in .env
  - If you're looking to host the frontend along, under config it has allowedOrigins.ts. Include the url there (default, has "http://localhost:5173")