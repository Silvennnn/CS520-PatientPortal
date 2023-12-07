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


export async function updateAppointmentByUUID(token, appointment_uuid, date, loc, msg){
    const response = await fetch(baseURL + `/appointment/updateAppointmentByUUID/?token=${token}&appointment_uuid=${appointment_uuid}`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:  JSON.stringify(
            {
                    "datetime" : date,
                    "location": loc,
                    "message": msg,
            }
        )
    }
    );
    if(response.ok){
        console.log("success");
        return response.json();
    }
    else{
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
}

const app_uuid = "b97c572c-e86d-4a50-a205-bf36178d9f1b"

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDdkYTQ1ZS1jMjk2LTQ3NGItYjY2ZC1hNzI1NTZlMGNiMmEiLCJleHAiOjE3MDQ1MDIyOTR9.8SzP1oPbceS-FX_OxgNXRHwlY_nF0CNGxJi0imApeCI"


export async function confirmAppointmentByUUID(token, appointment_uuid){
    const response = await fetch(baseURL + `/appointment/confirmAppointmentByUUID/?token=${token}&appointment_uuid=${appointment_uuid}`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    }
    );
    if(response.ok){
        console.log("success");
        return response.json();
    }
    else{
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
}

export async function cancelAppointmentByUUID(token, appointment_uuid){
    const response = await fetch(baseURL + `/appointment/cancelAppointmentByUUID/?token=${token}&appointment_uuid=${appointment_uuid}`,{
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        },
        }
    );
    if(response.ok){
        console.log("success");
        return response.json();
    }
    else{
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
}

export async function deleteAppointmentByUUID(token, appointment_uuid){
        const response = await fetch(baseURL + `/appointment/deleteAppointmentByUUID/?token=${token}&appointment_uuid=${appointment_uuid}`,{
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
        }
    );
        if(response.status != 200){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

}
