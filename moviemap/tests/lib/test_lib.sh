#!/bin/bash

function error() {
  arg1=${1-'Fail'}
  tput setaf 1
  echo [${arg1}]
  tput sgr 0
}

function pass_print() {
  arg1=${1-'Pass`'}
  tput setaf 2
  echo [${arg1}]
  tput sgr 0
}
