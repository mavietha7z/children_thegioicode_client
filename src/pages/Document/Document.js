import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconSend, IconServer2, IconUser } from '@tabler/icons-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Col, Empty, Flex, Input, Modal, notification, Row, Space, Tabs, Tooltip } from 'antd';

import Account from './Account';
import router from '~/configs/routes';
import CloudServer from './CloudServer';
import { serviceCopyKeyBoard } from '~/configs';
import IconQuestion from '~/assets/icon/IconQuestion';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserCreateTokenApi } from '~/services/account';
import { requestUserSendCodeVerifyEmail } from '~/services/auth';

function Document({ label, keyTab, children }) {
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [otpValue, setOtpValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [disableSendCode, setDisableSendCode] = useState(false);
    const [loadingSendCode, setLoadingSendCode] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { currentUser } = useSelector((state) => state.auth);

    const items = [
        {
            label: (
                <span className="box-align-center gap-2 text-subtitle">
                    <IconUser size={20} />
                    Tài Khoản
                </span>
            ),
            key: '1',
            children: <Account />,
        },
        {
            label: (
                <span className="box-align-center gap-2 text-subtitle">
                    <IconServer2 size={20} />
                    Cloud Server
                </span>
            ),
            key: '2',
            children: <CloudServer />,
        },
    ];

    // Tìm và cập nhật tab được chỉ định từ props
    const tabIndex = items.findIndex((item) => item.key === keyTab);
    if (tabIndex !== -1) {
        items[tabIndex].label = label;
        items[tabIndex].children = children;
    } else {
        // Nếu keyTab không khớp, thêm tab mới vào cuối danh sách
        items.push({
            label: label,
            key: keyTab,
            children: children,
        });
    }

    const onChangeNavigate = (key) => {
        switch (key) {
            case '1':
                navigate(router.document);
                break;

            case '2':
                navigate(router.document_cloud_server);
                break;
            default:
                navigate(pathname);
        }
    };

    const handleOpenModelCreateToken = () => {
        if (!currentUser) {
            navigate(router.home);
            notification.error({
                message: 'Thông báo',
                description: 'Vui lòng đăng nhập để tiếp tục',
            });
        } else {
            setModalVisible(true);
        }
    };

    const handleSendCodeVerifyEmail = async () => {
        setLoadingSendCode(true);
        const result = await requestUserSendCodeVerifyEmail();

        setLoadingSendCode(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            setDisableSendCode(true);
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handleCreateUserPartner = async () => {
        if (currentUser.register_type === 'google') {
            if (!currentUser.two_factor_auth) {
                return notification.error({
                    message: 'Thông báo',
                    description: 'Vui lòng bật xác thực 2 yếu tố để xác minh',
                });
            }

            if (!otpValue || otpValue.length !== 6) {
                return notification.error({ message: 'Thông báo', description: 'Mã xác minh không hợp lệ' });
            }
        }

        if (currentUser.register_type === 'email') {
            if (!password || password.length < 6 || password.length > 30) {
                return notification.error({ message: 'Thông báo', description: 'Mật khẩu xác minh không hợp lệ' });
            }
        }

        const two_factor_auth_type = currentUser.two_factor_auth_type;
        const data = {
            password,
            two_factor_auth_type,
        };

        if (currentUser.register_type === 'google') {
            data.password = otpValue;
        }

        setLoading(true);
        setModalVisible(false);

        const result = await requestUserCreateTokenApi(data);

        setLoading(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            setToken(result.data);
        } else {
            notification.error({
                message: 'Thông báo',
                description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    return (
        <Row style={{ rowGap: 16 }}>
            <Col md={20} xs={24}>
                <Card style={{ minHeight: 'calc(-104px + 100vh)' }}>
                    <div className="mb-3 document">
                        <Flex align="center" className="d-flex align-items-center gap-2">
                            <h2 className="font-size-20">API Document</h2>
                            <IconQuestion
                                width={13}
                                height={13}
                                className="text-subtitle"
                                title="API giúp quý khách có thể truy cập vào dữ liệu tài khoản của mình từ xa, khởi tạo và quản trị các dịch vụ tại
                            Thegioicode"
                            />
                        </Flex>
                        {token ? (
                            <div className="mt-2">
                                <Alert
                                    message="Tạo token thành công! Token chỉ hiển thị một lần duy nhất tại đây, vui lòng sao chép lưu trữ cẩn trọng!"
                                    type="success"
                                    closable
                                    onClose={() => {
                                        setToken('');
                                        setPassword('');
                                    }}
                                />

                                <Flex align="center" className="gap-2 mt-2">
                                    <Tooltip title="Click để copy">
                                        <span className="document-method font-bold" onClick={() => serviceCopyKeyBoard(token)}>
                                            {token}
                                        </span>
                                    </Tooltip>
                                </Flex>
                            </div>
                        ) : (
                            <Button type="primary" className="mt-2" loading={loading} onClick={handleOpenModelCreateToken}>
                                Tạo Token
                            </Button>
                        )}
                        <div className="mt-2">
                            <code>{`headers: { "Authorization": "Bearer token" }`}</code>
                        </div>
                        <div className="text-subtitle mt-2">
                            Sử dụng phương thức xác thực <b>"Bearer token"</b> trong header với mọi request.
                        </div>
                        <div className="text-subtitle mt-2">
                            Trong các request thử nghiệm vui lòng tự tạo <b>"MOCK API"</b> để sử dụng, chúng tôi sẽ không hoàn tiền nếu thử
                            nghiệm trực tiếp với API chính thức.
                        </div>
                    </div>

                    {modalVisible && (
                        <Modal
                            centered
                            closable={false}
                            maskClosable={false}
                            open={modalVisible}
                            onOk={handleCreateUserPartner}
                            onCancel={() => setModalVisible(false)}
                            width={460}
                            okText="Tạo Token"
                            cancelText="Hủy"
                            title="Tạo Token API"
                        >
                            {currentUser?.register_type === 'email' ? (
                                <Fragment>
                                    <div className="mb-3">Để bảo mật vui lòng nhập mật khẩu để xác minh.</div>

                                    <Input.Password
                                        size="large"
                                        placeholder="Mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Fragment>
                            ) : (
                                <Fragment>
                                    {currentUser.two_factor_auth ? (
                                        <div>
                                            {currentUser.two_factor_auth_type === 'Email' ? (
                                                <Fragment>
                                                    <div className="mb-3">Để bảo mật vui lòng xác minh bằng email.</div>

                                                    <Space.Compact style={{ width: '100%' }}>
                                                        <Input
                                                            size="large"
                                                            placeholder="Mã xác nhận"
                                                            value={otpValue}
                                                            onChange={(e) => setOtpValue(e.target.value)}
                                                        />
                                                        <Button
                                                            size="large"
                                                            className="box-center"
                                                            type="primary"
                                                            icon={<IconSend size={20} />}
                                                            onClick={handleSendCodeVerifyEmail}
                                                            disabled={disableSendCode}
                                                            loading={loadingSendCode}
                                                        >
                                                            Gửi mã
                                                        </Button>
                                                    </Space.Compact>
                                                </Fragment>
                                            ) : (
                                                <p></p>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <span>
                                                Vui lòng bật xác minh 2 bước để lấy mã xác minh
                                                <Link to={router.twoFactor}> tại đây </Link>
                                            </span>
                                        </div>
                                    )}
                                </Fragment>
                            )}
                        </Modal>
                    )}

                    <Tabs activeKey={keyTab} items={items} onChange={onChangeNavigate} className="billing-tabs" />
                </Card>
            </Col>
            <Col md={4} xs={24} style={{ padding: '0 8px' }}>
                <Card
                    title={
                        <div>
                            <h2 className="font-size-20">Mô-đun nâng cao</h2>
                        </div>
                    }
                >
                    <Empty description="Không có dữ liệu" />
                </Card>
            </Col>
        </Row>
    );
}

export default Document;
