import {removeCookie} from "typescript-cookie";

export const baseURL = 'http://127.0.0.1:8000';



export interface User_Form {
    "account_name": string,
    "password": string,
}


export async function login_call(form) {
    const response = await fetch(baseURL + "/login/access-token/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
    });
    return response
}

export async function logout() {
    removeCookie('access_token')
    removeCookie('account_type')
    window.location.replace('/home')
}
