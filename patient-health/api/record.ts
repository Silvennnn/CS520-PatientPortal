
export const baseURL = 'http://127.0.0.1:8000';
export interface Record{
      "symptom": string,
      "diagnosis": string,
      "Medication": string,
      "date_of_visit": string,
      "doctor_account_name": string,
      "patient_account_name": string
}


export interface Update_form{
      "symptom": string,
      "diagnosis": string,
      "Medication": string
}


export async function createMedicalRecord(token, record){
    const response = await fetch(baseURL + `/medicalRecord/createMedicalRecord/?token=${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(record)
    });
    if(response.ok){
        console.log("success");
        return response.json();
    } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
}

const rec: Record = {
      "symptom": "a",
      "diagnosis": "b",
      "Medication": "c",
      "date_of_visit": "2023-12-16T03:28:23.220Z",
      "doctor_account_name": "doctor_5",
      "patient_account_name": "patient_1"
}
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MTE0ZTU0Ny1kMzdjLTQzNWQtYmIwNC1mZWRmODI2MTkzMGIiLCJleHAiOjE3MDQ1MDYzNzZ9.9-o2S0oCr3QRjRcwjST2DQI5d-mHrVzhjmh6P-KLuvk"


export async function updateMedicalRecordByUUID(token, record_uuid, update_form){
    const response = await fetch(baseURL + `/medicalRecord/updateMedicalRecordByUUID/?token=${token}&medical_record_uuid=${record_uuid}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(update_form)
    });
    if(response.ok){
        console.log("success");
        return response.json();
    } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
}


const form: Update_form = {
      "symptom": "xasdas",
      "diagnosis": "ysd",
      "Medication": "zasd"
}

export async function getMedicalByAccountName(token, account_name){
     const response = await fetch(baseURL + `/medicalRecord/getMedicalRecordByAccountName/?token=${token}&account_name=${account_name}`,{
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

const token_pat = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDdkYTQ1ZS1jMjk2LTQ3NGItYjY2ZC1hNzI1NTZlMGNiMmEiLCJleHAiOjE3MDQ1MDIyOTR9.8SzP1oPbceS-FX_OxgNXRHwlY_nF0CNGxJi0imApeCI"


export async function getMedicalByToken(token){
     const response = await fetch(baseURL + `/medicalRecord/getMedicalRecordByToken/?token=${token}`,{
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

export async function deleteMedicalRecordByUUID(token, record_uuid){
        const response = await fetch(baseURL + `/medicalRecord/deleteMedicalRecordByUUID/?token=${token}&medical_record_uuid=${record_uuid}`,{
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

const rec_uuid = "7d86ffaa-4d9f-4452-9bdb-05293eb1c4c0"
deleteMedicalRecordByUUID(token, rec_uuid)