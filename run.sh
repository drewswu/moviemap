#!/bin/bash

PORT=3004

echo ">Starting Server..."
python manage.py runserver ${1-${PORT}}
