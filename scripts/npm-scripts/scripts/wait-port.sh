#!/bin/bash
port="$1"
script="${@:2}"

while ! nc -z localhost $port
    do
        sleep 1
    done

eval ${script}