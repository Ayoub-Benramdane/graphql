import { handleLogin } from "./login.js"
import { handleProfile } from "./profile.js"

document.addEventListener('DOMContentLoaded', () => {
    const jwt = localStorage.getItem('JWT')
    if (jwt) {
        handleProfile()
    } else {
        handleLogin()
    }
})