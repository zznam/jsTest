let arr1 = [1, 2, 4, 0];
let arr2 = [1, 2, [4, 0]];
function getFirstNElements(arr, n){
    if (arr === null){
        return null;
    }
    if (arr === undefined){
        return undefined;
    }
    if (n === undefined || isNaN(n)){
        return arr[0];
    }
    var ret = [];
    for (let i = 0; i < n ; i++){
        ret.push(arr[i]);
    }
    return ret;
}
console.log(getFirstNElements(123, 2));
console.log(getFirstNElements(arr2, 3));
