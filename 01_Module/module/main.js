// module/main.js
function sum(a, b) {
    return a + b;
}

// module.exports = sum; when export only on function////

function sub(a,b){
    return a-b;
}

module.exports = {sum, sub};