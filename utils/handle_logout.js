export default async function handleLogout(setLoggingout) {

    setLoggingout(true)
    try {
        await fetch("/api/logout", { 
            method: "POST",
            credentials: "include"
        });

        window.location.href = "/forward";
    } catch (error) {
        alert("Failed to logout");
    } finally {
        setLoggingout(false)
    }
}