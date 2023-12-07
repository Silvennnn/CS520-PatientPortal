
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

const rec_uuid = "8fb61056-9528-40ee-945e-22290184c842"

const form: Update_form = {
      "symptom": "xasdas",
      "diagnosis": "ysd",
      "Medication": "zasd"
}

updateMedicalRecordByUUID(token, rec_uuid, form)