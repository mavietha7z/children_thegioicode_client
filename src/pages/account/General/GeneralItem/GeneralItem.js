import { Avatar, Dropdown, Flex } from 'antd';
import { DownOutlined } from '@ant-design/icons';

function GeneralItem({ title, items, avatar, name, description }) {
    return (
        <div className="border-bottom">
            <Flex justify="space-between">
                <div>
                    <h3 className="font-bold font-size-18 mb-1">{title}</h3>
                </div>

                <Dropdown
                    menu={{
                        items,
                    }}
                    trigger={['click']}
                    className="box-header-icon text-subtitle cursor-pointer rounded-8 px-2 d-flex items-center"
                >
                    <div>
                        {avatar && <Avatar className="mr-2 rounded" src={avatar} style={{ width: 16, height: 16 }} />}
                        <span>{name}</span>
                        <DownOutlined className="font-size-12 ml-1" />
                    </div>
                </Dropdown>
            </Flex>

            <p className="text-subtitle mb-4">{description}</p>
        </div>
    );
}

export default GeneralItem;
