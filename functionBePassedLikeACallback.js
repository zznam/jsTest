function action(callback, x, y) {
    var result = callback(x, y);
    console.log(result);
}

function add(x, y) {
    return x + y;
}

function multiply(x, y) {
    return x * y;
}
action(add, 2, 3); // => 5
action(multiply, 2, 3); // => 6