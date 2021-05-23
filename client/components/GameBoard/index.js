import React from 'react';
import { Card, Row, Col } from 'antd'
import ElapsedTime from '../ElapsedTime';
import ErrorScore from '../ErrorScore';
import CardBoard from '../CardsBoard';

const GameBoard = (props) => {
    const {
        errorScore,
        startTimer,
        cardsData,
        onCardClick,
        selectedCards,
    } = props;
    return (
        <Card>
            <Row gutter={[16, 16]}>
                <Col span={12}><ElapsedTime startTimer={startTimer} /></Col>
                <Col span={12}><ErrorScore score={errorScore} /></Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <CardBoard
                        cardsData={cardsData}
                        onCardClick={onCardClick}
                        selectedCards={selectedCards}
                    />
                </Col>
            </Row>
        </Card>
    )
}

export default GameBoard;