import * as repl from "repl";


export const baseURL = 'http://127.0.0.1:8000';

export interface Appointment {
      "datetime": string,
      "location": string[],
      "doctor_account_name": string,
      "patient_account_name": string,
      "message": string,
      "status": number
}

export async function createAppointment(token, appointment){
    const response = await fetch(baseURL + `/appointment/createAppointment/?token=${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(appointment)
    });
    if(response.ok){
        console.log("success");
        return response.json();
    } else {
        console.error("error");
    }
}

const appoint: Appointment = {
    "datetime": "2023-12-06T22:50:01.665Z",
      "location": [],
      "doctor_account_name": "doctor_1",
      "patient_account_name": "patient_1",
      "message": "string",
      "status": 0
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYzQ4ZTJmOS0wYTRjLTRkZDQtODA2Zi1iMTJkZDM4Y2FkMTUiLCJleHAiOjE3MDQ0ODk2MTB9.twoGwsKhlTMisHWDR1zjOr8hCsOuraLjUexAm6n_168"
const acc_name = "doctor_1"


export async function getAppointmentByAccountName(account_name, token){
     const response = await fetch(baseURL + `/appointment/getAppointmentByAccountName/?token=${token}&account_name=${account_name}`,{
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

export async function getAppointmentByToken(token){
     const response = await fetch(baseURL + `/appointment/getAppointmentByToken/?token=${token}`,{
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
        console.log(data);
        return data;
     }

}


