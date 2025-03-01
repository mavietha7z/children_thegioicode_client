import { Collapse, Flex } from 'antd';

const responseSuccess = {
    data: [
        {
            id: 82206976,
            title: 'Hồ Chí Minh',
            priority: 1,
            image_url: 'https://thegioicode.com/images/yBdMTontlE.png',
            description: '',
            plans: [
                {
                    id: 28836824,
                    title: 'Premium',
                    image_url: 'https://thegioicode.com/images/TrchbOWyGD.png',
                    description:
                        'Ứng dụng đòi hỏi hiệu năng cao - Trang bị CPU Intel Xeon Gold/Platinum Gen 2 cùng với ổ cứng Enterprise NVMe siêu siêu nhanh',
                },
                '...',
            ],
        },
        '...',
    ],
    status: 200,
    message: 'Lấy danh sách vị trí đặt máy chủ thành công',
};

function Region() {
    return (
        <Collapse
            items={[
                {
                    key: '1',
                    label: <div className="font-bold text-hover">Danh sách vị trí</div>,
                    children: (
                        <div>
                            <Flex align="center">
                                <span className="document-method text-success font-bold">GET</span>
                                <span className="document-method flex-1 text-start">
                                    https://thegioicode.com/api/v2/cloud-server/regions
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

export default Region;
