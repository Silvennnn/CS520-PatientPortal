import Undici from "undici-types";
import fetch = Undici.fetch;

export async function registerUser(user){
    response = await fetch('/user/createUser/', {
        method: 'POST',
        headers: {

        }
    })
}