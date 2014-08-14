#!/bin/bash

pkill -f 'python manage.py runserver 3004' && echo ">Django process killed" || echo ">No Django process were found"
