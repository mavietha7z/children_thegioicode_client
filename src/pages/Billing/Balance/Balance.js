import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Empty, Flex, Pagination, Spin, Table, notification } from 'antd';

import Billing from '../Billing';
import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import IconBalance from '~/assets/icon/IconBalance';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserGetBalances } from '~/services/billing';

function Balance() {
    const [pages, setPages] = useState(1);
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Thegioicode.com - Biến động số dư';

        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetBalances(page);

            setLoading(false);
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
                notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
            } else if (result?.status === 200) {
                setPages(result.pages);
                setBalances(result.data);
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

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (index) => <b>{index}</b>,
        },
        {
            title: 'Mã GD',
            dataIndex: 'id',
            key: 'id',
            render: (id) => <Fragment>#{id}</Fragment>,
        },
        {
            title: 'Loại GD',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                let title = '';

                if (type === 'service') {
                    title = 'Dịch vụ';
                }
                if (type === 'deposit') {
                    title = 'Cộng tiền';
                }
                if (type === 'withdraw') {
                    title = 'Trừ tiền';
                }
                if (type === 'recharge') {
                    title = 'Nạp tiền';
                }
                if (type === 'withdrawal') {
                    title = 'Rút tiền';
                }

                return <Fragment>{title}</Fragment>;
            },
        },
        {
            title: 'Trước GD',
            dataIndex: 'before',
            key: 'before',
            render: (before) => <Fragment>{convertCurrency(before)}</Fragment>,
        },
        {
            title: 'Số tiền',
            key: 'amount',
            render: (data) => {
                let className = '';
                let isTrue = false;

                if (data.type === 'deposit' || data.type === 'recharge') {
                    className = 'text-success';
                    isTrue = true;
                }
                if (data.type === 'withdraw' || data.type === 'withdrawal' || data.type === 'service') {
                    className = 'text-danger';
                }
                return (
                    <span className={className}>
                        {isTrue && '+'}
                        {convertCurrency(data.amount)}
                    </span>
                );
            },
        },
        {
            title: 'Sau GD',
            dataIndex: 'after',
            key: 'after',
            render: (after) => <Fragment>{convertCurrency(after)}</Fragment>,
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => <Fragment>{moment(created_at).format('DD/MM/YYYY HH:mm:ss')}</Fragment>,
        },
        {
            title: 'Nội dung',
            dataIndex: 'description',
            key: 'description',
        },
    ];

    return (
        <Billing
            keyTab="2"
            label={
                <span className="box-align-center gap-2 text-subtitle">
                    <IconBalance width={20} height={20} />
                    Biến động số dư
                </span>
            }
        >
            {loading ? (
                <Flex align="center" justify="center" style={{ minHeight: '68vh' }}>
                    <Spin />
                </Flex>
            ) : balances.length > 0 ? (
                <Card styles={{ body: { padding: 0 } }}>
                    <Table
                        columns={columns}
                        dataSource={balances.map((balance, index) => ({ key: index, ...balance }))}
                        pagination={false}
                    />
                </Card>
            ) : (
                <Flex justify="center" align="center" style={{ minHeight: 'calc(-260px + 100vh)' }}>
                    <Empty description={<p className="text-subtitle">Không có dữ liệu biến động số dư</p>} />
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

export default Balance;
