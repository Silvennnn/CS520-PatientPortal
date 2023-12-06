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
  "address": string[],
}


export interface User_Form {
    "account_name": string,
    "password": string,
}

export interface Record{
      "symptom": string,
      "diagnosis": string,
      "Medication": [
        "string"
      ],
      "date_of_visit": "2023-12-06T03:28:23.220Z",
      "doctor_account_name": "string",
      "patient_account_name": "string"
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

// export async function login(form: User_Form){
//     const response = await fetch(baseURL + "/login/access-token",{
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body:  JSON.stringify(form)
//     }
//     );
//     if(response.ok){
//         const dt = response.json();
//         return dt
//     }
// }

export async function login_call(form) {
    const response = await fetch(baseURL + "/login/access-token/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
    });
    return response
}
