import { create } from "zustand";

export const useResearchStore = create((set) => ({
    sessionId: null,
    topic: null,
    report: null,
    agentLogs: [],
    sessions: [],

    setSessionId: (id) =>
        set({
            sessionId: id
        }),
    setTopic: (topic) =>
        set({
            topic
        }),
    setReport: (report) =>
        set({
            report
        }),
    addAgentLog: (log) =>
        set((state) => ({
            agentLogs: [...state.agentLogs, log]
        })),
    clearAgentLogs: () =>
        set({
            agentLogs: []
        }),
    setSessions: (sessions) =>
        set({
            sessions
        }),
    resetAll: () =>
        set({
            sessionId: null,
            topic: null,
            report: null,
            agentLogs: []
        })
}))
