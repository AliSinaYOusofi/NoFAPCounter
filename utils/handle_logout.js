export default function handleLogout() {
    try {
        localStorage.removeItem('token')
        window.location.href = '/forward'
        return true
    } catch (error) {
        alert('Failed to logout')
        return false
    }
}