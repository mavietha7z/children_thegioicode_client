import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import { IconFileInvoice } from '@tabler/icons-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Empty, Flex, Pagination, Spin, Table, notification } from 'antd';

import Billing from '../Billing';
import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserGetInvoices } from '~/services/billing';

function Invoices() {
    const [pages, setPages] = useState(1);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Netcode.vn - Hoá đơn';

        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetInvoices(page);

            setLoading(false);
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
                notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
            } else if (result?.status === 200) {
                setPages(result.pages);
                setInvoices(result.data);
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

    const handleNavigateDetail = (invoice_id) => {
        navigate(`${router.billing_invoices}/${invoice_id}`);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (index) => <b>{index}</b>,
        },
        {
            title: 'Mã hóa đơn',
            dataIndex: 'id',
            key: 'id',
            render: (id) => (
                <Link to={`/billing/invoices/${id}`} className="hover-underline">
                    #{id}
                </Link>
            ),
        },
        {
            title: 'Số tiền',
            dataIndex: 'total_payment',
            key: 'total_payment',
            render: (total_payment) => {
                let className = '';
                let title = `${convertCurrency(total_payment)}`;
                if (total_payment > 0) {
                    className = 'text-success';
                    title = `+${convertCurrency(total_payment)}`;
                }
                if (total_payment < 0) {
                    className = 'text-danger';
                    title = `${convertCurrency(total_payment)}`;
                }

                return <span className={className}>{title}</span>;
            },
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
            title: 'Ngày đáo hạn',
            dataIndex: 'expired_at',
            key: 'expired_at',
            render: (expired_at) => <Fragment>{moment(expired_at).format('DD/MM/YYYY HH:mm:ss')}</Fragment>,
        },
        {
            title: 'Nội dung',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '',
            key: 'action',
            render: (data) =>
                data.status === 'pending' && (
                    <Flex align="center" justify="end">
                        <Button className="box-center" type="primary" onClick={() => handleNavigateDetail(data.id)}>
                            Thanh toán
                        </Button>
                    </Flex>
                ),
        },
    ];

    return (
        <Billing
            keyTab="4"
            label={
                <span className="box-align-center gap-2 text-subtitle">
                    <IconFileInvoice size={20} />
                    Hoá đơn
                </span>
            }
        >
            {loading ? (
                <Flex align="center" justify="center" style={{ minHeight: '68vh' }}>
                    <Spin />
                </Flex>
            ) : invoices.length > 0 ? (
                <Card styles={{ body: { padding: 0 } }}>
                    <Table
                        columns={columns}
                        dataSource={invoices.map((invoice, index) => ({ key: index, ...invoice }))}
                        pagination={false}
                    />
                </Card>
            ) : (
                <Flex justify="center" align="center" style={{ minHeight: 'calc(-260px + 100vh)' }}>
                    <Empty description={<p className="text-subtitle">Không có dữ liệu hoá đơn</p>} />
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

export default Invoices;
