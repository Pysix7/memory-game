import React from 'react';
import { Row, Col, Card } from 'antd'
import GameCard from '../GameCard';

const GameBoard = (props) => {
    const {
        cardsData,
        onCardClick,
        selectedCards,
    } = props;
    return (
        <Card>
            <Row gutter={[16, 16]}>
                {cardsData.map((item, index) => {
                    const clickedItem = selectedCards.find((sel) => sel === item.id);
                    return (
                        <Col
                            xs={12}
                            sm={12}
                            md={8}
                            lg={3}
                            xl={3}
                            key={`cards-${item.id}-${index}`}
                        >
                            <GameCard
                                id={item.id}
                                onCardClick={onCardClick}
                                imgUrl={item.imgUrl}
                                cardSelected={clickedItem ? true : false}
                                canClose={selectedCards.length === 2}
                            />
                        </Col>
                    )
                })}
            </Row>
        </Card>
    )
}

export default GameBoard;