import moment from 'moment';
import { useDispatch } from 'react-redux';
import { IconCopy } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { Button, Card, Flex, notification, Spin, Table, Tag, Tooltip } from 'antd';

import Webhook from './Webhook';
import Account from '../Account';
import router from '~/configs/routes';
import { serviceCopyKeyBoard } from '~/configs';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserGetApikey } from '~/services/account';

function ApiKey() {
    const [loading, setLoading] = useState(false);
    const [serviceKeys, setServiceKeys] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = 'Thegioicode.com - Apikey Dịch vụ đang sử dụng';

        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetApikey();

            setLoading(false);
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
            } else if (result?.status === 200) {
                setServiceKeys(result.data);
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

    const onExpand = (record) => {
        const keys = expandedRowKeys.includes(record.key)
            ? expandedRowKeys.filter((k) => k !== record.key)
            : [...expandedRowKeys, record.key];
        setExpandedRowKeys(keys);
    };

    const defaultExpandable = {
        expandedRowRender: (record) => <Webhook webhooks={record.webhooks} api_key={record.api_key} />,
        expandedRowKeys,
        onExpand: (_, record) => onExpand(record),
        expandIcon: () => null,
    };

    const columns = [
        {
            title: 'Dịch vụ',
            dataIndex: 'category',
            key: 'category',
            render: (category) => <div style={{ whiteSpace: 'nowrap' }}>{category}</div>,
        },
        {
            title: 'Key',
            dataIndex: 'api_key',
            key: 'api_key',
            render: (api_key) => (
                <Flex align="center">
                    <span className="mr-2">{api_key}</span>
                    <Tooltip title="Sao chép">
                        <IconCopy className="cursor-pointer" size={18} stroke={1.5} onClick={() => serviceCopyKeyBoard(api_key)} />
                    </Tooltip>
                </Flex>
            ),
        },
        {
            title: 'Lượt dùng',
            key: 'use',
            render: (data) => (
                <Fragment>
                    <Tooltip title="Lượt dùng miễn phí">
                        <span className="text-success">{data.free_usage}</span>
                    </Tooltip>
                    <span className="mx-1">/</span>
                    <Tooltip title="Tổng lượt dùng">
                        <span className="text-info">{data.use}</span>
                    </Tooltip>
                </Fragment>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'green';
                let message = 'Hoạt động';

                if (!status) {
                    color = 'red';
                    message = 'Tạm khoá';
                }

                return <Tag color={color}>{message}</Tag>;
            },
        },
        {
            title: 'Ngày tạo/cập nhật',
            key: 'date',
            render: (data) => (
                <Fragment>
                    <span>{moment(data.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>
                    <br />
                    <span>{moment(data.updated_at).format('DD/MM/YYYY HH:mm:ss')}</span>
                </Fragment>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (data, record) => (
                <Button size="small" type="primary" onClick={() => record.onExpand(record)}>
                    Cấu hình
                </Button>
            ),
        },
    ];

    return (
        <Account>
            <div className="w-full">
                <h3 className="font-bold font-size-20 border-bottom pb-2 mb-5">Danh sách apikey</h3>

                {loading ? (
                    <Flex align="center" justify="center" style={{ minHeight: '40vh' }}>
                        <Spin />
                    </Flex>
                ) : (
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={serviceKeys.map((serviceKey) => ({ ...serviceKey, onExpand }))}
                            pagination={false}
                            expandable={defaultExpandable}
                        />
                    </Card>
                )}
            </div>
        </Account>
    );
}

export default ApiKey;
