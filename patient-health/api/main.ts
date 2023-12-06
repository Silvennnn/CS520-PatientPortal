export const baseURL = 'http://127.0.0.1:8000';

export interface User {
  "account_name": string,
  "password": string,
  "account_type": number,
  "first_name": string,
  "last_name": string,
  "middle_name": string,
  "phone_number": string,
  "date_of_birth": string,
  "gender": string,
  "address": string[],
}


export interface Form{
    "username": string,
    "password": string,
}

export async function registerUser(user: User){
    const response = await fetch(baseURL + "/user/createUser/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
        });
    if(response.ok){
        console.log("success");
        return response.json();
    } else {
        console.error("error");
    }
}

export async function login(form: Form){
    const response = await fetch(baseURL + "/login/access-token",{
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:  new URLSearchParams(form as any).toString()
    }
    );
    if(response.ok){
        const dt = response.json();
        return dt
    }
}

//Test
const form : Form = {
    'username': "test112",
    'password': "123",
}

login(form)
