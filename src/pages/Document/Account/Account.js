import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Collapse, Flex, Space } from 'antd';
import { IconUser } from '@tabler/icons-react';

import Document from '../Document';
import router from '~/configs/routes';

const responseProfileSuccess = {
    data: {
        id: 12345678,
        email: 'youremail@example.com',
        full_name: 'Your Name',
        balance: 100000,
    },
    status: 200,
    message: 'Lấy thông tin tài khoản thành công',
};

function Account() {
    return (
        <Fragment>
            <Helmet>
                <title>Thegioicode.com - API lấy thông tin tài khoản</title>
                <meta
                    key="description"
                    name="description"
                    content="API document này giúp lấy thông tin về tài khoản của bạn nhằm phục vụ sử dụng các dịch vụ của Thegioicode"
                />

                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://thegioicode.com${router.document}`} />
                <meta property="og:url" content={`https://thegioicode.com${router.document}`} />
                <meta property="og:title" content="Thegioicode.com - API lấy thông tin tài khoản" />
                <meta property="og:image" content="https://thegioicode.com/images/izgdwacbGc.png" />
                <meta
                    property="og:description"
                    content="API document này giúp lấy thông tin về tài khoản của bạn nhằm phục vụ sử dụng các dịch vụ của Thegioicode"
                />
            </Helmet>

            <Document
                keyTab="1"
                label={
                    <span className="box-align-center gap-2 text-subtitle">
                        <IconUser width={20} height={20} />
                        Tài Khoản
                    </span>
                }
            >
                <div className="api-detail">
                    <Space direction="vertical" className="w-full">
                        <Collapse
                            accordion
                            items={[
                                {
                                    key: '1',
                                    label: <div className="font-bold text-hover">Lấy thông tin tài khoản</div>,
                                    children: (
                                        <div>
                                            <Flex align="center">
                                                <span className="document-method text-success font-bold">GET</span>
                                                <span className="document-method flex-1 text-start">
                                                    https://thegioicode.com/api/v2/accounts/profile
                                                </span>
                                            </Flex>

                                            <div className="mt-3 mb-1">Thành công:</div>
                                            <div>
                                                <div className="copy">
                                                    <pre>
                                                        <code className="text-copy success">
                                                            {JSON.stringify(responseProfileSuccess, null, 4)}
                                                        </code>
                                                    </pre>
                                                </div>
                                            </div>

                                            <div className="mt-3 mb-1">Thất bại:</div>
                                            <div>
                                                <div className="copy">
                                                    <pre>
                                                        <code className="text-copy">
                                                            {JSON.stringify(
                                                                { status: 'Mã code lỗi', error: 'Thông tin lỗi trả về' },
                                                                null,
                                                                4,
                                                            )}
                                                        </code>
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </Space>
                </div>
            </Document>
        </Fragment>
    );
}

export default Account;
