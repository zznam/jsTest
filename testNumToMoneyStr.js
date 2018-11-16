var toMoneyString = function (num) {
    var isNegative = num < 0 ? true : false;
    var formattedNumber = num;
    num = Math.abs(num);
    var hau_to;
    if (num >= 1000000000) {
        hau_to = 'B';
        formattedNumber = (num / 1000000000).toFixed(3);
    } else if (num >= 1000000) {
        hau_to = 'M';
        formattedNumber = (num / 1000000).toFixed(3);
    } else if (num >= 1000) {
        hau_to = 'K';
        formattedNumber = (num / 1000).toFixed(3);
    } else {
        formattedNumber = num.toString();
    }

    formattedNumber = formattedNumber.replace('.000', hau_to).replace('.00', hau_to).replace('.0', hau_to);
    var indexOfDot = formattedNumber.indexOf('.');
    if (indexOfDot > 0) {
        var buff = formattedNumber.substring(indexOfDot + 1);
        if (buff[2] == '0') {
            buff = buff.replace(/0/g, '');
            formattedNumber = formattedNumber.substring(0, indexOfDot + 1) + buff + hau_to;
        } else {
            formattedNumber = formattedNumber.replace('.', hau_to).replace(/00$/, '').replace(/0$/, '');
        }
    }
    if (isNegative) {
        formattedNumber = '-' + formattedNumber;
    }
    return formattedNumber;
};
console.log(toMoneyString(4023000));