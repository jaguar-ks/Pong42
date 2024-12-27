from apps.users.models import User
from apps.users.models import Connection as con

for i in range(20):
    User.objects.create_user(username=f'user{i}', password='123', email=f'user{i}@gmail.com').save()

user = User.objects.get(username='user0')

for i in range(1,20):
    con.objects.create(initiator=user, recipient=User.objects.get(username=f'user{i}'), status=con.FRIENDS).save()