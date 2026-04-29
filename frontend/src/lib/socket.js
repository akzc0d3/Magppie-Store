import { io } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

let socket;

export function getSocket() {
  if (!socket) {
    const token = useAuthStore.getState().accessToken;

    socket = io( process.env.NEXT_PUBLIC_API_URL, {
      auth: {
        token,
      },
      withCredentials: true,
    });
  }

  return socket;
}