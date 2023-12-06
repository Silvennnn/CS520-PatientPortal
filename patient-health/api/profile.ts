import * as repl from "repl";

export const baseURL = 'http://127.0.0.1:8000';

export async function getUserProfileByToken(token: string){
    const response = await fetch(baseURL + `/user/getMe?token=${token}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
    return response
}

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
