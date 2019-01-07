/**
 * Created by CPU02412_LOCAL on 8/15/2018.
 */

var CardUtil = {};

CardUtil.CARD_SCALE_IN_TABLE = 0.7;

CardUtil.NUM_STANDARD_DECK = 52;
CardUtil.NUM_OUR_DECK = 54;

CardUtil.CARD_NAME = "card_";


CardUtil.CARD_WIDTH = 97;
CardUtil.CARD_HEIGHT = 131;

CardUtil.ACE_RANK = 1;
CardUtil.DEUCE_RANK = 2;
CardUtil.JOKER_RANK = 14;

CardUtil.SEQUENCES_INVALID = 0;
CardUtil.SEQUENCES_NORMAL = 1;
CardUtil.SEQUENCES_DIRTY_CANASTA = 2;
CardUtil.SEQUENCES_CLEAN_CANASTA = 3;
CardUtil.SEQUENCES_FIVE_HUNDRED_CANASTA = 4;
CardUtil.SEQUENCES_ROYAL_CANASTA = 5;

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

//TODO: reset when start new match...........
CardUtil.curListDrawFromDiscardPile = [];
CardUtil.mySeqIdList = [];
CardUtil.opponentSeqIdList = [];
CardUtil.sequencesCount = 0;

CardUtil.EXIST = 1;
CardUtil.NULL = 0;
getPointsByRank = function (rank) {
    if (rank >= 3 && rank <= 7) return CardUtil.POINTS_FIVE;
    if (rank >= 8 && rank <= 13) return CardUtil.POINTS_TEN;
    if (rank == CardUtil.JOKER_RANK) return CardUtil.POINTS_JOKER;
    if (rank == CardUtil.DEUCE_RANK) return CardUtil.POINTS_DEUCE;
};

CardUtil.FULL_SEQUENCES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
CardUtil.ACE_AT_END_SEQ_RANK = 14;
sortNumberList = function (cardIdList) { // [cardId, ..., ]
    cardIdList.sort(function (a, b) {
        return a - b;
    });
};


getCardIdByRankSuitColor = function (rank, suit, color) {
    //FIXME: should we need it?
    if (color == undefined) color = CardUtil.TYPE_BLUE_CARD;
    if (rank == CardUtil.JOKER_RANK) {
        if (suit == CardUtil.JOKER_BLACK) {
            if (color == CardUtil.TYPE_BLUE_CARD) return 52;
            if (color == CardUtil.TYPE_RED_CARD) return 106;
        }
        if (suit == CardUtil.JOKER_RED) {
            if (color == CardUtil.TYPE_BLUE_CARD) return 53;
            if (color == CardUtil.TYPE_RED_CARD) return 107;
        }
    }
    var id = (4 * (rank - 1) + suit);
    if (color == CardUtil.TYPE_RED_CARD) id += CardUtil.NUM_OUR_DECK;
    return id;
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
getSameCardFromListById = function (cardList, cardId) { //Card.js
    var sameCards = [];
    var rank = getRankById(cardId);
    for (var i = 0; i < cardList.length; i++) {
        if (getRankById(cardList[i].card.cardId) == rank) {
            sameCards.push(cardList[i]);
        }
    }
    return sameCards;
};
calculateScoreOfList = function (cardList) {
    var score = 0;
    var rank = 0;
    for (var i = 0; i < cardList.length; i++) {
        rank = getRankById(cardList[i].card.cardId);
        if (rank > 10) rank = 10;
        score += rank;
    }
    if (score < 0) score = -1;
    return score;
};
getCardsToMaxCurrPointInList = function (cardList) {
    //var cards = [];
    var lastNumCard = -1;
    var maxCurrPoint = 0;
    var cardIdToMaxPoint = -1;
    var currPoint = 0;
    var cardPoint = 0;
    var rank = -1;
    for (var i = cardList.length - 1; i >= 0; i--) {
        rank = getRankById(cardList[i].card.cardId);
        if (rank != lastNumCard) {
            currPoint = 0;
            lastNumCard = rank;
        }
        cardPoint = (rank > 10) ? 10 : rank;
        currPoint += cardPoint;
        if (currPoint > maxCurrPoint) {
            maxCurrPoint = currPoint;
            cardIdToMaxPoint = cardList[i].card.cardId;
        }
    }
    return cardIdToMaxPoint;
};
checkExistCardRankInCardList = function (cardList, rank) {
    for (var i = 0; i < cardList.length; i++) {
        if (getRankById(cardList[i].card.cardId) == rank) {
            return cardList[i].card.cardId;
        }
    }
    return -1;
};



checkSequenceState = function (cardIdList) { //cardIdList
    var res = CardUtil.SEQUENCES_INVALID;
    if (cardIdList.length < 3) return res;
    var i;
    var numOfAces = 0;
    var numOfJokers = 0;
    var numOfDeuces = 0;
    var rankList = [];
    var currSuit = null;
    var suitList = [];
    sortNumberList(cardIdList);
    for (i = 0; i < cardIdList.length; i++) {
        var rank = getRankById(cardIdList[i]);
        var suit = getSuitById(cardIdList[i]);
        rankList.push(rank);
        suitList.push(suit);
    }
    //check cards in same rank, only accept two deuces, two aces and one jokers.
    for (i = 0; i < rankList.length; i++) {
        if (rankList[i] == CardUtil.ACE_RANK) numOfAces++;
        if (rankList[i] == CardUtil.JOKER_RANK) numOfJokers++;
        if (rankList[i] == CardUtil.DEUCE_RANK) numOfDeuces++;
    }
    if (numOfDeuces > 2) return res;
    if (numOfJokers > 1) return res;
    if (numOfAces > 2) return res;
    if (numOfJokers + numOfDeuces > 2) return res;

    //find suit of first normal card.
    for (i = 0; i < suitList.length; i++) {
        if (rankList[i] != CardUtil.DEUCE_RANK && rankList[i] != CardUtil.JOKER_RANK) {
            currSuit = suitList[i];
            break;
        }
    }
    //all normal cards must have a same suit.
    for (i = 0; i < suitList.length; i++) {
        if (rankList[i] != CardUtil.DEUCE_RANK && rankList[i] != CardUtil.JOKER_RANK) {
            if (currSuit != suitList[i]) {
                return res;
            }
        }
    }
    //fill all normal cards in flagList, if flagList is 0-1-1-1-1-0-0... => valid sequences
    var flagList = [];
    for (i = 0; i < CardUtil.JOKER_RANK; i++) {
        flagList.push(CardUtil.NULL);
    }
    var curRank = 0,
        beginFlag = null,
        endFlag;

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
        if (!isFind) return res;
    }
    //find rank exist as normal card in list.
    for (i = 0; i < flagList.length; i++) {
        curRank++;
        if (curRank == CardUtil.DEUCE_RANK || curRank == CardUtil.JOKER_RANK || curRank == CardUtil.ACE_RANK) continue;
        if (rankList.indexOf(curRank) >= 0) {
            flagList[i] = CardUtil.EXIST;
        }
    }
    for (i = 0; i < flagList.length; i++) {
        if (flagList[i] != CardUtil.NULL) {
            if (beginFlag == null) beginFlag = i;
            endFlag = i;
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
    // hello, welcome to real world.
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
    if (flagList2.length > 0) {
        kind = checkFlagListForSeq(flagList2, rankList, suitList, currSuit, numOfDeuces, numOfJokers);
        if (kind != CardUtil.SEQUENCES_INVALID) {
            return kind;
        }
    }
    if (flagList1.length > 0) {
        kind = checkFlagListForSeq(flagList1, rankList, suitList, currSuit, numOfDeuces, numOfJokers);
        if (kind != CardUtil.SEQUENCES_INVALID) {
            return kind;
        }
    }
    kind = checkFlagListForSeq(flagList, rankList, suitList, currSuit, numOfDeuces, numOfJokers);
    return kind;

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
    var ret = CardUtil.SEQUENCES_INVALID;
    var isWildcardUsed = false;
    beginFlag = findFirstExistFlag(flagList);
    endFlag = findLastExistFlag(flagList);
    for (i = beginFlag; i <= endFlag; i++) {
        //find is there any space, and fill, if more than two spaces -> invalid
        if (flagList[i] == CardUtil.NULL) {
            if (i == CardUtil.DEUCE_RANK - 1) {
                //find if we can use deuce as normal card.
                for (k = 0; k < rankList.length; k++) {
                    if (rankList[k] > CardUtil.DEUCE_RANK) break;
                    if (rankList[k] == CardUtil.DEUCE_RANK && suitList[k] == currSuit) {
                        flagList[CardUtil.DEUCE_RANK - 1] = 1;
                        numOfDeuces--;
                    }
                }
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
        if (rankList.length < 7) return CardUtil.SEQUENCES_NORMAL;
        if (isWildcardUsed) return CardUtil.SEQUENCES_DIRTY_CANASTA;
        //from 2 to ace
        if (beginFlag == 1 && endFlag == 13) return CardUtil.SEQUENCES_FIVE_HUNDRED_CANASTA;
        // from ace to ace
        if (beginFlag == 0 && endFlag == 13) return CardUtil.SEQUENCES_ROYAL_CANASTA;
        return CardUtil.SEQUENCES_CLEAN_CANASTA;
    }
    return ret;
};
// let arr0 = [1, 5, 9, 13];
// let arr1 = [1, 5, 8, 13];
// let arr5 = [20,24,32,36,82,94,98];
let arr5 = [102,24,32,36,82,94,98];
// let arr2 = [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45];
// let arr3 = [1, 5, 9, 13, 4];
let arrOfArr = [];
// arrOfArr.push(arr0);
// arrOfArr.push(arr1);
// arrOfArr.push(arr2);
// arrOfArr.push(arr3);
arrOfArr.push(arr5);
for (let i = 0; i < arrOfArr.length; i++) {
    const element = arrOfArr[i];
    console.log("check index", i, checkSequenceState(element));
}