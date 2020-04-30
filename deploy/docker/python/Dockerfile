FROM python:3.6
MAINTAINER dfilyushin@localhost

COPY ../../../backend/api /lighthouse

WORKDIR /lighthouse

RUN pip install -r requirements

EXPOSE 8000

CMD ["gunicorn", "lighthouse.wsgi", "-b 0.0.0.0:8000"]
