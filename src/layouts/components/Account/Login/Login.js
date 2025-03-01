import { Link, useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconLock, IconMail } from '@tabler/icons-react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { Button, Flex, Input, Form, Divider, Spin, notification, Checkbox } from 'antd';

import router from '~/configs/routes';
import { app } from '~/firebase/config';
import logoGitHub from '~/assets/image/github.png';
import favIconLogo from '~/assets/image/favicon.png';
import logoGoogle from '~/assets/image/logo-google.png';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';
import { startLoadingGlobal, stopLoadingGlobal } from '~/redux/reducer/loading';
import { requestUserGetCurrent, requestUserLoginGoogle, requestUserLogin, requestUserVerifyLogin } from '~/services/auth';

function Login({ setModule, onHide }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isVerify, setIsVerify] = useState(false);
    const [verifyType, setVerifyType] = useState(null);
    const [loadingButton, setLoadingButton] = useState(false);

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { configs } = useSelector((state) => state.apps);
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (currentUser) {
            const fetch = async () => {
                dispatch(startLoadingGlobal());
                const result = await requestUserGetCurrent();

                dispatch(stopLoadingGlobal());
                if (result?.status === 200) {
                    dispatch(loginUserSuccess(result.data));
                    navigate(router.home);
                } else {
                    dispatch(logoutUserSuccess());
                }
            };
            fetch();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleVerifyOtpLogin = async (values) => {
        const { otp } = values;

        if (!otp || otp.length !== 6) {
            return notification.error({ message: 'Thông báo', description: 'Mã xác minh không hợp lệ' });
        }

        setLoadingButton(true);
        const data = {
            otp,
            email,
            password,
            type: verifyType,
        };

        const result = await requestUserVerifyLogin(data);

        setLoadingButton(false);
        if (result?.status === 200) {
            dispatch(loginUserSuccess(result.data));
            onHide();

            notification.success({
                message: 'Thông báo',
                description: result.message,
            });
        } else {
            notification.error({
                message: 'Thông báo',
                description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handleLoginEmail = async (data) => {
        setEmail(data.email);
        setLoadingButton(true);
        setPassword(data.password);

        const result = await requestUserLogin(data);

        setLoadingButton(false);
        if (result?.status === 1) {
            navigate(`${router.verify}?email=${data.email}`);
        } else if (result?.status === 2) {
            setIsVerify(true);
            setVerifyType(result.data);
        } else if (result?.status === 200) {
            dispatch(loginUserSuccess(result.data));
            onHide();
            notification.success({
                message: 'Thông báo',
                description: result.message,
            });
        } else {
            notification.error({
                message: 'Thông báo',
                description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handleLoginGoogle = async () => {
        try {
            const auth = getAuth(app);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            dispatch(startLoadingGlobal());
            const token = await result.user.getIdToken();

            const response = await requestUserLoginGoogle({ token });

            dispatch(stopLoadingGlobal());
            if (response.status === 200) {
                dispatch(loginUserSuccess(response.data));
                window.location.reload();
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: 'Lỗi đăng nhập bằng google',
            });
        }
    };

    const handleLoginGithub = async () => {
        notification.error({
            message: 'Thông báo',
            description: 'Chức năng đang được phát triển',
        });
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
        <Fragment>
            {isVerify && verifyType ? (
                <Fragment>
                    <div className="form_account-header">
                        <Link to={router.home}>
                            <img src={configs?.favicon_url || favIconLogo} alt="" style={{ width: 40, height: 40 }} />
                        </Link>

                        <h3 className="mb-3 font-weight-bold font-size-30 text-center">Xác thực OTP</h3>
                        <p className="mb-6 text-left">
                            {verifyType === 'Email' ? (
                                <Fragment>
                                    Một mã xác minh đã được gửi đến địa chỉ email của bạn. Mã xác minh sẽ có hiệu lực trong 5 phút. Vui lòng
                                    nhập mã vào ô bên dưới để tiếp tục.
                                </Fragment>
                            ) : (
                                <Fragment>
                                    Bạn đã bật <b>Google Authenticator</b> để xác thực. Vui lòng mở ứng dụng <b>Google Authenticator</b> để
                                    nhận mã và nhập mã vào ô bên dưới để tiếp tục.
                                </Fragment>
                            )}
                        </p>
                    </div>

                    <div className="form_account-form">
                        <Form form={form} name="horizontal_login" onFinish={handleVerifyOtpLogin}>
                            <Form.Item
                                name="otp"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mã xác nhận',
                                    },
                                ]}
                            >
                                <Input.OTP
                                    length={6}
                                    autoFocus
                                    size="large"
                                    placeholder="Mã xác nhận"
                                    {...sharedProps}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" size="large" disabled={loadingButton} style={{ width: '100%' }}>
                                {loadingButton ? <Spin /> : <Fragment>Xác nhận</Fragment>}
                            </Button>
                        </Form>
                    </div>
                </Fragment>
            ) : (
                <Fragment>
                    <div className="form_account-header">
                        <Link to={router.home}>
                            <img src={configs?.favicon_url || favIconLogo} alt="" style={{ width: 40, height: 40 }} />
                        </Link>

                        <h3 className="my-2 font-bold font-size-30">Welcome Back</h3>

                        <p className="mb-6">Chào mừng bạn trở lại! Vui lòng nhập thông tin của bạn.</p>
                    </div>

                    <div className="form_account-form">
                        <Form form={form} name="horizontal_login" onFinish={handleLoginEmail} initialValues={{ remember: true }}>
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập email',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Email không đúng định dạng',
                                    },
                                ]}
                            >
                                <Input size="large" autoFocus prefix={<IconMail />} placeholder="Nhập địa chỉ email của bạn" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mật khẩu',
                                    },
                                    {
                                        pattern: /^\S{6,30}$/,
                                        message: 'Mật khẩu không hợp lệ',
                                    },
                                ]}
                                style={{ marginBottom: 12 }}
                            >
                                <Input.Password
                                    size="large"
                                    prefix={<IconLock />}
                                    placeholder="Nhập mật khẩu của bạn"
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                            <Flex justify="space-between" className="my-5">
                                <Form.Item name="remember" valuePropName="checked" label={null}>
                                    <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                                </Form.Item>

                                <div className="text-info cursor-pointer" onClick={() => setModule('reset')}>
                                    Quên mật khẩu?
                                </div>
                            </Flex>
                            <Form.Item shouldUpdate>
                                {() => (
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        disabled={loadingButton}
                                        style={{ width: '100%' }}
                                    >
                                        {loadingButton ? <Spin /> : <Fragment>ĐĂNG NHẬP</Fragment>}
                                    </Button>
                                )}
                            </Form.Item>
                        </Form>
                    </div>
                </Fragment>
            )}

            <Divider style={{ color: '#7a869a' }}>Hoặc thông qua</Divider>
            <Flex justify="center" gap={10}>
                <Button
                    size="large"
                    style={{ display: 'flex', alignItems: 'center', borderRadius: 40 }}
                    onClick={handleLoginGoogle}
                    disabled={isVerify || verifyType}
                >
                    <img src={logoGoogle} alt="Google" className="login-google" />
                </Button>
                <Button
                    size="large"
                    style={{ display: 'flex', alignItems: 'center', borderRadius: 40 }}
                    onClick={handleLoginGithub}
                    disabled={isVerify || verifyType}
                >
                    <img src={logoGitHub} alt="GitHub" className="login-google" />
                </Button>
            </Flex>

            <div className="text-center mt-4">
                Bạn chưa có tài khoản?{' '}
                <span className="text-info cursor-pointer" onClick={() => setModule('register')}>
                    Đăng ký ngay
                </span>
            </div>

            <Flex justify="center" className="font-size-14 mt-6 gap-5">
                <Link target="_blank" to={router.terms}>
                    Điều khoản
                </Link>
                <Link target="_blank" to={router.privacy}>
                    Bảo mật
                </Link>
                <Link target="_blank" to={router.commit}>
                    Cam kết dịch vụ
                </Link>
            </Flex>
        </Fragment>
    );
}

export default Login;
