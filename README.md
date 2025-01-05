# Password Reset Backend

This repository contains the backend code for a password reset flow application. It provides endpoints for user signup, login, password reset, and related features. 
The backend is built with **Node.js**, **Express**, and **MongoDB**.

---

## Features

- User Signup
- User Login
- Password Reset via Email
- JWT-based Authentication
- MongoDB for Data Storage

---

## Prerequisites

- Node.js installed
- MongoDB connection string
- A Gmail account for sending emails
- Render account for deployment (if hosting the app on Render)

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone (https://github.com/nandhinigurumoorthyy/Password-reset-flow-server.git)
   cd Password-reset-flow-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=10000
   HOSTNAME=0.0.0.0
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET_KEY=<your-jwt-secret-key>
   EMAIL_USER=<your-gmail-email>
   EMAIL_PASS=<your-gmail-password>
   ```

4. Start the development server:
   ```bash
   npm start
   ```

---

## Deployment on Render

1. Create a Render account at [https://render.com](https://render.com).
2. Create a new **Web Service** on Render:
   - Choose your GitHub repository for this project.
   - Set the **Environment** to `Node.js`.
   - Specify the build and start commands:
     ```bash
     Build Command: npm install
     Start Command: npm start
     ```
   - Add the required environment variables in the **Environment** section of Render:
     - `PORT`
     - `HOSTNAME`
     - `MONGODB_URI`
     - `JWT_SECRET_KEY`
     - `EMAIL_USER`
     - `EMAIL_PASS`
   - Choose a region closest to your users for optimal performance.
3. Click **Deploy**.
4. After deployment, Render will provide you with a URL (`https://password-reset-flow-server-0ne8.onrender.com`).

---

## API Endpoints

| Method | Endpoint                | Description               |
|--------|-------------------------|---------------------------|
| POST   | `/create`               | User Signup               |
| POST   | `/login`                | User Login                |
| POST   | `/forgotpassword`       | Request Password Reset    |
| POST   | `/resetpassword/:id/:token` | Reset Password         |


### 1. Signup
- **Endpoint:** `/create`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "name": "<user-name>",
    "email": "<user-email>",
    "password": "<user-password>"
  }
  ```
- **Response:**
  ```json
  {
    "status": "Success",
    "user": { "_id": "<user-id>", "name": "<user-name>", "email": "<user-email>" }
  }
  ```

### 2. Login
- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Authenticates a user.
- **Request Body:**
  ```json
  {
    "email": "<user-email>",
    "password": "<user-password>"
  }
  ```
- **Response:**
  ```json
  {
    "status": "Success",
    "user": { "email": "<user-email>", "name": "<user-name>" }
  }
  ```

### 3. Forgot Password
- **Endpoint:** `/forgotpassword`
- **Method:** `POST`
- **Description:** Sends a password reset link to the user's email.
- **Request Body:**
  ```json
  {
    "email": "<user-email>"
  }
  ```
- **Response:**
  ```json
  {
    "status": "Success",
    "message": "Email sent successfully"
  }
  ```

### 4. Reset Password
- **Endpoint:** `/resetpassword/:id/:token`
- **Method:** `POST`
- **Description:** Resets the user's password.
- **Request Body:**
  ```json
  {
    "password": "<new-password>"
  }
  ```
- **Response:**
  ```json
  {
    "status": "Success",
    "message": "Password updated successfully"
  }
  ```

---

## Frontend Integration

Ensure your frontend is configured to use the deployed backend URL. For example:
```javascript
const API_URL = `https://password-reset-flow-server-0ne8.onrender.com`;
axios.post(`${API_URL}/create`, { name, email, password });
```

---

## Notes

- Ensure that the frontend has the correct API URL configured in its environment file.
- Always keep the `JWT_SECRET_KEY` and `EMAIL_PASS` secure.


