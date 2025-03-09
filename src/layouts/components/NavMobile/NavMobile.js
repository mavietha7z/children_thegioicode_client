import { Button, Drawer } from 'antd';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import {
    IconX,
    IconApi,
    IconBox,
    IconKey,
    IconPlus,
    IconHome,
    IconMenu2,
    IconCrown,
    IconServer2,
    IconTemplate,
    IconSourceCode,
    IconUserCircle,
    IconShieldLock,
    IconHomeDollar,
    IconShoppingBag,
    IconFileInvoice,
    IconHistoryToggle,
} from '@tabler/icons-react';

import './NavMobile.css';
import router from '~/configs/routes';
import IconBalance from '~/assets/icon/IconBalance';
import IconRecharge from '~/assets/icon/IconRecharge';

const menus = [
    { key: 'home', title: 'trang chủ', icon: <IconHome size={20} />, link: router.home, is_login: false, items: [] },
    {
        key: 'product',
        title: 'sản phẩm',
        icon: <IconBox size={20} />,
        link: false,
        is_login: false,
        items: [
            { icon: <IconApi size={35} />, title: 'Public API', path: router.public_apis },
            { icon: <IconSourceCode size={35} />, title: 'Mã nguồn', path: router.sources },
            { icon: <IconTemplate size={35} />, title: 'Tạo website', path: router.templates },
            { icon: <IconServer2 size={35} />, title: 'Cloud server', path: router.cloud_server },
        ],
    },
    { key: 'cloud', title: 'cloud server', icon: <IconPlus size={30} />, link: router.cloud_server, is_login: false, items: [] },
    {
        key: 'billing',
        title: 'thanh toán',
        icon: <IconHomeDollar size={20} />,
        link: false,
        is_login: true,
        items: [
            { icon: <IconRecharge width={35} height={35} />, title: 'Nạp tiền', path: router.billing },
            { icon: <IconBalance width={35} height={35} />, title: 'Giao dịch', path: router.billing_balance },
            { icon: <IconShoppingBag size={35} />, title: 'Đơn hàng', path: router.billing_orders },
            { icon: <IconFileInvoice size={35} />, title: 'Hoá đơn', path: router.billing_invoices },
            { icon: <IconSourceCode size={35} />, title: 'Đơn mã nguồn', path: router.billing_sources },
            { icon: <IconTemplate size={35} />, title: 'Đơn tạo website', path: router.billing_templates },
            { icon: <IconServer2 size={35} />, title: 'Instances', path: router.billing_instances },
        ],
    },
    {
        key: 'other',
        title: 'khác',
        icon: <IconMenu2 size={20} />,
        link: false,
        is_login: true,
        items: [
            { icon: <IconUserCircle size={35} />, title: 'Thông tin cá nhân', path: router.profile },
            { icon: <IconCrown size={35} />, title: 'Điểm thưởng', path: router.bonus_point },
            { icon: <IconKey size={35} />, title: 'Apikey', path: router.apikey },
            { icon: <IconShieldLock size={35} />, title: 'Bảo mật', path: router.security },
            { icon: <IconHistoryToggle size={35} />, title: 'Lịch sử đăng nhập', path: router.history_login },
        ],
    },
];

function NavMobile() {
    const [open, setOpen] = useState(false);
    const [currentKey, setCurrentKey] = useState(null);
    const [currentMenu, setCurrentMenu] = useState(null);

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [open]);

    const handleOpenMenu = (key) => {
        const menu = menus.find((menu) => menu.key === key);

        setCurrentKey(key);

        // Nếu menu không có items và có link thì điều hướng
        if (menu.items.length === 0 && menu.link) {
            setOpen(false);
            navigate(menu.link);
            return;
        }

        // Đóng menu nếu đang mở và click lại
        if (currentKey === key) {
            setOpen(!open);
        } else {
            // Mở menu mới
            setOpen(true);
        }
        setCurrentMenu(menu);
    };

    const handleCloseDrawer = () => {
        setOpen(false);
        setCurrentKey(null);
        setCurrentMenu(null);
    };

    return (
        <Fragment>
            <div className="nav-wrapper">
                {menus.map((menu) => (
                    <div
                        key={menu.key}
                        className={`nav-item ${menu.key === 'cloud' ? 'nav-item-cloud' : ''} ${currentKey === menu.key ? 'selected' : ''}`}
                        onClick={() => handleOpenMenu(menu.key)}
                    >
                        {menu.key === 'cloud' ? <div className="item-cloud">{menu.icon}</div> : menu.icon}
                        <span>{menu.title}</span>
                    </div>
                ))}
            </div>

            {currentMenu && (
                <Drawer
                    title={`Danh mục ${currentMenu.title}`}
                    placement="bottom"
                    closable={false}
                    onClose={handleCloseDrawer}
                    open={open}
                    zIndex={100}
                    height={600}
                    classNames={{ header: 'text-center px-3 py-2-5', content: 'rounded-top-xl', body: 'px-0 pt-0' }}
                    extra={<Button type="text" className="box-center" icon={<IconX size={20} />} onClick={handleCloseDrawer}></Button>}
                    styles={{ wrapper: { height: 600, boxShadow: 'none' }, body: { paddingBottom: 60 } }}
                >
                    <div className="h-full w-full overflow-auto">
                        <div className="p-3-5">
                            <div className={currentMenu.is_login && !currentUser ? '' : 'nav-category'}>
                                {currentMenu.is_login && !currentUser ? (
                                    <div className="box-center flex-column gap-1 px-3 py-3 bg-card-info-modal rounded">
                                        <span className="font-size-16">Vui lòng đăng nhập để xem danh mục</span>
                                    </div>
                                ) : (
                                    currentMenu.items.map((menu, index) => (
                                        <Link
                                            to={menu.path}
                                            className="box-center flex-column gap-1 px-3 py-4 bg-card-info-modal rounded"
                                            key={index}
                                            onClick={handleCloseDrawer}
                                        >
                                            {menu.icon}
                                            <div className="font-size-16 nav-link-text">{menu.title}</div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </Drawer>
            )}
        </Fragment>
    );
}

export default NavMobile;
