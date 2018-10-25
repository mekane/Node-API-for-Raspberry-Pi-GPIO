function isEmptyObject(obj) {
  const isEmpty = Object.keys(obj).length === 0;
  return isEmpty;
}

function accessLogger(req, res, next) {
  const date = new Date().toDateString();
  const path = req.path;
  const body = isEmptyObject(req.body) ? '' : req.body;
  console.log(`${date} ${req.method} ${path}`, body);
  next();
}

module.exports = accessLogger;
