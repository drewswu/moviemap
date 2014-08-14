#!/bin/bash

echo ">Running Tests..."
cd tests
for test in $(ls *.sh)
  do ./${test}
done
