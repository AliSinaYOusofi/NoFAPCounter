export default async function handleLogout() {

    try {
        await fetch("/api/logout", { 
            method: "POST",
            credentials: "include"
        });

        window.location.href = "/forward";
    } catch (error) {
        alert("Failed to logout");
    }
}