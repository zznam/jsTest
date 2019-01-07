var isPrime = function (number) {     // determines if number is prime
    var divisor = parseInt(number/2, 10);
    var prime = true;
    while(divisor > 1) {
        if (number % divisor === 0) {
            prime = false;
            divisor = 0;
        } else {
            divisor -= 1;
        }
    }
    return prime === true;
};
function negate(f) {
    return function (i) {
        return !f(i);
    };
}
var isComposite = negate(isPrime); // function object
console.log([2, 4].every(isComposite));  // => false (2 is prime, 4 is not)
console.log([4, 6].every(isComposite));  // => true (4 or 6 are composite)