import { useState, useEffect } from 'react';

export function useToken() {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
            }
        } catch (error) {
            console.error("Error retrieving token:", error);
            setToken(null);
        }
    }, []);

    return token;
}
