import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconCheck, IconSend } from '@tabler/icons-react';
import { Button, Col, Divider, Flex, Form, Input, notification, QRCode, Row } from 'antd';

import router from '~/configs/routes';
import imageChPlay from '~/assets/image/chplay.png';
import imageAppStore from '~/assets/image/appstore.png';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserSecurityEnable2Fa, requestUserSecurityVerify2Fa } from '~/services/account';

function Authentication({ type, urlQr, callback }) {
    const [sendCode, setSendCode] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        setSendCode(false);

        form.setFieldValue('otp', '');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    const handleSendCodeEmail = async () => {
        setLoadingButton(true);
        const result = await requestUserSecurityEnable2Fa({ two_factor_auth_type: type });

        setLoadingButton(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            setSendCode(true);
            notification.success({ message: 'Thành công', description: 'Gửi mã xác minh đến email thành công' });
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handleAuthentication = async (values) => {
        const { otp } = values;

        if (!otp || otp.length !== 6) {
            return notification.error({ message: 'Thông báo', description: 'Mã xác minh không hợp lệ' });
        }

        const data = {
            otp: values.otp,
            two_factor_auth_type: type,
        };

        const result = await requestUserSecurityVerify2Fa(data);

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            callback(type);
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const onChange = (otp) => {
        if (otp.length === 6) {
            form.submit();
        }
    };

    const sharedProps = {
        onChange,
    };

    return (
        <Form layout="vertical" form={form} onFinish={handleAuthentication}>
            <Row justify="center">
                <Col md={16} xs={24}>
                    <div className="border rounded-8 p-4">
                        <div className="font-size-20 font-bold text-center">
                            {type === 'Email' ? 'Xác thực Email' : 'Xác thực ứng dụng'}
                        </div>
                        <div className="text-center mt-2">
                            {type === 'Email' ? (
                                <Fragment>
                                    Để bật xác thực qua email, vui lòng nhấn vào nút <b>Gửi mã</b> để nhận mã xác nhận được gửi đến địa chỉ
                                    email <b>{currentUser?.email}</b> của bạn. Sau đó nhập mã xác nhận vào ô tương ứng. Cuối cùng, nhấn
                                    <b> Xác nhận</b> để hoàn tất quá trình bật xác thực.
                                </Fragment>
                            ) : (
                                <Fragment>
                                    Để bật xác thực qua ứng dụng, vui lòng tải ứng dụng <b>Google Authenticator</b> từ App Store hoặc Google
                                    Play. Sau đó quét mã QR dưới đây và nhập mã xác nhận vào ô tương ứng. Cuối cùng, nhấn <b>Xác nhận</b> để
                                    hoàn tất quá trình bật xác thực.
                                </Fragment>
                            )}
                        </div>

                        <div className="box-justify-center my-5">
                            {type === 'Google' && urlQr && <QRCode status="active" errorLevel="M" value={urlQr} />}
                        </div>

                        <Flex justify="center" align="center" className="flex-column">
                            <div style={{ width: '50%' }} className="w-xs-full">
                                <Form.Item name="otp">
                                    <Input.OTP
                                        size="large"
                                        style={{ width: '100%' }}
                                        length={6}
                                        {...sharedProps}
                                        disabled={!sendCode && type !== 'Google'}
                                    />
                                </Form.Item>
                            </div>
                            {type === 'Email' && !sendCode ? (
                                <Button
                                    size="large"
                                    type="primary"
                                    style={{ width: `${isMobile ? '100%' : '25%'}` }}
                                    disabled={type !== 'Email'}
                                    onClick={handleSendCodeEmail}
                                    className="box-center"
                                    loading={loadingButton}
                                >
                                    <IconSend size={20} />
                                    <span className="ml-1">Gửi mã</span>
                                </Button>
                            ) : (
                                <Button
                                    size="large"
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: `${isMobile ? '100%' : '25%'}` }}
                                    className="box-center"
                                >
                                    <IconCheck size={20} />
                                    <span className="ml-1">Xác nhận</span>
                                </Button>
                            )}
                        </Flex>

                        {type === 'Google' && (
                            <Fragment>
                                <Divider>
                                    <span className="text-subtitle font-size-13">Bạn chưa cài đặt ứng dụng?</span>
                                </Divider>
                                <Flex justify="center" className="gap-2 flex-wrap">
                                    <a
                                        href="https://apps.apple.com/vn/app/google-authenticator/id388497605"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Button size="large" className="box-align-center">
                                            <img src={imageAppStore} alt="App Store" className="mr-2" style={{ width: 18 }} />
                                            <span>App Store</span>
                                        </Button>
                                    </a>
                                    <a
                                        href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Button size="large" className="box-align-center">
                                            <img src={imageChPlay} alt="App Store" className="mr-2" style={{ width: 18 }} />
                                            <span>Google Play</span>
                                        </Button>
                                    </a>
                                </Flex>
                            </Fragment>
                        )}
                    </div>
                </Col>
            </Row>
        </Form>
    );
}

export default Authentication;
