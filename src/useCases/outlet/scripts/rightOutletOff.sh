#! /bin/bash

echo "Turning RIGHT outlet OFF"
curl -sLv -X PUT "http://localhot/rightOutletOff"