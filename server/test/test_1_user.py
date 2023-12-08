import pytest
from server.test.test_deps import client
from server.test.test_datas import *
from server.test.test_funcs import verify_user_data


def test_create_user_happyCase():
    for user in test_users:
        response = client.post(
            url="/user/createUser/",
            json=user,
        )
        assert response.status_code == 200
        data = response.json()
        user["user_uuid"] = data["user_uuid"]
        verify_user_data(user=user, data=data)


def test_create_user_accountExist():
    response = client.post(
        url="/user/createUser/",
        json=test_patient_1,
    )
    assert response.status_code == 400


def test_create_user_unacceptable_userType():
    test_patient_1["account_type"] = 2
    response = client.post(
        url="/user/createUser/",
        json=test_patient_1,
    )
    test_patient_1["account_type"] = 0
    assert response.status_code == 404


def test_user_login_happyCase():
    for user in test_users:
        cur_login = {"account_name": user["account_name"], "password": user["password"]}
        response = client.post(
            url="/login/access-token/",
            json=cur_login,
        )
        assert response.status_code == 200
        data = response.json()
        user["access_token"] = data["access_token"]
        verify_user_data(user=user, data=data)


def test_user_login_userName_not_found():
    cur_login = {"account_name": "account_name_not_found", "password": "123"}
    response = client.post(
        url="/login/access-token/",
        json=cur_login,
    )
    assert response.status_code == 401


def test_user_login_incorrect_password():
    cur_login = {"account_name": test_patient_1["account_name"], "password": "111"}
    response = client.post(
        url="/login/access-token/",
        json=cur_login,
    )
    assert response.status_code == 401


def test_user_get_me_happyCase():
    for user in test_users:
        cur_token = user["access_token"]
        response = client.get(
            url=f"/user/getMe/?token={cur_token}",
        )
        assert response.status_code == 200
        data = response.json()
        verify_user_data(user=user, data=data)


def test_user_update_happyCase():
    cur_token = test_patient_1["access_token"]
    response = client.post(
        url=f"/user/updateUserProfile/?token={cur_token}", json=update_test_patient_1
    )
    for field in update_test_patient_1:
        test_patient_1[field] = update_test_patient_1[field]
    assert response.status_code == 200
    data = response.json()
    verify_user_data(user=test_patient_1, data=data)
