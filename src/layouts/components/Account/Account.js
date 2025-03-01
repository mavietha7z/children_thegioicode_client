import { useState } from 'react';
import { IconX } from '@tabler/icons-react';

import './Account.css';
import Login from './Login';
import Reset from './Reset';
import Register from './Register';
import ResetPassword from './ResetPassword';

function Account({ module, setModule, onHide }) {
    const [isClosing, setIsClosing] = useState(false);

    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');

    const handleHideNewFeed = () => {
        setIsClosing(true);

        setTimeout(() => {
            onHide(false);
            setModule(null);
            setIsClosing(false);

            document.body.classList.remove('open-new-feed');
        }, 300);
    };
    return (
        <div className={`form_account-wrapper ${isClosing ? 'closing' : ''}`}>
            <div className="form_account-overlay"></div>
            <div className="form_account-content">
                <button className="form_account-close" onClick={handleHideNewFeed}>
                    <IconX size={22} />
                </button>

                {module === 'login' && <Login setModule={setModule} onHide={handleHideNewFeed} />}
                {module === 'register' && <Register setModule={setModule} />}
                {module === 'reset' && <Reset setModule={setModule} setEmail={setEmail} setOtp={setOtp} />}
                {module === 'reset_password' && <ResetPassword setModule={setModule} otp={otp} email={email} />}
            </div>
        </div>
    );
}

export default Account;
