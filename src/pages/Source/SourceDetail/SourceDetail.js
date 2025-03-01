import { Helmet } from 'react-helmet';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft, IconEye, IconShoppingCartPlus, IconTag } from '@tabler/icons-react';
import { Breadcrumb, Button, Card, Col, Empty, Flex, Image, Row, Spin, message, notification } from 'antd';

import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import SlideImage from '~/components/SlideImage';
import imageNotFound from '~/assets/image/image_not.jpg';
import { requestUserAddProductToCart } from '~/services/cart';
import { requestUserGetSourceBySlug } from '~/services/source';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';

function SourceDetail() {
    const [source, setSource] = useState(null);
    const [loading, setLoading] = useState(false);

    const { slug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (slug) {
            const fetch = async () => {
                setLoading(true);
                const result = await requestUserGetSourceBySlug(slug);

                setLoading(false);
                if (result?.status === 200) {
                    setSource(result.data);
                } else {
                    navigate(router.sources);
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

    const handleAddSourceCart = async (id) => {
        if (!id) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn mã nguồn để thanh toán',
            });
        }

        const result = await requestUserAddProductToCart('source', { id });

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            notification.error({
                message: 'Thông báo',
                description: 'Vui lòng đăng nhập để tiếp tục',
            });
        } else if (result?.status === 200) {
            const { cart_count, ...others } = currentUser;
            dispatch(loginUserSuccess({ cart_count: cart_count + 1, ...others }));

            navigate(router.cart);
            message.success(result.message);
        } else {
            notification.error({
                message: 'Thông báo',
                description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    return (
        <Fragment>
            {source && (
                <Helmet>
                    <title>Thegioicode.com - {source.title}</title>
                    <meta key="description" name="description" content={`${source.description}`} />

                    <meta name="robots" content="index, follow" />
                    <meta property="og:image" content={`${source.image_url}`} />
                    <link rel="canonical" href={`https://thegioicode.com${pathname}`} />
                    <meta property="og:description" content={`${source.description}`} />
                    <meta property="og:url" content={`https://thegioicode.com${pathname}`} />
                    <meta property="og:title" content={`Thegioicode.com - ${source.title}`} />
                </Helmet>
            )}

            <Row style={{ rowGap: 16 }}>
                <Col span={24}>
                    <Flex className="gap-2 pl-2">
                        <Button size="small" className="box-center" onClick={() => navigate(router.sources)}>
                            <IconArrowLeft size={18} />
                        </Button>
                        <Breadcrumb
                            className="flex-1"
                            items={[
                                {
                                    title: <Link to={router.home}>Trang chủ</Link>,
                                },
                                {
                                    title: <Link to={router.sources}>Mã nguồn</Link>,
                                },
                                {
                                    title: source?.title,
                                },
                            ]}
                        />
                    </Flex>
                </Col>
                <Col md={20} xs={24} style={{ padding: '0 8px' }}>
                    <Card>
                        {!loading && source ? (
                            <Row style={{ margin: '0 -14px' }}>
                                <Col md={6} xs={24} style={{ padding: '0 14px' }}>
                                    <Image
                                        style={{ width: '100%', maxHeight: 240 }}
                                        src={source.image_url}
                                        alt={source.title}
                                        fallback={imageNotFound}
                                        className="border"
                                    />
                                </Col>

                                <Col md={14} xs={24} style={{ padding: '0 14px' }}>
                                    <h1 className="font-size-22 text-uppercase font-max mb-4">
                                        {source.title} {source.version && '-'}{' '}
                                        <span className="text-danger font-size-20">{source.version}</span>
                                    </h1>
                                    <div className="text-subtitle mb-xs-2">
                                        <p className="font-size-15" style={{ textAlign: 'justify' }}>
                                            {source.description}
                                        </p>
                                    </div>
                                </Col>
                                <Col md={4} xs={24} style={{ padding: '0 14px' }}>
                                    <Fragment>
                                        <h3 className="font-size-16 font-bold mb-4 d-flex align-items-center justify-content-between">
                                            Giá bán:
                                        </h3>

                                        <div className="d-flex align-items-center">
                                            <IconTag size={20} className="text-subtitle" style={{ transform: 'rotate(90deg)' }} />
                                            <span className="text-danger font-size-20 font-bold mx-1">
                                                {convertCurrency(source.pricing.price * (1 - source.pricing.discount / 100))}
                                            </span>
                                        </div>
                                        <span className="text-subtitle font-size-16 font-semibold d-block pl-4 text-line-through mb-5">
                                            {convertCurrency(source.pricing.price)}
                                        </span>
                                    </Fragment>

                                    <div>
                                        <Button
                                            type="primary"
                                            className="w-full box-center bg-warning"
                                            onClick={() => handleViewDemo(source.demo_url)}
                                        >
                                            <IconEye size={22} />
                                            <span className="text-uppercase ml-1">Xem mẫu</span>
                                        </Button>
                                        <Button
                                            type="primary"
                                            className="w-full mt-3 box-center"
                                            onClick={() => handleAddSourceCart(source.id)}
                                        >
                                            <IconShoppingCartPlus size={20} />
                                            <span className="text-uppercase ml-1">Giỏ hàng</span>
                                        </Button>
                                    </div>
                                </Col>

                                <Col span={24} className="pt-5">
                                    <div className="title-custom font-size-16 text-uppercase">Ảnh demo</div>

                                    <SlideImage images={source.image_meta} />
                                </Col>

                                <Col span={24}>
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

export default SourceDetail;
