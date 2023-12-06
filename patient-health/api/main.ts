import axios from "axios";


const api = axios.create({
    baseURL: 'http://localhost:8000',
});

export default api;

interface User {
  "account_name": string,
  "password": string,
  "account_type": number,
  "first_name": string,
  "last_name": string,
  "middle_name": string,
  "phone_number_number": string,
  "date_of_birth": string,
  "gender": string,
  "address": string[]
}

export async function registerUser(user: User){
    const response = await fetch('/user/createUser/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    };
}