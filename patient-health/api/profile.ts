import * as repl from "repl";

export const baseURL = 'http://127.0.0.1:8000';

export async function updateUserProfile(token: string, address: string[], phoneNumber: string){
    const response = await fetch(baseURL + `/user/updateUserProfile?token=${token}`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:  JSON.stringify(
            {
                address: address,
                phone_number: phoneNumber
            }
        )
    }
    );
    if(response.ok){
        console.log("success");
        return response.json();
    }
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYzQ4ZTJmOS0wYTRjLTRkZDQtODA2Zi1iMTJkZDM4Y2FkMTUiLCJleHAiOjE3MDQ0MjU3Mzd9.G9IWNPZPdyTU9jCXkpWU2pwVw0wkLLYSQRB_PVbT8ZM"
const acc_name = "doctor_1"

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

getUserByAccountName(acc_name, token)
