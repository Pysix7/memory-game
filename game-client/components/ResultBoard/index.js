import React from 'react';
import { Card, Row, Col, Typography } from 'antd'
import ElapsedTime from '../ElapsedTime';
import ErrorScore from '../ErrorScore';

import './index.less';

const { Title } = Typography;

const ResultBoard = (props) => {
    const {
        errorScore,
        elapsedTime,
    } = props;
    return (
        <Card>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={2} className="headingTitle">
                        Congratulations, you have completed the game
                    </Title>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <ElapsedTime
                                startTimer={false}
                                elapsedTime={elapsedTime}
                            />
                        </Col>
                        <Col span={12}>
                            <ErrorScore score={errorScore} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    )
}

export default ResultBoard;