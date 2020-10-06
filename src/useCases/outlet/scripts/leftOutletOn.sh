#! /bin/bash

echo "Turning LEFT outlet ON"
curl -sLv -X PUT "http://localhot/leftOutletOn"