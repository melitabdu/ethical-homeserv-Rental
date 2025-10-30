// src/socket.js
import { io } from "socket.io-client";

const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://home-service-backend-3qy2.onrender.com";

const socket = io(BACKEND_URL);

export default socket;
