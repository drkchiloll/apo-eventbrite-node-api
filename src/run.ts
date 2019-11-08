// server.js

// BASE SETUP
// ============================================================================
import * as express from 'express';
import * as http from 'http';
import * as debug from 'debug';
import { app } from './routes';
import { properties } from './services';

let server = http.createServer(app);
/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || '8012');
app.set('port', port);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(app.get('port'), () => {
  console.log('Server listening on port ' + app.get('port'));
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val:any) {
  let port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}
