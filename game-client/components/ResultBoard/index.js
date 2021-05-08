import React from 'react';
import { Card, Row, Col, Typography } from 'antd'

const { Title } = Typography;

const ResultBoard = (props) => {
    const {
        errorScore,
        elapsedTime,
    } = props;
    return (
        <Card>
            <Row gutter={[16, 16]}>
                <Col>
                    <Title level={2}>Congratulations, you have completed the game</Title>
                    <Title level={3}>Error Score: {errorScore}</Title>
                    <Title level={3}>Elapsed TIme: {elapsedTime}</Title>
                </Col>
            </Row>
        </Card>
    )
}

export default ResultBoard;