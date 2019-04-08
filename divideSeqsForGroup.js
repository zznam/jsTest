let ROW_NUM = 4;
let seqLengthList = [1,2,3,4,5,6,7,8,9];
let averageForOneRow = 0;
let averageValue = 0;
for (let i = 0; i < seqLengthList.length; i++) {
    const element = seqLengthList[i];
    averageForOneRow += element;
}
var rowList = [];
for (let i = 0; i < ROW_NUM; i++) {
    rowList.push([]);
    
}
averageValue = averageForOneRow / seqLengthList.length;
averageForOneRow /= ROW_NUM;
let averageLen = seqLengthList.length/ ROW_NUM;
console.log(averageForOneRow, averageValue, averageLen);