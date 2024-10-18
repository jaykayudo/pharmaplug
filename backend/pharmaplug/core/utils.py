import random
import uuid


def generated_username_from_email(email: str, use_random=False):
    username = email.split("@")[0]
    if use_random:
        username += str(random.randint(100, 900))
    return username


def check_uuid_validity(obj):
    try:
        uuid_obj = uuid.UUID(obj)
        return True
    except ValueError:
        return False
