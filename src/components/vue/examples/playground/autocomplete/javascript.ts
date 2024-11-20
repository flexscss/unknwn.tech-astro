export default [
  { label: 'const', type: 'keyword', info: 'Declare a constant variable' },
  { label: 'let', type: 'keyword', info: 'Declare a block-scoped variable' },
  { label: 'var', type: 'keyword', info: 'Declare a variable' },
  { label: 'function', type: 'keyword', info: 'Declare a function' },
  { label: 'return', type: 'keyword', info: 'Return a value from a function' },
  { label: 'if', type: 'keyword', info: 'Conditional statement' },
  { label: 'else', type: 'keyword', info: 'Else conditional' },
  { label: 'for', type: 'keyword', info: 'For loop' },
  { label: 'while', type: 'keyword', info: 'While loop' },
  { label: 'do', type: 'keyword', info: 'Do-while loop' },
  { label: 'switch', type: 'keyword', info: 'Switch statement' },
  { label: 'case', type: 'keyword', info: 'Case in switch statement' },
  { label: 'break', type: 'keyword', info: 'Break out of a loop or switch' },
  { label: 'continue', type: 'keyword', info: 'Continue to the next iteration of a loop' },
  { label: 'class', type: 'keyword', info: 'Define a class' },
  { label: 'extends', type: 'keyword', info: 'Extend a class' },
  { label: 'super', type: 'keyword', info: 'Call the constructor of a parent class' },
  { label: 'import', type: 'keyword', info: 'Import a module' },
  { label: 'export', type: 'keyword', info: 'Export a module' },
  { label: 'default', type: 'keyword', info: 'Default export' },
  { label: 'async', type: 'keyword', info: 'Define an async function' },
  { label: 'await', type: 'keyword', info: 'Wait for a promise' },
  { label: 'try', type: 'keyword', info: 'Start a try block' },
  { label: 'catch', type: 'keyword', info: 'Catch an error' },
  { label: 'finally', type: 'keyword', info: 'Execute code after try/catch' },
  { label: 'throw', type: 'keyword', info: 'Throw an error' },
  { label: 'new', type: 'keyword', info: 'Create a new instance of an object' },
  { label: 'this', type: 'keyword', info: 'Reference the current object' },
  { label: 'typeof', type: 'keyword', info: 'Get the type of a variable' },
  { label: 'instanceof', type: 'keyword', info: 'Check if an object is an instance of a class' },
  { label: 'in', type: 'keyword', info: 'Check if a property exists in an object' },
  { label: 'with', type: 'keyword', info: 'Extend the scope chain for a statement' },
  { label: 'debugger', type: 'keyword', info: 'Invoke the debugger' },
  { label: 'console.log', type: 'function', info: 'Log to console' },
  { label: 'console.error', type: 'function', info: 'Log error to console' },
  { label: 'console.warn', type: 'function', info: 'Log warning to console' },
  { label: 'console.info', type: 'function', info: 'Log informational message' },
  { label: 'console.table', type: 'function', info: 'Display tabular data' },
  { label: 'console.group', type: 'function', info: 'Group console messages' },
  { label: 'console.groupEnd', type: 'function', info: 'End a console group' },
  { label: 'map', type: 'method', info: 'Create a new array with results' },
  { label: 'filter', type: 'method', info: 'Filter array elements' },
  { label: 'reduce', type: 'method', info: 'Reduce array to single value' },
  { label: 'forEach', type: 'method', info: 'Execute function for each element' },
  { label: 'push', type: 'method', info: 'Add one or more elements to the end of an array' },
  { label: 'pop', type: 'method', info: 'Remove the last element from an array' },
  { label: 'shift', type: 'method', info: 'Remove the first element from an array' },
  { label: 'unshift', type: 'method', info: 'Add one or more elements to the beginning of an array' },
  { label: 'slice', type: 'method', info: 'Return a shallow copy of a portion of an array' },
  { label: 'splice', type: 'method', info: 'Change the contents of an array' },
  { label: 'find', type: 'method', info: 'Return the first element that satisfies a testing function' },
  { label: 'some', type: 'method', info: 'Test whether at least one element in the array passes the test' },
  { label: 'every', type: 'method', info: 'Test whether all elements in the array pass the test' },
  { label: 'includes', type: 'method', info: 'Determine whether an array includes a certain value' },
  { label: 'indexOf', type: 'method', info: 'Return the first index at which a given element can be found' },
  { label: 'lastIndexOf', type: 'method', info: 'Return the last index at which a given element can be found' },
  { label: 'join', type: 'method', info: 'Join all elements of an array into a string' },
  { label: 'concat', type: 'method', info: 'Merge two or more arrays' },
  { label: 'sort', type: 'method', info: 'Sort the elements of an array' },
  { label: 'reverse', type: 'method', info: 'Reverse the elements of an array' },
  { label: 'Object.keys', type: 'function', info: 'Return an array of a given object\'s own enumerable property names' },
  { label: 'Object.values', type: 'function', info: 'Return an array of a given object\'s own enumerable property values' },
  { label: 'Object.entries', type: 'function', info: 'Return an array of a given object\'s own enumerable string-keyed property [key, value] pairs' },
  { label: 'Object.assign', type: 'function', info: 'Copy the values of all enumerable own properties from one or more source objects to a target object' },
  { label: 'Object.freeze', type: 'function', info: 'Freeze an object' },
  { label: 'Object.seal', type: 'function', info: 'Seal an object' },
  { label: 'Object.create', type: 'function', info: 'Create a new object with the specified prototype object and properties' },
  { label: 'Promise.all', type: 'function', info: 'Return a promise that resolves when all of the promises in the iterable have resolved' },
  { label: 'Promise.race', type: 'function', info: 'Return a promise that resolves or rejects as soon as one of the promises in the iterable resolves or rejects' },
  { label: 'Promise.resolve', type: 'function', info: 'Return a Promise object that is resolved with a given value' },
  { label: 'Promise.reject', type: 'function', info: 'Return a Promise object that is rejected with a given reason' },
  { label: 'test', type: 'method', info: 'Test for a match in a string' },
  { label: 'exec', type: 'method', info: 'Execute a search for a match in a string' },
  { label: 'Math.random', type: 'function', info: 'Return a pseudo-random number between 0 and 1' },
  { label: 'Math.floor', type: 'function', info: 'Return the largest integer less than or equal to a given number' },
  { label: 'Math.ceil', type: 'function', info: 'Return the smallest integer greater than or equal to a given number' },
  { label: 'Math.round', type: 'function', info: 'Return the value of a number rounded to the nearest integer' },
  { label: 'Math.max', type: 'function', info: 'Return the largest of zero or more numbers' },
  { label: 'Math.min', type: 'function', info: 'Return the smallest of zero or more numbers' },
  { label: 'Math.abs', type: 'function', info: 'Return the absolute value of a number' },
  { label: 'Math.sqrt', type: 'function', info: 'Return the square root of a number' },
  { label: 'Math.pow', type: 'function', info: 'Return the base to the exponent power' },
  { label: 'JSON.stringify', type: 'function', info: 'Convert a JavaScript object or value to a JSON string' },
  { label: 'JSON.parse', type: 'function', info: 'Parse a JSON string, constructing the JavaScript value or object described by the string' },
  { label: 'document', type: 'object', info: 'Get the document object' },
  { label: 'window', type: 'object', info: 'Get the window object' },
  { label: 'addEventListener', type: 'method', info: 'Add an event listener to an element' },
  { label: 'removeEventListener', type: 'method', info: 'Remove an event listener from an element' },
  { label: 'DOMContentLoaded', type: 'event', info: 'Event that fires when the initial HTML document has been completely loaded and parsed' },
  { label: 'getElementById', type: 'method', info: 'Get an element by its ID' },
  { label: 'querySelector', type: 'method', info: 'Get the first element that matches a CSS selector' },
  { label: 'querySelectorAll', type: 'method', info: 'Get all elements that match a CSS selector' },
  { label: 'createElement', type: 'method', info: 'Create a new element' },
  { label: 'appendChild', type: 'method', info: 'Add a new child node to an element' },
  { label: 'removeChild', type: 'method', info: 'Remove a child node from an element' },
  { label: 'innerHTML', type: 'property', info: 'Get or set the HTML content of an element' }
]