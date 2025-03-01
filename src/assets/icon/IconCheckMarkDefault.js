import { IconCheck } from '@tabler/icons-react';

function IconCheckMarkDefault() {
    return (
        <div className="CheckMarkDefault_box_check">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="CheckMarkDefault_img_check">
                <path fill="currentColor" d="M4586,7426h32v32Z" transform="translate(-4586 -7426)"></path>
            </svg>
            <IconCheck className="CheckMarkDefault_icon_check" size={16} />
        </div>
    );
}

export default IconCheckMarkDefault;
