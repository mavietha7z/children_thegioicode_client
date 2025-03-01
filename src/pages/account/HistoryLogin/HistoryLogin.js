import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Flex, notification, Pagination, Spin, Table } from 'antd';

import Account from '../Account';
import router from '~/configs/routes';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserGetLoginHistories } from '~/services/account';

const columns = [
    {
        title: 'IPv4/IPv6',
        dataIndex: 'ip',
        key: 'ip',
    },
    {
        title: 'Thời gian',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (created_at) => <Fragment>{moment(created_at).format('DD/MM/YYYY HH:mm:ss')}</Fragment>,
    },
    {
        title: 'Device',
        dataIndex: 'device',
        key: 'device',
    },
    {
        title: 'Browser',
        dataIndex: 'browser',
        key: 'browser',
    },
];

function HistoryLogin() {
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [histories, setHistories] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = 'Thegioicode.com - Lịch sử đăng nhập';

        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetLoginHistories(page);

            setLoading(false);
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(`${router.home}`);
                notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
            } else if (result?.status === 200) {
                setPages(result.pages);
                setHistories(result.data);
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                });
            }
        };
        fetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Account>
            <div className="w-full">
                <h3 className="font-bold font-size-20 border-bottom pb-2">Lịch sử đăng nhập</h3>
                {loading ? (
                    <Flex align="center" justify="center" style={{ minHeight: '40vh' }}>
                        <Spin />
                    </Flex>
                ) : (
                    <Table
                        className="mt-5"
                        dataSource={histories.map((history, index) => ({ key: index, ...history }))}
                        columns={columns}
                        bordered
                        pagination={false}
                    />
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
            </div>
        </Account>
    );
}

export default HistoryLogin;
