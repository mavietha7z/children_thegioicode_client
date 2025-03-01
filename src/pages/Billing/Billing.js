import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, notification, Tabs } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconFileInvoice, IconServer2, IconShoppingBag, IconTemplate } from '@tabler/icons-react';

import Orders from './Orders';
import Balance from './Balance';
import Template from './Template';
import Recharge from './Recharge';
import Invoices from './Invoices';
import Instances from './Instances';
import router from '~/configs/routes';
import IconBalance from '~/assets/icon/IconBalance';
import IconRecharge from '~/assets/icon/IconRecharge';

function Billing({ label, keyTab, children }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!currentUser) {
            navigate(router.home);
            return notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const items = [
        {
            label: (
                <span className="box-align-center gap-2 text-subtitle">
                    <IconRecharge width={20} height={20} />
                    Nạp tiền
                </span>
            ),
            key: '1',
            children: <Recharge />,
        },
        {
            label: (
                <span className="box-align-center gap-2 text-subtitle">
                    <IconBalance width={20} height={20} />
                    Biến động số dư
                </span>
            ),
            key: '2',
            children: <Balance />,
        },
        {
            label: (
                <span className="box-align-center gap-2 text-subtitle">
                    <IconShoppingBag size={20} />
                    Đơn hàng
                </span>
            ),
            key: '3',
            children: <Orders />,
        },
        {
            label: (
                <span className="box-align-center gap-2 text-subtitle">
                    <IconFileInvoice size={20} />
                    Hoá đơn
                </span>
            ),
            key: '4',
            children: <Invoices />,
        },
        {
            label: (
                <span className="box-align-center gap-2 text-subtitle">
                    <IconTemplate size={20} />
                    Đơn tạo website
                </span>
            ),
            key: '5',
            children: <Template />,
        },
        {
            label: (
                <span className="box-align-center gap-2 text-subtitle">
                    <IconServer2 size={20} />
                    Instances
                </span>
            ),
            key: '6',
            children: <Instances />,
        },
    ];

    // Tìm và cập nhật tab được chỉ định từ props
    const tabIndex = items.findIndex((item) => item.key === keyTab);
    if (tabIndex !== -1) {
        items[tabIndex].label = label;
        items[tabIndex].children = children;
    } else {
        // Nếu keyTab không khớp, thêm tab mới vào cuối danh sách
        items.push({
            label: label,
            key: keyTab,
            children: children,
        });
    }

    const onChangeNavigate = (key) => {
        switch (key) {
            case '1':
                navigate(router.billing);
                break;
            case '2':
                navigate(router.billing_balance);
                break;
            case '3':
                navigate(router.billing_orders);
                break;
            case '4':
                navigate(router.billing_invoices);
                break;
            case '5':
                navigate(router.billing_templates);
                break;
            case '6':
                navigate(router.billing_instances);
                break;
            default:
                navigate(pathname);
        }
    };

    return (
        <Card style={{ minHeight: 'calc(-104px + 100vh)' }}>
            <h2 className="font-semibold font-size-18 mb-4">Thanh toán</h2>

            <Tabs activeKey={keyTab} items={items} onChange={onChangeNavigate} className="billing-tabs" />
        </Card>
    );
}

export default Billing;
