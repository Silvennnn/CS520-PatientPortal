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
const address: string[] = []
const phone_number = "4131234567"

updateUserProfile(token, address, phone_number)