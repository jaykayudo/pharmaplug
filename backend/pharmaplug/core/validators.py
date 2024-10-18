from django.core.exceptions import ValidationError


def phone_number_validator(value: str):
    """
    Validator to check whether the provided number is a valid nigerian number.
    """
    if not value.isdigit():
        raise ValidationError("The phone number is not a number")
    if len(value) != 11:
        raise ValidationError("The phone number should be 11 digits")
    phone_start_number = ["081", "080", "090", "091", "070"]
    if value[:3] not in phone_start_number:
        raise ValidationError("Enter a valid nigerian number")
