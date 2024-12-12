from rest_framework.exceptions import APIException


class IncorrectCredentials(APIException):
    status_code = 400
    default_code = "incorrect_credentials"
    default_detail = "Incorrect Credentials"


class ProductNotInStock(APIException):
    status_code = 400
    default_code = "product_not_in_stock"
    default_detail = "Product not in stock"


class InvalidToken(APIException):
    status_code = 400
    default_code = "invalid_token"
    default_detail = "Invalid Token"


class InvalidSession(APIException):
    status_code = 403
    default_code = "invalid_session"
    default_detail = "Invalid Session"


class DoctorNotAvailable(APIException):
    status_code = 400
    default_code = "doctor_not_available"
    default_detail = "Doctor not available at the specified period"
