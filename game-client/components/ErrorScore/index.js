import React from 'react';
import { Card, Row, Col, Typography } from 'antd'

const { Title } = Typography;

const ErrorScore = (props) => {
    const { score } = props;
    return (
        <Card>
            <Row>
                <Col>
                    <Title level={5} >Error Score: {' '}
                        <span
                            style={{
                                color: 'orangered'
                            }}
                        >
                            {score}
                        </span>
                    </Title>
                </Col>
            </Row>
        </Card>
    )
}

export default ErrorScore;