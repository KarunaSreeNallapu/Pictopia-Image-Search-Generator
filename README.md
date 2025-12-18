# **Pictopia**  
## **Image Search Generator**  

### **Project Description**  
Pictopia is an image search generator that allows users to search, save, and manage images. It features a secure authentication system, a responsive UI, and seamless integration with the Unsplash API.  

The backend is built with **Node.js** and **Express.js**, while the frontend is developed using **HTML, CSS, and JavaScript**. Data is stored securely using **MongoDB**.  

---

## **Features**  
- 🔍 **Image Search** – Fetches high-quality images from Unsplash.  
- 💾 **Save Favorites** – Users can store their favorite images.  
- 🔑 **User Authentication** – Secure login and registration.  
- 🔒 **JWT Security** – Uses JSON Web Tokens for session management.  
- 📡 **MongoDB Database** – Stores user credentials and saved images.  
- 🌍 **Responsive UI** – Optimized for both desktop and mobile devices.  

---

## **Installation Guide**  


STEP 1: Install dependencies (ONLY ONCE)

Open terminal inside pictopia folder:

## npm init -y


Then install what you actually need:

## npm install express mongoose dotenv bcryptjs jsonwebtoken cors


Check Node:

## node -v

No version = install Node first. Period.

STEP 2: Setup .env file (MOST PEOPLE MESS THIS UP)

## Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=supersecretkey

⚠️ If MongoDB isn’t connected, login/signup WILL NOT WORK. No excuses.

STEP 3: Start MongoDB

If using MongoDB Atlas → nothing to start, just ensure URI is correct.

If using local MongoDB:

## mongod

If this fails → MongoDB isn’t installed. Fix that first.

STEP 4: Run the backend server (this is the execution)

## node server.js


You MUST see:

Server running on port 5000
MongoDB connected


### **Step 1: Install Dependencies**  
```sh
npm install
```

### **Step 3: Configure Environment Variables**  
Create a `.env` file in the project root:  
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
PORT=3001
```

### **Step 4: Start MongoDB**  
Ensure MongoDB is running locally or on a cloud provider like **MongoDB Atlas**.

### **Step 5: Run the Server**  
```sh
npm start
```
The backend will be available at:  
`http://localhost:3001/`  

### **Step 6: Open the Frontend**  
Open `index.html` in a browser to start using the app.  

---

## **API Endpoints**  

| Method | Endpoint         | Description                      |
|--------|-----------------|----------------------------------|
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Authenticate user (returns JWT) |
| **GET**  | `/api/images/search?q=` | Search for images (requires authentication) |
| **GET**  | `/api/favorites` | Get saved images (requires authentication) |
| **POST** | `/api/favorites` | Save an image (requires authentication) |
| **DELETE** | `/api/favorites` | Remove an image (requires authentication) |

#### **Authentication Headers**  
For protected routes, include the JWT token in headers:  
```json
{
  "Authorization": "Bearer <your-token-here>"
}
```

---

## **Technologies Used**  
### **Frontend:**  
- HTML  
- CSS  
- JavaScript  

### **Backend:**  
- Node.js  
- Express.js  

### **Database:**  
- MongoDB (Mongoose ORM)  

### **Authentication & Security:**  
- bcrypt.js (Password Hashing)  
- JWT (JSON Web Token)  

### **API Services:**  
- Unsplash API (for image search)  
- Axios (for API requests)  

---  

### **Troubleshooting Common Issues**  
- Use clear descriptions and error logs.  
- MongoDB Connection Fails:
Verify the MONGODB_URI in .env.
Ensure your IP is whitelisted in MongoDB Atlas.
- Unsplash API Errors:
Check that UNSPLASH_ACCESS_KEY is correct and valid.
- Token Issues:
If authentication fails, ensure the token isn’t expired (valid for 1 hour).
- CORS Issues:
Since the frontend and backend are on the same origin (localhost:3000), CORS shouldn’t be an issue.

---

## **License**  
This project is licensed under the MIT License.  

---

## **Author**  
[NALLAPU KARUNA SREE] – *Developer of Pictopia*  
