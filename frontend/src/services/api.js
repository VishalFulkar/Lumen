import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true
})

export const authAPI = {
    login: (email, password) =>
        api.post("/auth/login", {email, password}),
    register: (email, password, name) =>
        api.post("/auth/register", {email, password, name}),

    logout: () =>
        api.post("/auth/logout"),

    getMe: () =>
        api.get("/auth/me")
}

export const researchAPI = {
    createSession: (topic, depth) =>
        api.post("/research", {topic, depth}),

    getSessions: () =>
        api.get("/research"),

    getSession: (sessionId) =>
        api.get(`/research/${sessionId}`),

    getReport: (sessionId) =>
        api.get(`/research/${sessionId}/report`)
}

export default api;