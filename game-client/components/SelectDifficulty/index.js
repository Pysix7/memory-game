import React from 'react';
import difficulties from '../../configs/difficulties';
import { Card, Row, Col, Button, Typography } from 'antd'

import './index.less';
const { Title } = Typography;

const SelectDifficulty = (props) => {
    const { onDifficultySelect } = props;
    return (
        <Card>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={3} className="title">
                        Please select game difficulty:
                    </Title>
                </Col>
            </Row>
            <Row className="diffRow">
                <Col span={12}>
                    <Row gutter={[16, 16]}>
                        {difficulties.map((difficulty, index) => {
                            return (
                                <Col
                                    xs={24}
                                    sm={24}
                                    md={8}
                                    lg={8}
                                    xl={8}
                                    key={`difficulty-${index}`}
                                    className="diffCard"
                                >

                                    <Button
                                        className="diffButton"
                                        type="primary"
                                        onClick={() => onDifficultySelect(difficulty)}
                                    >
                                        {difficulty.toUpperCase()}
                                    </Button>
                                </Col>
                            )
                        })}
                    </Row>
                </Col>
            </Row>
        </Card>
    )
}

export default SelectDifficulty;