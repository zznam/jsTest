function original() {
    // ...
}
original.message = "Hello";
var copy = original;
console.log(original.message);         // => Hello
console.log(copy.message);             // => Hello
copy.message = "Greetings";
console.log(original.message);         // => Greetings
console.log(copy.message);             // => Greetings