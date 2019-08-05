#!/bin/bash
port="$1"
script="${@:2}"

until lsof -Pi :$port -sTCP:LISTEN -t >/dev/null
    do
        sleep 1
    done

eval ${script}