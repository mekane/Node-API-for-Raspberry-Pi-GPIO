echo "RGB($1, $2, $3)"
curl -sLv --data-binary \{\"red\":\ $1\,\ \"green\":\ $2\,\ \"blue\":\ $3\} -X PUT -H Content-Type:\ application/json "http://localhost/color"
