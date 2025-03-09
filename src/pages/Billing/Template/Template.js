import moment from 'moment';
import { IconTemplate } from '@tabler/icons-react';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Empty, Flex, Pagination, Spin, Switch, Table, message, notification } from 'antd';

import Billing from '../Billing';
import router from '~/configs/routes';
import { calculateDaysLeft } from '~/configs';
import IconBalance from '~/assets/icon/IconBalance';
import { requestUserAddProductToCart } from '~/services/cart';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserActionTemplate, requestUserGetOrderTemplate } from '~/services/billing';

function Template() {
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        document.title = 'Netcode.vn - Đơn tạo website';

        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetOrderTemplate(page);

            setLoading(false);
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
                notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
            } else if (result?.status === 200) {
                setPages(result.pages);
                setTemplates(result.data);
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        };
        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // Auto Renew
    const handleAutoReNewOrderTemplate = async (id) => {
        if (!id) {
            return notification.error({
                message: 'Thông báo',
                description: 'Lỗi lấy ID đơn hàng để gia hạn',
            });
        }

        const result = await requestUserActionTemplate('auto-renew', id);

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            const cloneTemplates = [...templates];

            const indexTemplate = cloneTemplates.findIndex((item) => item.id === id);
            if (indexTemplate === -1) {
                return notification.error({
                    message: 'Thông báo',
                    description: 'Không tìm thấy đơn hàng trong danh sách',
                });
            }

            cloneTemplates[indexTemplate].auto_renew = result.data;
            setTemplates(cloneTemplates);

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

    // Renew
    const handleRenewOrderTemplate = async (id) => {
        if (!id) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn đơn hàng để gia hạn',
            });
        }

        const result = await requestUserAddProductToCart('order-template', { id });

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
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

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (index) => <b>{index}</b>,
        },
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            render: (id) => (
                <Link to={`${router.billing_templates}/${id}`} className="hover-underline">
                    #{id}
                </Link>
            ),
        },
        {
            title: 'Tên miền',
            key: 'domain',
            render: (data) => (
                <Link to={`${router.billing_templates}/${data.id}`} className="hover-underline">
                    {data.domain.charAt(0).toUpperCase() + data.domain.slice(1)}
                </Link>
            ),
        },
        {
            title: 'Mẫu website',
            dataIndex: 'template',
            key: 'template',
            render: (template) => <Link to={`${router.templates}/detail/${template.slug_url}`}>{template.title}</Link>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let className = '';
                let style = {};

                if (status === 'activated') {
                    className = 'label-light-success font-weight-bold';
                    style = { backgroundColor: '#4caf501a', color: '#4caf50', border: '1px solid #4caf501a' };
                }
                if (status === 'pending' || status === 'wait_confirm') {
                    className = 'label-light-warning font-weight-bold';
                    style = { backgroundColor: '#ff98001a', color: '#ff9800', border: '1px solid #ff98001a' };
                }
                if (status === 'inactivated' || status === 'expired' || status === 'blocked' || status === 'deleted') {
                    className = 'label-light-danger font-weight-bold';
                    style = { backgroundColor: '#f443361a', color: '#f44336', border: '1px solid #f443361a' };
                }

                return (
                    <div className={className} style={style}>
                        {status.toUpperCase()}
                    </div>
                );
            },
        },
        {
            title: 'Tự động gia hạn',
            key: 'auto_renew',
            render: (data) => (
                <Switch
                    checkedChildren="Bật"
                    unCheckedChildren="Tắt"
                    value={data.auto_renew}
                    onChange={() => handleAutoReNewOrderTemplate(data.id)}
                />
            ),
        },
        {
            title: 'Ngày tạo/Hết hạn',
            key: 'date',
            render: (data) => (
                <Fragment>
                    <span>{moment(data.created_at).format('DD/MM/YYYY HH:mm')}</span>
                    <br />
                    <span>{moment(data.expired_at).format('DD/MM/YYYY HH:mm')}</span>
                    <br />
                    <Fragment>
                        (
                        <b className={moment(data.expired_at).diff(new Date(), 'days') < 8 ? 'text-danger' : ''}>
                            {calculateDaysLeft(data.expired_at)}
                        </b>
                        )
                    </Fragment>
                </Fragment>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (data) => {
                if (data.status === 'wait_confirm') {
                    return (
                        <Link to={`${router.billing_templates}/${data.id}`}>
                            <Button type="primary" style={{ height: 30 }}>
                                Xác nhận
                            </Button>
                        </Link>
                    );
                }

                if (data.status === 'pending' || data.status === 'activated' || data.status === 'expired') {
                    return (
                        <Button className="box-center gap-1" type="primary" onClick={() => handleRenewOrderTemplate(data.id)}>
                            <IconBalance width={18} height={18} />
                            Gia hạn
                        </Button>
                    );
                }
            },
        },
    ];

    return (
        <Billing
            keyTab="6"
            label={
                <span className="box-align-center gap-2 text-subtitle">
                    <IconTemplate size={20} />
                    Đơn tạo website
                </span>
            }
        >
            {loading ? (
                <Flex align="center" justify="center" style={{ minHeight: '68vh' }}>
                    <Spin />
                </Flex>
            ) : templates.length > 0 ? (
                <Card styles={{ body: { padding: 0 } }}>
                    <Table
                        columns={columns}
                        dataSource={templates.map((template, index) => ({ key: index, ...template }))}
                        pagination={false}
                    />
                </Card>
            ) : (
                <Flex justify="center" align="center" style={{ minHeight: 'calc(-260px + 100vh)' }}>
                    <Empty description={<p className="text-subtitle">Không có dữ liệu đơn tạo website</p>} />
                </Flex>
            )}

            {Number(pages) > 1 && (
                <Flex justify="end" style={{ margin: '20px 0 10px 0' }}>
                    <Pagination
                        current={page || 1}
                        pageSize={20}
                        total={Number(pages) * 20}
                        onChange={(page) => {
                            setPage(page);
                            setSearchParams({ page });
                        }}
                    />
                </Flex>
            )}
        </Billing>
    );
}

export default Template;
