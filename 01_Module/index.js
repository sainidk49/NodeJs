// const sum = require("./module/main");
// console.log("Sum is :: ", sum(4, 5)); //// availabel only one function


// const fn = require("./module/main");
// console.log("Sum is :: ", fn.sum(4, 5));
// console.log("Sub is :: ", fn.sub(4, 5));


const { sum, sub } = require("./module/main");
console.log("Sum is :: ", sum(4, 5));
console.log("Sub is :: ", sub(4, 5));

