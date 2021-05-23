const removeValidatedCards = (cardsData, cardsToRemove) => {
    const updatedCardsData = [];

    cardsData.map((c1) => {
        let cardMatch = false;
        cardsToRemove.map((c2) => {
            if (c1.uuid === c2) {
                cardMatch = true;
            }
        });
        if (!cardMatch) {
            updatedCardsData.push(c1)
        }
    });

    return updatedCardsData;
}

module.exports = removeValidatedCards;