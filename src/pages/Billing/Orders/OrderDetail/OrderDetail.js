import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft, IconCreditCardPay, IconDownload, IconGift } from '@tabler/icons-react';
import { Avatar, Breadcrumb, Button, Card, Col, Flex, Radio, Row, Space, Spin, Table, Tooltip, notification } from 'antd';

import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import imagePoint from '~/assets/image/point.png';
import imageWallet from '~/assets/image/wallet.png';
import { Fragment, useEffect, useState } from 'react';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserGetOrderDetail, requestUserPaymentOrder } from '~/services/billing';

function OrderDetail() {
    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { order_id } = useParams();

    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (order_id) {
            document.title = `Netcode.vn - #${order_id}`;

            const fetch = async () => {
                const result = await requestUserGetOrderDetail(order_id);

                setLoading(false);
                if (result.status === 401 || result.status === 403) {
                    dispatch(logoutUserSuccess());
                    navigate(router.home);
                    notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
                } else if (result.status === 200) {
                    const { products, ...others } = result.data;

                    setOrder({ ...others });
                    setProducts(products);
                } else {
                    navigate(router.billing_orders);
                    notification.error({
                        message: 'Thông báo',
                        description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                    });
                }
            };
            fetch();
        } else {
            navigate(router.billing_orders);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);

    const handlePaymentOrder = async () => {
        if (!order_id) {
            return notification.error({
                message: 'Thông báo',
                description: 'Lỗi lấy ID đơn hàng cần thanh tán',
            });
        }

        if (Math.abs(order.total_payment) > currentUser.wallet.total_balance) {
            return notification.error({
                message: 'Thông báo',
                description: 'Số dư ví không đủ thanh toán đơn hàng này',
            });
        }

        setPaymentLoading(true);

        const result = await requestUserPaymentOrder(order_id);

        setPaymentLoading(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result.status === 200) {
            setOrder(result.data);
            setProducts(result.data.products);

            const { wallet, ...others } = currentUser;
            const { credit_balance, total_balance, ...rest } = wallet;
            dispatch(
                loginUserSuccess({
                    wallet: {
                        credit_balance: credit_balance - Math.abs(order.total_payment),
                        total_balance: credit_balance - Math.abs(order.total_payment) + wallet.bonus_balance,
                        ...rest,
                    },
                    ...others,
                }),
            );

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

    const columns = [
        {
            title: 'Sản phẩm',
            key: 'product',
            render: (data) => (
                <Fragment>
                    <div className="font-size-16 font-bold">{data.title}</div>
                    <div className="text-subtitle">{data.description}</div>
                </Fragment>
            ),
        },
        {
            title: 'Đơn giá',
            key: 'unit_price',
            render: (data) => (
                <Fragment>
                    {data.discount > 0 && (
                        <div className="text-danger font-size-13 text-line-through">{convertCurrency(data.unit_price)}</div>
                    )}
                    <div className="font-size-15 font-bold">
                        {convertCurrency(data.unit_price - (data.unit_price * data.quantity * data.discount) / 100)}
                    </div>
                </Fragment>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity) => <div className="font-bold">{quantity}</div>,
        },
        {
            title: 'Thành tiền',
            key: 'total_price',
            render: (data) => (
                <Flex align="center" justify="space-between">
                    <div className="font-size-15 font-bold">{convertCurrency(data.total_price)}</div>

                    {data.data_url && (
                        <Tooltip title="Tải dữ liệu">
                            <a href={data.data_url} target="_blank" rel="noreferrer" className="ml-2">
                                <Button type="primary" size="small" className="box-center">
                                    <IconDownload size={16} />
                                </Button>
                            </a>
                        </Tooltip>
                    )}
                </Flex>
            ),
        },
    ];

    return (
        <div className="container">
            <Row>
                <Col span={24}>
                    <Flex className="gap-2 mb-3 ml-2">
                        <Button size="small" className="box-center" onClick={() => navigate(router.billing_orders)}>
                            <IconArrowLeft size={18} />
                        </Button>
                        <Breadcrumb
                            className="flex-1"
                            items={[
                                {
                                    title: <Link to={router.home}>Trang chủ</Link>,
                                },
                                {
                                    title: <Link to={router.billing_orders}>Đơn hàng</Link>,
                                },
                                {
                                    title: `#${order_id}`,
                                },
                            ]}
                        />
                    </Flex>
                </Col>

                {!loading && order ? (
                    <Col span={24}>
                        <Row style={{ rowGap: 16 }}>
                            <Col span={24} style={{ padding: '0 8px' }}>
                                <Card size="small">
                                    <h2 className="font-size-20 line-height-22 mb-0 font-bold">Xác nhận đơn hàng</h2>
                                    <span
                                        className={`font-bold font-size-13 text-uppercase ${
                                            order.status === 'pending' ? 'text-warning' : order.status === 'completed' ? 'text-success' : ''
                                        }`}
                                    >
                                        {order.status === 'pending' ? 'Chờ thanh toán' : order.status === 'completed' ? 'Hoàn thành' : ''}
                                    </span>
                                </Card>
                            </Col>

                            <Col md={17} xs={24} style={{ padding: '0 8px' }}>
                                <Space direction="vertical" className="w-full" style={{ gap: 16 }}>
                                    <Card styles={{ body: { padding: 18 } }}>
                                        <h3 className="font-size-18 font-bold mb-0 border-b-dashed mb-3 border-bottom">
                                            Thông tin đơn hàng
                                        </h3>

                                        <Row style={{ margin: '0 -8px', rowGap: 16 }}>
                                            <Col md={12} xs={24} style={{ padding: '0 8px' }}>
                                                <div className="d-flex flex-column gap-3">
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <div>Mã hóa đơn:</div>
                                                        <div className="text-subtitle">
                                                            <Link
                                                                to={`${router.billing_invoices}/${order.invoice_id}`}
                                                                className="font-bold"
                                                            >
                                                                #{order.invoice_id}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={12} xs={24} style={{ padding: '0 8px' }}>
                                                <div className="d-flex flex-column gap-3">
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <div>Ngày tạo:</div>
                                                        <div className="text-subtitle">
                                                            {moment(order.created_at).format('DD/MM/YYYY HH:mm:ss')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={12} xs={24} style={{ padding: '0 8px' }}>
                                                <div className="d-flex flex-column gap-3">
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <div>Ngày thanh toán:</div>
                                                        <div className="text-subtitle">
                                                            {order.status === 'completed'
                                                                ? moment(order.paid_at).format('DD/MM/YYYY HH:mm:ss')
                                                                : 'Chưa thanh toán'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="mt-5">
                                            <Table
                                                className="mt-3 border-t-dashed border-top orders-table"
                                                columns={columns}
                                                dataSource={products.map((product, index) => ({ key: index, ...product }))}
                                                pagination={false}
                                            />
                                        </div>
                                    </Card>

                                    <Card styles={{ body: { padding: 18 } }}>
                                        {order.status === 'completed' && (
                                            <div className="border-bottom">
                                                <Flex className="gap-2 pb-2">
                                                    <IconGift size={22} className="text-danger cursor-pointer" style={{ marginTop: 2 }} />
                                                    <h3 className="font-size-18 font-bold mb-0">Mã giảm giá</h3>
                                                </Flex>
                                                <div className="border-top border-t-dashed p-3">
                                                    {order.coupons.length > 0 ? (
                                                        <Fragment>
                                                            {order.coupons.map((coupon, index) => (
                                                                <div
                                                                    className={`${index < order.coupons.length - 1 ? 'mb-2' : ''} ${
                                                                        index > 0 ? 'border-top pt-2' : ''
                                                                    }`}
                                                                    key={index}
                                                                >
                                                                    <div className="font-bold font-size-15">{coupon.code}</div>
                                                                    <div className="text-subtitle">{coupon.description}</div>
                                                                </div>
                                                            ))}
                                                        </Fragment>
                                                    ) : (
                                                        <span className="text-subtitle">Không có mã giảm giá nào được áp dụng!</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <Flex className="flex-wrap gap-3 py-2">
                                            <h3 className="font-size-18 font-bold mb-0">Phương thức thanh toán</h3>
                                        </Flex>

                                        {order.status === 'pending' ? (
                                            <Radio.Group value={1} className="w-full">
                                                <Radio value={1} className="border-antd billing-payment-method_item">
                                                    <Flex align="center" className="gap-2">
                                                        <Avatar
                                                            shape="square"
                                                            src={imageWallet}
                                                            style={{ fontSize: 18, width: 35, height: 35, lineHeight: 35 }}
                                                        />
                                                        <div>
                                                            <span className="mr-2">Ví Netcode</span>
                                                            <p className="text-primary mb-0 line-height-15 font-size-13">
                                                                Số dư: {convertCurrency(currentUser?.wallet.total_balance)}
                                                            </p>
                                                        </div>
                                                    </Flex>
                                                </Radio>
                                            </Radio.Group>
                                        ) : (
                                            <div className="border-top border-t-dashed pt-3">
                                                <Flex align="center" className="gap-2">
                                                    <Avatar
                                                        shape="square"
                                                        src={imageWallet}
                                                        style={{ fontSize: 18, width: 35, height: 35, lineHeight: 35 }}
                                                    />
                                                    <span className="text-black">Ví Netcode</span>
                                                </Flex>
                                            </div>
                                        )}
                                    </Card>
                                </Space>
                            </Col>

                            <Col md={7} xs={24} style={{ padding: '0 8px' }}>
                                <Flex className="flex-column gap-4">
                                    <Card styles={{ body: { padding: 18 } }}>
                                        {order.status === 'completed' && (
                                            <div className="ribbon">
                                                <span>PAID</span>
                                            </div>
                                        )}
                                        <h2 className="font-size-18 mb-0">Chi tiết giá</h2>

                                        <Flex className="flex-column mt-3 border-top border-t-dashed">
                                            <Flex justify="space-between" className="py-2 border-bottom border-b-dashed">
                                                <span className="font-bold">Tổng số tiền</span>
                                                <span className="font-bold">{convertCurrency(order.total_price)}</span>
                                            </Flex>
                                            <Flex justify="space-between" className="py-2 border-bottom border-b-dashed">
                                                <span className="font-bold">Chiết khấu</span>
                                                <span className="font-bold text-danger">
                                                    {convertCurrency(order.total_payment - order.total_price)}
                                                </span>
                                            </Flex>
                                            <Flex justify="space-between" className="py-2 border-bottom border-b-dashed">
                                                <span className="font-bold">Điểm nhận được</span>
                                                <span className="font-bold text-warning">
                                                    <span className="mr-1">{convertCurrency(order.bonus_point).slice(0, -1)}</span>
                                                    <img src={imagePoint} alt="Point" style={{ width: 12, height: 12 }} />
                                                </span>
                                            </Flex>
                                            <Flex
                                                justify="space-between"
                                                className={`${order.status === 'pending' ? 'border-bottom py-2' : 'pt-2'}`}
                                            >
                                                <span className="font-bold">Tổng thanh toán</span>
                                                <span className="font-bold font-size-18 text-primary">
                                                    {convertCurrency(order.total_payment)}
                                                </span>
                                            </Flex>

                                            {order.status !== 'completed' && (
                                                <div className="mt-4">
                                                    <Button type="primary" loading={paymentLoading} block onClick={handlePaymentOrder}>
                                                        {paymentLoading ? (
                                                            'Đang thanh toán...'
                                                        ) : (
                                                            <div className="box-center">
                                                                <IconCreditCardPay size={20} />
                                                                <span className="ml-1">Thanh toán</span>
                                                            </div>
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                        </Flex>
                                    </Card>
                                </Flex>
                            </Col>
                        </Row>
                    </Col>
                ) : (
                    <Flex align="center" justify="center" className="w-full" style={{ minHeight: '60vh' }}>
                        <Spin />
                    </Flex>
                )}
            </Row>
        </div>
    );
}

export default OrderDetail;
