import React, { useState, useEffect } from 'react';
import { Card, Typography } from 'antd'
import timeCal from '../../utils/timeCalc';

import './index.less';

const { Title } = Typography;

const ElapsedTime = (props) => {
    const { startTimer, elapsedTime } = props;

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
            <Title level={5} className="title">Elapsed Time:{' '}
                <span className="value">
                    {elapsedTime ? elapsedTime : timeCal(time)}
                </span>
            </Title>
        </Card>
    )
}

export default ElapsedTime;