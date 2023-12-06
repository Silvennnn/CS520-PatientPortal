
import axios from "axios";

//
//
//

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
    const response = await axios.post(baseURL + "/user/createUser/",
       user
    , {
        headers: {
            "Content-Type": "application/json"
        }
        }
    );
    if(response.status === 200){
        console.log("success");
    } else {
        console.error("error");
    }
}

export async function login(form: Form){
    const response = await axios.post(baseURL + "/login/access-token",
        new URLSearchParams(form as any).toString()
    , {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        }
    );
    if(response){
        const dt = response.data
        return dt
    }
}

//Test
const form : Form = {
    'username': "test112",
    'password': "123",
}

login(form)
