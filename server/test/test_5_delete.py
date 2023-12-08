from server.test.test_datas import *
from server.test.test_deps import client


def test_delete_appointments():
    for appointment in appointments:
        cur_token = None
        cur_appointment_uuid = appointment["appointment_uuid"]
        if appointment["patient_account_name"] == "test_patient_1":
            cur_token = test_patient_1["access_token"]
        else:
            cur_token = test_patient_2["access_token"]
        response = client.delete(
            url=f"/appointment/deleteAppointmentByUUID/?token={cur_token}&appointment_uuid={cur_appointment_uuid}",
        )
        assert response.status_code == 200


def test_delete_user():
    for user in test_users:
        delete_uuid = user["user_uuid"]
        response = client.delete(
            url=f"/user/deleteUserByUUID/?user_uuid={delete_uuid}",
        )
        assert response.status_code == 200
