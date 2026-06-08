import { useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import { useResearchStore } from "../store/researchStore";

export const useSocket = (sessionId) => {
    const socketRef = useRef(null);
    const { addAgentLog } = useResearchStore();

    useEffect(() => {
        if(!sessionId) return;

        const socket = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Socket connected: ", socket.id)
            socket.emit("join:session", sessionId)
        });

        socket.on("session:joined", () => {
            console.log("Joined session room: ", sessionId)
        })

        socket.on("agent:update", (data) => {
            console.log("Agent update: ", data.agentId, data.status)
            addAgentLog(data);
        })

        socket.on("error", (error) => {
            console.error("Socket error: ", error)
        })

        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected: ", reason)
        })

        socket.on("connect_error" , (error) => {
            console.error("Connection error: " + error.message)
        })

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
            socketRef.current = null;
        };
    }, [sessionId, addAgentLog]);

    const emit = useCallback((event, data) => {
        if(socketRef.current){
            socketRef.current.emit(event, data);
        }
    }, [])

    const on = useCallback((event, callback) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    }, []);

    const off = useCallback((event, callback) => {
        if (socketRef.current) {
            socketRef.current.off(event, callback)
        }
    }, [])

    return {
        socket: socketRef.current,
        emit,
        on,
        off,
        isConnected: socketRef.current?.connected || false,
        id: socketRef.current?.id || null
    }
}