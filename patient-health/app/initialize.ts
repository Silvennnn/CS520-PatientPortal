import { getCookie, setCookie } from 'typescript-cookie'
export default function app_init() {
    if (getCookie('access_token') === undefined) {
        console.log("Not login yet, redirect to home page")
        window.location.replace('/home')
    }
}
