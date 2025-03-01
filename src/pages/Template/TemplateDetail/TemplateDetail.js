import { Helmet } from 'react-helmet';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft, IconCreditCardPay, IconEye } from '@tabler/icons-react';
import { Breadcrumb, Button, Card, Col, Empty, Flex, Form, Image, Input, Row, Select, Spin, notification } from 'antd';

import router from '~/configs/routes';
import TemplateModun from './TemplateModun';
import { convertCurrency } from '~/configs';
import SlideImage from '~/components/SlideImage';
import imageNotFound from '~/assets/image/image_not.jpg';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserGetTemplateBySlug, requestUserPaymentTemplate } from '~/services/template';

function TemplateDetail() {
    const [loading, setLoading] = useState(false);
    const [template, setTemplate] = useState(null);
    const [loadingPayment, setLoadingPayment] = useState(false);

    const { slug } = useParams();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { configs } = useSelector((state) => state.apps);
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (slug) {
            const fetch = async () => {
                setLoading(true);
                const result = await requestUserGetTemplateBySlug(slug);

                setLoading(false);
                if (result?.status === 200) {
                    setTemplate(result.data);
                } else {
                    navigate(router.templates);
                    notification.error({
                        message: 'Thông báo',
                        description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                    });
                }
            };
            fetch();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    const handleViewDemo = (demo_url) => {
        if (!currentUser) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng đăng nhập để tiếp tục',
            });
        }

        const url = demo_url || window.location.href;
        window.open(url, '_blank');
    };

    const handlePaymentTemplate = async (values) => {
        const data = {
            id: template.id,
            ...values,
        };

        setLoadingPayment(true);

        const result = await requestUserPaymentTemplate(data);

        setLoadingPayment(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            notification.error({
                message: 'Thông báo',
                description: 'Vui lòng đăng nhập để tiếp tục',
            });
        } else if (result?.status === 200) {
            navigate(`${router.billing_templates}/${result.data}`);

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

    return (
        <Fragment>
            {template && (
                <Helmet>
                    <title>Netcode.vn - {template.title}</title>
                    <meta key="description" name="description" content={`${template.description}`} />

                    <meta name="robots" content="index, follow" />
                    <meta property="og:image" content={`${template.image_url}`} />
                    <link rel="canonical" href={`https://netcode.vn${pathname}`} />
                    <meta property="og:description" content={`${template.description}`} />
                    <meta property="og:url" content={`https://netcode.vn${pathname}`} />
                    <meta property="og:title" content={`Netcode.vn - ${template.title}`} />
                </Helmet>
            )}

            <Row style={{ rowGap: 16 }}>
                <Col span={24}>
                    <Flex className="gap-2 pl-2">
                        <Button size="small" className="box-center" onClick={() => navigate(router.templates)}>
                            <IconArrowLeft size={18} />
                        </Button>
                        <Breadcrumb
                            className="flex-1"
                            items={[
                                {
                                    title: <Link to={router.home}>Trang chủ</Link>,
                                },
                                {
                                    title: <Link to={router.templates}>Tạo website</Link>,
                                },
                                {
                                    title: template?.title,
                                },
                            ]}
                        />
                    </Flex>
                </Col>

                <Col md={20} xs={24} style={{ padding: '0 8px' }}>
                    <Card>
                        {!loading && template ? (
                            <Row style={{ margin: '0 -14px' }}>
                                <Col md={12} xs={24} style={{ padding: '0 14px' }}>
                                    <div className="mb-5">
                                        <h1 className="font-size-22 text-uppercase font-max mb-4">
                                            {template.title} {template.version && '-'}{' '}
                                            <span className="text-danger font-size-20">{template.version}</span>
                                        </h1>

                                        <div className="text-subtitle mb-xs-2">
                                            <p className="font-size-15" style={{ textAlign: 'justify' }}>
                                                {template.description}
                                            </p>
                                        </div>
                                    </div>

                                    <Image
                                        style={{ width: '100%', maxHeight: 460 }}
                                        src={template.image_url}
                                        alt={template.title}
                                        fallback={imageNotFound}
                                        className="border"
                                    />
                                </Col>

                                <Col md={12} xs={24} style={{ padding: '0 14px' }}>
                                    <Form
                                        layout="vertical"
                                        form={form}
                                        onFinish={handlePaymentTemplate}
                                        initialValues={{ cycles: template.pricing[0].id }}
                                    >
                                        <Row gutter={16}>
                                            <Col md={24} xs={24}>
                                                <Form.Item
                                                    name="cycles"
                                                    label="Chu kỳ"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Vui lòng chọn chu kỳ muốn tạo',
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        size="large"
                                                        placeholder="Chọn chu kỳ"
                                                        options={template.pricing.map((option) => {
                                                            return {
                                                                label: (
                                                                    <Fragment>
                                                                        <span>
                                                                            {convertCurrency(option.price * (1 - option.discount / 100))}
                                                                        </span>
                                                                        <span className="ml-1 text-subtitle font-size-12 text-line-through">
                                                                            {convertCurrency(option.price)}
                                                                        </span>
                                                                        <span> / </span>
                                                                        <span>{option.cycles.display_name}</span>
                                                                        <span className="ml-1 text-danger font-size-12 text-line-through">
                                                                            {option.discount}%
                                                                        </span>
                                                                    </Fragment>
                                                                ),
                                                                value: option.id,
                                                            };
                                                        })}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col md={24} xs={24}>
                                                <Form.Item
                                                    name="domain"
                                                    label="Tên miền"
                                                    className="mb-0"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Vui lòng nhập tên miền của bạn',
                                                        },
                                                        {
                                                            pattern: /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,6}$/,
                                                            message: 'Tên miền có định dạng như: Netcode.vn',
                                                        },
                                                    ]}
                                                >
                                                    <Input size="large" placeholder="VD: Netcode.vn" />
                                                </Form.Item>
                                                <div className="mb-4 mt-1 font-size-13">
                                                    Nếu bạn chưa có tên miền thể mua{' '}
                                                    <Link to={configs?.contacts?.zalo_url} target="_blank">
                                                        tại đây
                                                    </Link>
                                                </div>
                                            </Col>
                                            <Col md={24} xs={24}>
                                                <Form.Item
                                                    name="email_admin"
                                                    label="Email quản trị"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Vui lòng nhập email quản trị',
                                                        },
                                                        {
                                                            type: 'email',
                                                            message: 'Email không đúng định dạng',
                                                        },
                                                    ]}
                                                >
                                                    <Input size="large" placeholder="VD: admin@Netcode.vn" />
                                                </Form.Item>
                                            </Col>
                                            <Col md={24} xs={24}>
                                                <Form.Item
                                                    name="password_admin"
                                                    label="Mật khẩu quản trị"
                                                    className="mb-0"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Vui lòng nhập mật khẩu quản trị',
                                                        },
                                                        {
                                                            pattern: /^\S{6,30}$/,
                                                            message: 'Mật khẩu không hợp lệ',
                                                        },
                                                    ]}
                                                >
                                                    <Input size="large" placeholder="Mật khẩu từ 6 - 20 kí tự" />
                                                </Form.Item>
                                                <div className="mb-4 mt-1 font-size-13">
                                                    Mật khẩu này có thể đổi sau khi đăng nhập quản trị
                                                </div>
                                            </Col>
                                        </Row>
                                        <Flex align="center" justify="center" gap={20}>
                                            <Button
                                                type="primary"
                                                className="bg-warning box-center"
                                                disabled={loadingPayment}
                                                onClick={() => handleViewDemo(template.demo_url)}
                                            >
                                                <IconEye size={22} />
                                                <span className="text-uppercase ml-1">Xem mẫu</span>
                                            </Button>

                                            <Button type="primary" htmlType="submit" loading={loadingPayment}>
                                                {loadingPayment ? (
                                                    <span>Loading...</span>
                                                ) : (
                                                    <div className="box-center">
                                                        <IconCreditCardPay size={20} />
                                                        <span className="text-uppercase ml-1">Thanh toán</span>
                                                    </div>
                                                )}
                                            </Button>
                                        </Flex>
                                    </Form>
                                </Col>

                                <Col span={24} className="pt-5">
                                    <div className="title-custom font-size-16 text-uppercase">Ảnh demo</div>

                                    <SlideImage images={template.image_meta} />
                                </Col>

                                <Col span={24} className="pt-5">
                                    <div className="title-custom font-size-16 text-uppercase">Chi tiết phần mềm</div>

                                    <TemplateModun
                                        details={template.modules.map((module, index) => {
                                            return {
                                                key: Math.random(),
                                                index: index + 1,
                                                ...module,
                                            };
                                        })}
                                    />
                                </Col>

                                <Col span={24} className="pt-5">
                                    <div className="title-custom font-size-16 text-uppercase">Đánh giá</div>

                                    <Empty description="Chưa có đánh giá nào" />
                                </Col>
                            </Row>
                        ) : (
                            <Flex align="center" justify="center" style={{ minHeight: '68vh' }}>
                                <Spin />
                            </Flex>
                        )}
                    </Card>
                </Col>

                <Col md={4} xs={24} style={{ padding: '0 8px' }}>
                    <Card
                        title={
                            <div>
                                <h2 className="font-size-20">Lịch sử cập nhật</h2>
                            </div>
                        }
                    >
                        <Empty description="Chưa có bản cập nhật nào" />
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
}

export default TemplateDetail;
