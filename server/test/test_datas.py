test_patient_1 = {
    "account_name": "test_patient_1",
    "password": "123",
    "account_type": 0,
    "first_name": "patient_1",
    "last_name": "test",
    "middle_name": "",
    "phone_number": "0123456789",
    "date_of_birth": "1993-06-08",
    "gender": "male",
    "address": "home",
}
test_patient_2 = {
    "account_name": "test_patient_2",
    "password": "123",
    "account_type": 0,
    "first_name": "patient_2",
    "last_name": "test",
    "middle_name": "",
    "phone_number": "0123456789",
    "date_of_birth": "1995-06-08",
    "gender": "male",
    "address": "home",
}
test_doctor_1 = {
    "account_name": "test_doctor_1",
    "password": "123",
    "account_type": 1,
    "first_name": "doctor1",
    "last_name": "test",
    "middle_name": "",
    "phone_number": "0123456789",
    "date_of_birth": "1995-06-08",
    "gender": "male",
    "address": "home",
}
test_doctor_2 = {
    "account_name": "test_doctor_2",
    "password": "123",
    "account_type": 1,
    "first_name": "doctor_2",
    "last_name": "test",
    "middle_name": "",
    "phone_number": "0123456789",
    "date_of_birth": "1995-06-08",
    "gender": "male",
    "address": "home",
}
update_test_patient_1 = {
    "address": "work1",
    "phone_number": "789456132",
}
appointment_1_1 = {
    "datetime": "2023-12-07T10:00",
    "location": "UHS",
    "doctor_account_name": "test_doctor_1",
    "patient_account_name": "test_patient_1",
    "message": "Hello",
    "status": 0,
}
appointment_2_2 = {
    "datetime": "2023-12-07T12:00",
    "location": "UHS",
    "doctor_account_name": "test_doctor_2",
    "patient_account_name": "test_patient_2",
    "message": "How are you",
    "status": 0,
}
update_appointment_1_1 = {
    "datetime": "2023-12-07T12:00",
    "location": "home",
    "message": "please come",
}
appointments = [appointment_1_1, appointment_2_2]
test_users = [test_patient_1, test_patient_2, test_doctor_1, test_doctor_2]
