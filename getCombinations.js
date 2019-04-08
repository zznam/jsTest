var Utility = {};
Utility.calculateFactorial = function (n) {
    let ret = 1;
    if (!isNaN(n)) {
        for (let index = 2; index <= n; index++) {
            ret *= index;
        }
    }
    return ret;
};
