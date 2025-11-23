

SESSION_KEY = 'user_info'


class UserInfoSession:
    def __init__(self, request) -> None:
        """
        Initializes the OtpCodeSession with the given request.
        Sets up the session to store user information if it doesn't already exist.
        """
        self.session = request.session
        if not self.session.get('user_info'):
            self.session[SESSION_KEY] = {}


    def set_user_info(self, user_info):
        """
        Stores user information in the session.
        
        Args:
            user_info (dict): User information to store.
        """
        self.session[SESSION_KEY] = user_info
        self.save()

    def update_user_info(self, partial_user_info):
        self.session['user_info'].update(
            partial_user_info
        )
        self.save()


    @property
    def get_user_info(self):
        """
        Return user information stored in the session.
        """
        return self.session[SESSION_KEY]

    def save(self):
        """
        Marks the session as modified to save changes.
        """
        self.session.modified = True

    def clear(self):
        """
        Removes user information from the session.
        """
        del self.session['user_info']
        self.save()