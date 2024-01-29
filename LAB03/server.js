const connect = require('connect');
const url = require('url');
const http = require('http');

// connect app
const app = connect();

// defining the calculate function
function calculate(req, res, next) {
  // parsing URL to get query parameters
  const queryParams = url.parse(req.url, true).query;

  // extract method for x and y parameters
  const { method, x, y } = queryParams;

  // convert x and y to number values
  const numX = parseFloat(x);
  const numY = parseFloat(y);

  // checking if x and y are valid numbers
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
  if (isNaN(numX) || isNaN(numY)) {
    res.end('ERROR! Invalid parameters. x and y must be numbers.');
    return;
  }

  // math operations based on the method parameter
  let result;
  let mathSymbol;

  switch (method) {
    case 'add':
      result = numX + numY;
      mathSymbol = '+';
      break;
    case 'subtract':
      result = numX - numY;
      mathSymbol = '-';
      break;
    case 'multiply':
      result = numX * numY;
      mathSymbol = '*';
      break;
    case 'divide':
      // for division by zero
      if (numY === 0) {
        res.end('ERROR... cannot divide by zero.');
        return;
      }
      result = numX / numY;
      mathSymbol = '/';
      break;
    default:
      res.end('ERROR... Invalid method. Valid methods are add, subtract, multiply, and divide.');
      return;
  }

  // displaying the full math operation 
  const output = `${numX} ${mathSymbol} ${numY} = ${result}`;
  res.end(output); // displaying result
}

// using the calculate function for any request to the /lab2 path
app.use('/lab2', calculate);

// creating an http server and starting the server on port 3000
http.createServer(app).listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
