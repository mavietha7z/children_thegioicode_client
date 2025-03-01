import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IconArrowBackUp, IconCancel, IconCheck } from '@tabler/icons-react';
import { Avatar, Button, Col, Flex, Form, Input, Modal, notification, Radio, Row } from 'antd';

import Account from '../../Account';
import router from '~/configs/routes';
import Authentication from './Authentication';
import imageEnable2Fa from '~/assets/image/enable-2fa.png';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserSecurityEnable2Fa, requestUserVerifyPassword } from '~/services/account';

function TwoFactor() {
    const [value, setValue] = useState('0');
    const [urlQr, setUrlQr] = useState(null);
    const [disable, setDisable] = useState(false);
    const [openModel, setOpenModel] = useState(false);

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        document.title = 'Thegioicode.com - Xác thực 2 bước';

        if (!currentUser) {
            navigate(router.home);
            return notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
        }

        setDisable(currentUser?.two_factor_auth);
        if (currentUser?.two_factor_auth) {
            setValue(currentUser?.two_factor_auth_type);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const handleSelectOption = (e) => {
        const value = e.target.value;

        if (value === 'Google') {
            setOpenModel(true);
        } else {
            setValue(value);
        }
    };

    const handleVerifyPassword = async (values) => {
        const data = { password: values.password };

        const result = await requestUserVerifyPassword(data);

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            setValue('Google');
            setOpenModel(false);
            form.resetFields();

            const resultEnable = await requestUserSecurityEnable2Fa({ two_factor_auth_type: 'Google' });

            if (resultEnable.status === 401 || resultEnable.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
            } else if (resultEnable?.status === 200) {
                setUrlQr(resultEnable.data);
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: resultEnable.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handleActive2Fa = async (type) => {
        const { two_factor_auth, two_factor_auth_type, ...other } = currentUser;
        const newCurrentUser = { two_factor_auth: true, two_factor_auth_type: type, ...other };
        dispatch(loginUserSuccess(newCurrentUser));

        navigate(router.security);
        notification.success({
            message: 'Thông báo',
            description: 'Bạn đã kích hoạt xác thực 2 bước thành công',
        });
    };

    return (
        <Account>
            <div className="w-full">
                <div className="d-flex gap-3 border-bottom pb-2 mb-4">
                    <Button
                        className="box-center mt-1"
                        size="small"
                        onClick={() => navigate(router.security)}
                        style={{ width: 32, height: 32 }}
                    >
                        <IconArrowBackUp size={20} />
                    </Button>

                    <div className="flex-1">
                        <h3 className="font-bold font-size-20 mb-0">Xác thực 2 bước (2FA)</h3>
                    </div>
                </div>

                <Row justify="center">
                    <Col md={20} xs={24}>
                        <h3 className="font-bold font-size-26 text-center ">Xác thực 2 bước (2FA)</h3>

                        <p className="text-center text-subtitle mb-4">
                            Bảo vệ tài khoản của bạn bằng xác thực hai bước. Khi bật xác thực hai bước, bạn sẽ thêm một lớp bảo mật bổ sung
                            vào tài khoản của mình, đảm bảo an toàn ngay cả khi mật khẩu bị đánh cắp theo các cách sau:
                        </p>

                        <div className="box-justify-center">
                            <Radio.Group
                                onChange={handleSelectOption}
                                value={value}
                                disabled={disable}
                                className="w-full max-width-80 mt-5 mb-8"
                            >
                                <Row style={{ marginLeft: -12, marginRight: -12, rowGap: 20 }}>
                                    <Col md={8} xs={24} style={{ paddingLeft: 12, paddingRight: 12 }}>
                                        <Radio value="0" className="border-antd billing-payment-method_item">
                                            Không sử dùng
                                        </Radio>
                                    </Col>
                                    <Col md={8} xs={24} style={{ paddingLeft: 12, paddingRight: 12 }}>
                                        <Radio value="Email" className="border-antd billing-payment-method_item">
                                            Xác thực email
                                        </Radio>
                                    </Col>
                                    <Col md={8} xs={24} style={{ paddingLeft: 12, paddingRight: 12 }}>
                                        <Radio value="Google" className="border-antd billing-payment-method_item">
                                            Xác thực ứng dụng
                                        </Radio>
                                    </Col>
                                </Row>
                            </Radio.Group>
                        </div>

                        {value !== '0' && <Authentication type={value} urlQr={urlQr} callback={handleActive2Fa} />}
                    </Col>
                </Row>

                <Modal
                    width={450}
                    centered
                    open={openModel}
                    onOk={() => setOpenModel(false)}
                    onCancel={() => setOpenModel(false)}
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
                    <div className="text-center mb-5 text-subtitle">Để tiếp tục quý khách vui lòng xác nhận mật khẩu vào ô bên dưới</div>

                    <Form layout="vertical" form={form} onFinish={handleVerifyPassword}>
                        <Form.Item name="password" className="mb-0" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                            <Input.Password size="large" />
                        </Form.Item>

                        <Flex justify="end" className="pt-2 gap-2">
                            <Button
                                size="large"
                                className="box-center text-subtitle hover-blue"
                                icon={<IconCancel size={22} />}
                                onClick={() => setOpenModel(false)}
                            >
                                Huỷ
                            </Button>
                            <Button
                                size="large"
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
        </Account>
    );
}

export default TwoFactor;
