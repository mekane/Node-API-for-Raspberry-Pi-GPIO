#! /bin/bash

echo "Turning RIGHT outlet ON"
curl -sLv -X PUT "http://localhot/rightOutletOn"