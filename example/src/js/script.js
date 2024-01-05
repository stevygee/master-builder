/**
 * External dependencies
 */
const isUndefined = require('lodash/isUndefined');
const pickBy = require('lodash/pickBy');

const classnames = require('classnames');

/* Math */
let number = Math.min(2,3);
console.log('test: Math', number);

/* ES6 */
var newOne = () => {
  console.log("Hello World..!");
}

/* JSX */
//const element = <h1>Hello, world!</h1>;

/* Test dependencies */
let imaginaryValue = undefined;
console.log( 'test: lodash', isUndefined( imaginaryValue ) );
console.log(
  'test: classnames',
  classnames( {
    'tab-contents': true,
    'align-items-center': ! imaginaryValue,
  } )
);
