import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IconMail } from '@tabler/icons-react';
import { Fragment, useState, useEffect } from 'react';
import { Button, Input, Form, Spin, notification, Alert, Space } from 'antd';

import router from '~/configs/routes';
import favIconLogo from '~/assets/image/favicon.png';
import { requestUserSendCodeVerifyEmail, requestUserVerifyOtpPassword } from '~/services/auth';

const validateOtp = (rule, value) => {
    if (!value) return Promise.reject('Vui lòng nhập mã xác nhận');
    if (value.length !== 6) return Promise.reject('Mã xác nhận phải có 6 ký tự');
    return Promise.resolve();
};

function Reset({ setModule, setEmail, setOtp }) {
    const [alert, setAlert] = useState(false);
    const [isSendOtp, setIsSendOtp] = useState(false);
    const [isOtpValid, setIsOtpValid] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);
    const [loadingSendOtp, setLoadingSendOtp] = useState(false);

    const [form] = Form.useForm();
    const { configs } = useSelector((state) => state.apps);

    const otp = Form.useWatch('otp', form);
    const email = Form.useWatch('email', form);

    // Kiểm tra email có hợp lệ không
    const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

    useEffect(() => {
        setIsOtpValid(otp && otp.length === 6);
    }, [otp]);

    // Điều kiện kích hoạt nút gửi mã
    const isSendOtpDisabled = !isEmailValid || loadingSendOtp || isSendOtp;

    // Điều kiện kích hoạt nút đặt mật khẩu
    const isSubmitDisabled = !isOtpValid || loadingButton;

    const handleSendOtpVerifyEmail = async () => {
        setIsSendOtp(true);
        setLoadingSendOtp(true);

        const data = { email, module: 'reset' };
        const result = await requestUserSendCodeVerifyEmail(data);

        setLoadingSendOtp(false);
        if (result?.status === 200) {
            setAlert(true);
            notification.success({ message: 'Thông báo', description: result.message });
        } else {
            notification.error({ message: 'Thông báo', description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau' });
        }
    };

    const handleSubmitResetPassword = async (values) => {
        setLoadingButton(true);

        const data = {
            otp: values.otp,
            email: values.email,
        };
        const result = await requestUserVerifyOtpPassword(data);

        setLoadingButton(false);
        if (result?.status === 200) {
            setOtp(values.otp);
            setEmail(values.email);
            setModule('reset_password');
        } else {
            notification.error({ message: 'Thông báo', description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau' });
        }
    };

    return (
        <Fragment>
            <div className="form_account-header">
                <Link to={router.home}>
                    <img src={configs?.favicon_url || favIconLogo} alt="" style={{ width: 40, height: 40 }} />
                </Link>
                <h3 className="my-2 font-bold font-size-30">Quên mật khẩu</h3>
                {!alert && <p className="mb-6">Nhập địa chỉ email đã đăng ký để xác minh tài khoản.</p>}
            </div>

            {alert && (
                <Alert
                    className="mb-6"
                    message="Vui lòng kiểm tra email để lấy lại mật khẩu. Nếu không nhận được, kiểm tra thư mục spam."
                    type="success"
                />
            )}

            <div className="form_account-form">
                <Form form={form} name="reset_password_form" onFinish={handleSubmitResetPassword}>
                    <Form.Item
                        name="email"
                        className="mt-6"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không đúng định dạng' },
                        ]}
                    >
                        <Input size="large" autoFocus prefix={<IconMail />} readOnly={alert} placeholder="Nhập địa chỉ email của bạn" />
                    </Form.Item>

                    <Form.Item name="otp" className="mt-6" rules={[{ validator: validateOtp }]}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input size="large" placeholder="Mã xác nhận" disabled={!isSendOtp} />
                            <Button
                                size="large"
                                className="box-center"
                                type="primary"
                                onClick={handleSendOtpVerifyEmail}
                                disabled={isSendOtpDisabled}
                                loading={loadingSendOtp}
                            >
                                Gửi mã
                            </Button>
                        </Space.Compact>
                    </Form.Item>

                    <Form.Item shouldUpdate>
                        {() => (
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                disabled={isSubmitDisabled}
                                style={{ width: '100%' }}
                                className="mt-5"
                            >
                                {loadingButton ? <Spin /> : 'ĐẶT MẬT KHẨU'}
                            </Button>
                        )}
                    </Form.Item>
                </Form>

                <Button size="large" block className="text-uppercase font-weight-bold" onClick={() => setModule('login')}>
                    Về trang đăng nhập
                </Button>
            </div>
        </Fragment>
    );
}

export default Reset;
