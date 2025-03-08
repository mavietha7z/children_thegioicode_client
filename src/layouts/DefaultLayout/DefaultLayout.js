import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Fragment, useEffect, useState } from 'react';
import { IconShoppingCart } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Flex, Layout, Spin, theme, notification, Divider, Tooltip, Badge } from 'antd';

import './DefaultLayout.css';
import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import Account from '../components/Account';
import imageLogo from '~/assets/image/logo.png';
import NavMobile from '../components/NavMobile';
import NavComputer from '../components/NavComputer';
import ProfileMenu from '../components/ProfileMenu';
import Notification from '../components/Notification';
import { requestUserGetCurrent } from '~/services/auth';
import FooterWrapper from '../components/FooterWrapper';
import { dispatchConfigApps } from '~/redux/reducer/app';
import { requestUserGetConfigApps } from '~/services/app';
import { loginUserSuccess, logoutUserSuccess } from '~/redux/reducer/auth';

const { Content, Header } = Layout;

function DefaultLayout({ children }) {
    const [loading, setLoading] = useState(true);
    const [openAccount, setOpenAccount] = useState(false);
    const [moduleAccount, setModuleAccount] = useState(null);
    const [websiteStatus, setWebsiteStatus] = useState(true);
    const [websiteStatusReason, setWebsiteStatusReason] = useState('Website bảo trì vui lòng truy cập lại sau!');

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const dispatch = useDispatch();

    const { configs } = useSelector((state) => state.apps);
    const { currentUser } = useSelector((state) => state.auth);
    const [lastBalance, setLastBalance] = useState(currentUser?.wallet?.total_balance);

    useEffect(() => {
        const fetch = async () => {
            const result = await requestUserGetConfigApps();
            if (result.status === 200) {
                const updateFavicon = (iconUrl) => {
                    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                    link.type = 'image/x-icon';
                    link.rel = 'shortcut icon';
                    link.href = iconUrl;
                    document.getElementsByTagName('head')[0].appendChild(link);
                };

                updateFavicon(result.data.favicon_url);
                dispatch(dispatchConfigApps(result.data));

                setWebsiteStatusReason(result.data.website_status.reason);
            } else {
                setLoading(false);
                setWebsiteStatus(false);
            }
        };
        fetch();

        console.log('%cDừng lại ngay việc truy cập công cụ dành cho nhà phát triển!', 'color:#29c4a9;font-size:14px;font-weight:600');
        console.log(
            '%cNếu bạn cố tình bị phát hiện sẽ bị khoá toàn khoản và chặn truy cập vĩnh viễn!',
            'color:#29c4a9;font-size:14px;font-weight:600',
        );
        console.log('%cCopyright © Thegioicode.com', 'color:#096eff;font-size:16px;font-weight:600');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (configs) {
            const fetch = async () => {
                try {
                    const result = await requestUserGetCurrent();

                    if (result.status === 200) {
                        if (!result.data) {
                            dispatch(logoutUserSuccess());
                            return;
                        }

                        if (lastBalance && lastBalance !== result.data.wallet.total_balance) {
                            const amount = result.data.wallet.total_balance - lastBalance;

                            const type = amount > 0 ? 'success' : 'error';
                            const className = amount > 0 ? 'text-success' : 'text-danger';
                            const message = amount > 0 ? 'Nạp tiền thành công' : 'Tài khoản trừ tiền';

                            notification[type]({
                                message: 'Thông báo',
                                description: (
                                    <Fragment>
                                        <span className="mr-1">{message}</span>
                                        <span className={className}>
                                            {amount > 0 && '+'}
                                            {convertCurrency(amount)}
                                        </span>
                                    </Fragment>
                                ),
                            });
                            setLastBalance(result.data.wallet.total_balance);
                        }

                        dispatch(loginUserSuccess(result.data));
                    } else {
                        dispatch(logoutUserSuccess());

                        notification.error({
                            message: 'Thông báo',
                            description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: 'Thông báo',
                        description: 'Lỗi hệ thống vui lòng thử lại sau',
                    });
                } finally {
                    setLoading(false);
                }
            };
            fetch();

            const intervalId = setInterval(fetch, 8000);

            return () => clearInterval(intervalId);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastBalance, configs]);

    return (
        <Fragment>
            {loading ? (
                <Flex align="center" justify="center" style={{ height: '70vh' }}>
                    <Spin />
                </Flex>
            ) : (
                <Fragment>
                    {!websiteStatus || !configs || configs.website_status.status !== 'activated' ? (
                        <Flex align="center" justify="center" style={{ height: '90vh' }}>
                            <div className="text-center">
                                <h2 className="font-size-15">{websiteStatusReason}</h2>
                                <p className="text-subtitle mt-2">
                                    <span className="mr-1">Contact:</span>
                                    <a className="text-subtitle hover-blue" href="mailto:noreply@netcode.vn">
                                        noreply@netcode.vn
                                    </a>
                                </p>
                            </div>
                        </Flex>
                    ) : (
                        <Layout>
                            {openAccount && moduleAccount && (
                                <Account module={moduleAccount} setModule={setModuleAccount} onHide={setOpenAccount} />
                            )}

                            <Header
                                className="default__header"
                                style={{ background: colorBgContainer, width: '100%', paddingLeft: 20, paddingRight: 20 }}
                            >
                                <div className="default__header-hr"></div>
                                <Flex align="center" justify="space-between" style={{ height: '100%' }}>
                                    {isMobile && (
                                        <Link to={router.home} style={{ lineHeight: 1 }}>
                                            <img
                                                src={configs?.website_logo_url || imageLogo}
                                                alt="Netcode"
                                                className="header__logo-mobile"
                                            />
                                        </Link>
                                    )}
                                    <div className="default__header-logo">
                                        <Link to={router.home}>
                                            <div className="header__logo-pc">
                                                <img
                                                    src={configs?.website_logo_url || imageLogo}
                                                    alt="Netcode"
                                                    className="header__logo-mobile"
                                                />
                                            </div>
                                        </Link>
                                    </div>

                                    {currentUser ? (
                                        <Flex align="center" className="h-full">
                                            <Notification currentUser={currentUser} />

                                            <div className="default__header-item">
                                                <Link to={router.cart} className="text-black">
                                                    <Tooltip title={isMobile ? '' : 'Giỏ hàng'}>
                                                        <Badge
                                                            count={currentUser?.cart_count}
                                                            overflowCount={9}
                                                            size="small"
                                                            offset={[0, 6]}
                                                            className="mt-5"
                                                        >
                                                            <Avatar
                                                                className="text-warning box-center box-header-icon"
                                                                icon={<IconShoppingCart size={20} />}
                                                                style={{ width: 35, height: 35, lineHeight: 35 }}
                                                            />
                                                        </Badge>
                                                    </Tooltip>
                                                </Link>
                                            </div>

                                            <Divider type="vertical" className="ml-3 mr-0" style={{ height: 20 }} />

                                            <div className="default__header-item d-none-tablet">
                                                <Link to={router.bonus_point} className="text-black">
                                                    <div className="box-header-text">
                                                        <div>
                                                            <div className="font-size-10 font-semibold line-height-12">Điểm thưởng</div>
                                                            <div className="font-semibold line-height-14 font-size-13 text-warning text-center">
                                                                {convertCurrency(currentUser?.wallet?.bonus_point).slice(0, -1)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>

                                            <div className="default__header-item d-none-tablet">
                                                <Link to={router.billing} className="text-black">
                                                    <div className="box-header-text">
                                                        <div>
                                                            <div className="font-size-10 font-semibold line-height-12">Số dư hiện tại</div>
                                                            <div className="font-semibold line-height-14 font-size-13 text-primary text-center">
                                                                {convertCurrency(currentUser?.wallet?.total_balance)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>

                                            <ProfileMenu />
                                        </Flex>
                                    ) : (
                                        <Flex align="center" className="h-full gap-3 header-cta-text">
                                            <div
                                                className="btn btn-register btn-radius btn-border btn-white px-3 cursor-pointer"
                                                onClick={() => {
                                                    setOpenAccount(true);
                                                    setModuleAccount('register');
                                                    document.body.classList.add('open-new-feed');
                                                }}
                                            >
                                                Đăng ký
                                            </div>

                                            <div
                                                className="btn btn-login btn-radius btn-border px-3 cursor-pointer"
                                                onClick={() => {
                                                    setOpenAccount(true);
                                                    setModuleAccount('login');
                                                    document.body.classList.add('open-new-feed');
                                                }}
                                            >
                                                Đăng nhập
                                            </div>
                                        </Flex>
                                    )}
                                </Flex>
                            </Header>
                            <Layout className="default_layout-layout">
                                {!isMobile && <NavComputer />}

                                <Content className="default-content">{children}</Content>
                            </Layout>

                            {isMobile && <NavMobile />}

                            <FooterWrapper />
                        </Layout>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
}

export default DefaultLayout;
