var CardUtil = {};

CardUtil.CARD_SCALE_IN_TABLE = 0.5;
CardUtil.CARD_SCALE_IN_MY_HAND = 1;
CardUtil.STOCK_SCALE_IN_TABLE = 0.5;
CardUtil.POT_SCALE = 0.5;

CardUtil.NUM_OUR_DECK = 52;

CardUtil.CARD_NAME = "card_";
CardUtil.CARD_WIDTH = 102;
CardUtil.CARD_HEIGHT = 142;


CardUtil.ID_FACED_DOWN = -1;


CardUtil.ON_MY_HAND = 0;
CardUtil.ON_OTHER_HAND = 1;
CardUtil.ON_DEALER_HAND = 2;

// 0 runToMyHand, 1 runToOtherHand, 2 runToDiscardPile, 3 runToSeq;
CardUtil.RUN_TO_MY_HAND = 0;
CardUtil.RUN_TO_OTHER_HAND = 1;
CardUtil.RUN_TO_DEALER_HAND = 2;
CardUtil.UPDATE_POSITION = 3;

CardUtil.NULL = 0;
CardUtil.EXIST = 1;

// hand types
CardUtil.NORMAL = 0;
CardUtil.ANY_NINE = 1;
CardUtil.NATURAL_NINE = 2;
CardUtil.LUCKY_NINE = 3;

//bet x times 
CardUtil.BET_1 = 1;
CardUtil.BET_2 = 2;
CardUtil.BET_3 = 5;
CardUtil.BET_4 = 10;
CardUtil.BET_5 = 100;

// lucky nine bet
CardUtil.BET_SUITED_3_3_3 = 200;
CardUtil.BET_SUITED_2_3_4 = 100;
CardUtil.BET_ANY_3_3_3 = 50;
CardUtil.BET_ANY_2_3_4 = 40;
CardUtil.BET_SUITED_TOTAL_9 = 30;
CardUtil.BET_ANY_TOTAL_9 = 5;

CardUtil.BET_TIE = 7;

calculateValueAndType = function (cardIdList) {
    let value = 0;
    let kind = CardUtil.NORMAL;
    for (let i = 0; i < cardIdList.length; i++) {
        let element = cardIdList[i];
        let rank = getRankById(element);
        if (rank < 10) {
            value += rank;
        }
    }
    value = value % 10;
    if (value === 9) {
        let numOfNines = 0;
        let numOfFaces = 0;
        let len = cardIdList.length;
        for (let i = 0; i < len; i++) {
            let element = cardIdList[i];
            let rank = getRankById(element);
            if (rank === 9) {
                numOfNines++;
            }
            if (rank > 9) {
                numOfFaces++;
            }
        }
        switch (numOfNines) {
            case 0:
                if (len === 2 && numOfFaces === 0) {
                    kind = CardUtil.LUCKY_NINE;
                }
                break;
            case 1:
                if (numOfFaces + numOfNines === len) {
                    kind = CardUtil.NATURAL_NINE;
                }
                break;

            default:
                break;
        }
    }
    return {
        value: value,
        kind: kind
    };
};
calculateLuckyNineBetWin = function (cardIdList) {
    let value = 0;
    let times = 0;
    let len = cardIdList.length;
    for (let i = 0; i < cardIdList.length; i++) {
        let element = cardIdList[i];
        let rank = getRankById(element);
        if (rank < 10) {
            value += rank;
        }
    }
    value = value % 10;
    if (value !== 9) return 0;
    let suit0 = getSuitById(cardIdList[0]);
    let suit1 = getSuitById(cardIdList[1]);
    let suit2 = getSuitById(cardIdList[2]);
    switch (len) {
        case 3:
            sortNumberList(cardIdList);
            let rank0 = getRankById(cardIdList[0]);
            
            let suited = (suit0 === suit1 && suit1 === suit2);
            console.log("suit0 suit1 suit2" ,suit0 ,suit1 ,suit2);
            switch (rank0) {
                case 2:
                    if (getRankById(cardIdList[1]) === 3) {
                        times = suited ? CardUtil.BET_SUITED_2_3_4 : CardUtil.BET_ANY_2_3_4;
                    } else {
                        times = suited ? CardUtil.BET_SUITED_TOTAL_9 : CardUtil.BET_ANY_TOTAL_9;
                    }
                    break;
                case 3:
                    times = suited ? CardUtil.BET_SUITED_3_3_3 : CardUtil.BET_ANY_3_3_3;
                    break;

                default:
                times = (suit1 === suit0) ? CardUtil.BET_SUITED_TOTAL_9 : CardUtil.BET_ANY_TOTAL_9;
                    break;
            }
            break;
        case 2:
            times = (suit1 === suit0) ? CardUtil.BET_SUITED_TOTAL_9 : CardUtil.BET_ANY_TOTAL_9;
            break;
        default:
            break;
    }
    return times;
};
sortNumberList = function (numberList) { // [cardId, ..., ]
    numberList.sort(function (a, b) {
        return a - b;
    });
};
getRankById = function (cardId) {
    if (cardId < 0 || cardId > CardUtil.NUM_OUR_DECK - 1) return -1;
    return Math.floor(cardId / 4) + 1;
};

getSuitById = function (cardId) {
    if (cardId < 0 || cardId > CardUtil.NUM_OUR_DECK - 1) return -1;
    return cardId % 4;
};

// let arr = [32, 51]; console.log(arr,JSON.stringify(calculateValueAndType(arr)));
// let arr1 = [32, 51]; console.log(arr1,JSON.stringify(calculateLuckyNineBetWin(arr1)));
// let arr12 = [32, 48]; console.log(arr12,JSON.stringify(calculateLuckyNineBetWin(arr12)));
// let arr123 = [4, 12, 8]; console.log(arr123,JSON.stringify(calculateLuckyNineBetWin(arr123)));
// let arr123w = [4, 12, 9]; console.log(arr123w,JSON.stringify(calculateLuckyNineBetWin(arr123w))); //40
// let arr1234 = [8, 8, 8]; console.log(arr1234,JSON.stringify(calculateLuckyNineBetWin(arr1234))); //100
// let drf = [10, 8, 9]; console.log(drf,JSON.stringify(calculateLuckyNineBetWin(drf))); // 50
// let dr2f = [1, 2, 25]; console.log(dr2f,JSON.stringify(calculateLuckyNineBetWin(dr2f))); //5
// let dr2f = [1, 5, 21]; console.log(dr2f,JSON.stringify(calculateLuckyNineBetWin(dr2f))); //5
