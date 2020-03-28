const http = require('http');
const fs = require('fs');
const {
  parse
} = require('querystring')
const hostname = '127.0.0.1';
const port = 8080;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  fs.readFile('./form.html', null, (error, data) => {
    if (error) {
      res.setHeader(404);
      res.write("Not Found")
    } else {
      res.write(data)
    }
    res.end();
  })
  if (req.method === 'POST') {
    collectRequestData(req, result => {
      console.log(result)
    })
  }
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
function collectRequestData(request, callback) {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if (request.headers['content-type'] === FORM_URLENCODED) {
    var body = '';
    request.on('data', (chunk) => {
      body += chunk
      var newBody = parse(body);
      var message = newBody.message;
      fs.appendFile("message.txt", `${message} \n`, (err) => {
        if (err) {
          console.log(err)
        }
        console.log(newBody.message);
      })
      if (body.length > 1e6)
        request.connection.destroy();
    });
  } else {
    callback(null)
  }
}