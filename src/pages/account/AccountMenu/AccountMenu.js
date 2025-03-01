import { Menu } from 'antd';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconCrown, IconHistoryToggle, IconKey, IconNotification, IconSettings, IconShieldLock, IconUserCircle } from '@tabler/icons-react';

import router from '~/configs/routes';

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
    getItem(<Link to={router.profile}>Thông tin cá nhân</Link>, router.profile, <IconUserCircle size={22} />),
    getItem(<Link to={router.bonus_point}>Điểm thưởng</Link>, router.bonus_point, <IconCrown size={22} />),
    getItem(<Link to={router.apikey}>Apikey</Link>, router.apikey, <IconKey size={22} />),
    getItem(<Link to={router.security}>Bảo mật</Link>, router.security, <IconShieldLock size={22} />),
    getItem(<Link to={router.notification}>Thông báo</Link>, router.notification, <IconNotification size={22} />),
    getItem(<Link to={router.history_login}>Lịch sử đăng nhập</Link>, router.history_login, <IconHistoryToggle size={22} />),
    getItem(<Link to={router.general}>Cài đặt chung</Link>, router.general, <IconSettings size={22} />),
];

function AccountMenu() {
    const { pathname } = useLocation();
    const [current, setCurrent] = useState(() => `/user/${pathname.split('/')[2]}`);

    return (
        <Menu
            selectedKeys={[current]}
            onClick={(e) => setCurrent(e.key)}
            defaultOpenKeys={['1']}
            mode="inline"
            items={items}
            className="menu-sidebar"
            style={{
                borderRight: 'none',
            }}
        />
    );
}

export default AccountMenu;
