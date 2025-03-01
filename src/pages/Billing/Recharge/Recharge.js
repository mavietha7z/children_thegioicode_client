import { useNavigate } from 'react-router-dom';
import { IconCopy } from '@tabler/icons-react';
import { BankOutlined } from '@ant-design/icons';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Card, Col, Flex, Image, Input, Radio, Row, Spin, Tooltip, notification } from 'antd';

import Billing from '../Billing';
import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import { serviceCopyKeyBoard } from '~/configs';
import IconQuestion from '~/assets/icon/IconQuestion';
import IconRecharge from '~/assets/icon/IconRecharge';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserGetRecharge } from '~/services/billing';

const defaultAmounts = [50000, 100000, 200000, 500000, 1000000];

const formatNumber = (num) => {
    if (!num) return '0';

    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

function Recharge() {
    const [loading, setLoading] = useState(false);
    const [validateOtherAmount, setValidateOtherAmount] = useState('Số tiền nhập phải là bội của 1,000đ');

    const [value, setValue] = useState(-1);
    const [wallet, setWallet] = useState(null);
    const [wallets, setWallets] = useState([]);
    const [amounts, setAmounts] = useState([]);

    const [dataActive, setDataActive] = useState(0);
    const [amount, setAmount] = useState('Số khác');
    const [amountQr, setAmountQr] = useState(() => amounts[dataActive]);
    const [amountBill, setAmountBill] = useState(() => formatNumber(amounts[dataActive]));

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { configs } = useSelector((state) => state.apps);
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        document.title = 'Netcode.vn - Thanh toán';

        if (currentUser) {
            const fetch = async () => {
                setLoading(true);
                const result = await requestUserGetRecharge();

                if (result.status === 401 || result.status === 403) {
                    dispatch(logoutUserSuccess());
                    navigate(router.home);
                    notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
                } else if (result?.status === 200) {
                    setWallets(result.data);
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                    });
                }
                setLoading(false);
            };
            fetch();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChangeOptions = (e) => {
        setValue(e.target.value);
    };

    const handleSelectWallet = (wallet) => {
        const amounts = defaultAmounts.map((amount, index) => {
            return {
                id: index,
                amount,
            };
        });

        setDataActive(0);
        setWallet(wallet);
        setAmounts(amounts);
        setAmount('Số khác');
        setAmountQr(defaultAmounts[0]);
        setAmountBill(formatNumber(defaultAmounts[0]));
    };

    const handleSelectAmount = (index, type = null) => {
        let value = null;
        for (let i = 0; i < amounts.length; i++) {
            if (amounts[i].id === index) {
                value = amounts[i].amount;
                break;
            }
        }

        if (!value && !type) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn số tiền thanh toán',
            });
        }

        setAmount('Số khác');
        const cleanInput = amount.toString().replace(/[^\d]/g, '');

        if (type) {
            if (cleanInput) {
                setAmount(amount);
                setAmountQr(Number(cleanInput));
            } else {
                setAmount(0);
                setAmountQr(null);
            }
        } else {
            setAmountQr(value);
        }

        setDataActive(index);
        setAmountBill(formatNumber(value || Number(cleanInput)));
    };

    const handleChangeAmount = (e) => {
        const input = e.target.value;

        // Bỏ tất cả các ký tự không phải số
        const cleanInput = input.replace(/[^\d]/g, '');

        // Bỏ số 0 ở đầu
        const nonZeroStartInput = cleanInput.replace(/^0+/, '');
        if (!nonZeroStartInput) {
            return;
        }

        const amount = Number(nonZeroStartInput);

        // Kiểm tra số tiền tối thiểu
        if (amount < wallet.minimum_payment) {
            setValidateOtherAmount(`Số tiền nhập tối thiểu từ ${convertCurrency(wallet.minimum_payment)}`);
        }

        // Kiểm tra số tiền tối đa
        if (amount >= wallet.minimum_payment) {
            setValidateOtherAmount(`Số tiền nhập tối đa là ${convertCurrency(wallet.maximum_payment)}`);
        }

        // Kiểm tra bội số của 1000
        if (amount % 1000 !== 0) {
            setValidateOtherAmount('Số tiền nhập phải là bội của 1,000đ');
        }

        // Định dạng lại số với dấu phẩy
        const formattedInput = formatNumber(nonZeroStartInput);

        setAmountQr(amount);
        setAmount(formattedInput);
        setAmountBill(formattedInput);
    };

    return (
        <Billing
            keyTab="1"
            label={
                <span className="box-align-center gap-2 text-subtitle">
                    <IconRecharge width={20} height={20} />
                    Nạp tiền
                </span>
            }
        >
            {loading ? (
                <Flex align="center" justify="center" style={{ height: '60vh' }}>
                    <Spin />
                </Flex>
            ) : (
                <Row style={{ margin: '0 -12px', rowGap: 24 }}>
                    <Col md={17} xs={24} style={{ padding: '0 12px' }}>
                        <h3 className="mb-3 font-weight-bold font-size-20">Cổng thanh toán</h3>

                        <Radio.Group className="w-full" onChange={onChangeOptions} value={value}>
                            <Row style={{ marginLeft: -8, marginRight: -8, rowGap: 15 }}>
                                {wallets.map((wallet, index) => (
                                    <Col md={12} xs={24} style={{ padding: '0 8px' }} key={index}>
                                        <Radio
                                            className="border-antd billing-payment-method_item"
                                            value={index}
                                            onClick={() => handleSelectWallet(wallet)}
                                            disabled={!wallet.status}
                                        >
                                            <Flex align="center" className="gap-2">
                                                <Avatar
                                                    shape="square"
                                                    style={{ width: 35, height: 35, lineHeight: 35, fontSize: 18 }}
                                                    src={wallet.logo_url}
                                                />
                                                <div>
                                                    <span className="mr-2">{wallet.name}</span>
                                                    <IconQuestion
                                                        width={14}
                                                        height={14}
                                                        className="text-subtitle"
                                                        title={!wallet.status ? 'Cổng thanh toán bảo trì' : wallet.question}
                                                    />
                                                    <p className="text-danger mb-0 line-height-15 font-size-xs-13">
                                                        {!wallet.status ? 'Cổng thanh toán bảo trì' : `(${wallet.description})`}
                                                    </p>
                                                </div>
                                            </Flex>
                                        </Radio>
                                    </Col>
                                ))}
                            </Row>
                        </Radio.Group>

                        {wallets.length < 1 ? (
                            <Fragment>
                                <div className="ml-1 text-subtitle">
                                    Hiện tại không có cổng thanh toán nào hoạt động vui lòng quay lại sau!
                                </div>
                            </Fragment>
                        ) : amounts.length > 0 ? (
                            <Row style={{ margin: '0 -8px', rowGap: 15 }}>
                                <Col span={24} style={{ padding: '0 8px' }}>
                                    <h3 className="mb-3 font-weight-bold font-size-20 mt-7">Số tiền</h3>
                                    <p className="text-subtitle">
                                        Tiền sẽ vào tài khoảng trong vòng 5s - 5p phút kể từ khi giao dịch thành công. Tuy nhiên đôi lúc do
                                        một vài lỗi khách quan, tiền có thể sẽ vào chậm hơn một chút.
                                    </p>
                                    <p className="mb-5 text-subtitle">
                                        Nếu quá lâu không thấy cập nhật số dư, Vui lòng liên hệ hỗ trợ
                                        <a href={configs.contacts.zalo_url} target="_blank" rel="noreferrer" className="ml-1">
                                            tại đây.
                                        </a>
                                    </p>
                                </Col>
                                <Fragment>
                                    {amounts.map((amount, index) => (
                                        <Col
                                            md={8}
                                            xs={24}
                                            style={{ padding: '0 8px' }}
                                            key={index}
                                            onClick={() => handleSelectAmount(index)}
                                        >
                                            <div className="button_amount_billing" data-active={index === dataActive}>
                                                {convertCurrency(amount.amount)}
                                            </div>
                                        </Col>
                                    ))}

                                    <Col md={8} xs={24} style={{ padding: '0 8px' }} onClick={() => handleSelectAmount(6, 'other')}>
                                        <div className="button_amount_billing" data-active={6 === dataActive}>
                                            <Input
                                                className="button_amount_billing-input"
                                                value={amount}
                                                onChange={handleChangeAmount}
                                                suffix={<b>{amount !== 'Số khác' ? 'đ' : ''}</b>}
                                            />
                                        </div>
                                        {amount !== 'Số khác' && (
                                            <Fragment>
                                                <div className="text-error mt-1">{validateOtherAmount}</div>
                                            </Fragment>
                                        )}
                                    </Col>
                                </Fragment>
                            </Row>
                        ) : (
                            <div className="py-4 ml-1 text-subtitle">Quý khách vui lòng chọn cổng thanh toán!</div>
                        )}
                    </Col>

                    {amounts.length > 0 && (
                        <Col md={7} xs={24} style={{ padding: '0 12px' }}>
                            <div className="rounded-8 p-3 border container-make-payment d-flex flex-column" style={{ minHeight: '100%' }}>
                                <div className="w-full flex-1">
                                    <h3 className="mb-3 font-weight-bold font-size-20">Nạp tiền</h3>
                                    <div className="d-flex gap-2 border border-white p-3 rounded-8 mb-4 align-items-center">
                                        <Avatar icon={<BankOutlined />} className="background-primary" />
                                        <div className="font-size-18 font-weight-bold">{amountBill}đ</div>
                                    </div>
                                </div>

                                {amountQr >= wallet.minimum_payment && amountQr <= wallet.maximum_payment && (
                                    <Fragment>
                                        <Flex align="center" justify="space-between" className="pt-2 border-top border-white">
                                            <div className="text-subtitle">Thành tiền</div>
                                            <div className="text-primary font-bold font-size-20">
                                                {formatNumber(amountQr)}
                                                <sup>đ</sup>
                                            </div>
                                        </Flex>
                                        <Card
                                            className="mt-4"
                                            title={
                                                <h2 className="font-size-18 font-semibold mb-0 white-space-break">
                                                    <div className="white-space-break font-semibold font-size-16">{wallet.name}</div>
                                                    <p className="mb-0 white-space-break font-size-12 text-italic text-subtitle">
                                                        Quý khách vui lòng quét mã QR hoặc chuyển khoản đúng nội dụng theo một trong các
                                                        ngân hàng, ví điện tử bên dưới
                                                    </p>
                                                </h2>
                                            }
                                            styles={{ body: { paddingTop: 12 } }}
                                        >
                                            <Row style={{ margin: '0 10px' }}>
                                                {wallet.options.length > 0 ? (
                                                    wallet.options.map((option, index) => (
                                                        <Col span={24} style={{ padding: '0 10px' }} key={index}>
                                                            <Flex align="center" className="gap-3 border-bottom pb-2 mb-3">
                                                                <img
                                                                    src={option.logo_url}
                                                                    alt="VietinBank"
                                                                    className="mt-1"
                                                                    style={{ width: 32, height: 32, borderRadius: 6 }}
                                                                />
                                                                <div className="font-semibold">{option.name}</div>
                                                            </Flex>

                                                            <Row style={{ margin: '0 -6px', rowGap: 12 }}>
                                                                <Col md={12} xs={24} style={{ padding: '0 6px' }}>
                                                                    <Flex justify="center" align="center" className="h-full">
                                                                        {option.type === 'bank' ? (
                                                                            <Image
                                                                                src={`https://img.vietqr.io/image/${option.interbank_code}-${option.account_number}-oKRSYFw.jpg?amount=${amountQr}&addInfo=NAP ${currentUser?.id}&accountName=${option.account_holder}`}
                                                                                alt="QR Thanh toán ngân hàng"
                                                                                style={{
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    objectFit: 'contain',
                                                                                    maxWidth: 240,
                                                                                    filter: option.status ? 'none' : 'blur(3px)',
                                                                                }}
                                                                                preview={option.status}
                                                                                className="border-primary rounded"
                                                                            />
                                                                        ) : (
                                                                            <Image
                                                                                src={`https://momofree.apimienphi.com/api/QRCode?phone=${option.account_number}&amount=${amountQr}`}
                                                                                alt="QR Thanh toán momo"
                                                                                style={{
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    objectFit: 'contain',
                                                                                    maxWidth: 240,
                                                                                    filter: option.status ? 'none' : 'blur(3px)',
                                                                                }}
                                                                                preview={option.status}
                                                                                className="border-primary rounded"
                                                                            />
                                                                        )}
                                                                    </Flex>
                                                                </Col>
                                                                <Col md={12} xs={24} style={{ padding: '0 6px' }}>
                                                                    <Flex
                                                                        justify="space-between"
                                                                        align="center"
                                                                        className="border-bottom pb-1"
                                                                    >
                                                                        <div>
                                                                            <div className="text-subtitle font-size-xs-13">
                                                                                Số tài khoản
                                                                            </div>
                                                                            <div className="font-bold font-size-xs-13 line-height-18 box-center">
                                                                                <span className="mr-2">
                                                                                    {!option.status
                                                                                        ? 'Đang bảo trì'
                                                                                        : option.account_number}
                                                                                </span>
                                                                                {option.status && (
                                                                                    <Tooltip title="Sao chép">
                                                                                        <IconCopy
                                                                                            size={16}
                                                                                            style={{ cursor: 'pointer' }}
                                                                                            onClick={() =>
                                                                                                serviceCopyKeyBoard(option.account_number)
                                                                                            }
                                                                                        />
                                                                                    </Tooltip>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </Flex>
                                                                    <Flex
                                                                        justify="space-between"
                                                                        align="center"
                                                                        className="border-bottom pb-1"
                                                                    >
                                                                        <div>
                                                                            <div className="text-subtitle font-size-xs-13">
                                                                                Tên tài khoản
                                                                            </div>
                                                                            <div className="font-bold font-size-xs-13 line-height-18">
                                                                                <span className="mr-3">
                                                                                    {!option.status
                                                                                        ? 'Đang bảo trì'
                                                                                        : option.account_holder}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </Flex>
                                                                    <Flex
                                                                        justify="space-between"
                                                                        align="center"
                                                                        className="border-bottom pb-1"
                                                                    >
                                                                        <div>
                                                                            <div className="text-subtitle font-size-xs-13">Số tiền</div>
                                                                            <div className="font-bold font-size-xs-13 line-height-18 box-center">
                                                                                <span className="mr-2">
                                                                                    {!option.status
                                                                                        ? 'Đang bảo trì'
                                                                                        : `${formatNumber(amountQr)} VNĐ`}
                                                                                </span>
                                                                                {option.status && (
                                                                                    <Tooltip title="Sao chép">
                                                                                        <IconCopy
                                                                                            size={16}
                                                                                            style={{ cursor: 'pointer' }}
                                                                                            onClick={() => serviceCopyKeyBoard(amountQr)}
                                                                                        />
                                                                                    </Tooltip>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </Flex>
                                                                    <Flex justify="space-between" align="center" className="pb-1">
                                                                        <div>
                                                                            <div className="text-subtitle font-size-xs-13">
                                                                                Nội dung chuyển khoản
                                                                            </div>
                                                                            <div className="font-bold font-size-xs-13 line-height-18 d-flex align-items-center">
                                                                                <span className="mr-2">
                                                                                    {!option.status
                                                                                        ? 'Đang bảo trì'
                                                                                        : ` NAP ${currentUser?.id}`}
                                                                                </span>
                                                                                {option.status && (
                                                                                    <Tooltip title="Sao chép">
                                                                                        <IconCopy
                                                                                            size={16}
                                                                                            style={{ cursor: 'pointer' }}
                                                                                            onClick={() =>
                                                                                                serviceCopyKeyBoard(
                                                                                                    `NAP ${currentUser?.id}`,
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </Tooltip>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </Flex>
                                                                </Col>
                                                                <Col span={24}>
                                                                    <div className="w-full my-1 border-top border-t-dashed"></div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    ))
                                                ) : (
                                                    <div style={{ paddingTop: 12 }}>Không có tài khoản thanh toán</div>
                                                )}
                                            </Row>
                                        </Card>
                                    </Fragment>
                                )}
                            </div>
                        </Col>
                    )}
                </Row>
            )}
        </Billing>
    );
}

export default Recharge;
