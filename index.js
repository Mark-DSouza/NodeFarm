const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

///////////////////////////////////////////////////////////////////////////
// FILES
// Synchronous, blocking file handling
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avacado: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written synchronously');

// Asynchronous, non-blocking file handling
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('Something went terribly wrong! ');

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written!');
//             })
//         })
//     })
// })

// console.log('Will read file!');

//////////////////////////////////////////////////////////////////////
// WEB SERVER

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

console.log(dataObj.map(el => slugify(el.productName, { lower: true })));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const overviewHtml = tempOverview.replace(/{%PRODUCT-CARD%}/g, cardHtml);
    res.end(overviewHtml);
  }

  // Product page
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const productHtml = replaceTemplate(tempProduct, dataObj[query.id]);
    res.end(productHtml);
    // res.end('This is from the PRODUCT');
  }

  // API page
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }

  // Not Found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      myOwnHeader: 'hello world'
    });
    res.end('<h1>Page not found<h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});