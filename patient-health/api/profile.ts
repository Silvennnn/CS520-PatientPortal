import * as repl from "repl";

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
  "address": string,
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



export async function getUserProfileByToken(token: string){
    const response = await fetch(baseURL + `/user/getMe?token=${token}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
    const json_response = await response.json()
    return json_response
}

export async function updateUserProfile(token: string, address: string, phoneNumber: string){
    const response = await fetch(baseURL + `/user/updateUserProfile/?token=${token}`,{
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
        return response.json();
    } else{
        console.log("User Profile Update Error!")
    }
}

export async function getUserByAccountName(account_name, token){
     const response = await fetch(baseURL + `/user/getUserByAccountName/?account_name=${account_name}&token=${token}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
     if(response.ok){
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

export async function getMe(token){
     const response = await fetch(baseURL + `/user/getMe/?token=${token}`,{
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
