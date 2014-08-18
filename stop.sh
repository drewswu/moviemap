#!/bin/bash

PORT=3004

pkill -f "python manage.py runserver ${1-${PORT}}" && echo ">Django process killed" || echo ">No Django process were found"
