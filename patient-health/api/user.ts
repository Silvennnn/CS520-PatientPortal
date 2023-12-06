import * as repl from "repl";

export const baseURL = 'http://127.0.0.1:8000';

export async function getUserByAccountName(account_name, token){
     const response = await fetch(baseURL + `/user/getUserByAccountName/?account_name=${account_name}&token=${token}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
     if(!response.ok){
         throw new Error(`HTTP error! Status: ${response.status}`);
     }
    else{
        const data = await response.json();
        return data;
     }

}

export async function getUserByUUID(id, token){
     const response = await fetch(baseURL + `/user/getUserByUUID/?user_uuid=${id}&token=${token}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
     if(!response.ok){
         throw new Error(`HTTP error! Status: ${response.status}`);
     }
    else{
        const data = await response.json();
        return data;
     }

}


const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYzQ4ZTJmOS0wYTRjLTRkZDQtODA2Zi1iMTJkZDM4Y2FkMTUiLCJleHAiOjE3MDQ0MjU3Mzd9.G9IWNPZPdyTU9jCXkpWU2pwVw0wkLLYSQRB_PVbT8ZM"
const id = "ec48e2f9-0a4c-4dd4-806f-b12dd38cad15"


getUserByUUID(id, token)