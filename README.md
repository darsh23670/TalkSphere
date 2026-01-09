# TalkSphere

**TalkSphere** is a full-stack real-time communication application that allows users to create or join rooms and communicate using **audio and video in real time**.  
The project demonstrates **end-to-end web development skills** including frontend UI, backend APIs, real-time signaling, and database integration.

This repository contains **everything required to run the project locally**.

---

##  What This Project Does

- Enables real-time **audio/video communication**
- Uses **room-based communication**
- Handles real-time events using **Socket.IO**
- Demonstrates **full-stack project architecture**
- Suitable for **learning, internships, and placement portfolios**

---

##  Technologies Used

###  Frontend
- JavaScript
- React
- HTML & CSS
- WebRTC
- Socket.IO Client

###  Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB
- Mongoose

###  Tools & Platforms
- Git & GitHub
- VS Code
- MongoDB Atlas (optional)
- Render / Vercel (optional)

---

##  How to Run the Project Locally

###  Step 1: Clone the Repository

git clone https://github.com/darsh23670/TalkSphere.git
cd TalkSphere
Step 2: Install Dependencies
bash
Copy code
cd Backend
npm install

cd ../Frontend
npm install
Step 3: Environment Configuration
Create a .env file inside the Backend folder:

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Step 4: Start the Application
Open two terminals.

Terminal 1 (Backend):

bash
Copy code
cd Backend
npm start
Terminal 2 (Frontend):

bash
Copy code
cd Frontend
npm start
Step 5: Use the Application
Open your browser and go to:

arduino
Copy code
http://localhost:3000
Create or join a room

Allow microphone and camera permissions

Start real-time communication 

How the System Works
The frontend handles UI, user interaction, and media access

The backend manages rooms, sockets, and signaling

WebRTC enables peer-to-peer audio/video streaming

Socket.IO handles real-time event communication

MongoDB stores application-related data if required

