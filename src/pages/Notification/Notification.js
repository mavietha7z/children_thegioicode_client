import moment from 'moment';
import { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IconArrowLeft, IconEye, IconEyeOff } from '@tabler/icons-react';
import { Breadcrumb, Button, Card, Col, Flex, notification, Pagination, Row, Spin, Table, Tooltip } from 'antd';

import router from '~/configs/routes';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserGetNotifications, requestUserUnreadNotification } from '~/services/account';

function Notification() {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(searchParams.get('page') || 1);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        document.title = 'Quản trị website - Danh sách thông báo';

        const fetch = async () => {
            setLoading(true);
            const result = await requestUserGetNotifications('mucus', page);

            setLoading(false);
            if (result.status === 401 || result.status === 403) {
                dispatch(logoutUserSuccess());
                navigate(router.home);
                notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
            } else if (result?.status === 200) {
                setPages(result.pages);
                setNotifications(result.data);
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

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const onExpand = (record) => {
        const keys = expandedRowKeys.includes(record.key)
            ? expandedRowKeys.filter((k) => k !== record.key)
            : [...expandedRowKeys, record.key];
        setExpandedRowKeys(keys);
    };

    const defaultExpandable = {
        expandedRowRender: (record) => <p className="notification-content">{record.content}</p>,
        expandedRowKeys,
        onExpand: (_, record) => onExpand(record),
        expandIcon: () => null,
    };

    const handleUnreadNotification = async (values) => {
        if (!values.unread) {
            return;
        }
        const data = {
            type: 'one',
            id: values.id,
        };

        const result = await requestUserUnreadNotification(data);

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            const cloneNotifications = [...notifications];

            const indexNotification = cloneNotifications.findIndex((notification) => notification.id === values.id);
            if (indexNotification === -1) {
                return notification.error({
                    message: 'Thông báo',
                    description: 'Không tìm thấy ID thông báo trong danh sách',
                });
            }

            cloneNotifications[indexNotification].unread = false;
            setNotifications(cloneNotifications);

            const { notification_count, ...others } = currentUser;
            dispatch(loginUserSuccess({ notification_count: notification_count - 1, ...others }));
        } else {
            notification.error({
                message: 'Thông báo',
                description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const columns = [
        {
            title: 'Tiêu đề',
            key: 'title',
            className: 'notification-title',
            render: (data) => (
                <span className={data.unread ? 'font-bold' : 'text-subtitle'}>
                    <RightOutlined className="mr-5" />
                    {data.title}
                </span>
            ),
        },
        {
            title: 'Ngày tạo',
            key: 'created_at',
            render: (data) => (
                <Flex align="center">
                    <span>{moment(data.created_at).format('DD/MM/YYYY HH:mm:ss')}</span>

                    <Tooltip title="Đánh dấu đã đọc">
                        <Button
                            size="small"
                            className="box-center ml-5"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleUnreadNotification(data);
                            }}
                        >
                            {data.unread ? <IconEye size={18} /> : <IconEyeOff size={18} />}
                        </Button>
                    </Tooltip>
                </Flex>
            ),
        },
    ];

    return (
        <Row style={{ rowGap: 16 }}>
            <Col span={24}>
                <Flex className="gap-2 pl-2">
                    <Button size="small" className="box-center" onClick={() => navigate(router.home)}>
                        <IconArrowLeft size={18} />
                    </Button>
                    <Breadcrumb
                        items={[
                            {
                                title: <Link to={router.home}>Trang chủ</Link>,
                            },
                            {
                                title: `Thông báo`,
                            },
                        ]}
                    />
                </Flex>
            </Col>

            <Col span={24}>
                <Card
                    styles={{
                        body: { padding: 10 },
                    }}
                    style={{ minHeight: 'calc(-171px + 100vh)' }}
                >
                    {!loading ? (
                        <Table
                            columns={columns}
                            className="notifications-table"
                            pagination={false}
                            expandable={defaultExpandable}
                            dataSource={notifications.map((notification) => ({
                                key: notification.id,
                                ...notification,
                                onExpand,
                            }))}
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        onExpand(record);
                                    },
                                };
                            }}
                        />
                    ) : (
                        <Flex align="center" justify="center" style={{ minHeight: '60vh' }}>
                            <Spin />
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
                </Card>
            </Col>
        </Row>
    );
}

export default Notification;
