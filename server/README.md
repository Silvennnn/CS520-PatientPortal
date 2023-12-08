# PatientProtal - Back-end

## Installation

### Installation for server
`python -m pip install -r requirements.txt`

## Run

### Using terminal

Make sure you at the root of the application and run`uvicorn server.main:app --reload --log-config log_config.ini`
(run server applocation required `.env` file in the root)

## Tutorial Link

[API_docs] (http://127.0.0.1:8000/docs)

## Datebase

Make sure that `.env` file is in the root 

## Test
### Run pytest

Make sure you at the root of the application and run `pytest -s server/test/ -W ignore::DeprecationWarning`
(run pytest required `.env` file in the root)


[FastAPI](https://fastapi.tiangolo.com/tutorial/)

[SQLAlchemy orm](https://docs.sqlalchemy.org/en/14/orm/index.html)

FastAPI and SQLAlchemy project generator: [Full Stack FastAPI PostgreSQL](https://github.com/tiangolo/full-stack-fastapi-postgresql).
