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


