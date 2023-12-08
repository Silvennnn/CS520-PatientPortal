from server.test.test_deps import client
from server.test.test_datas import *
from server.test.test_funcs import verify_item_data


def test_create_medical_record_happyCase():
    for medical_record in medical_records:
        cur_token = None
        if medical_record["patient_account_name"] == "test_patient_1":
            cur_token = test_patient_1["access_token"]
        else:
            cur_token = test_patient_2["access_token"]
        response = client.post(
            url=f"/medicalRecord/createMedicalRecord/?token={cur_token}",
            json=medical_record,
        )
        assert response.status_code == 200
        data = response.json()
        medical_record["medical_record_uuid"] = data["medical_record_uuid"]
        verify_item_data(item=medical_record, data=data)


def test_get_medical_record_by_token_happy_case():
    patient_1_token = test_patient_1["access_token"]
    response = client.get(
        url=f"/medicalRecord/getMedicalRecordByToken/?token={patient_1_token}",
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    data = data[0]
    verify_item_data(item=medical_record_1_1, data=data)


def test_get_medical_record_by_account_name_happyCase():
    doctor_token = test_doctor_1["access_token"]
    patient_account_name = test_patient_1["account_name"]
    response = client.get(
        url=f"/medicalRecord/getMedicalRecordByAccountName/?token={doctor_token}&account_name={patient_account_name}",
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    data = data[0]
    verify_item_data(item=medical_record_1_1, data=data)


def test_get_medical_record_by_account_name_patient_look_for_patient():
    patient_token = test_patient_1["access_token"]
    patient_account_name = test_patient_2["account_name"]
    response = client.get(
        url=f"/medicalRecord/getMedicalRecordByAccountName/?token={patient_token}&account_name={patient_account_name}",
    )
    assert response.status_code == 401


def test_get_medicalRecord_by_account_name_doctor_look_for_unrelated_patient():
    doctor_token = test_doctor_2["access_token"]
    patient_account_name = test_patient_1["account_name"]
    response = client.get(
        url=f"/medicalRecord/getMedicalRecordByAccountName/?token={doctor_token}&account_name={patient_account_name}",
    )
    assert response.status_code == 401


def test_update_medical_record_by_uuid_patient_HappyCase():
    update_medical_record_uuid = medical_record_1_1["medical_record_uuid"]
    patient_token = test_patient_1["access_token"]
    response = client.post(
        url=f"/medicalRecord/updateMedicalRecordByUUID/?token={patient_token}&medical_record_uuid={update_medical_record_uuid}",
        json=update_medical_record_1_1,
    )
    for field in update_medical_record_1_1:
        medical_record_1_1[field] = update_medical_record_1_1[field]
    assert response.status_code == 200
    data = response.json()
    verify_item_data(item=medical_record_1_1, data=data)
