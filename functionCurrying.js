function name(first, last) {
    if (typeof last === 'undefined') {
        return function (last) { // curry function, creates a closure
            return first + " " + last;
        };
    }
    return first + " " + last;
}
console.log(name("Joni", "Mitchell")); // => Joni Mitchell
var partialName = name("Joni");
console.log(partialName("Mitchell")); // => Joni Mitchell
console.log(partialName("McNamara")); // => Joni McNamara