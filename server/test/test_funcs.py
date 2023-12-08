def verify_user_data(user, data):
    for key in user:
        if key in data:
            assert user[key] == data[key]


def verify_item_data(item, data):
    for key in item:
        if key in data:
            if "date" not in key:
                assert item[key] == data[key]
            else:
                assert item[key] == data[key][:-3]
