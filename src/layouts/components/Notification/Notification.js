import { useDispatch } from 'react-redux';
import { Fragment, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';
import { IconBell, IconChecks, IconEye } from '@tabler/icons-react';
import { Avatar, Badge, Button, Dropdown, Empty, Flex, notification, Spin } from 'antd';

import './Notification.css';
import router from '~/configs/routes';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';
import { requestUserGetNotifications, requestUserUnreadNotification } from '~/services/account';

function Notification({ currentUser }) {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleShowNotification = async () => {
        if (notifications.length > 0) {
            return;
        }

        setLoading(true);
        const result = await requestUserGetNotifications('quicks');

        setLoading(false);
        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            setNotifications(result.data);
        } else {
            notification.error({
                message: 'Thông báo',
                description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    const handleUnreadNotification = async (type, id) => {
        const { notification_count, ...others } = currentUser;

        if (notification_count < 1) {
            return;
        }

        let data = {
            type,
            id: null,
        };

        if (type === 'one') {
            data.id = id;
        }

        const result = await requestUserUnreadNotification(data);

        if (result.status === 401 || result.status === 403) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else if (result?.status === 200) {
            const newResult = await requestUserGetNotifications('quicks');

            setNotifications(newResult.data);

            let notificationCount = 0;
            if (type === 'one') {
                notificationCount = notification_count - 1;
            }

            dispatch(loginUserSuccess({ notification_count: notificationCount, ...others }));
        } else {
            notification.error({
                message: 'Thông báo',
                description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    if (isMobile) {
        return (
            <div className="default__header-item">
                <Badge count={currentUser?.notification_count} overflowCount={9} size="small" offset={[0, 6]}>
                    <Link to={router.notifications}>
                        <Avatar
                            className="box-center box-header-icon text-link cursor-pointer"
                            icon={<IconBell size={20} />}
                            style={{ width: 35, height: 35, lineHeight: 35 }}
                        />
                    </Link>
                </Badge>
            </div>
        );
    }

    return (
        <Dropdown
            dropdownRender={() => (
                <div className="notification rounded-8 boxshadow background-white">
                    <div className="notification-header">Thông báo</div>

                    {loading ? (
                        <Flex className="py-5" align="center" justify="center">
                            <Spin />
                        </Flex>
                    ) : (
                        <Fragment>
                            <ul className="notification-list">
                                {notifications.length > 0 ? (
                                    <Fragment>
                                        {notifications.map((notification) => (
                                            <li
                                                key={notification.id}
                                                className="notification-item"
                                                data-unread={notification.unread}
                                                onClick={() => handleUnreadNotification('one', notification.id)}
                                            >
                                                <h4 className="m-0 font-size-15 line-height-17 font-bold">{notification.title}</h4>
                                                <span className="mt-0 mb-0 text-ellipsis ellipsis-1 text-subtitle font-size-13 custom-inner-html-editor">
                                                    {notification.content}
                                                </span>
                                            </li>
                                        ))}
                                    </Fragment>
                                ) : (
                                    <Empty description="Chưa có thông báo nào" className="py-4" />
                                )}
                            </ul>
                            <div className="notification-footer">
                                <div className="d-flex gap-2">
                                    <Link to={router.notifications}>
                                        <Button className="box-center gap-1">
                                            <IconEye stroke={1.2} size={18} />
                                            Xem tất cả
                                        </Button>
                                    </Link>
                                    <Button
                                        type="primary"
                                        className="box-center gap-1 flex-1"
                                        disabled={currentUser?.notification_count === 0}
                                        onClick={() => handleUnreadNotification('all', null)}
                                    >
                                        <IconChecks stroke={1.2} size={18} />
                                        Đọc tất cả
                                    </Button>
                                </div>
                            </div>
                        </Fragment>
                    )}
                </div>
            )}
            placement="bottom"
            trigger={['click']}
            overlayStyle={{ minWidth: 270, maxWidth: 320, zIndex: 99 }}
        >
            <div className="default__header-item">
                <Badge count={currentUser?.notification_count} overflowCount={9} size="small" offset={[0, 6]}>
                    <Avatar
                        className="box-center box-header-icon text-link cursor-pointer"
                        icon={<IconBell size={20} />}
                        style={{ width: 35, height: 35, lineHeight: 35 }}
                        onClick={handleShowNotification}
                    />
                </Badge>
            </div>
        </Dropdown>
    );
}

export default Notification;
