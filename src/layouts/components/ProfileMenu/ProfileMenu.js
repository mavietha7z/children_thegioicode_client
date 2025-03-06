import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Divider, Dropdown, Flex, notification } from 'antd';
import { IconAuth2fa, IconKey, IconPower, IconUserCircle } from '@tabler/icons-react';

import './ProfileMenu.css';
import router from '~/configs/routes';
import { convertCurrency } from '~/configs';
import { requestUserLogout } from '~/services/auth';
import { logoutUserSuccess } from '~/redux/reducer/auth';
import imageAvatarDefault from '~/assets/image/avatar-default.png';

function ProfileMenu() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.auth);

    const handleLogoutAuth = async () => {
        const result = await requestUserLogout();

        if (result.status === 200) {
            dispatch(logoutUserSuccess());
            navigate(router.home);
        } else {
            notification.error({
                message: 'Thông báo',
                description: result?.error || 'Lỗi hệ thống vui lòng thử lại sau',
            });
        }
    };

    return (
        <Dropdown
            className="default__header-item"
            dropdownRender={() => (
                <div className="profile__menu-content">
                    <Flex align="center" style={{ padding: '16px 16px 8px 16px' }}>
                        <div style={{ width: 45 }}>
                            <Avatar src={currentUser?.avatar_url || imageAvatarDefault} style={{ width: 45, height: 45, lineHeight: 45 }} />
                        </div>

                        <div className="ml-2 flex-1">
                            <div style={{ color: '#000' }} className="font-bold">
                                {currentUser?.full_name}
                            </div>
                            <div style={{ fontSize: 'smaller', color: '#000' }} className="font-weight-bold">
                                {currentUser?.email}
                            </div>
                            <div className="profile__menu-status">{currentUser?.membership.current.name}</div>
                        </div>
                    </Flex>
                    <Divider style={{ margin: '4px 0' }} />

                    <div className="d-none-mobile">
                        <div className="d-flex gap-2 py-1 px-2">
                            <Link
                                to={router.bonus_point}
                                className="text-black box-header-text justify-content-center pb-1 pt-2 h-auto"
                                style={{ width: '50%', borderRadius: 20 }}
                            >
                                <div>
                                    <div className="font-size-10 font-semibold line-height-12">Điểm thưởng</div>
                                    <div className="font-semibold text-warning text-center">
                                        {convertCurrency(currentUser?.wallet.bonus_point).slice(0, -1)}
                                    </div>
                                </div>
                            </Link>

                            <Link
                                to={router.billing}
                                className="text-black box-header-text justify-content-center pb-1 pt-2 h-auto"
                                style={{ width: '50%', borderRadius: 20 }}
                            >
                                <div>
                                    <div className="font-size-10 font-semibold line-height-12">Số dư hiện tại</div>
                                    <div className="font-semibold text-primary text-center">
                                        {convertCurrency(currentUser?.wallet.total_balance)}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <Divider className="d-none-mobile" style={{ margin: '4px 0' }} />

                    <ul className="profile__menu-list">
                        <Link to={router.profile} className="w-full">
                            <li className="profile__menu-item">
                                <IconUserCircle size={18} />
                                <span className="profile__menu-title">Cài đặt tài khoản</span>
                            </li>
                        </Link>
                        <Link to={router.apikey} className="w-full">
                            <li className="profile__menu-item">
                                <IconKey size={18} />
                                <span className="profile__menu-title">Apikey</span>
                            </li>
                        </Link>
                        <Link to={router.security} className="w-full">
                            <li className="profile__menu-item">
                                <IconAuth2fa size={18} />
                                <span className="profile__menu-title">Xác thực 2 bước</span>
                            </li>
                        </Link>
                        <Divider style={{ margin: '4px 0' }} />
                        <li className="profile__menu-item" onClick={handleLogoutAuth}>
                            <IconPower size={18} />
                            <span className="profile__menu-title">Đăng xuất</span>
                        </li>
                    </ul>
                </div>
            )}
            placement="bottomLeft"
            trigger={['click']}
        >
            <div>
                <Avatar
                    src={currentUser?.avatar_url || imageAvatarDefault}
                    style={{ cursor: 'pointer', width: 35, height: 35, lineHeight: 35 }}
                />
            </div>
        </Dropdown>
    );
}

export default ProfileMenu;
