export const usernameValidator = (username) => {
    const regex = /^[a-zA-Z0-9-_ ]+$/;
    return regex.test(username);
}