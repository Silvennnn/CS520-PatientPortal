
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
