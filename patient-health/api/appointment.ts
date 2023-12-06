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

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYzQ4ZTJmOS0wYTRjLTRkZDQtODA2Zi1iMTJkZDM4Y2FkMTUiLCJleHAiOjE3MDQ0MjU3Mzd9.G9IWNPZPdyTU9jCXkpWU2pwVw0wkLLYSQRB_PVbT8ZM"

createAppointment(token, appoint);