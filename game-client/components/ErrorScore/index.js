import React from 'react';
import { Card, Typography } from 'antd'

import './index.less';

const { Title } = Typography;

const ErrorScore = (props) => {
    const { score } = props;
    return (
        <Card>
            <Title level={5} className="title" >Error Score: {' '}
                <span className="value">
                    {score}
                </span>
            </Title>
        </Card>
    )
}

export default ErrorScore;