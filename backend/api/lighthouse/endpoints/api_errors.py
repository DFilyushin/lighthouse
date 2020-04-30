from rest_framework import status
from rest_framework.response import Response

API_ERROR_POST_TURNOVER = 'Ошибка сервера. Не удалось сохранить данные складской операции.'
API_ERROR_CARD_IS_CLOSE = 'Производстенная карта выполнена, изменения невозможны'
API_ERROR_SAVE_DATA = 'Ошибка при сохранении данных: {}'
API_ERROR_CARD_NOT_IN_WORK = 'Производственная карта не в работе!'
API_ERROR_CARD_NO_SET_FINISH_PROCESS = 'Не указана дата окончания производственного процесса'
API_ERROR_CARD_TEAM_ERROR = 'Некорректное состояние смен (не все смены закрыты у сотрудников)'
API_ERROR_CARD_INCORRECT_STATUS = 'Некорретный статус для смены!'
API_ERROR_CARD_INCORRECT_TARE = 'Некорректно указана фасовка продукции. Расфасовано больше, чем выпущено.'


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