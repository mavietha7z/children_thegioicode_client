import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import router from '~/configs/routes';

function RefProfile() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(router.profile);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div></div>;
}

export default RefProfile;
