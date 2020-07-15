from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.conf import settings
import string
import random


class Command(BaseCommand):

    help = 'Create super admin user with cli'
    pass_size = 12
    pass_chars = string.ascii_uppercase + string.digits + string.ascii_lowercase

    def generate_pass(self):
        return ''.join(random.choice(self.pass_chars) for _ in range(self.pass_size))

    def handle(self, *args, **options):
        if User.objects.count() == 0:
            if not settings.ADMINS:
                print('Nothing admins in settings.py')
            for user in settings.ADMINS:
                username = user[0].replace(' ', '')
                email = user[1]
                password = self.generate_pass()
                print('Creating account for %s with pass: %s' % (username, password))
                admin = User.objects.create_superuser(email=email, username=username, password=password)
                admin.is_active = True
                admin.is_admin = True
                admin.save()
        else:
            print('Admin accounts can only be initialized if no Accounts exist')
