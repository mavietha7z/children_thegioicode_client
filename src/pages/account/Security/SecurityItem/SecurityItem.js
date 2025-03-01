import { EditOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconCancel, IconCheck, IconSend, IconX } from '@tabler/icons-react';
import { Avatar, Button, Col, Flex, Form, Input, Modal, notification, Row, Space } from 'antd';

import router from '~/configs/routes';
import imageEnable2Fa from '~/assets/image/enable-2fa.png';
import { requestUserSendCodeVerifyEmail } from '~/services/auth';
import { requestUserSecurityTurnoff2Fa } from '~/services/account';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';

function SecurityItem({ title, link = null, textLink, factor = false, active = false, authen = false, description, name, value }) {
    const [otpValue, setOtpValue] = useState('');
    const [isChange, setIsChange] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [disableSendCode, setDisableSendCode] = useState(false);
    const [loadingSendCode, setLoadingSendCode] = useState(false);

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isChange) {
            if (name === 'Email') {
                form.setFieldsValue({ email: value });
            } else {
                form.setFieldsValue({ phone_number: value });
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isChange]);

    const handleVerifyData = (values) => {
        if (name === 'Email') {
            notification.error({
                message: 'Thông báo',
                description: `${values?.email} chức năng đang được phát triển`,
            });
        } else {
            notification.error({
                message: 'Thông báo',
                description: `${values?.phone_number} chức năng đang được phát triển`,
            });
        }
    };

    const handleSendCodeVerifyEmail = async () => {
        setLoadingSendCode(true);

        const data = {
            email: currentUser.email,
            module: 'verify',
        };
        const result = await requestUserSendCodeVerifyEmail(data);

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

    const handleTurnOff2Fa = async () => {
        if (!otpValue || otpValue.length !== 6) {
            return notification.error({ message: 'Thông báo', description: 'Mã xác minh không hợp lệ' });
        }

        const two_factor_auth_type = currentUser.two_factor_auth_type;
        const data = {
            otp: otpValue,
            two_factor_auth_type,
        };

        const result = await requestUserSecurityTurnoff2Fa(data);

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            const { two_factor_auth, two_factor_auth_type, ...other } = currentUser;
            const newCurrentUser = { two_factor_auth: false, two_factor_auth_type: null, ...other };
            dispatch(loginUserSuccess(newCurrentUser));
            setOpenModal(false);
            notification.success({ message: 'Thông báo', description: result.message });
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    return (
        <div className="border-bottom pb-3 account_security-item">
            <Flex justify="center" className="gap-3">
                <div className="flex-1">
                    <h3 className="font-bold font-size-16 mb-1">
                        {title}

                        {factor && (
                            <span className={`label-light-${active ? 'info' : 'default'} rounded-8 ml-2`}>
                                {active ? 'ĐÃ BẬT' : 'VÔ HIỆU HOÁ'}
                            </span>
                        )}
                    </h3>
                </div>

                {link || active || factor ? (
                    <Fragment>
                        {active ? (
                            <Button className="rounded-full" danger type="primary" onClick={() => setOpenModal(true)}>
                                Tắt xác thực
                            </Button>
                        ) : (
                            <Link to={link}>
                                <Button className="rounded-full">{textLink}</Button>
                            </Link>
                        )}
                    </Fragment>
                ) : (
                    <span className={`label-light-${authen ? 'info' : 'default'} rounded-8`}>
                        {authen ? 'Đã xác thực' : 'Chưa xác thực'}
                    </span>
                )}
            </Flex>
            <p className="text-subtitle mb-3">{description}</p>

            {name && value && (
                <Fragment>
                    {isChange ? (
                        <Form layout="horizontal" form={form} onFinish={handleVerifyData}>
                            <Form.Item
                                className="mb-0 w-full"
                                name={name === 'Email' ? 'email' : 'phone_number'}
                                label={name === 'Email' ? 'Email:' : 'Điện thoại:'}
                                rules={[
                                    {
                                        required: true,
                                        message: `Vui lòng nhập ${name === 'Email' ? 'địa chỉ email' : 'số điện thoại'} mới`,
                                    },
                                    name === 'Email'
                                        ? {
                                              type: 'email',
                                              message: 'Địa chỉ email không đúng định dạng',
                                          }
                                        : {
                                              pattern: /^0[0-9]{9}$/,
                                              message: 'Số điện thoại không đúng định dạng',
                                          },
                                ]}
                            >
                                <Row style={{ margin: '0 -4px', rowGap: 8 }}>
                                    <Col md={10} xs={17} style={{ padding: '0 4px' }}>
                                        <Input
                                            size="large"
                                            placeholder={`${name === 'Email' ? 'Địa chỉ email' : 'Số điện thoại'} mới`}
                                            defaultValue={value}
                                        />
                                    </Col>
                                    <Col style={{ padding: '0 4px' }}>
                                        <div className="d-flex gap-2">
                                            <Button
                                                size="large"
                                                style={{ padding: '4px 10px' }}
                                                type="primary"
                                                className="box-center"
                                                htmlType="submit"
                                            >
                                                <IconCheck />
                                            </Button>
                                            <Button
                                                size="large"
                                                style={{ padding: '4px 10px' }}
                                                className="box-center"
                                                onClick={() => setIsChange(false)}
                                            >
                                                <IconX />
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    ) : (
                        <div className="d-flex align-items-center">
                            <div className="text-subtitle">{name}: </div>

                            <div className="pl-2">
                                {value}
                                <EditOutlined className="ml-2 text-subtitle cursor-pointer" onClick={() => setIsChange(true)} />
                            </div>
                        </div>
                    )}
                </Fragment>
            )}

            <Modal
                width={500}
                centered
                open={openModal}
                onOk={() => setOpenModal(false)}
                onCancel={() => setOpenModal(false)}
                footer={null}
            >
                <Flex justify="center" className="mb-4 mt-2">
                    <Avatar
                        src={imageEnable2Fa}
                        style={{
                            width: 120,
                            height: 120,
                            lineHeight: 120,
                            fontSize: 18,
                            borderRadius: 0,
                        }}
                    />
                </Flex>
                <div className="text-center mb-5 text-subtitle">
                    {currentUser?.two_factor_auth_type === 'Google' ? (
                        <Fragment>
                            Bạn đã bật <b>Google Authenticator</b> Vui lòng mở ứng dụng <b>Google Authenticator</b> để nhận mã và nhập mã
                            vào ô bên dưới để tiếp tục.
                        </Fragment>
                    ) : (
                        <Fragment>
                            Quý khách đang bật xác thực 2 bước qua Email, để tắt xác thực quý khách vui lòng nhấn vào <b>Gửi mã</b> để nhận
                            mã kích hoạt tắt xác thực và nhập mã vào ô bên dưới để tiếp tục.
                        </Fragment>
                    )}
                </div>

                <Form layout="vertical" form={form} onFinish={handleTurnOff2Fa}>
                    <Form.Item className="mb-0" rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận' }]}>
                        {currentUser?.two_factor_auth_type === 'Google' ? (
                            <Input size="large" placeholder="Mã xác nhận" value={otpValue} onChange={(e) => setOtpValue(e.target.value)} />
                        ) : (
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
                        )}
                    </Form.Item>

                    <Flex justify="end" className="pt-2 gap-2">
                        <Button
                            size="large"
                            className="box-center text-subtitle hover-blue"
                            icon={<IconCancel size={22} />}
                            onClick={() => setOpenModal(false)}
                        >
                            Huỷ
                        </Button>
                        <Button
                            size="large"
                            disabled={!otpValue}
                            type="primary"
                            className="flex-1 box-center"
                            htmlType="submit"
                            icon={<IconCheck size={22} />}
                        >
                            Xác nhận
                        </Button>
                    </Flex>
                </Form>
            </Modal>
        </div>
    );
}

export default SecurityItem;
