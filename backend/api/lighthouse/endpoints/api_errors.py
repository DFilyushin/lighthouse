from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.views import exception_handler

API_ERROR_POST_TURNOVER = 'Ошибка сервера. Не удалось сохранить данные складской операции.'
API_ERROR_CARD_IS_CLOSE = 'Производственная карта выполнена, изменения невозможны'
API_ERROR_SAVE_DATA = 'Ошибка при сохранении данных: {}'
API_ERROR_CARD_NOT_IN_WORK = 'Производственная карта не в работе!'
API_ERROR_CARD_NO_SET_FINISH_PROCESS = 'Не указана дата окончания производственного процесса'
API_ERROR_CARD_TEAM_ERROR = 'Некорректное состояние смен (не все смены закрыты у сотрудников)'
API_ERROR_CARD_INCORRECT_STATUS = 'Некорретный статус для смены!'
API_ERROR_CARD_INCORRECT_TARE = 'Объём расфасованной продукции не соответствует выпуску.'
API_ERROR_CONTRACT_INCORRECT_STATUS = 'Указан некорректный статус!'
API_ERROR_CONTRACT_NO_PAYMENT = 'Оплата не соответствует стоимости контракта!'
API_ERROR_CONTRACT_IS_CLOSE = 'Контракт исполнен, изменения невозможны'


class AppError(Exception):

    def __init__(self, expression, message):
        self.expression = expression
        self.message = message

    def __str__(self):
        return self.message


def api_error_response(error_message):
    error = {
        "message": error_message
    }
    return Response(status=status.HTTP_400_BAD_REQUEST, data=error)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if isinstance(exc, IntegrityError):
        response = Response(
            data={
                'message': "Повторяющееся значение",
                'detail': exc.args[0]
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    if isinstance(exc, ValidationError):
        response = Response(
            data={
                'message': 'Ошибка введённых данных',
                'detail': exc.args[0]
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    # Now add the HTTP status code to the response.
    if response is not None and response.status_code == 404:
        response.data = {
            "message": "Instance not found.",
            "error": "HTTP_404_NOT_FOUND",
        }

    return response
