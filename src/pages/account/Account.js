import { useState } from 'react';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { Avatar, Card, Flex, Tabs, Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    IconKey,
    IconCrown,
    IconSettings,
    IconShieldLock,
    IconUserCircle,
    IconNotification,
    IconHistoryToggle,
    IconCircleCheckFilled,
} from '@tabler/icons-react';

import './Account.css';
import router from '~/configs/routes';
import AccountMenu from './AccountMenu';
import imageAvatarDefault from '~/assets/image/avatar-default.png';

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
const items = [
    getItem(<span>Thông tin cá nhân</span>, router.profile, <IconUserCircle size={22} />),
    getItem(<span>Điểm thưởng</span>, router.bonus_point, <IconCrown size={22} />),
    getItem(<span>Apikey</span>, router.apikey, <IconKey size={22} />),
    getItem(<span>Bảo mật</span>, router.security, <IconShieldLock size={22} />),
    getItem(<span>Thông báo</span>, router.notification, <IconNotification size={22} />),
    getItem(<span>Lịch sử đăng nhập</span>, router.history_login, <IconHistoryToggle size={22} />),
    getItem(<span>Cài đặt chung</span>, router.general, <IconSettings size={22} />),
];

function Account({ children }) {
    const { pathname } = useLocation();
    const [activeKey, setActiveKey] = useState(pathname);

    const { currentUser } = useSelector((state) => state.auth);

    const navigate = useNavigate();

    const onChangeNavigate = (key) => {
        navigate(key);
        setActiveKey(key);
    };

    return (
        <div className="d-flex flex-column gap-5">
            <h3 className="title-page font-bold ml-xs-2">Cài đặt tài khoản</h3>

            <Card className="rounded-15">
                <Flex justify="space-between" className="gap-3 flex-wrap">
                    <Flex className="gap-3">
                        <div className="w-max position-relative">
                            <Avatar src={currentUser?.avatar_url || imageAvatarDefault} style={{ width: 55, height: 55, lineHeight: 55 }} />

                            <div className="badge_profile"></div>
                        </div>
                        <Flex className="flex-column">
                            <h5 className="font-size-17 mb-0 font-bold mt-0">{currentUser?.full_name}</h5>
                            <div className="text-subtitle font-size-13 word-break-all">{currentUser?.email}</div>
                            <div className="profile__menu-status">{currentUser?.membership.current.name.toUpperCase()}</div>
                        </Flex>
                    </Flex>

                    <div className="w-xs-full">
                        <h5 className="font-size-14 mb-2 font-bold mt-0">Trạng thái tài khoản</h5>

                        <Flex className="flex-wrap gap-2">
                            <Flex
                                align="center"
                                className="flex-column border px-3 py-2 rounded-8 text-subtitle font-size-12 font-weight-bold profile_status"
                            >
                                Địa chỉ email
                                <Tooltip placement="bottom" title={`${currentUser?.email_verified ? 'Đã' : 'Chưa'} xác thực`}>
                                    <IconCircleCheckFilled size={18} className={`${currentUser?.email_verified && 'text-success'}`} />
                                </Tooltip>
                            </Flex>
                            <Flex
                                align="center"
                                className="flex-column border px-3 py-2 rounded-8 text-subtitle font-size-12 font-weight-bold profile_status"
                            >
                                Số điện thoại
                                <Tooltip placement="bottom" title={`${currentUser?.phone_verified ? 'Đã' : 'Chưa'} xác thực`}>
                                    <IconCircleCheckFilled size={18} className={`${currentUser?.phone_verified && 'text-success'}`} />
                                </Tooltip>
                            </Flex>
                        </Flex>
                    </div>
                </Flex>
            </Card>

            <Card>
                <div className="account_container py-2">
                    <div className="account_col-left">
                        {isMobile ? (
                            <Tabs activeKey={activeKey} items={items} onChange={onChangeNavigate} className="profile_tabs" />
                        ) : (
                            <AccountMenu />
                        )}
                    </div>
                    <div className="account_col-br"></div>
                    <div className="account_col-right">{children}</div>
                </div>
            </Card>
        </div>
    );
}

export default Account;
