var CardUtil = {};

CardUtil.CARD_SCALE_IN_TABLE = 0.5;

CardUtil.NUM_STANDARD_DECK = 52;
CardUtil.NUM_OUR_DECK = 54;

CardUtil.CARD_NAME = "card_";


CardUtil.CARD_WIDTH = 97;
CardUtil.CARD_HEIGHT = 131;

CardUtil.ACE_RANK = 1;
CardUtil.DEUCE_RANK = 2;
CardUtil.JOKER_RANK = 14;

CardUtil.SEQUENCE_INVALID = 0;
CardUtil.SEQUENCE_NORMAL = 1;
CardUtil.SEQUENCE_DIRTY_CANASTA = 2;
CardUtil.SEQUENCE_CLEAN_CANASTA = 3;
CardUtil.SEQUENCE_FIVE_HUNDRED_CANASTA = 4;
CardUtil.SEQUENCE_ROYAL_CANASTA = 5;

CardUtil.POINTS_FIVE = 5;
CardUtil.POINTS_DEUCE = 10;
CardUtil.POINTS_TEN = 10;
CardUtil.POINTS_ACE = 15;
CardUtil.POINTS_JOKER = 20;

CardUtil.TYPE_BLUE_CARD = 0;
CardUtil.TYPE_RED_CARD = 1;

CardUtil.JOKER_BLACK = 0;
CardUtil.JOKER_RED = 1;

CardUtil.ON_HAND = 0;
CardUtil.ON_DISCARD_PILE = 1;
CardUtil.ON_A_SEQ = 2;
CardUtil.ON_STOCK = 3;


CardUtil.NULL = 0;
CardUtil.EXIST = 1;
CardUtil.ACE_AT_END_SEQ_RANK = 14;
//TODO: reset when start new match...........
CardUtil.curListDrewFromDiscardPile = [];
CardUtil.mySeqIdList = [];
CardUtil.opponentSeqIdList = [];
CardUtil.sequencesCount = 0;
CardUtil.FULL_SEQUENCES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

CardUtil.FULL_SEQUENCES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

sortNumberList = function (cardIdList) { // [cardId, ..., ]
    cardIdList.sort(function (a, b) {
        return a - b;
    });
};
getRankById = function (cardId) {
    if (cardId >= CardUtil.NUM_OUR_DECK) cardId -= CardUtil.NUM_OUR_DECK;
    if (cardId != 0) {
        if (cardId % (CardUtil.NUM_OUR_DECK - 2) == 0 || cardId % (CardUtil.NUM_OUR_DECK - 1) == 0)
            return CardUtil.JOKER_RANK;
    }
    return Math.floor(cardId / 4) + 1;
};
getColorById = function (cardId) {
    if (cardId >= CardUtil.NUM_OUR_DECK) return CardUtil.TYPE_RED_CARD;
    return CardUtil.TYPE_BLUE_CARD;
};
getSuitById = function (cardId) {
    if (cardId >= CardUtil.NUM_OUR_DECK) cardId -= CardUtil.NUM_OUR_DECK;
    if (cardId != 0) {
        if (cardId % (CardUtil.NUM_OUR_DECK - 2) == 0) return 0; //joker black
        if (cardId % (CardUtil.NUM_OUR_DECK - 1) == 0) return 1; //joker red
    }
    return cardId % 4;
};
findFirstExistFlag = function (flagList) {
    for (i = 0; i < flagList.length; i++) {
        if (flagList[i] != CardUtil.NULL) {
            return i;
        }
    }
};
findLastExistFlag = function (flagList) {
    for (i = flagList.length - 1; i >= 0; i--) {
        if (flagList[i] != CardUtil.NULL) {
            return i;
        }
    }
};
checkFlagListForSeq = function (flagList, rankList, suitList, currSuit, numOfDeuces, numOfJokers) {
    var beginFlag, endFlag;
    var valid = true;
    var ret = CardUtil.SEQUENCE_INVALID;
    var isWildcardUsed = false;
    beginFlag = findFirstExistFlag(flagList);
    endFlag = findLastExistFlag(flagList);
    for (i = beginFlag; i <= endFlag; i++) {
        //find is there any space, and fill, if more than two spaces -> invalid
        if (flagList[i] == CardUtil.NULL) {
            if (i == CardUtil.DEUCE_RANK - 1) {
                var found = false;
                //find if we can use deuce as normal card.
                for (k = 0; k < rankList.length; k++) {
                    if (rankList[k] > CardUtil.DEUCE_RANK) break;
                    if (rankList[k] == CardUtil.DEUCE_RANK &&
                        suitList[k] == currSuit &&
                        numOfDeuces > 0) {
                        flagList[CardUtil.DEUCE_RANK - 1] = 1;
                        numOfDeuces--;
                        found = true;
                        break;
                    }
                }
                if (found) continue; // skip find wildcard to use.
            }
            if (!isWildcardUsed) {
                if (numOfDeuces > 0 || numOfJokers > 0) {
                    flagList[i] = CardUtil.EXIST;
                    isWildcardUsed = true;
                }
            } else {
                valid = false;
                break;
            }
        }
    }
    if (valid) {
        // console.log("checkKindOfCanasta", length, isWildcardUsed, beginFlag, endFlag);
        if (rankList.length < 7) return CardUtil.SEQUENCE_NORMAL;
        if (isWildcardUsed) return CardUtil.SEQUENCE_DIRTY_CANASTA;
        //from 2 to ace
        if (beginFlag == 1 && endFlag == 13) return CardUtil.SEQUENCE_FIVE_HUNDRED_CANASTA;
        // from ace to ace
        if (beginFlag == 0 && endFlag == 13) return CardUtil.SEQUENCE_ROYAL_CANASTA;
        return CardUtil.SEQUENCE_CLEAN_CANASTA;
    }
    return ret;
};
checkSequenceState = function (cardIdList) { //cardIdList
    var ret = CardUtil.SEQUENCE_INVALID;
    if (cardIdList.length < 3) return ret;
    var i;
    var numOfAces = 0;
    var numOfJokers = 0;
    var numOfDeuces = 0;
    var rankList = [];
    var currSuit = null;
    var suitList = [];
    var newCardIdList = [];
    for (var m = 0; m < cardIdList.length; m++) {
        var element = cardIdList[m];
        if (element >= CardUtil.NUM_OUR_DECK) {
            element -= CardUtil.NUM_OUR_DECK;
        }
        newCardIdList.push(element);
    }
    sortNumberList(newCardIdList);
    for (i = 0; i < newCardIdList.length; i++) {
        var rank = getRankById(newCardIdList[i]);
        var suit = getSuitById(newCardIdList[i]);
        rankList.push(rank);
        suitList.push(suit);
    }
    //find suit of first normal card.
    for (i = 0; i < suitList.length; i++) {
        if (rankList[i] != CardUtil.DEUCE_RANK && rankList[i] != CardUtil.JOKER_RANK) {
            currSuit = suitList[i];
            break;
        }
    }
    //all normal cards must have a same suit.
    for (i = 0; i < suitList.length; i++) {
        if (rankList[i] != CardUtil.DEUCE_RANK &&
            rankList[i] != CardUtil.JOKER_RANK) {
            if (currSuit != suitList[i]) {
                return ret;
            }
        }
    }

    //check cards in same rank, only accept two deuces, two aces and one jokers.
    for (i = 0; i < rankList.length; i++) {
        switch (rankList[i]) {
            case CardUtil.ACE_RANK:
                numOfAces++;
                break;
            case CardUtil.JOKER_RANK:
                numOfJokers++;
                break;
            case CardUtil.DEUCE_RANK:
                numOfDeuces++;
                break;
            default:
                //don't accept two normal cards in a sam rank
                if (i < (rankList.length - 1)) {
                    if (rankList[i] === rankList[i + 1]) return ret;
                }
                break;
        }
    }
    if (numOfDeuces > 2) return ret;
    if (numOfJokers > 1) return ret;
    if (numOfAces > 2) return ret;
    if (numOfJokers + numOfDeuces > 2) return ret;


    //fill all normal cards in flagList, if flagList is 0-1-1-1-1-0-0... => valid sequences
    var flagList = [];
    for (i = 0; i < CardUtil.JOKER_RANK; i++) {
        flagList.push(CardUtil.NULL);
    }
    var curRank = 0;

    if (numOfDeuces == 2) {
        //if we have two deuces, find a deuce to can use as a normal card
        var isFind = false;
        for (var j = 0; j < rankList.length; j++) {
            if (rankList[j] > CardUtil.DEUCE_RANK) break;
            if (rankList[j] == CardUtil.DEUCE_RANK && suitList[j] == currSuit) {
                flagList[CardUtil.DEUCE_RANK - 1] = CardUtil.EXIST;
                isFind = true;
                numOfDeuces--;
                break;
            }
        }
        if (!isFind) return ret;
    }
    if (numOfDeuces + numOfJokers == 2) {
        //if we have one joker and one deuce, find a deuce to can use as a normal card
        var isFind = false;
        for (var j = 0; j < rankList.length; j++) {
            if (rankList[j] > CardUtil.DEUCE_RANK) break;
            if (rankList[j] == CardUtil.DEUCE_RANK && suitList[j] == currSuit) {
                flagList[CardUtil.DEUCE_RANK - 1] = CardUtil.EXIST;
                isFind = true;
                numOfDeuces--;
                break;
            }
        }
        if (!isFind) return ret;
    }
    //find rank exist as normal card in list.
    for (i = 0; i < flagList.length; i++) {
        curRank++;
        if (curRank == CardUtil.DEUCE_RANK || curRank == CardUtil.JOKER_RANK || curRank == CardUtil.ACE_RANK) continue;
        if (rankList.indexOf(curRank) >= 0) {
            flagList[i] = CardUtil.EXIST;
        }
    }
    //if we have two aces add it in the begin and the end of flag list
    if (numOfAces == 2) {
        flagList[0] = 1;
        flagList[13] = 1;
    }
    //divide into two cases: 
    // ace at the beginning of the sequence
    // ace at the ending of the sequence
    var flagList1 = [];
    var flagList2 = [];
    if (numOfAces == 1) {
        for (i = 0; i < CardUtil.ACE_AT_END_SEQ_RANK; i++) {
            var flag = flagList[i];
            flagList1.push(flag);
            flagList2.push(flag);
        }
        flagList1[0] = 1;
        flagList2[CardUtil.ACE_AT_END_SEQ_RANK - 1] = 1;
    }
    var kind;
    if (flagList2.length > 0) {
        kind = checkFlagListForSeq(flagList2, rankList, suitList, currSuit, numOfDeuces, numOfJokers);
        if (kind != CardUtil.SEQUENCE_INVALID) {
            return kind;
        }
    }
    if (flagList1.length > 0) {
        kind = checkFlagListForSeq(flagList1, rankList, suitList, currSuit, numOfDeuces, numOfJokers);
        return kind;
    }
    kind = checkFlagListForSeq(flagList, rankList, suitList, currSuit, numOfDeuces, numOfJokers);

    return kind;
};
checkIsStraight = function (cardIdList) { //cardIdList
    var ret = false;
    var i;
    var numOfAces = 0;
    var numOfJokers = 0;
    var numOfDeuces = 0;
    var rankList = [];
    var currSuit = null;
    var suitList = [];
    var newCardIdList = [];
    for (var m = 0; m < cardIdList.length; m++) {
        var element = cardIdList[m];
        if (element >= CardUtil.NUM_OUR_DECK) {
            element -= CardUtil.NUM_OUR_DECK;
        }
        newCardIdList.push(element);
    }
    sortNumberList(newCardIdList);
    for (i = 0; i < newCardIdList.length; i++) {
        var rank = getRankById(newCardIdList[i]);
        var suit = getSuitById(newCardIdList[i]);
        rankList.push(rank);
        suitList.push(suit);
    }

    //find suit of first normal card.
    for (i = 0; i < suitList.length; i++) {
        if (rankList[i] != CardUtil.DEUCE_RANK && rankList[i] != CardUtil.JOKER_RANK) {
            currSuit = suitList[i];
            break;
        }
    }
    //all normal cards must have a same suit.
    for (i = 0; i < suitList.length; i++) {
        if (suitList[i] != currSuit) {
            return ret;
        }
    }
    //check cards in same rank, only accept two deuces, two aces and one jokers.
    for (i = 0; i < rankList.length; i++) {
        switch (rankList[i]) {
            case CardUtil.ACE_RANK:
                numOfAces++;
                break;
            case CardUtil.JOKER_RANK:
                numOfJokers++;
                break;
            case CardUtil.DEUCE_RANK:
                numOfDeuces++;
                break;
            default:
                //don't accept two normal cards in a sam rank
                if (i < (rankList.length - 1)) {
                    if (rankList[i] === rankList[i + 1]) return ret;
                }
                break;
        }
    }
    if (numOfDeuces > 1) return ret;
    if (numOfJokers > 1) return ret;
    if (numOfAces > 2) return ret;
    if (numOfJokers + numOfDeuces > 2) return ret;

    //fill all normal cards in flagList, if flagList is 0-1-1-1-1-0-0... => valid sequences
    var flagList = [];
    for (i = 0; i < CardUtil.JOKER_RANK; i++) {
        flagList.push(CardUtil.NULL);
    }
    var curRank = 0;
    var isFind, j;
    if (numOfDeuces == 2) {
        //if we have two deuces, find a deuce to can use as a normal card
        isFind = false;
        for (j = 0; j < rankList.length; j++) {
            if (rankList[j] > CardUtil.DEUCE_RANK) break;
            if (rankList[j] == CardUtil.DEUCE_RANK && suitList[j] == currSuit) {
                flagList[CardUtil.DEUCE_RANK - 1] = CardUtil.EXIST;
                isFind = true;
                numOfDeuces--;
                break;
            }
        }
        if (!isFind) return ret;
    }
    if ((numOfDeuces + numOfJokers) == 2) {
        //if we have two deuces, find a deuce to can use as a normal card
        isFind = false;
        for (j = 0; j < rankList.length; j++) {
            if (rankList[j] > CardUtil.DEUCE_RANK) break;
            if (rankList[j] == CardUtil.DEUCE_RANK && suitList[j] == currSuit) {
                flagList[CardUtil.DEUCE_RANK - 1] = CardUtil.EXIST;
                isFind = true;
                numOfDeuces--;
                break;
            }
        }
        if (!isFind) return ret;
    }
    //find rank exist as normal card in list.
    for (i = 0; i < flagList.length; i++) {
        curRank++;
        if (curRank == CardUtil.DEUCE_RANK || curRank == CardUtil.JOKER_RANK || curRank == CardUtil.ACE_RANK) continue;
        if (rankList.indexOf(curRank) >= 0) {
            flagList[i] = CardUtil.EXIST;
        }
    }
    //if we have two aces add it in the begin and the end of flag list
    if (numOfAces == 2) {
        flagList[0] = 1;
        flagList[13] = 1;
    }
    //divide into two cases: 
    // ace at the beginning of the sequence
    // ace at the ending of the sequence
    var flagList1 = [];
    var flagList2 = [];
    if (numOfAces == 1) {
        for (i = 0; i < CardUtil.ACE_AT_END_SEQ_RANK; i++) {
            var flag = flagList[i];
            flagList1.push(flag);
            flagList2.push(flag);
        }
        flagList1[0] = 1;
        flagList2[CardUtil.ACE_AT_END_SEQ_RANK - 1] = 1;
    }
    var valid;
    if (flagList2.length > 0) {
        valid = checkFlagListStraight(flagList2, rankList, suitList, currSuit, numOfDeuces, numOfJokers);
        if (valid) return valid;
    }
    if (flagList1.length > 0) {
        valid = checkFlagListStraight(flagList1, rankList, suitList, currSuit, numOfDeuces, numOfJokers);
        return valid;
    }
    valid = checkFlagListStraight(flagList, rankList, suitList, currSuit, numOfDeuces, numOfJokers);
    return valid;
};

checkFlagListStraight = function (flagList, rankList, suitList, currSuit, numOfDeuces, numOfJokers) {
    var beginFlag, endFlag;
    var valid = true;
    var isWildcardUsed = false;
    beginFlag = findFirstExistFlag(flagList);
    endFlag = findLastExistFlag(flagList);
    for (i = beginFlag; i <= endFlag; i++) {
        //find is there any space, and fill, if more than two spaces -> invalid
        if (flagList[i] == CardUtil.NULL) {
            if (i == CardUtil.DEUCE_RANK - 1) {
                var found = false;
                //find if we can use deuce as normal card.
                for (k = 0; k < rankList.length; k++) {
                    if (rankList[k] > CardUtil.DEUCE_RANK) break;
                    if (rankList[k] == CardUtil.DEUCE_RANK &&
                        suitList[k] == currSuit &&
                        numOfDeuces > 0) {
                        flagList[CardUtil.DEUCE_RANK - 1] = 1;
                        numOfDeuces--;
                        found = true;
                        break;
                    }
                }
                if (found) continue;
            }
            if (!isWildcardUsed) {
                if (numOfDeuces > 0 || numOfJokers > 0) {
                    flagList[i] = CardUtil.EXIST;
                    isWildcardUsed = true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
    return valid;

};

class CardObj {
    /* 
    0..51 blue deck 
    52 black joker blue
    53 red joker blue
    54-> 105 red deck 
    106 black joker red
    107 red joker red
     */
    // rank: 0, //1..13, 14 (JOKER)
    // suit: 0, //0..3 
    // //bích < rô < cơ < nhép
    // //clubs < diamonds < hearts < spades
    // color: 0, // 0 blue 1 red
    // // points: 5,
    // weight:0, // for order job;
    constructor(cardId) {
        this.cardId = cardId;
        this.rank = getRankById(cardId);
        this.suit = getSuitById(cardId);
        this.color = getColorById(cardId);
        // this.points = CardUtil.getPointsByRank(this.rank);
    }
    reset() {}
    updateCard(cardId) {
        this.cardId = cardId;
        this.rank = getRankById(cardId);
        this.suit = getSuitById(cardId);
        this.color = getColorById(cardId);
        // this.points = CardUtil.getPointsByRank(this.rank);
    }

}
sortCardObjListByRank = function (cardList) { //Card.js
    cardList.sort(function (a, b) {
        var idA = a.cardId;
        var idB = b.cardId;
        if (idA >= CardUtil.NUM_OUR_DECK) idA -= CardUtil.NUM_OUR_DECK;
        if (idB >= CardUtil.NUM_OUR_DECK) idB -= CardUtil.NUM_OUR_DECK;
        return idA - idB;
    });
};
sortCardObjListByWeight = function (cardList) { //Card.js
    cardList.sort(function (a, b) {
        var weightA = a.weight;
        var weightB = b.weight;
        return weightA - weightB;
    });
};
sortSequence = function (cardList) { //Card.js
    sortCardObjListByRank(cardList);
    var cardIdList = [];
    for (var i = 0; i < cardList.length; i++) {
        var element = cardList[i].cardId;
        if (element >= CardUtil.NUM_OUR_DECK) {
            element -= CardUtil.NUM_OUR_DECK;
        }
        cardIdList.push(element);
    }
    // var seqState = CardUtil.checkSequenceState(cardIdList);
    var numOfAces = 0;
    var numOfJokers = 0;
    var numOfDeuces = 0;
    var rankList = [];
    var currSuit = null;
    var suitList = [];
    for (i = 0; i < cardIdList.length; i++) {
        var rank = getRankById(cardIdList[i]);
        rankList.push(rank);
        cardList[i].weight = i;
        var suit = getSuitById(cardIdList[i]);
        suitList.push(suit);
    }
    //find suit of first normal card.
    for (i = 0; i < suitList.length; i++) {
        if (rankList[i] != CardUtil.DEUCE_RANK && rankList[i] != CardUtil.JOKER_RANK) {
            currSuit = suitList[i];
            break;
        }
    }
    for (i = 0; i < rankList.length; i++) {
        switch (rankList[i]) {
            case CardUtil.ACE_RANK:
                numOfAces++;
                break;
            case CardUtil.JOKER_RANK:
                numOfJokers++;
                break;
            case CardUtil.DEUCE_RANK:
                numOfDeuces++;
                break;
            default:
                break;
        }
        cardList[i].weight = rankList[i];
    }
    //if we have two aces, moved one ace to end of seq
    if (numOfAces == 2) {
        cardList[0].weight = CardUtil.DEUCE_RANK;
    }
    var indexOfWildCard = -1;
    var weightForWildCard;
    for (var l = 0; l < rankList.length - 1; l++) {
        if (rankList[l + 1] - rankList[l] == 2 &&
            suitList[l + 1] === suitList[l] &&
            suitList[l + 1] === currSuit) {
            weightForWildCard = l + 0.5;
            break;
        }
    }
    var j;
    if (weightForWildCard > 0) {
        if (numOfDeuces == 2) {
            for (j = 0; j < rankList.length; j++) {
                var element2 = rankList[j];
                if (element2 == CardUtil.DEUCE_RANK) {
                    indexOfWildCard = j;
                    if (suitList[j] != currSuit) break;
                }
            }
        } else {
            //TODO: case numOfAces = 1; still bug
            if (numOfJokers == 1) {
                for (j = rankList.length - 1; j >= 0; j++) {
                    var element3 = rankList[j];
                    if (element3 == CardUtil.JOKER_RANK) {
                        indexOfWildCard = j;
                        break;
                    }
                }
            } else {
                for (j = 0; j < rankList.length; j++) {
                    var element4 = rankList[j];
                    if (element4 == CardUtil.DEUCE_RANK) {
                        indexOfWildCard = j;
                        break;
                    }
                }
            }
        }
        if (indexOfWildCard > -1) cardList[indexOfWildCard].weight = weightForWildCard;
    }
    sortCardObjListByWeight(cardList);
    return cardList;
};

let arr0 = [1, 5, 9, 13];
let arr1 = [1, 5, 8, 13];
let arr2 = [20, 24, 32, 36, 82, 94, 98];
let arr3 = [102, 24, 32, 36, 82, 94, 98];
let arr4 = [102, 24, 32, 36, 82, 94, 98];
let arr5 = [32, 90, 87];
let arr6 = [25, 17, 55];
let arr7 = [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45];
let arr8 = [1, 5, 9, 13, 4];
let arr9 = [6, 9, 13, 59];
let arr10 = [54, 90, 13, 98, 102, 5, 36];
let arr11 = [35, 39, 43, 52, 47, 105, 7];
let arr12 = [80, 42, 72];
var arrOfArr = [];
arrOfArr.push(arr0);
arrOfArr.push(arr1);
arrOfArr.push(arr2);
arrOfArr.push(arr3);
arrOfArr.push(arr4);
arrOfArr.push(arr5);
arrOfArr.push(arr6);
arrOfArr.push(arr7);
arrOfArr.push(arr8);
arrOfArr.push(arr9);
arrOfArr.push(arr10);
arrOfArr.push(arr11);
arrOfArr.push(arr12);
// for (let i = 0; i < arrOfArr.length; i++) {
//     const element = arrOfArr[i];
//     if (i == 12) {
//         element.forEach(sub => {
//             console.log(getRankById(sub), getSuitById(sub));
//         });
//         console.log("check index", i, JSON.stringify(element), checkIsStraight(element));
//     }
// }
for (let index = 0; index < arrOfArr.length; index++) {
    const element = arrOfArr[index];
    let wannaSortList = [];
    for (let i = 0; i < element.length; i++) {
        let cardObj = new CardObj(element[i]);
        console.log("create cardObj", JSON.stringify(cardObj));
        wannaSortList.push(cardObj);
    }
    if (checkSequenceState(element)!= CardUtil.SEQUENCE_INVALID) console.log("sortedList\n", sortSequence(wannaSortList));

}