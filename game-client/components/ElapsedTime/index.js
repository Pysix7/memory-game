import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography } from 'antd'
import timeCal from '../../utils/timeCalc';

const { Title } = Typography;

const ElapsedTime = (props) => {
    const { startTimer } = props;

    const [time, setTime] = useState(0);

    // inside useEffect update time on interval of one second if startTimer is true
    useEffect(() => {
        let timer = null;
        if (startTimer) {
            timer = setInterval(() => {
                setTime(time + 1);
            }, 1000);
        }

        return function cleanup() {
            if (timer) {
                clearInterval(timer)
            }
        }
    }, [startTimer, time]);

    return (
        <Card>
            <Row>
                <Col>
                    <Title level={5} >Elapsed Time:{' '}
                        <span
                            style={{
                                color: 'coral'
                            }}
                        >
                            {timeCal(time)}
                        </span>
                    </Title>
                </Col>
            </Row>
        </Card>
    )
}

export default ElapsedTime;