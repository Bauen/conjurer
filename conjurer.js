/**
 * @file
 * Main package file for conjurer.
 */

'use strict'

const Conjuree = require('./lib/conjuree');

// Test implementation.
let machine = new Conjuree();
machine.setName('Testing');
machine.setPort(1337);
machine.setMethod(() => {
  return 'hiiiii';
});

machine.listen();

// Export conjurer and conjuree libraries.
module.exports = {
  Conjurer: require('./lib/conjurer'),
  Conjuree: require('./lib/conjuree'),
}

