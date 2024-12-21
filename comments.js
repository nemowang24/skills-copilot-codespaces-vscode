// Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const comments = [];
const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  if (pathname === '/') {
    fs.readFile(path.resolve(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error!');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (pathname === '/comments') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(comments));
    } else if (req.method === 'POST') {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        const comment = JSON.parse(data);
        comment.time = new Date();
        comments.push(comment);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(comment));
      });
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page Not Found!');
  }
});

server.listen(3000, () => {
  console.log('Server is running at http://
