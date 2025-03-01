import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import { IconCancel, IconShoppingBag } from '@tabler/icons-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Empty, Flex, Modal, Pagination, Spin, Table, Tooltip, notification } from 'antd';

import Billing from '../Billing';
import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserCancelledOrder, requestUserGetOrders } from '~/services/billing';

function Orders() {
    const [pages, setPages] = useState(1);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modal, contextHolder] = Modal.useModal();

    useEffect(() => {
        document.title = 'Netcode.vn - Đơn hàng';

        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetOrders(page);

            setLoading(false);
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
                notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
            } else if (result?.status === 200) {
                setPages(result.pages);
                setOrders(result.data);
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

    const handleCanceledOrder = async (orderId) => {
        if (!orderId) {
            return notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn đơn hàng để hủy',
            });
        }

        setConfirmLoading(true);
        const result = await requestUserCancelledOrder(orderId);

        setConfirmLoading(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result.status === 200) {
            const clone = [...orders];
            clone.splice(
                orders.findIndex((order) => order.id === orderId),
                1,
            );
            setOrders(clone);
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

    const handleShowModal = (orderId) => {
        modal.confirm({
            title: 'Hủy đơn hàng',
            content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
            icon: null,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            centered: true,
            onOk: () => handleCanceledOrder(orderId),
        });
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (index) => <b>{index}</b>,
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
            render: (id) => (
                <Link to={`/billing/orders/${id}`} className="hover-underline">
                    #{id}
                </Link>
            ),
        },
        {
            title: 'Mã hóa đơn',
            dataIndex: 'invoice_id',
            key: 'invoice_id',
            render: (invoice_id) => (
                <Link to={`/billing/invoices/${invoice_id}`} className="hover-underline">
                    #{invoice_id}
                </Link>
            ),
        },
        {
            title: 'Số tiền',
            dataIndex: 'total_payment',
            key: 'total_payment',
            render: (total_payment) => <Fragment>{convertCurrency(total_payment)}</Fragment>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let className = '';
                let style = {};
                let title = '';

                if (status === 'completed') {
                    title = 'Hoàn thành';
                    className = 'label-light-success font-weight-bold';
                    style = { backgroundColor: '#4caf501a', color: '#4caf50', border: '1px solid #4caf501a' };
                }
                if (status === 'pending') {
                    title = 'Chờ thanh toán';
                    className = 'label-light-warning font-weight-bold';
                    style = { backgroundColor: '#ff98001a', color: '#ff9800', border: '1px solid #ff98001a' };
                }

                return (
                    <div className={className} style={style}>
                        {title}
                    </div>
                );
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => <Fragment>{moment(created_at).format('DD/MM/YYYY HH:mm:ss')}</Fragment>,
        },
        {
            title: '',
            key: 'action',
            render: (data) =>
                data.status === 'pending' && (
                    <Flex align="center" justify="end">
                        <Tooltip title="Huỷ đơn hàng">
                            <Button
                                className="box-center"
                                type="primary"
                                danger
                                size="small"
                                disabled={confirmLoading}
                                onClick={() => handleShowModal(data.id)}
                            >
                                <IconCancel size={20} />
                            </Button>
                        </Tooltip>
                    </Flex>
                ),
        },
    ];

    return (
        <Billing
            keyTab="3"
            label={
                <span className="box-align-center gap-2 text-subtitle">
                    <IconShoppingBag size={20} />
                    Đơn hàng
                </span>
            }
        >
            {loading ? (
                <Flex align="center" justify="center" style={{ minHeight: '68vh' }}>
                    <Spin />
                </Flex>
            ) : orders.length > 0 ? (
                <Card styles={{ body: { padding: 0 } }}>
                    <Table columns={columns} dataSource={orders.map((order, index) => ({ key: index, ...order }))} pagination={false} />
                </Card>
            ) : (
                <Flex justify="center" align="center" style={{ minHeight: 'calc(-260px + 100vh)' }}>
                    <Empty description={<p className="text-subtitle">Không có dữ liệu đơn hàng</p>} />
                </Flex>
            )}

            {contextHolder}

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

export default Orders;
