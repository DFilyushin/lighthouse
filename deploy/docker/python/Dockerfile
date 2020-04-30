FROM python:3.6
MAINTAINER dmitiry.filyushin@ya.ru

COPY ./backend/api /lighthouse


WORKDIR /lighthouse

RUN pip install -r requirements

EXPOSE 8000

CMD ["gunicorn", "api.wsgi", "-b 0.0.0.0:8000"]
