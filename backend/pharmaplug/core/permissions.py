from rest_framework.permissions import BasePermission


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_active
            and request.user.is_authenticated
            and request.user.is_doctor
        )
