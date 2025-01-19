
---

# **Reflecto API Documentation** (Updated for Cookie-Based Authentication)

## **Overview**
The Reflecto API is a journaling platform backend that allows users to register, log in, and create, view, update, and delete journal entries. It uses Node.js, Express, and MongoDB to handle user authentication via JWT stored in cookies and manage journal entries.

---

## **Base URL**
```
http://<your-server-url>/api
```

---

## **Authentication**
The API uses **JWT tokens** for user authentication, which are stored in **HTTP-only cookies** during login. Protected routes require the token to be included in the request as a cookie.

---

## **Setting Up Cookie Authentication**

1. **Set the token in the response cookie during login.**
2. **Subsequent requests automatically send the token via the `cookie` header.**
3. **Use `cookie-parser` middleware to parse cookies.**

---

## **Endpoints**

### **1. User Routes**

#### **POST /api/users/register**
**Description:** Register a new user.  
**Request Body:**
```json
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "password123"
}
```
**Response:**
- **201 Created**
  ```json
  {
    "id": "64c01ed2e634c43c8f283456",
    "username": "johndoe"
  }
  ```
- **400 Bad Request**
  ```json
  {
    "message": "User already exists"
  }
  ```

#### **POST /api/users/login**
**Description:** Authenticate an existing user and generate a JWT token, which is set in an HTTP-only cookie.  
**Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```
**Response:**
- **200 OK**
  ```json
  {
    "message": "Login successful"
  }
  ```
- **400 Bad Request**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

**Set Cookie Example:**
- The server will send a cookie with the following parameters:
  - **Name:** `token`
  - **HTTP-only**: Yes (cannot be accessed by JavaScript)
  - **Secure**: Yes (in production, requires HTTPS)
  - **Max-Age**: 1 day

---

### **2. Journal Routes**

These routes are protected and require the user to be authenticated via the JWT token stored in the cookies.

#### **POST /api/journals/create**
**Description:** Create a new journal entry.  
**Headers:**
```http
Authorization: Bearer <token>
```
or use cookies that will be automatically sent.  
**Request Body:**
```json
{
  "title": "My Day",
  "content": "Today was productive. I learned a lot!"
}
```
**Response:**
- **201 Created**
  ```json
  {
    "message": "Journal created successfully",
    "journal": {
      "id": "64c01ed2e634c43c8f283456",
      "title": "My Day",
      "content": "Today was productive. I learned a lot!",
      "createdAt": "2025-01-19T12:34:56.789Z"
    }
  }
  ```

#### **GET /api/journals/get**
**Description:** Retrieve all journals for the authenticated user.  
**Headers:**
```http
Authorization: Bearer <token>
```
or use cookies that will be automatically sent.  
**Response:**
- **200 OK**
  ```json
  [
    {
      "id": "64c01ed2e634c43c8f283456",
      "title": "My Day",
      "content": "Today was productive. I learned a lot!",
      "createdAt": "2025-01-19T12:34:56.789Z"
    },
    {
      "id": "64c01ed2e634c43c8f283457",
      "title": "Weekend Plans",
      "content": "Going hiking tomorrow!",
      "createdAt": "2025-01-18T09:20:45.123Z"
    }
  ]
  ```

#### **PUT /api/journals/update/:id**
**Description:** Update a specific journal entry by its ID.  
**Headers:**
```http
Authorization: Bearer <token>
```
or use cookies that will be automatically sent.  
**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content here."
}
```
**Response:**
- **200 OK**
  ```json
  {
    "message": "Journal updated successfully",
    "journal": {
      "id": "64c01ed2e634c43c8f283456",
      "title": "Updated Title",
      "content": "Updated content here.",
      "createdAt": "2025-01-19T12:34:56.789Z"
    }
  }
  ```

#### **DELETE /api/journals/delete/:id**
**Description:** Delete a specific journal entry by its ID.  
**Headers:**
```http
Authorization: Bearer <token>
```
or use cookies that will be automatically sent.  
**Response:**
- **200 OK**
  ```json
  {
    "message": "Journal deleted successfully"
  }
  ```

---

## **Error Handling**

| **Code** | **Message**                  | **Description**                               |
|----------|------------------------------|-----------------------------------------------|
| `401`    | Unauthorized                 | Missing or invalid token                      |
| `400`    | Bad Request                  | Invalid data provided in request body         |
| `404`    | Not Found                    | Resource (e.g., journal or user) not found    |
| `500`    | Internal Server Error        | Unexpected server-side error                  |

---

## **Cookie Settings for Authentication**
- **HTTP-only**: The cookie containing the token is not accessible via JavaScript to protect from cross-site scripting (XSS) attacks.
- **Secure**: Ensure this is enabled for production (i.e., over HTTPS).
- **Max-Age**: 1 day (can be adjusted).
- **SameSite**: Set to `Strict` to prevent the cookie from being sent in cross-site requests.

---

### **Logout**

To log the user out, clear the cookie using:
```javascript
res.clearCookie('token');
res.status(200).json({ message: 'Logged out successfully' });
```

---

### **Example: Login with Cookies Using Postman**

1. **Login Request:**
   - Method: `POST`
   - URL: `/api/users/login`
   - Body:
     ```json
     {
       "email": "johndoe@example.com",
       "password": "password123"
     }
     ```

2. **Check Response:**
   - The cookie will be set in the `Set-Cookie` header.

3. **Access Protected Route:**
   - Send a `GET` request to `/api/journals/get`, and the token will automatically be included from the cookie.

---
