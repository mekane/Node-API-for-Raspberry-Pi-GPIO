echo "Set pin $1 to $2"
curl -sLv --data-binary \{\"state\":\ $2\} -X PUT -H Content-Type:\ application/json "http://localhost/pin/$1"
