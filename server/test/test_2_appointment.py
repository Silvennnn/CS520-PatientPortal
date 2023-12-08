from server.test.test_deps import client
from server.test.test_datas import *
from server.test.test_funcs import verify_item_data


def test_create_appointment_happyCase():
    for appointment in appointments:
        cur_token = None
        if appointment["patient_account_name"] == "test_patient_1":
            cur_token = test_patient_1["access_token"]
        else:
            cur_token = test_patient_2["access_token"]
        response = client.post(
            url=f"/appointment/createAppointment/?token={cur_token}",
            json=appointment,
        )
        assert response.status_code == 200
        data = response.json()
        appointment["appointment_uuid"] = data["appointment_uuid"]
        verify_item_data(item=appointment, data=data)


def test_get_appointment_by_token_happy_case():
    patient_1_token = test_patient_1["access_token"]
    response = client.get(
        url=f"/appointment/getAppointmentByToken/?token={patient_1_token}",
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    data = data[0]
    verify_item_data(item=appointment_1_1, data=data)


def test_get_appointment_by_account_name_happyCase():
    doctor_token = test_doctor_1["access_token"]
    patient_account_name = test_patient_1["account_name"]
    response = client.get(
        url=f"/appointment/getAppointmentByAccountName/?token={doctor_token}&account_name={patient_account_name}",
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    data = data[0]
    verify_item_data(item=appointment_1_1, data=data)


def test_get_appointment_by_account_name_patient_look_for_patient():
    patient_token = test_patient_1["access_token"]
    patient_account_name = test_patient_2["account_name"]
    response = client.get(
        url=f"/appointment/getAppointmentByAccountName/?token={patient_token}&account_name={patient_account_name}",
    )
    assert response.status_code == 401


def test_get_appointment_by_account_name_doctor_look_for_unrelated_patient():
    doctor_token = test_doctor_2["access_token"]
    patient_account_name = test_patient_1["account_name"]
    response = client.get(
        url=f"/appointment/getAppointmentByAccountName/?token={doctor_token}&account_name={patient_account_name}",
    )
    assert response.status_code == 401


def test_update_appointment_by_uuid_patient_HappyCase():
    update_appointment_uuid = appointment_1_1["appointment_uuid"]
    patient_token = test_patient_1["access_token"]
    response = client.post(
        url=f"/appointment/updateAppointmentByUUID/?token={patient_token}&appointment_uuid={update_appointment_uuid}",
        json=update_appointment_1_1,
    )
    for field in update_appointment_1_1:
        if field != "location":
            appointment_1_1[field] = update_appointment_1_1[field]
    assert response.status_code == 200
    data = response.json()
    verify_item_data(item=appointment_1_1, data=data)


def test_update_appointment_by_uuid_other_patient():
    update_appointment_uuid = appointment_1_1["appointment_uuid"]
    patient_token = test_patient_2["access_token"]
    response = client.post(
        url=f"/appointment/updateAppointmentByUUID/?token={patient_token}&appointment_uuid={update_appointment_uuid}",
        json=update_appointment_1_1,
    )
    assert response.status_code == 401


def test_update_appointment_by_uuid_other_doctor():
    update_appointment_uuid = appointment_1_1["appointment_uuid"]
    doctor_token = test_doctor_2["access_token"]
    response = client.post(
        url=f"/appointment/updateAppointmentByUUID/?token={doctor_token}&appointment_uuid={update_appointment_uuid}",
        json=update_appointment_1_1,
    )
    assert response.status_code == 401


def test_complete_appointment_HappyCase():
    doctor_token = test_doctor_2["access_token"]
    appointment_uuid = appointment_2_2["appointment_uuid"]
    response = client.post(
        url=f"/appointment/completeAppointmentByUUID/?token={doctor_token}&appointment_uuid={appointment_uuid}",
    )
    appointment_2_2["status"] = 1
    assert response.status_code == 200
    data = response.json()
    verify_item_data(item=appointment_2_2, data=data)


def test_complete_appointment_to_a_complete_appointment():
    doctor_token = test_doctor_2["access_token"]
    appointment_uuid = appointment_2_2["appointment_uuid"]
    response = client.post(
        url=f"/appointment/completeAppointmentByUUID/?token={doctor_token}&appointment_uuid={appointment_uuid}",
    )
    assert response.status_code == 401


def test_complete_appointment_complete_others_appointment():
    doctor_token = test_doctor_1["access_token"]
    appointment_uuid = appointment_2_2["appointment_uuid"]
    response = client.post(
        url=f"/appointment/completeAppointmentByUUID/?token={doctor_token}&appointment_uuid={appointment_uuid}",
    )
    assert response.status_code == 401


def test_cancel_appointment_HappyCase():
    doctor_token = test_doctor_1["access_token"]
    appointment_uuid = appointment_1_1["appointment_uuid"]
    response = client.post(
        url=f"/appointment/cancelAppointmentByUUID/?token={doctor_token}&appointment_uuid={appointment_uuid}",
    )
    appointment_1_1["status"] = -1
    assert response.status_code == 200
    data = response.json()
    verify_item_data(item=appointment_1_1, data=data)


def test_cancel_appointment_to_a_cancelled_appointment():
    doctor_token = test_doctor_1["access_token"]
    appointment_uuid = appointment_1_1["appointment_uuid"]
    response = client.post(
        url=f"/appointment/cancelAppointmentByUUID/?token={doctor_token}&appointment_uuid={appointment_uuid}",
    )
    assert response.status_code == 401


def test_cancel_appointment_cancel_other_appointment():
    doctor_token = test_doctor_2["access_token"]
    appointment_uuid = appointment_1_1["appointment_uuid"]
    response = client.post(
        url=f"/appointment/cancelAppointmentByUUID/?token={doctor_token}&appointment_uuid={appointment_uuid}",
    )
    assert response.status_code == 401
