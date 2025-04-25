import { io } from "socket.io-client";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const socket = io(baseUrl);

export default socket;
