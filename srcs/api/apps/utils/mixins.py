from django.db.models import Q, Subquery

from apps.users.models import User, Connection


class AllUsersMixins:
    """
    A mixin class that provides utility methods for retrieving unblocked users.
    """

    def get_unblocked_users(
        self, queryset=User.objects.filter(is_active=True), user=None
    ):
        current_user = user
        if not current_user:
            current_user = self.request.user

        blocked_subquery = Connection.objects.filter(
            Q(initiator=current_user, status=Connection.BLOCKED)
            | Q(recipient=current_user, status=Connection.BLOCKED)
        ).values("initiator_id", "recipient_id")

        if queryset is None:
            queryset = User.objects.all()

        # Exclude blocked users and current user
        return queryset.exclude(
            Q(id__in=Subquery(blocked_subquery.values("initiator_id")))
            | Q(id__in=Subquery(blocked_subquery.values("recipient_id")))
        )
