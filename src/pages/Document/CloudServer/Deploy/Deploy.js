import { Collapse, Flex, Table } from 'antd';

const columns = [
    {
        title: 'Loại',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Tham số',
        dataIndex: 'parameter',
        key: 'parameter',
    },
    {
        title: 'Kiểu dữ liệu',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
    },
];

const dataSource = [
    {
        title: 'Body JSON',
        parameter: 'plan_id',
        type: 'Number | String',
        description: 'ID của loại máy chủ',
    },
    {
        title: 'Body JSON',
        parameter: 'region_id',
        type: 'Number | String',
        description: 'ID vị trí đặt máy chủ',
    },
    {
        title: 'Body JSON',
        parameter: 'product_id',
        type: 'Number | String',
        description: 'ID gói dịch vụ muốn đăng ký',
    },
    {
        title: 'Body JSON',
        parameter: 'display_name',
        type: 'Array',
        description: 'Mảng danh sách tên máy chủ',
    },
    {
        title: 'Body JSON',
        parameter: 'image_id',
        type: 'Number | String',
        description: 'ID hệ điều hành muốn cài đặt',
    },
    {
        title: 'Body JSON',
        parameter: 'pricing_id',
        type: 'Number | String',
        description: 'ID chu kỳ máy chủ muốn đăng ký',
    },
];

const example = {
    plan_id: 28836824,
    region_id: 82206976,
    display_name: ['ubuntu2004'],
    image_id: 21859853,
    product_id: 91900449,
    pricing_id: 74188112,
};

const responseSuccess = {
    data: [
        {
            id: 73665972,
            order_info: {
                port: 22,
                hostname: 'ubuntu2004',
                username: 'root',
                password: 'FmQ0#tJ#6zaD',
                access_ipv4: '161.248.4.17',
                access_ipv6: '',
            },
            plan: {
                id: 28836824,
                title: 'Premium',
                image_url: 'https://thegioicode.com/images/TrchbOWyGD.png',
                description:
                    'Ứng dụng đòi hỏi hiệu năng cao - Trang bị CPU Intel Xeon Gold/Platinum Gen 2 cùng với ổ cứng Enterprise NVMe siêu siêu nhanh',
            },
            region: {
                id: 82206976,
                title: 'Việt Nam',
                image_url: 'https://thegioicode.com/images/SOAsaJEpxu.png',
                description: '',
            },
            image: {
                id: 21859853,
                title: 'Ubuntu-20.04_64bit',
                group: 'Ubuntu',
                image_url: 'https://thegioicode.com/images/eTgIWUuUgV.png',
                description: '',
            },
            product: {
                id: 91900449,
                disk: 20,
                core: 1,
                title: 'Premium #1',
                memory: 1024,
                customize: false,
                bandwidth: 1000,
                description: '',
                network_speed: 100,
            },
            status: 'starting',
            method: 'api',
            slug_url: 'ce04f497-2a5e-4d52-955b-6a84cd4bd6a3',
            cpu_usage: 0,
            auto_renew: false,
            disk_usage: 0,
            description: '',
            memory_usage: 0,
            display_name: 'ubuntu2004',
            backup_server: false,
            override_price: 40000,
            bandwidth_usage: 0,
            created_at: '2025-02-25 23:52:49',
            expired_at: '2025-03-25 23:59:59',
        },
    ],
    status: 200,
    message: 'Khởi tạo máy chủ thành công',
};

function Deploy() {
    return (
        <Collapse
            items={[
                {
                    key: '1',
                    label: <div className="font-bold text-hover">Khởi tạo dịch vụ</div>,
                    children: (
                        <div>
                            <Flex align="center">
                                <span className="document-method text-warning font-bold">POST</span>
                                <span className="document-method flex-1 text-start">
                                    https://thegioicode.com/api/v2/cloud-server/deploy
                                </span>
                            </Flex>

                            <Table className="mt-4" bordered columns={columns} dataSource={dataSource} pagination={false} />

                            <div className="mt-3 mb-1">Body:</div>
                            <div>
                                <div className="copy">
                                    <pre>
                                        <code className="text-copy warning">{JSON.stringify(example, null, 2)}</code>
                                    </pre>
                                </div>
                            </div>

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

export default Deploy;
