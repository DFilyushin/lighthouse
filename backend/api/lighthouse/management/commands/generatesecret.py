from django.core.management.base import BaseCommand
from django.conf import settings
import random


class Command(BaseCommand):

    help = 'Generate new secret key'
    pass_size = 50
    pass_chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)'

    def generate_pass(self):
        return ''.join(random.choice(self.pass_chars) for _ in range(self.pass_size))

    def handle(self, *args, **options):
        if settings.SECRET_KEY == 'EMPTY':
            settings.SECRET_KEY = self.generate_pass()
            print('Secret generate ok')
        else:
            print('Secret key exists!')
