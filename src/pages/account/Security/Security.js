import { useEffect } from 'react';
import { notification } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Account from '../Account';
import router from '~/configs/routes';
import SecurityItem from './SecurityItem';

function Security() {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        document.title = 'Thegioicode.com - Bảo mật tài khoản';

        if (!currentUser) {
            navigate(router.home);
            return notification.error({ message: 'Thông báo', description: 'Vui lòng đăng nhập để tiếp tục' });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Account>
            <div className="w-full">
                <h3 className="font-bold font-size-20 border-bottom pb-2 mb-5">Bảo mật</h3>

                <SecurityItem
                    title="Địa chỉ email"
                    authen={currentUser?.email_verified}
                    description="Xin lưu ý, quý khách vui lòng nhập đúng email cần chuyển đổi trước khi nhấn xác nhận và xác nhận lại bằng mật khẩu. Sau khi hoàn tất, chúng tôi sẽ gửi cho bạn một liên kết đến email mới của bạn. Hãy kiểm tra và click vào liên kết để xác nhận."
                    name="Email"
                    value={currentUser?.email}
                    type="email"
                />

                <SecurityItem
                    title="Số điện thoại"
                    authen={currentUser?.phone_verified}
                    description="Hãy đảm bảo cập nhật thông tin số điện thoại một cách chính xác để nhận các thông báo và xác thực tài khoản."
                    name="Điện thoại"
                    value={currentUser?.phone_number}
                    type="phone_number"
                />

                <SecurityItem
                    title="Mật khẩu"
                    link="/user/security/change-password"
                    textLink="Thay đổi"
                    authen={false}
                    description="Đặt mật khẩu duy nhất để bảo vệ tài khoản của bạn."
                />

                <SecurityItem
                    title="Xác thực 2 bước (2FA)"
                    authen={false}
                    active={currentUser?.two_factor_auth}
                    factor
                    link={currentUser?.two_factor_auth ? null : `${router.twoFactor}`}
                    textLink="Bật xác thực"
                    description="Bảo vệ tài khoản của bạn khỏi bị đánh cắp bằng cách bật xác thực 2 bước. Khi bật xác thực 2 bước, bạn bắt buộc phải nhập mã xác thực mỗi khi đăng nhập vào Thegioicode"
                />
            </div>
        </Account>
    );
}

export default Security;
