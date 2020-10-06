#! /bin/bash

echo "Turning LEFT outlet OFF"
curl -sLv -X PUT "http://localhot/leftOutletOff"