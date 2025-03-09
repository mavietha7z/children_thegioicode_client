import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft, IconCreditCardPay, IconGift } from '@tabler/icons-react';
import { Avatar, Breadcrumb, Button, Card, Col, Flex, Radio, Row, Space, Spin, Table, Tooltip, notification } from 'antd';

import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import imagePoint from '~/assets/image/point.png';
import imageWallet from '~/assets/image/wallet.png';
import { Fragment, useEffect, useState } from 'react';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserGetInvoiceDetail, requestUserPaymentInvoice } from '~/services/billing';

function InvoiceDetail() {
    const [invoice, setInvoice] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { invoice_id } = useParams();

    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (invoice_id) {
            document.title = `Netcode.vn - #${invoice_id}`;

            const fetch = async () => {
                const result = await requestUserGetInvoiceDetail(invoice_id);

                setLoading(false);
                if (result.status === 401 || result.status === 403) {
                    dispatch(logoutUserSuccess());
                    navigate(router.home);
                    notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
                } else if (result.status === 200) {
                    const { products, ...others } = result.data;

                    setInvoice({ ...others });
                    setProducts(products);
                } else {
                    navigate(router.billing_invoices);
                    notification.error({
                        message: 'Thông báo',
                        description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                    });
                }
            };
            fetch();
        } else {
            navigate(router.billing_invoices);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoice_id]);

    const handlePaymentInvoice = async () => {
        if (!invoice_id) {
            return notification.error({
                message: 'Thông báo',
                description: 'Lỗi lấy ID hoá đơn cần thanh toán',
            });
        }

        if (Math.abs(invoice.total_payment) > currentUser.wallet.total_balance) {
            return notification.error({
                message: 'Thông báo',
                description: 'Số dư ví không đủ thanh toán hoá đơn này',
            });
        }

        setPaymentLoading(true);

        const result = await requestUserPaymentInvoice(invoice_id);

        setPaymentLoading(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result.status === 200) {
            setInvoice(result.data);
            setProducts(result.data.products);

            const { wallet, ...others } = currentUser;
            const { credit_balance, total_balance, ...rest } = wallet;
            dispatch(
                loginUserSuccess({
                    wallet: {
                        credit_balance: credit_balance - Math.abs(invoice.total_payment),
                        total_balance: credit_balance - Math.abs(invoice.total_payment) + wallet.bonus_balance,
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
            title: 'Nội dung',
            key: 'title',
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
            title: 'Chu kỳ',
            dataIndex: 'cycles',
            key: 'cycles',
            render: (cycles) => <div className="font-bold">{cycles ? cycles : '_'}</div>,
        },
        {
            title: 'Thành tiền',
            key: 'total_price',
            render: (data) => (
                <Flex align="center" justify="space-between">
                    <div>
                        {invoice.recurring_type && data.fees !== 0 && (
                            <Tooltip
                                title={`Phí ${
                                    invoice.recurring_type === 'register'
                                        ? 'khởi tạo'
                                        : invoice.recurring_type === 'renew'
                                        ? 'gia hạn'
                                        : invoice.recurring_type === 'upgrade'
                                        ? 'nâng cấp'
                                        : invoice.recurring_type === 'destroy'
                                        ? 'huỷ'
                                        : invoice.recurring_type
                                }`}
                            >
                                <div
                                    className={`font-size-12 text-right ${
                                        data.fees > 0 ? 'text-success' : 'text-danger text-line-through'
                                    }`}
                                >
                                    {data.fees > 0 && '+'}
                                    {convertCurrency(data.fees)}
                                </div>
                            </Tooltip>
                        )}
                        <div className="font-size-15 font-bold">{convertCurrency(data.total_price)}</div>
                    </div>
                </Flex>
            ),
        },
    ];

    return (
        <div className="container">
            <Row>
                <Col span={24}>
                    <Flex className="gap-2 mb-3 ml-2">
                        <Button size="small" className="box-center" onClick={() => navigate(router.billing_invoices)}>
                            <IconArrowLeft size={18} />
                        </Button>
                        <Breadcrumb
                            className="flex-1"
                            items={[
                                {
                                    title: <Link to={router.home}>Trang chủ</Link>,
                                },
                                {
                                    title: <Link to={router.billing_invoices}>Hoá đơn</Link>,
                                },
                                {
                                    title: `#${invoice_id}`,
                                },
                            ]}
                        />
                    </Flex>
                </Col>

                {!loading && invoice ? (
                    <Col span={24}>
                        <Row style={{ rowGap: 16 }}>
                            <Col span={24} style={{ padding: '0 8px' }}>
                                <Card size="small">
                                    <h2 className="font-size-20 line-height-22 mb-0 font-bold">Hóa đơn #{invoice_id}</h2>
                                    <span
                                        className={`font-bold font-size-13 text-uppercase ${
                                            invoice.status === 'pending'
                                                ? 'text-warning'
                                                : invoice.status === 'completed'
                                                ? 'text-success'
                                                : ''
                                        }`}
                                    >
                                        {invoice.status === 'pending'
                                            ? 'Chờ thanh toán'
                                            : invoice.status === 'completed'
                                            ? 'Đã thanh toán'
                                            : ''}
                                    </span>
                                </Card>
                            </Col>

                            <Col md={17} xs={24} style={{ padding: '0 8px' }}>
                                <Space direction="vertical" className="w-full" style={{ gap: 16 }}>
                                    <Card styles={{ body: { padding: 18 } }}>
                                        <h3 className="font-size-18 font-bold mb-0 border-b-dashed mb-3 border-bottom">
                                            Thông tin hoá đơn
                                        </h3>

                                        <Row style={{ margin: '0 -8px', rowGap: 16 }}>
                                            <Col md={12} xs={24} style={{ padding: '0 8px' }}>
                                                <div className="d-flex flex-column gap-3">
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <div>Loại hoá đơn:</div>
                                                        <div className="text-subtitle">
                                                            {invoice.type === 'service'
                                                                ? 'Dịch vụ'
                                                                : invoice.type === 'recharge'
                                                                ? 'Nạp tiền'
                                                                : invoice.type === 'withdrawal'
                                                                ? 'Rút tiền'
                                                                : invoice.type === 'deposit'
                                                                ? 'Cộng tiền'
                                                                : 'Trừ tiền'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={12} xs={24} style={{ padding: '0 8px' }}>
                                                <div className="d-flex flex-column gap-3">
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <div>Ngày tạo:</div>
                                                        <div className="text-subtitle">
                                                            {moment(invoice.created_at).format('DD/MM/YYYY HH:mm:ss')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={12} xs={24} style={{ padding: '0 8px' }}>
                                                <div className="d-flex flex-column gap-3">
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <div>Loại tiền:</div>
                                                        <div className="text-subtitle">{invoice.currency}</div>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={12} xs={24} style={{ padding: '0 8px' }}>
                                                <div className="d-flex flex-column gap-3">
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <div>Ngày {invoice.status === 'pending' ? 'đáo hạn' : 'xử lý'}:</div>
                                                        <div className="text-subtitle">
                                                            {moment(
                                                                invoice.status === 'pending' ? invoice.expired_at : invoice.processed_at,
                                                            ).format('DD/MM/YYYY HH:mm:ss')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="mt-5">
                                            <h3 className="font-size-16 font-bold mb-1 pb-2 border-bottom border-b-dashed">Items</h3>

                                            <Table
                                                className="orders-table"
                                                columns={columns}
                                                dataSource={products.map((product, index) => ({ key: index, ...product }))}
                                                pagination={false}
                                            />
                                        </div>
                                    </Card>

                                    <Card styles={{ body: { padding: 18 } }}>
                                        {invoice.status === 'completed' && (
                                            <div className="border-bottom">
                                                <Flex className="gap-2 pb-2">
                                                    <IconGift size={22} className="text-danger cursor-pointer" style={{ marginTop: 2 }} />
                                                    <h3 className="font-size-18 font-bold mb-0">Mã giảm giá</h3>
                                                </Flex>
                                                <div className="border-top border-t-dashed p-3">
                                                    {invoice.coupons.length > 0 ? (
                                                        <Fragment>
                                                            {invoice.coupons.map((coupon, index) => (
                                                                <div
                                                                    className={`${index < invoice.coupons.length - 1 ? 'mb-2' : ''} ${
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

                                        {invoice.status === 'pending' ? (
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
                                                        src={invoice.localbank?.logo_url || imageWallet}
                                                        style={{ fontSize: 18, width: 35, height: 35, lineHeight: 35 }}
                                                    />
                                                    <span className="text-black">{invoice.localbank?.full_name || 'Ví Netcode'}</span>
                                                </Flex>
                                            </div>
                                        )}
                                    </Card>
                                </Space>
                            </Col>

                            <Col md={7} xs={24} style={{ padding: '0 8px' }}>
                                <Flex className="flex-column gap-4">
                                    <Card styles={{ body: { padding: 18 } }}>
                                        {invoice.status === 'completed' && (
                                            <div className="ribbon">
                                                <span>PAID</span>
                                            </div>
                                        )}
                                        <h2 className="font-size-18 mb-0">Chi tiết giá</h2>

                                        <Flex className="flex-column mt-3 border-top border-t-dashed">
                                            <Flex justify="space-between" className="py-2 border-bottom border-b-dashed">
                                                <span className="font-bold">Tổng số tiền</span>
                                                <span className="font-bold">{convertCurrency(Math.abs(invoice.total_price))}</span>
                                            </Flex>
                                            <Flex justify="space-between" className="py-2 border-bottom border-b-dashed">
                                                <span className="font-bold">Chiết khấu</span>
                                                <span className="font-bold text-danger">
                                                    {convertCurrency(invoice.total_price - invoice.total_payment)}
                                                </span>
                                            </Flex>
                                            <Flex justify="space-between" className="py-2 border-bottom border-b-dashed">
                                                <span className="font-bold">Điểm nhận được</span>
                                                <span className="font-bold text-warning">
                                                    <span className="mr-1">{convertCurrency(invoice.bonus_point).slice(0, -1)}</span>
                                                    <img src={imagePoint} alt="Point" style={{ width: 12, height: 12 }} />
                                                </span>
                                            </Flex>
                                            <Flex
                                                justify="space-between"
                                                className={`${invoice.status === 'pending' ? 'border-bottom py-2' : 'pt-2'}`}
                                            >
                                                <span className="font-bold">Tổng thanh toán</span>
                                                <span className="font-bold font-size-18 text-primary">
                                                    {convertCurrency(Math.abs(invoice.total_payment))}
                                                </span>
                                            </Flex>

                                            {invoice.status !== 'completed' && (
                                                <div className="mt-4">
                                                    <Button type="primary" loading={paymentLoading} block onClick={handlePaymentInvoice}>
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

export default InvoiceDetail;
