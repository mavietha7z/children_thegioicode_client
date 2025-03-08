import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import { IconArrowLeft, IconCopy } from '@tabler/icons-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Flex, Row, Spin, notification } from 'antd';

import router from '~/configs/routes';
import imagePoint from '~/assets/image/point.png';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserGetTemplateDetail } from '~/services/billing';
import { calculateDaysLeft, convertCurrency, serviceCopyKeyBoard } from '~/configs';

function TemplateDetail() {
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { template_id } = useParams();

    useEffect(() => {
        if (template_id) {
            document.title = `Netcode.vn - #${template_id}`;

            const fetch = async () => {
                const result = await requestUserGetTemplateDetail(template_id);

                setLoading(false);
                if (result.status === 401 || result.status === 403) {
                    dispatch(logoutUserSuccess());
                    navigate(router.home);
                    notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
                } else if (result.status === 200) {
                    setTemplate(result.data);
                } else {
                    navigate(router.billing_templates);
                    notification.error({
                        message: 'Thông báo',
                        description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                    });
                }
            };
            fetch();
        } else {
            navigate(router.billing_templates);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [template_id]);

    return (
        <div className="container">
            <Row>
                <Col span={24}>
                    <Flex className="gap-2 mb-3 ml-2">
                        <Button size="small" className="box-center" onClick={() => navigate(router.billing_templates)}>
                            <IconArrowLeft size={18} />
                        </Button>
                        <Breadcrumb
                            className="flex-1"
                            items={[
                                {
                                    title: <Link to={router.home}>Trang chủ</Link>,
                                },
                                {
                                    title: <Link to={router.billing_templates}>Đơn tạo website</Link>,
                                },
                                {
                                    title: `#${template_id}`,
                                },
                            ]}
                        />
                    </Flex>
                </Col>

                {!loading && template ? (
                    <Col span={24}>
                        <Row style={{ rowGap: 16 }}>
                            <Col span={24} style={{ padding: '0 8px' }}>
                                <Card size="small">
                                    <h2 className="font-size-20 line-height-22 mb-0 font-bold">Đơn hàng #{template_id}</h2>
                                    <span
                                        className={`font-bold font-size-13 text-uppercase ${
                                            template.status === 'activated'
                                                ? 'text-success'
                                                : template.status === 'wait_confirm' || template.status === 'pending'
                                                ? 'text-warning'
                                                : 'text-danger'
                                        }`}
                                    >
                                        {template.status.toUpperCase()}
                                    </span>
                                </Card>
                            </Col>

                            <Col md={17} xs={24} style={{ padding: '0 8px' }}>
                                <Card styles={{ body: { padding: 18 } }}>
                                    <h3 className="font-size-18 font-bold mb-0 border-b-dashed mb-3 border-bottom">Thông tin đơn hàng</h3>

                                    <Row style={{ margin: '0 -8px', rowGap: 16 }}>
                                        <Col md={12} xs={24} style={{ padding: '0 8px' }}>
                                            <div className="d-flex flex-column gap-4">
                                                <div>
                                                    <div>Mẫu:</div>
                                                    <div className="flex-1 font-semibold break-all text-subtitle">
                                                        <Link
                                                            to={`${router.templates}/detail/${template.template.slug_url}`}
                                                            className="text-subtitle hover-blue"
                                                            target="_blank"
                                                        >
                                                            {template.template.title}
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div>Tổng tiền:</div>
                                                    <div className="flex-1 font-semibold break-all text-subtitle">
                                                        {convertCurrency(template.total_payment)}
                                                    </div>
                                                </div>
                                                {template.status === 'wait_confirm' && (
                                                    <Fragment>
                                                        <div>
                                                            <div>Nameservers gốc:</div>
                                                            <div className="flex-1 font-semibold break-all text-subtitle">
                                                                {template.cloudflare.original_name_servers.map((server, index) => (
                                                                    <Fragment key={index}>
                                                                        <span>{server}</span>
                                                                        <br />
                                                                    </Fragment>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>Nameservers mới:</div>
                                                            <div className="flex-1 font-semibold break-all text-subtitle">
                                                                {template.cloudflare.name_servers.map((server, index) => (
                                                                    <Fragment key={index}>
                                                                        <span>
                                                                            {server}
                                                                            <IconCopy
                                                                                className="cursor-pointer text-subtitle hover-blue ml-1"
                                                                                size={14}
                                                                                onClick={() => serviceCopyKeyBoard(server)}
                                                                            />
                                                                        </span>
                                                                        <br />
                                                                    </Fragment>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                )}
                                                <div>
                                                    <div>Trạng thái:</div>
                                                    <div className="flex-1 font-semibold break-all text-subtitle">
                                                        <span
                                                            className={`font-semibold text-uppercase ${
                                                                template.status === 'wait_confirm' || template.status === 'pending'
                                                                    ? 'text-warning'
                                                                    : template.status === 'activated'
                                                                    ? 'text-info'
                                                                    : 'text-danger'
                                                            }`}
                                                        >
                                                            {template.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={12} xs={24} style={{ padding: '0 8px' }}>
                                            <div className="d-flex flex-column gap-4">
                                                <div>
                                                    <div>Tên miền:</div>
                                                    <div className="flex-1 font-semibold break-all text-subtitle">
                                                        {template.app_domain}
                                                        <IconCopy
                                                            className="cursor-pointer text-subtitle hover-blue ml-1"
                                                            size={14}
                                                            onClick={() => serviceCopyKeyBoard(template.app_domain)}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div>Quản trị:</div>
                                                    <div className="flex-1 font-semibold break-all text-subtitle">
                                                        {template.admin_domain ? template.admin_domain : 'Đang cập nhật'}
                                                        {template.admin_domain && (
                                                            <IconCopy
                                                                className="cursor-pointer text-subtitle hover-blue ml-1"
                                                                size={14}
                                                                onClick={() => serviceCopyKeyBoard(template.admin_domain)}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div>Tài khoản:</div>
                                                    <div className="flex-1 font-semibold break-all text-subtitle">
                                                        {template.email_admin}
                                                        <IconCopy
                                                            className="cursor-pointer text-subtitle hover-blue ml-1"
                                                            size={14}
                                                            onClick={() => serviceCopyKeyBoard(template.email_admin)}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div>Mật khẩu:</div>
                                                    <div className="flex-1 font-semibold break-all text-subtitle">
                                                        {template.password_admin}
                                                        <IconCopy
                                                            className="cursor-pointer text-subtitle hover-blue ml-1"
                                                            size={14}
                                                            onClick={() => serviceCopyKeyBoard(template.password_admin)}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div>Ngày tạo/Hết hạn:</div>
                                                    <div className="flex-1 font-semibold break-all text-subtitle">
                                                        {moment(template.created_at).format('DD/MM/YYYY HH:mm:ss')}
                                                    </div>
                                                    <div className="flex-1 font-semibold break-all text-subtitle">
                                                        {moment(template.expired_at).format('DD/MM/YYYY HH:mm:ss')}
                                                    </div>
                                                    <div className="flex-1 font-semibold break-all text-subtitle">
                                                        (
                                                        <b
                                                            className={
                                                                moment(template.expired_at).diff(new Date(), 'days') < 8
                                                                    ? 'text-danger'
                                                                    : ''
                                                            }
                                                        >
                                                            {calculateDaysLeft(template.expired_at)}
                                                        </b>
                                                        )
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={24} xs={24} className="mt-4" style={{ padding: '0 8px' }}>
                                            <div className="d-flex flex-column gap-3">
                                                <div className="d-flex flex-wrap gap-2">
                                                    <div>Ghi chú:</div>
                                                    <div className="text-subtitle">{template.description}</div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>

                            <Col md={7} xs={24} style={{ padding: '0 8px' }}>
                                <Flex className="flex-column gap-4">
                                    <Card styles={{ body: { padding: 18 } }}>
                                        <div className="ribbon">
                                            <span>PAID</span>
                                        </div>
                                        <h2 className="font-size-18 mb-0">Chi tiết</h2>

                                        <Flex className="flex-column mt-3 border-top border-t-dashed">
                                            <Flex justify="space-between" className="py-2 border-bottom border-b-dashed">
                                                <span className="font-bold">Tổng số tiền</span>
                                                <span className="font-bold">{convertCurrency(Math.abs(template.total_price))}</span>
                                            </Flex>
                                            <Flex justify="space-between" className="py-2 border-bottom border-b-dashed">
                                                <span className="font-bold">Chiết khấu</span>
                                                <span className="font-bold text-danger">
                                                    {convertCurrency(template.total_payment - template.total_price)}
                                                </span>
                                            </Flex>
                                            <Flex justify="space-between" className="py-2 border-bottom border-b-dashed">
                                                <span className="font-bold">Điểm đã nhận</span>
                                                <span className="font-bold text-warning">
                                                    <span className="mr-1">{convertCurrency(template.bonus_point).slice(0, -1)}</span>
                                                    <img src={imagePoint} alt="Point" style={{ width: 12, height: 12 }} />
                                                </span>
                                            </Flex>
                                            <Flex justify="space-between" className="pt-2">
                                                <span className="font-bold">Số tiền đã thanh toán</span>
                                                <span className="font-bold font-size-18 text-primary">
                                                    {convertCurrency(Math.abs(template.total_payment))}
                                                </span>
                                            </Flex>
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

export default TemplateDetail;
