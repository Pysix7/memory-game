import React, { useState, useEffect } from 'react';
import { Card } from 'antd'
import CONFIGS from '../../configs/configs';

import './index.less';

const GameCard = (props) => {
    const {
        cardSelected,
        imgUrl,
        canClose,
        onCardClick,
        id,
    } = props;

    const [cardOpen, setCardOpen] = useState(null);

    useEffect(() => {
        setCardOpen(cardSelected)
    }, [cardSelected]);

    useEffect(() => {
        let timeout = null;
        if (cardOpen && canClose) {
            const timeOut = CONFIGS.CARD_OPEN_TIME * 1000;
            // close the card after 3 seconds
            timeout = setTimeout(() => {
                setCardOpen(false);
            }, timeOut);
        }
        return function cleanup() {
            if (timeout) {
                clearTimeout(timeout)
            }
        }
    }, [cardOpen, canClose]);

    let cardClsName = 'unselectedCard';
    if (id) {
        if (cardOpen) {
            cardClsName = 'selectedCard';
        } else if (canClose) {
            cardClsName = 'disabledCard';
        } else {
            cardClsName = 'unselectedCard';
        }
    } else {
        cardClsName = 'removedCard';
    };
    const imageUrl = CONFIGS.SERVER_URI + '/img/' + imgUrl;
    return (
        <Card
            onClick={() => {
                if (id && !cardSelected && !canClose) {
                    onCardClick(id)
                }
            }}
            className={["imgCard", cardClsName]}
        >
            {cardOpen ? (
                <img
                    src={imageUrl}
                    alt={'image'}
                    className="img"
                />
            ) : null
            }
        </Card>
    )
}

export default GameCard;