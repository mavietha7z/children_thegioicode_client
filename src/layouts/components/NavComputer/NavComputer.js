import { Tooltip } from 'antd';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    IconApi,
    IconUsers,
    IconNetwork,
    IconServer2,
    IconTemplate,
    IconArrowLeft,
    IconBorderAll,
    IconArrowRight,
    IconHomeDollar,
    IconSourceCode,
    IconClipboardText,
} from '@tabler/icons-react';

import './NavComputer.css';
import router from '~/configs/routes';

const topItems = [
    {
        title: 'Trang chủ',
        router: router.home,
        icon: <IconBorderAll className="sidebar-icon" />,
    },
    {
        title: 'Public API',
        router: router.public_apis,
        icon: <IconApi className="sidebar-icon" />,
    },
    {
        title: 'Tài Khoản',
        router: router.resources,
        icon: <IconUsers className="sidebar-icon" />,
    },
    {
        title: 'Mã Nguồn',
        router: router.sources,
        icon: <IconSourceCode className="sidebar-icon" />,
    },
    {
        title: 'Tạo Website',
        router: router.templates,
        icon: <IconTemplate className="sidebar-icon" />,
    },

    {
        title: 'Proxy Server',
        router: router.proxy_server,
        icon: <IconNetwork className="sidebar-icon" />,
    },
    {
        title: 'Cloud Server',
        router: router.cloud_server,
        icon: <IconServer2 className="sidebar-icon" />,
    },
];

const bottomItems = [
    {
        title: 'Tài liệu',
        router: router.document,
        icon: <IconClipboardText className="sidebar-icon" />,
    },
    {
        title: 'Thanh toán',
        router: router.billing,
        icon: <IconHomeDollar className="sidebar-icon" />,
    },
];

function NavComputer() {
    const { pathname } = useLocation();
    const firstPart = pathname === '/' ? '/' : pathname.substring(0, pathname.indexOf('/', 1)) || pathname;

    const [current, setCurrent] = useState(() => firstPart);
    const [collapsed, setCollapsed] = useState(true);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);

        if (collapsed) {
            document.querySelector('.default-content').classList.add('active');
        } else {
            document.querySelector('.default-content').classList.remove('active');
        }
    };

    return (
        <div className="sidebar-wrapper">
            <div className="pt-20 sidebar">
                <div className="sidebar-container">
                    <div className="sidebar-over">
                        <div className={`sidebar-content ${collapsed ? '' : 'collapsed'}`}>
                            <div className="sidebar-section">
                                <ul className="sidebar-list">
                                    {topItems.map((sidebar, index) => (
                                        <li className="sidebar-item" key={index} onClick={() => setCurrent(sidebar.router)}>
                                            <Tooltip title={collapsed ? '' : sidebar.title} placement="right">
                                                <Link
                                                    to={sidebar.router}
                                                    className={`sidebar-link ${current === sidebar.router ? 'active' : ''} ${
                                                        !collapsed ? 'flex-column align-items-center' : ''
                                                    }`}
                                                >
                                                    {sidebar.icon}
                                                    {collapsed && <span className="sidebar-text">{sidebar.title}</span>}
                                                </Link>
                                            </Tooltip>
                                            {current === sidebar.router && <div className="sidebar-affix"></div>}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div
                                className="sidebar-section mb-0 pb-2"
                                style={{
                                    position: 'sticky',
                                    bottom: 0,
                                }}
                            >
                                <div className="sidebar-narrow mb-3"></div>

                                <ul className="sidebar-list">
                                    {bottomItems.map((sidebar, index) => (
                                        <li className="sidebar-item" key={index} onClick={() => setCurrent(sidebar.router)}>
                                            <Tooltip title={collapsed ? '' : sidebar.title} placement="right">
                                                <Link
                                                    to={sidebar.router}
                                                    className={`sidebar-link ${current === sidebar.router ? 'active' : ''} ${
                                                        !collapsed ? 'flex-column align-items-center' : ''
                                                    }`}
                                                >
                                                    {sidebar.icon}
                                                    {collapsed && <span className="sidebar-text">{sidebar.title}</span>}
                                                </Link>
                                            </Tooltip>
                                            {current === sidebar.router && <div className="sidebar-affix"></div>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sidebar-arrow" onClick={toggleCollapsed}>
                    {collapsed ? <IconArrowLeft size={18} /> : <IconArrowRight size={18} />}
                </div>
            </div>
        </div>
    );
}

export default NavComputer;
