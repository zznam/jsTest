/**
 * Created by CPU02412_LOCAL on 8/15/2018.
 */

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

isDiscardable = function (cardId) {
    if (CardUtil.curListDrewFromDiscardPile.length == 1) {
        if (CardUtil.curListDrewFromDiscardPile[0] == cardId) {
            return false;
        }
    }
    return true;
};

getPointsByRank = function (rank) {
    if (rank >= 3 && rank <= 7) return CardUtil.POINTS_FIVE;
    if (rank >= 8 && rank <= 13) return CardUtil.POINTS_TEN;
    if (rank == CardUtil.JOKER_RANK) return CardUtil.POINTS_JOKER;
    if (rank == CardUtil.DEUCE_RANK) return CardUtil.POINTS_DEUCE;
};
getTextureNameByCardId = function (cardId) {
    // cc.log("getTextureNameByCardId", cardId, CardUtil.getRankById(cardId), CardUtil.getSuitById(cardId), CardUtil.getColorById(cardId));
    if (cardId == -1) {
        return (CardUtil.CARD_NAME + "blue.png");
    }
    if (cardId <= -2) {
        return (CardUtil.CARD_NAME + "red.png");
    }
    if (cardId >= CardUtil.NUM_OUR_DECK) {
        cardId -= CardUtil.NUM_OUR_DECK;
    }
    return (CardUtil.CARD_NAME + cardId.toString() + ".png");
};

getRankById = function (cardId) {
    if (cardId >= CardUtil.NUM_OUR_DECK) cardId -= CardUtil.NUM_OUR_DECK;
    if (cardId != 0) {
        if (cardId % (CardUtil.NUM_OUR_DECK - 2) == 0 || cardId % (CardUtil.NUM_OUR_DECK - 1) == 0)
            return CardUtil.JOKER_RANK;
    }
    return Math.floor(cardId / 4) + 1;
};
sortCardList = function (cardList) { //CardObj
    cardList.sort(function (a, b) {
        return a.cardId - b.cardId;
    });
};
sortCardObjListBySuit = function (cardObjList) { //CardObj
    cardObjList.sort(function (a, b) {
        //joker greater than anything
        if (a.rank == CardUtil.JOKER_RANK) {
            if (b.rank == CardUtil.JOKER_RANK) {
                return a.suit - b.suit;
            }
            return 1;
        }
        if (b.rank == CardUtil.JOKER_RANK) {
            return -1;
        }
        //compare suit of normal cards
        if (a.suit != b.suit) {
            return a.suit - b.suit;
        } else {
            return a.cardId - b.cardId;
        }
    });
};
sortCardSpriteListBySuit = function (cardSpriteList) { //CardSpriteObject
    cardSpriteList.sort(function (a, b) {
        var idA = a.card.cardId;
        var idB = b.card.cardId;
        var rankA = a.card.rank;
        var rankB = b.card.rank;
        var suitA = a.card.suit;
        var suitB = b.card.suit;
        if (idA >= CardUtil.NUM_OUR_DECK) idA -= CardUtil.NUM_OUR_DECK;
        if (idB >= CardUtil.NUM_OUR_DECK) idB -= CardUtil.NUM_OUR_DECK;
        //joker greater than anything
        if (rankA == CardUtil.JOKER_RANK) {
            if (rankB == CardUtil.JOKER_RANK) {
                return suitA - suitB;
            }
            return 1;
        }
        if (rankB == CardUtil.JOKER_RANK) {
            return -1;
        }
        if (suitA != suitB) {
            return suitA - suitB;
        } else {
            return idA - idB;
        }
    });
};
sortCardSpriteListByRank = function (cardList) { //Card.js
    cardList.sort(function (a, b) {
        var idA = a.card.cardId;
        var idB = b.card.cardId;
        if (idA >= CardUtil.NUM_OUR_DECK) idA -= CardUtil.NUM_OUR_DECK;
        if (idB >= CardUtil.NUM_OUR_DECK) idB -= CardUtil.NUM_OUR_DECK;
        return idA - idB;
    });
};
sortCardSpriteListByWeight = function (cardList) { //Card.js
    cardList.sort(function (a, b) {
        var weightA = a.card.weight;
        var weightB = b.card.weight;
        return weightA - weightB;
    });
};
sortSequence = function (cardList) { //Card.js
    sortCardSpriteListByRank(cardList);
    var cardIdList = [];
    for (var i = 0; i < cardList.length; i++) {
        var element = cardList[i].card.cardId;
        cardIdList.push(element);
    }
    var numOfAces = 0;
    var numOfJokers = 0;
    var numOfDeuces = 0;
    var rankList = [];
    var currSuit = null;
    var suitList = [];
    for (i = 0; i < cardIdList.length; i++) {
        var rank = getRankById(cardIdList[i]);
        rankList.push(rank);
        cardList[i].card.weight = i;
        var suit =getSuitById(cardIdList[i]);
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
                //don't accept two normal cards in a sam rank
                if (i < (rankList.length - 1)) {
                    if (rankList[i] === rankList[i + 1]) return res;
                }
                break;
        }
    }
    //if we have two aces, moved one ace to end of seq
    if (numOfAces == 2) {
        cardList[0].card.weight = this.rankList.length;
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
    if (weightForWildCard > 0) {
        if (numOfDeuces == 2) {

            for (var j = 0; j < rankList.length; j++) {
                var element2 = rankList[j];
                if (element2 == CardUtil.DEUCE_RANK) {
                    indexOfWildCard = j;
                    if (suitList[j] != currSuit) break;
                }
            }

        } else {
            //TODO: case numOfAces = 1; still bug
            if (numOfJokers == 1) {
                for (var j = rankList.length - 1; j >= 0; j++) {
                    var element3 = rankList[j];
                    if (element3 == CardUtil.JOKER_RANK) {
                        indexOfWildCard = j;
                        break;
                    }
                }
            } else {
                for (var j = 0; j < rankList.length; j++) {
                    var element4 = rankList[j];
                    if (element4 == CardUtil.DEUCE_RANK) {
                        indexOfWildCard = j;
                        break;
                    }
                }
            }
        }

        if (indexOfWildCard > -1) cardList[indexOfWildCard].card.weight = weightForWildCard;
    }
    sortCardSpriteListByWeight(cardList);
};
CardUtil.FULL_SEQUENCES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
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
    var newCardIdList =[];
    for (var m = 0; m < cardIdList.length; m++) {
        var element = cardIdList[m];
        if (element >= CardUtil.NUM_OUR_DECK){
            element-=CardUtil.NUM_OUR_DECK;
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
                    if (rankList[i] === rankList[i + 1]) return res;
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
    var res = false;
    var i;
    var numOfAces = 0;
    var numOfJokers = 0;
    var numOfDeuces = 0;
    var rankList = [];
    var currSuit = null;
    var suitList = [];
    var newCardIdList =[];
    for (var m = 0; m < cardIdList.length; m++) {
        var element = cardIdList[m];
        if (element >= CardUtil.NUM_OUR_DECK){
            element-=CardUtil.NUM_OUR_DECK;
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
            return res;
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
                    if (rankList[i] === rankList[i + 1]) return res;
                }
                break;
        }
    }
    if (numOfDeuces > 1) return res;
    if (numOfJokers > 1) return res;
    if (numOfAces > 2) return res;
    if (numOfJokers + numOfDeuces > 2) return res;

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
checkFlagListStraight = function (flagList, rankList, suitList, currSuit, numOfDeuces, numOfJokers) {
    var beginFlag, endFlag;
    var valid = true;
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
            valid = false;
            break;
        }
    }
    return valid;

};

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
    var rank = CardUtil.getRankById(cardId);
    for (var i = 0; i < cardList.length; i++) {
        if (getRankById(cardList[i].card.cardId) == rank) {
            sameCards.push(cardList[i]);
        }
    }
    return sameCards;
};
CardUtil.calculateScoreOfList = function (cardList) {
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
let arr0 = [1, 5, 9, 13];
let arr1 = [1, 5, 8, 13];
let arr2 = [20,24,32,36,82,94,98];
let arr3 = [102, 24, 32, 36, 82, 94, 98];
let arr4 = [102, 24, 32, 36, 82, 94, 98];
let arr5 = [32, 90,87];
let arr6 = [25, 17,55];
let arr7= [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45];
let arr8 = [1, 5, 9, 13, 4];
let arr9 = [6, 9 , 13, 59];
let arrOfArr = [];
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
arr9.forEach(element => {
    console.log(getRankById(element), getSuitById(element));
});
for (let i = 0; i < arrOfArr.length; i++) {
    const element = arrOfArr[i];
    if(i==9) console.log("check index", i, checkSequenceState(element));
}