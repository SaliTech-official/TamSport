from rest_framework import permissions


class IsAuthor(permissions.BasePermission):
    """
    Custom permission to only allow authors to create/edit articles.
    """
    message = "You must be an authenticated author to perform this action."
    

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return request.user.is_author
        return False



class IsOwnAuthor(permissions.BasePermission):
    """
    Custom permission to only allow authors to update/delete their own articles.
    """
    message = "You must be the author of this article to perform this action."


    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user
    

class IsSuperUser(permissions.BasePermission):
    """
    Allows access only to superusers.
    """

    def has_permission(self, request, view):
        return (request.user and request.user.is_superuser)


class IsAuthorAndSuperuser(permissions.BasePermission):
    """
    Custom permission to only allow authors to create/edit articles.
    """
    message = "You must be an authenticated author to perform this action."
    

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return request.user.is_author and request.user.is_author
        return False


class IsNotAuthenticated(permissions.BasePermission):
    """
    Allows access only to non-authenticated users.
    """

    def has_permission(self, request, view):
        return not request.user or not request.user.is_authenticated
