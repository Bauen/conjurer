/**
 * @file
 * Defines conjuree API.
 */

'use strict'

// Load dependencies.
const net = require('net');

/**
 * Defines a library that helps create machines that can be conjured.
 *
 * @class
 * @classDesc library that helps create machines that  can be conjured.
 */
class Conjuree {

  /**
   * Scaffolds class properties.
   * @param {String} name machine name of this conjuree.
   * @param {Number} port at which this service should be available.
   * @param {Function} method function that should be called on conjure.
   */
  constructor(name, port, method) {
    this.setName(name || 'conjuree');
    this.setPort(port || 1337);
    this.setMethod(method || () => { });
  }

  /**
   * Starts TCP server and gets ready to be conjured.
   * @param {Number} port at which this service should be available.
   */
  listen(port) {
    // If port is specified, override.
    this.setPort(port || this.port);

    let server = net.createServer((socket) => {
      socket.write(this.method());
      socket.pipe(socket);
    });

    server.listen(this.port);
  }

  /**
   * Sets the machine name of this machine.
   * @param {String} name machine name of this conjuree.
   */
  setName(name) {
    if (typeof name !== 'string') {
      throw new Error('Name must be a string.');
    }

    this.name = name;
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
