#!/bin/sh

PORT=$1 
until nc -vz localhost $PORT >/dev/null 2>&1
do
	sleep 1
done
