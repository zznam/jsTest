let string = "";
let numWords = 500;
let lastIndex = numWords - 1;
for (let index = 0; index < numWords; index++) {
    switch (index % 3) {
        case 0:
            string += "năm ";
            break;
        case 1:
            string += "trăm ";
            break;
        default:
            if (index != lastIndex) string += "chữ ";
            else string += "chữ";
            break;
    }
}
console.log(string);