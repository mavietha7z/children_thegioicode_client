import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import { IconDownload, IconSourceCode } from '@tabler/icons-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Empty, Flex, Pagination, Spin, Table, Tooltip, notification } from 'antd';

import Billing from '../Billing';
import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserGetBillingSources } from '~/services/billing';

function Sources() {
    const [pages, setPages] = useState(1);
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Netcode.vn - Đơn mã nguồn';

        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetBillingSources(page);

            setLoading(false);
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
                notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
            } else if (result?.status === 200) {
                setPages(result.pages);
                setSources(result.data);
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
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            render: (id) => `#${id}`,
        },
        {
            title: 'Mã hóa đơn',
            dataIndex: 'invoice_id',
            key: 'invoice_id',
            render: (invoice_id) => (
                <Link to={`${router.billing_invoices}/${invoice_id}`} className="hover-underline">
                    #{invoice_id}
                </Link>
            ),
        },
        {
            title: 'Mã nguồn',
            key: 'source',
            render: (data) => {
                return (
                    <Link to={router.sources + `/detail/${data.source.slug_url}`} className="hover-underline">
                        {data.source.title}
                    </Link>
                );
            },
        },
        {
            title: 'Số tiền',
            key: 'unit_price',
            render: (data) => (
                <Fragment>
                    {data.discount > 0 && (
                        <div className="text-danger font-size-13 text-line-through">{convertCurrency(data.unit_price)}</div>
                    )}
                    <div className="font-size-15">
                        {convertCurrency(data.unit_price - (data.unit_price * data.quantity * data.discount) / 100)}
                    </div>
                </Fragment>
            ),
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
            title: 'Ngày mua',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => <Fragment>{moment(created_at).format('DD/MM/YYYY HH:mm:ss')}</Fragment>,
        },
        {
            title: '',
            key: 'action',
            render: (data) => (
                <Flex align="center" justify="end">
                    <Tooltip title="Tải xuống dữ liệu">
                        <a href={data.data_url} target="_blank" rel="noreferrer" className="ml-2">
                            <Button type="primary" size="small" className="box-center">
                                <IconDownload size={16} />
                            </Button>
                        </a>
                    </Tooltip>
                </Flex>
            ),
        },
    ];

    return (
        <Billing
            keyTab="5"
            label={
                <span className="box-align-center gap-2 text-subtitle">
                    <IconSourceCode size={20} />
                    Đơn mã nguồn
                </span>
            }
        >
            {loading ? (
                <Flex align="center" justify="center" style={{ minHeight: '68vh' }}>
                    <Spin />
                </Flex>
            ) : sources.length > 0 ? (
                <Card styles={{ body: { padding: 0 } }}>
                    <Table columns={columns} dataSource={sources.map((source, index) => ({ key: index, ...source }))} pagination={false} />
                </Card>
            ) : (
                <Flex justify="center" align="center" style={{ minHeight: 'calc(-260px + 100vh)' }}>
                    <Empty description={<p className="text-subtitle">Không có dữ liệu đơn mã nguồn</p>} />
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

export default Sources;
