/**
 * @file
 * Defines conjuree API.
 */

'use strict'

// Load dependencies.
const net = require('net');
const cluster = require('cluster');
const os = require('os');

/**
 * Defines a library that helps create machines that can be conjured.
 *
 * @class
 * @classDesc library that helps create machines that  can be conjured.
 */
class Conjuree {

  /**
   * Scaffolds class properties.
   * @param {Number} port at which this service should be available.
   * @param {Function} method function that should be called on conjure.
   */
  constructor(method, port) {
    this.setPort(port || 1337);
    this.setMethod(method || () => { });
    this.maxWorkers = os.cpus().length || 1;
    this.workers = [];
  }

  /**
   * Starts a clustered TCP server and gets ready to be conjured.
   * @param {Number} port at which this service should be available.
   */
  listen(port) {
    // Set up cluster of listeners.
    if (cluster.isMaster) {
      for (let i = 0; i < this.maxWorkers; i++) {
        this.spawnWorker();
      }

      // If a worker dies, respawn.
      cluster.on('exit', (worker, code) => {
        if (code === 0) {
          return;
        }
        if (this.workers[worker.process.pid]) {
          this.workers[worker.process.pid] = null;
          delete this.workers[worker.process.pid];
          this.spawnWorker();
        }
      })

      return;
    }

    // If port is specified, override.
    this.setPort(port || this.port);

    // Create a server and listen on specified port.
    net.createServer((socket) => {
      // On data, call specified method and pass in data.
      socket
      .on('data', (data) => {
        socket.write(this.method(data));
      })
      .on('error', (error) => {
        this.method(false, error);
      })
    })
    .listen(this.port)
  }

  /**
   * Spawns a worker.
   */
  spawnWorker() {
    let worker = cluster.fork({ type: 'webWorker' });
    this.workers[worker.process.pid] = worker;
    return worker;
  }

  /**
   * Sets the method that should be called on conjure.
   * @param {Function} method function that should be called on conjure.
   */
  setMethod(method) {
    if (typeof method !== 'function') {
      throw new Error('Method must be a function.');
    }

    this.method = method;
  }

  /**
   * Sets the method that should be called on conjure.
   * @param {Number} port at which this service should be available.
   */
  setPort(port) {
    if (typeof port !== 'number') {
      throw new Error('Port must be a number.');
    }

    this.port = port;
  }
}

module.exports = Conjuree;
