module.exports = (cardsSet, selectedCards) => {
    let cardsMatch = false;

    if (cardsSet && cardsSet.length > 0 && selectedCards && selectedCards.length > 0) {
        // retrive the 2 cards data of selectedCards
        const foundCardIds = [];

        cardsSet.forEach((card) => {
            selectedCards.forEach((selectedCard) => {
                if (card.uuid === selectedCard) {
                    foundCardIds.push(card.id)
                }
            })
        });

        // finally checking if the 2 card ID are same
        if (foundCardIds[0] === foundCardIds[1]) {
            cardsMatch = true;
        }
    }
    return cardsMatch;
}