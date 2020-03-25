module.exports = (temp, card) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, card.productName);
    output = output.replace(/{%IMAGE%}/g, card.image);
    output = output.replace(/{%FROM%}/g, card.from);
    output = output.replace(/{%NUTRIENTS%}/g, card.nutrients);
    output = output.replace(/{%QUANTITY%}/g, card.quantity);
    output = output.replace(/{%PRICE%}/g, card.price);
    output = output.replace(/{%DESCRIPTION%}/g, card.description);
    output = output.replace(/{%ID%}/g, card.id);

    // The class place-holder
    if (!card.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
}