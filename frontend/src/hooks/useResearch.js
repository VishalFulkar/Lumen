import { useState, useEffect, useCallback, useRef } from "react";
import { researchAPI } from "../services/api";
import { useSocket } from "./useSocket";
import { useResearchStore } from "../store/researchStore";

export const useResearch = (sessionId) => {
    const [session, setSession] = useState(null);
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isConnected } = useSocket(sessionId);
    const { clearAgentLogs } = useResearchStore();
    const intervalRef = useRef(null);

    // Clear logs when starting new research
    useEffect(() => {
        if (sessionId) {
            clearAgentLogs();
            setIsLoading(true);
            setError(null);
            setSession(null);
            setReport(null);
        }
    }, [sessionId, clearAgentLogs]);

    // Fetch single session
    const fetchSession = useCallback(async () => {
        if (!sessionId) return null;

        try {
            const { data } = await researchAPI.getSession(sessionId);
            setSession(data.session);
            setError(null);
            return data.session;
        } catch (err) {
            console.error("Failed to fetch session:", err);
            setError(err.response?.data?.message || "Failed to fetch session");
            setIsLoading(false);
            return null;
        }
    }, [sessionId]);

    // Fetch report
    const fetchReport = useCallback(async () => {
        if (!sessionId) return;

        try {
            const { data } = await researchAPI.getReport(sessionId);
            setReport(data.report);
            setIsLoading(false);
        } catch (err) {
            console.error("Failed to fetch report:", err);
            setError(err.response?.data?.message || "Failed to fetch report");
            setIsLoading(false);
        }
    }, [sessionId]);

    // Poll logic
    useEffect(() => {
        if (!sessionId) return;

        const poll = async () => {
            const fetchedSession = await fetchSession();

            if (fetchedSession?.status === "completed") {
                await fetchReport();
                // Stop polling by clearing interval
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                return;
            }

            if (fetchedSession?.status === "failed") {
                setIsLoading(false);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        };

        // Poll immediately
        poll();

        // Then poll every 2 seconds
        intervalRef.current = setInterval(poll, 2000);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [sessionId, fetchSession, fetchReport]);

    return {
        session,
        report,
        isLoading,
        error,
        isConnected,
        refetch: fetchSession,
    };
};