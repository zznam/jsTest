function original() {
console.log("I am Original");
}
var copy = original;
original();                  // => I am Original
copy();                      // => I am Original
var original = function() {      // Modify the original code
    console.log("I am Altered");
};
original();                  // => I am Altered
copy();                      // => I am Original