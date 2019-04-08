sortNumberList = function (numberList) { // [cardId, ..., ]
    numberList.sort(function (a, b) {
        return a - b;
    });
};
var arr = [2, 4, 3, 1, 4, 5];
sortNumberList(arr);
console.log(arr);