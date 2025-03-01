import { Collapse, Flex } from 'antd';

const responseSuccess = {
    data: [
        {
            id: 39355013,
            title: 'Ubuntu-18.04_64bit',
            group: 'Ubuntu',
            priority: 2,
            image_url: 'https://thegioicode.com/images/hOejKcFsYT.png',
            description: '',
        },
        {
            id: 21859853,
            title: 'Ubuntu-20.04_64bit',
            group: 'Ubuntu',
            priority: 2,
            image_url: 'https://thegioicode.com/images/eTgIWUuUgV.png',
            description: '',
        },
        '...',
    ],
    status: 200,
    message: 'Lấy danh sách hệ điều hành thành công',
};

function Image() {
    return (
        <Collapse
            items={[
                {
                    key: '1',
                    label: <div className="font-bold text-hover">Danh sách hệ điều hành</div>,
                    children: (
                        <div>
                            <Flex align="center">
                                <span className="document-method text-success font-bold">GET</span>
                                <span className="document-method flex-1 text-start">
                                    https://thegioicode.com/api/v2/cloud-server/images
                                </span>
                            </Flex>

                            <div className="mt-3 mb-1">Thành công:</div>
                            <div>
                                <div className="copy">
                                    <pre>
                                        <code className="text-copy success">{JSON.stringify(responseSuccess, null, 2)}</code>
                                    </pre>
                                </div>
                            </div>

                            <div className="mt-3 mb-1">Thất bại:</div>
                            <div>
                                <div className="copy">
                                    <pre>
                                        <code className="text-copy">
                                            {JSON.stringify({ status: 'Mã code lỗi', error: 'Thông tin lỗi trả về' }, null, 4)}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ]}
        />
    );
}

export default Image;
