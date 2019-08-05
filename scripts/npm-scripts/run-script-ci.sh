#!/bin/bash

MICROSERVICES=("app" "admin" "pro" "www")
SCRIPTS=("test-ci" "test-e2e-ci")
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"


script="$1"
microservice="${PWD##*/}"


if [[ ! " ${MICROSERVICES[@]} " =~ " ${microservice} " ]]; then
    echo "Unknown microservice \"${microservice}\". Available microservices:"
    printf "%s, " "${MICROSERVICES[@]}" | cut -d "," -f 1-${#MICROSERVICES[@]}
    exit 1
fi

if [[ ! ${script} ]]; then 
    echo "Script argument not provided. Usage: \"./run-script.sh <script>\""
    exit 1
fi

if [[ ! " ${SCRIPTS[@]} " =~ " ${script} " ]]; then
    echo "Unknown microservice \"${script}\". Available microservices:"
    printf "%s, " "${SCRIPTS[@]}" | cut -d "," -f 1-${#SCRIPTS[@]}
    exit 1
fi

eval "${SCRIPTPATH}/scripts/${script}.sh ${microservice} $@"