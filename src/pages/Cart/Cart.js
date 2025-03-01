import { isMobile } from 'react-device-detect';
import { GiftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconArrowLeft, IconCheck, IconChevronDown, IconTicket, IconTrash, IconX } from '@tabler/icons-react';
import { Breadcrumb, Button, Card, Col, Dropdown, Flex, Input, message, Modal, notification, Row, Spin } from 'antd';

import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import imagePoint from '~/assets/image/point.png';
import imageEmptyCart from '~/assets/image/empty-cart.png';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';
import {
    requestUserGetCart,
    requestUserClearCart,
    requestUserApplyCoupon,
    requestUserPaymentCart,
    requestUserChangeCycles,
    requestUserRemoveCoupon,
} from '~/services/cart';

function Cart() {
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);

    const [items, setItems] = useState([]);
    const [carts, setCarts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalBonusPoint, setTotalBonusPoint] = useState(0);

    const [coupon, setCoupon] = useState('');
    const [coupons, setCoupons] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        document.title = 'Thegioicode.com - Giỏ hàng';

        const fetch = async () => {
            setLoading(true);

            const result = await requestUserGetCart();

            setLoading(false);
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
                notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
            } else if (result.status === 200) {
                setCarts(result.data);
                setCoupons(result.coupons);
                setTotalPrice(result.total_price);
                setTotalPayment(result.total_payment);
                setTotalBonusPoint(result.bonus_point);
                setTotalDiscount(result.total_payment - result.total_price);
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        };
        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApplyCoupon = async () => {
        if (!coupon) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng nhập mã giảm giá',
            });
        }

        const data = {
            code: coupon,
        };

        const result = await requestUserApplyCoupon(data);

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result.status === 200) {
            const resultGetCart = await requestUserGetCart();

            if (resultGetCart.status === 401 || resultGetCart.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
            } else if (resultGetCart.status === 200) {
                setCoupon('');
                setCarts(resultGetCart.data);
                setCoupons(resultGetCart.coupons);
                setTotalPrice(resultGetCart.total_price);
                setTotalPayment(resultGetCart.total_payment);
                setTotalBonusPoint(resultGetCart.bonus_point);
                setTotalDiscount(resultGetCart.total_payment - resultGetCart.total_price);

                notification.success({
                    message: 'Thông báo',
                    description: result.message,
                });
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: resultGetCart.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handleRemoveCoupon = async (id) => {
        if (!id) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn mã giảm giá cần xoá',
            });
        }

        const result = await requestUserRemoveCoupon(id);

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result.status === 200) {
            const resultGetCart = await requestUserGetCart();

            if (resultGetCart.status === 401 || resultGetCart.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
            } else if (resultGetCart.status === 200) {
                setCarts(resultGetCart.data);
                setCoupons(resultGetCart.coupons);
                setTotalPrice(resultGetCart.total_price);
                setTotalPayment(resultGetCart.total_payment);
                setTotalBonusPoint(resultGetCart.bonus_point);
                setTotalDiscount(resultGetCart.total_payment - resultGetCart.total_price);

                notification.success({
                    message: 'Thông báo',
                    description: result.message,
                });
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: resultGetCart.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handleClearCart = async () => {
        const data = carts.map((data) => data.id);
        if (data.length < 1) {
            return notification.error({ message: 'Thông báo', description: 'Giỏ hàng trống không có gì để xoá' });
        }

        const result = await requestUserClearCart(data);

        setModalVisible(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result.status === 200) {
            const { cart_count, ...others } = currentUser;
            dispatch(loginUserSuccess({ cart_count: 0, ...others }));

            setCarts([]);
            setCoupons([]);
            setTotalPrice(0);
            setTotalPayment(0);
            setTotalDiscount(0);
            setTotalBonusPoint(0);

            notification.success({
                message: 'Thông báo',
                description: result.message,
            });
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handleRemoveItemCart = async (data) => {
        if (!data) {
            return notification.error({ message: 'Thông báo', description: 'Chọn sản phẩm cần xoá khỏi giỏ hàng' });
        }

        const result = await requestUserClearCart([data]);

        setModalVisible(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result.status === 200) {
            const resultGetCart = await requestUserGetCart();

            if (resultGetCart.status === 401 || resultGetCart.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
            } else if (resultGetCart.status === 200) {
                setCarts(resultGetCart.data);
                setCoupons(resultGetCart.coupons);
                setTotalPrice(resultGetCart.total_price);
                setTotalPayment(resultGetCart.total_payment);
                setTotalBonusPoint(resultGetCart.bonus_point);
                setTotalDiscount(resultGetCart.total_payment - resultGetCart.total_price);

                const { cart_count, ...others } = currentUser;
                dispatch(loginUserSuccess({ cart_count: cart_count - 1, ...others }));

                notification.success({
                    message: 'Thông báo',
                    description: result.message,
                });
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: resultGetCart.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handlePaymentCart = async () => {
        setLoadingPayment(true);
        const result = await requestUserPaymentCart();

        setLoadingPayment(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result.status === 200) {
            setCarts([]);
            setCoupons([]);
            setTotalPrice(0);
            setTotalPayment(0);
            setTotalDiscount(0);
            setTotalBonusPoint(0);

            const { cart_count, ...others } = currentUser;
            dispatch(loginUserSuccess({ cart_count: 0, ...others }));

            navigate(`${router.billing_orders}/${result.data}`);
            message.success(result.message);
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handleClickMenuCycle = async (e) => {
        const [product_id, pricing_id] = e.key.split('_');
        if (!product_id) {
            return notification.error({ message: 'Thông báo', description: 'Lỗi chọn sản phẩm để cập nhật' });
        }
        if (!pricing_id) {
            return notification.error({ message: 'Thông báo', description: 'Lỗi chọn chu kỳ để cập nhật' });
        }

        const data = {
            pricing_id,
            product_id,
        };

        const result = await requestUserChangeCycles(data);

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result.status === 200) {
            const resultGetCart = await requestUserGetCart();

            if (resultGetCart.status === 401 || resultGetCart.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
            } else if (resultGetCart.status === 200) {
                setCarts(resultGetCart.data);
                setCoupons(resultGetCart.coupons);
                setTotalPrice(resultGetCart.total_price);
                setTotalPayment(resultGetCart.total_payment);
                setTotalBonusPoint(resultGetCart.bonus_point);
                setTotalDiscount(resultGetCart.total_payment - resultGetCart.total_price);

                notification.success({
                    message: 'Thông báo',
                    description: result.message,
                });
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: resultGetCart.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        } else {
            notification.error({
                message: 'Thông báo',
                description: result.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const menuProps = {
        items,
        onClick: handleClickMenuCycle,
    };

    const handleChangeItemCycle = (product) => {
        const items = product.pricings.map((pricing) => {
            return {
                key: `${product.id}_${pricing.id}`,
                label: (
                    <Fragment>
                        {pricing.cycles.display_name}

                        {pricing.discount > 0 && (
                            <span className="bg-card-gray font-size-11 line-height-15 px-1 ml-1 border rounded-md text-danger font-bold">
                                {pricing.discount}%
                            </span>
                        )}
                    </Fragment>
                ),
                disabled: product.pricing.id === pricing.id,
            };
        });

        setItems(items);
    };

    return (
        <div className="container">
            <Row>
                <Col span={24}>
                    <Flex className="gap-2 mb-3 ml-2">
                        <Button size="small" className="box-center" onClick={() => navigate('/billing/orders')}>
                            <IconArrowLeft size={18} />
                        </Button>
                        <Breadcrumb
                            className="flex-1"
                            items={[
                                {
                                    title: <Link to={router.home}>Trang chủ</Link>,
                                },
                                {
                                    title: 'Giỏ hàng',
                                },
                            ]}
                        />
                    </Flex>
                </Col>

                {!loading ? (
                    <Col span={24}>
                        <Row style={{ rowGap: 16 }}>
                            <Col md={17} xs={24} style={{ padding: '0 8px' }}>
                                <Card styles={{ body: { padding: 18 } }}>
                                    {carts.length > 0 ? (
                                        <Fragment>
                                            <Flex align="center" justify="space-between">
                                                <h2 className="font-size-20 font-bold mb-0">Giỏ hàng ({carts.length})</h2>

                                                <Button
                                                    danger
                                                    type="link"
                                                    className="box-center gap-1"
                                                    onClick={() => setModalVisible(true)}
                                                >
                                                    <IconTrash size={18} />
                                                    Làm trống
                                                </Button>
                                            </Flex>

                                            <div className="mt-2 border-top  border-t-dashed">
                                                <div className="w-full">
                                                    {!isMobile && (
                                                        <div className="pt-3 pb-2-5 border-bottom">
                                                            <div className="d-flex justify-content-between gap-3">
                                                                <div className="flex-1 d-flex justify-content-between gap-3">
                                                                    <div className="flex-1 font-weight-bold font-size-15">Sản phẩm</div>

                                                                    <div className="w-max-120 w-full d-flex">
                                                                        <div className="font-weight-bold font-size-15">Chu kỳ</div>
                                                                    </div>
                                                                </div>

                                                                <div className="w-max-140 w-full text-right font-weight-bold font-size-15">
                                                                    Số tiền
                                                                </div>
                                                                <div style={{ width: 26 }}></div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {!isMobile ? (
                                                        <Fragment>
                                                            {carts.map((cart, index) => (
                                                                <div
                                                                    className={`flex-1 py-2-5 ${index > 0 ? 'border-top' : ''}`}
                                                                    key={cart.id}
                                                                >
                                                                    <div className="d-flex justify-content-between gap-3">
                                                                        <div className="flex-1">
                                                                            <div className="d-flex justify-content-between gap-3">
                                                                                <div className="flex-1">
                                                                                    <div className="font-bold font-size-16 line-height-20">
                                                                                        {cart.title}
                                                                                    </div>

                                                                                    <div className="d-flex gap-1 mt-1 max-w-content">
                                                                                        <span
                                                                                            className="text-subtitle text-ellipsis ellipsis-1 text-subtitle"
                                                                                            title={cart.description}
                                                                                        >
                                                                                            {cart.description}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="w-max-120 w-full">
                                                                                    <Dropdown
                                                                                        menu={menuProps}
                                                                                        trigger={['click']}
                                                                                        className="d-flex align-items-center gap-1 cursor-pointer border border-antd no-select rounded-md py-1 px-2"
                                                                                        onOpenChange={() => handleChangeItemCycle(cart)}
                                                                                    >
                                                                                        <div>
                                                                                            <div className="flex-1">
                                                                                                {cart.pricing.cycles.display_name}
                                                                                            </div>
                                                                                            <IconChevronDown size={15} />
                                                                                        </div>
                                                                                    </Dropdown>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="w-max-140 w-full d-flex flex-column align-items-end">
                                                                            <div className="font-size-13 text-line-through text-danger">
                                                                                {cart.price !== cart.origin_price &&
                                                                                    convertCurrency(cart.origin_price)}
                                                                            </div>

                                                                            <div className="font-size-17 font-bold line-height-20">
                                                                                {convertCurrency(cart.price)}
                                                                            </div>
                                                                        </div>

                                                                        <Button
                                                                            size="small"
                                                                            className="box-center hover-red hover-border-red"
                                                                            onClick={() => handleRemoveItemCart(cart.id)}
                                                                        >
                                                                            <IconTrash size={16} />
                                                                        </Button>
                                                                    </div>

                                                                    {cart.partner_service && cart.partner_service.discount > 0 && (
                                                                        <div className="d-flex gap-2 text-danger mt-3 border px-2 py-1 border-dashed rounded-sm">
                                                                            <GiftOutlined />
                                                                            <span>
                                                                                Giảm giá {cart.partner_service.discount}% theo chiết khấu
                                                                                dành cho đối tác
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {cart.pricing.discount > 0 && !cart.coupon > 0 && (
                                                                        <div className="d-flex gap-2 text-danger mt-3 border px-2 py-1 border-dashed rounded-sm">
                                                                            <GiftOutlined />
                                                                            <span>
                                                                                Giảm giá {cart.pricing.discount}% mặc định theo chu kỳ thanh
                                                                                toán
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {cart.coupon && (
                                                                        <div className="d-flex gap-2 text-danger mt-3 border px-2 py-1 border-dashed rounded-sm">
                                                                            <GiftOutlined />
                                                                            <span>{cart.coupon.description}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </Fragment>
                                                    ) : (
                                                        <Fragment>
                                                            {carts.map((cart, index) => (
                                                                <div className="d-flex justify-content-between gap-3">
                                                                    <div className={`flex-1 py-2-5 ${index > 0 ? 'border-top' : ''}`}>
                                                                        <div className="d-flex w-full align-items-center gap-3">
                                                                            <div className="flex-1">
                                                                                <div className="d-flex w-full gap-2">
                                                                                    <div className="flex-1 font-bold font-size-16 line-height-20">
                                                                                        {cart.title}
                                                                                    </div>
                                                                                    <Button
                                                                                        size="small"
                                                                                        className="box-center hover-red hover-border-red"
                                                                                        onClick={() => handleRemoveItemCart(cart.id)}
                                                                                    >
                                                                                        <IconTrash size={16} />
                                                                                    </Button>
                                                                                </div>

                                                                                <div className="text-ellipsis ellipsis-1 min-h-auto word-break-all white-space-break no-select text-subtitle">
                                                                                    {cart.description}
                                                                                </div>

                                                                                <div className="mt-2">
                                                                                    <div className="font-size-13 text-line-through text-danger">
                                                                                        {cart.price !== cart.origin_price &&
                                                                                            convertCurrency(cart.origin_price)}
                                                                                    </div>

                                                                                    <div className="d-flex gap-2 justify-content-between align-items-center">
                                                                                        <div className="text-primary font-bold font-size-16">
                                                                                            {convertCurrency(cart.price)}
                                                                                        </div>

                                                                                        <Dropdown
                                                                                            menu={menuProps}
                                                                                            trigger={['click']}
                                                                                            className="box-center no-select gap-1 cursor-pointer background-gray px-2 py-1 font-bold font-size-13 rounded"
                                                                                            onOpenChange={() => handleChangeItemCycle(cart)}
                                                                                        >
                                                                                            <div>
                                                                                                <div className="flex-1">
                                                                                                    {cart.pricing.cycles.display_name}
                                                                                                </div>
                                                                                                <IconChevronDown size={15} />
                                                                                            </div>
                                                                                        </Dropdown>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {cart.partner_service && cart.partner_service.discount > 0 && (
                                                                            <div className="d-flex gap-2 text-danger mt-3 border px-2 py-1 border-dashed rounded-sm">
                                                                                <GiftOutlined />
                                                                                <span>
                                                                                    Giảm giá {cart.partner_service.discount}% theo chiết
                                                                                    khấu dành cho đối tác
                                                                                </span>
                                                                            </div>
                                                                        )}

                                                                        {cart.pricing.discount > 0 && !cart.coupon > 0 && (
                                                                            <div className="d-flex gap-2 text-danger mt-3 border px-2 py-1 border-dashed rounded-sm">
                                                                                <GiftOutlined />
                                                                                <span>
                                                                                    Giảm giá {cart.pricing.discount}% mặc định theo chu kỳ
                                                                                    thanh toán
                                                                                </span>
                                                                            </div>
                                                                        )}

                                                                        {cart.coupon && (
                                                                            <div className="d-flex gap-2 text-danger mt-3 border px-2 py-1 border-dashed rounded-sm">
                                                                                <GiftOutlined />
                                                                                <span>{cart.coupon.description}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </Fragment>
                                                    )}
                                                </div>
                                            </div>
                                        </Fragment>
                                    ) : (
                                        <Flex justify="center" align="center" className="py-4">
                                            <div className="w-max-600 d-flex flex-column align-items-center">
                                                <img
                                                    src={imageEmptyCart}
                                                    alt="Empty Cart"
                                                    style={{ width: '100%', height: 'auto', maxWidth: 250 }}
                                                />
                                                <h3 className="mb-2 font-size-25 text-center mt-4">Giỏ hàng của bạn còn trống</h3>
                                                <div className="text-subtitle text-center">
                                                    Có vẻ như bạn chưa thêm bất cứ thứ gì vào giỏ hàng của mình. Hãy tiếp tục và khám phá
                                                    các sản phẩm của chúng tôi.
                                                </div>
                                            </div>
                                        </Flex>
                                    )}
                                </Card>
                            </Col>

                            {carts.length > 0 && (
                                <Col md={7} xs={24} style={{ padding: '0 8px' }}>
                                    <Card styles={{ body: { padding: '10px 18px 18px' } }}>
                                        <h2 className="font-size-18 mb-0 ">Mã giảm giá</h2>

                                        <div className="border-top border-t-dashed mt-2 pt-2">
                                            <Input
                                                value={coupon}
                                                onChange={(e) => setCoupon(e.target.value)}
                                                placeholder="Nhập mã voucher"
                                                prefix={<IconTicket size={18} className="text-subtitle" />}
                                                maxLength={20}
                                                disabled={carts.length < 1}
                                            />
                                            <Button
                                                type="primary"
                                                block
                                                className="mt-2"
                                                disabled={coupon.length < 1 || carts.length < 1}
                                                onClick={handleApplyCoupon}
                                            >
                                                Áp dụng
                                            </Button>

                                            <div className="mt-2">
                                                {coupons.map((coupon) => (
                                                    <Flex align="center" className="gap-2 border-top py-2">
                                                        <div>
                                                            <div className="font-bold font-size-15">{coupon.code}</div>
                                                            <div className="text-subtitle font-size-13">{coupon.description}</div>
                                                        </div>
                                                        <div
                                                            className="p-1 cursor-pointer text-danger"
                                                            onClick={() => handleRemoveCoupon(coupon.id)}
                                                        >
                                                            <IconX size={16} />
                                                        </div>
                                                    </Flex>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>

                                    <Card styles={{ body: { padding: '10px 18px 18px' } }} className="mt-4">
                                        <h2 className="font-size-18 mb-0">Chi tiết giá</h2>

                                        <Flex className="flex-column mt-3 border-top border-t-dashed">
                                            <Flex justify="space-between" className="py-2 border-bottom border-b-dashed">
                                                <span className="font-bold">Tổng số tiền</span>
                                                <span className="font-bold">{convertCurrency(totalPrice)}</span>
                                            </Flex>
                                            <Flex justify="space-between" className="py-2 border-bottom border-b-dashed">
                                                <span className="font-bold">Chiết khấu</span>
                                                <span className="font-bold text-danger">{convertCurrency(totalDiscount)}</span>
                                            </Flex>
                                            <Flex justify="space-between" className="py-2 border-bottom border-b-dashed">
                                                <span className="font-bold">Điểm nhận được</span>
                                                <span className="font-bold text-warning">
                                                    <span className="mr-1">{convertCurrency(totalBonusPoint).slice(0, -1)}</span>
                                                    <img src={imagePoint} alt="Point" style={{ width: 12, height: 12 }} />
                                                </span>
                                            </Flex>
                                            <Flex justify="space-between" className="border-bottom py-2">
                                                <span className="font-bold">Tổng thanh toán</span>
                                                <span className="font-bold font-size-18 text-primary">{convertCurrency(totalPayment)}</span>
                                            </Flex>

                                            <div className=" mt-4">
                                                <Button type="primary" loading={loadingPayment} block onClick={handlePaymentCart}>
                                                    {loadingPayment ? (
                                                        'Đang tạo...'
                                                    ) : (
                                                        <div className="box-center gap-1">
                                                            <IconCheck size={20} />
                                                            <span className="ml-1">Xác nhận</span>
                                                        </div>
                                                    )}
                                                </Button>
                                            </div>
                                        </Flex>
                                    </Card>
                                </Col>
                            )}

                            {modalVisible && (
                                <Modal
                                    centered
                                    closable={false}
                                    maskClosable={false}
                                    open={modalVisible}
                                    onOk={handleClearCart}
                                    onCancel={() => setModalVisible(false)}
                                    width={460}
                                    okText="Xác nhận"
                                    cancelText="Hủy"
                                >
                                    <p>Bạn có muốn xóa bỏ {carts.length} sản phẩm khỏ giỏ hàng?</p>
                                </Modal>
                            )}
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

export default Cart;
