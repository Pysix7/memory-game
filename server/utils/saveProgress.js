const path = require('path');
const fs = require('fs');

const getFile = (fileId) => {
    const filePath = path.join(__dirname + '/..' + '/game-boards' + `/${fileId}.json`);
    let file = null;

    try {
        const fileExists = fs.readFileSync(filePath);
        if (fileExists) {
            file = JSON.parse(fileExists);
        }
    } catch (error) {
        console.log(`[getFile] error`, error)
    }

    return file;
};

const saveProgress = (data) => {
    const {
        fileId,
        startTime,
        endTime,
        difficulty,
        gameRound,
        selectedCards,
        cardsValidation,
    } = data;

    const filePath = path.join(__dirname + '/..' + '/game-boards' + `/${fileId}.json`);
    let errorScoreCount = 0;

    try {
        const fileExists = getFile(fileId);

        if (fileExists) {
            // file update
            let cardPicksProgress = [];
            if (fileExists.cardPicks && fileExists.cardPicks.length > 0) {

                cardPicksProgress = [
                    ...fileExists.cardPicks,
                    {
                        gameRound,
                        selectedCards: selectedCards || [],
                        validation: cardsValidation,
                    }
                ];
            } else {
                cardPicksProgress = [
                    {
                        gameRound,
                        selectedCards: selectedCards,
                        validation: cardsValidation,
                    }
                ];
            }


            if (fileExists.errorScore >= 0) {
                if (cardsValidation) {
                    // if cards match / validate no need to increment count
                    errorScoreCount = fileExists.errorScore;
                } else {
                    // if cards don't match increment count by one
                    errorScoreCount = fileExists.errorScore + 1;
                }
            }
            const finalJsonObj = Object.assign(
                {},
                fileId ? { id: fileExists.id } : {},
                {
                    startTime: startTime || fileExists.startTime || 0,
                    endTime: endTime || fileExists.endTime || 0,
                    difficulty: difficulty || fileExists.difficulty,
                    errorScore: errorScoreCount,
                    cardPicks: cardPicksProgress
                },
            );

            // save file in human readable format
            fs.writeFileSync(filePath, JSON.stringify(finalJsonObj, null, 2));
        } else {
            // file create
            const finalJsonObj = Object.assign(
                {},
                fileId ? { id: fileId } : {},
                startTime ? { startTime } : {},
                difficulty ? { difficulty } : {},
            );
            // save file in human readable format
            fs.writeFileSync(filePath, JSON.stringify(finalJsonObj, null, 2));
        }
    } catch (error) {
        console.log(`[saveProgress error]`, error)
    }

    return {
        errorScore: errorScoreCount
    };
};

module.exports = {
    saveProgress,
    getFile,
};