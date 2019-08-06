#!/bin/bash
port="$1"
script="${@:2}"

until $(curl --output /dev/null --silent --head --fail http://localhost:$port);
    do
        sleep 1
    done

echo "Port $port is open"
echo "Running $script"
eval ${script}