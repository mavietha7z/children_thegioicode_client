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
        title: 'Query',
        parameter: 'page',
        type: 'Number',
        description: 'Số trang muốn lấy dữ liệu mặc định trả về 20 dữ liệu trên 1 trang',
    },
];

const responseSuccess = {
    data: [
        {
            id: 73665972,
            plan: {
                title: 'Premium',
                image_url: 'https://thegioicode.com/images/TrchbOWyGD.png',
                description:
                    'Ứng dụng đòi hỏi hiệu năng cao - Trang bị CPU Intel Xeon Gold/Platinum Gen 2 cùng với ổ cứng Enterprise NVMe siêu siêu nhanh',
                id: 28836824,
            },
            image: {
                title: 'Ubuntu-20.04_64bit',
                group: 'Ubuntu',
                image_url: 'https://thegioicode.com/images/eTgIWUuUgV.png',
                description: '',
                id: 21859853,
            },
            status: 'activated',
            region: {
                title: 'Việt Nam',
                image_url: 'https://thegioicode.com/images/SOAsaJEpxu.png',
                description: '',
                id: 82206976,
            },
            method: 'api',
            product: {
                title: 'Premium #1',
                core: 1,
                memory: 1024,
                disk: 20,
                bandwidth: 1000,
                network_speed: 100,
                customize: false,
                id: 91900449,
            },
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
            order_info: {
                port: 22,
                hostname: 'ubuntu2004',
                username: 'root',
                password: 'FmQ0#tJ#6zaD',
                access_ipv4: '161.248.4.17',
                access_ipv6: '',
            },
            created_at: '2025-02-25 23:52:49',
            expired_at: '2025-03-25 23:59:59',
        },
        '...',
    ],
    pages: 1,
    status: 200,
    message: 'Lấy danh sách máy chủ đã tạo thành công',
};

function Order() {
    return (
        <Collapse
            items={[
                {
                    key: '1',
                    label: <div className="font-bold text-hover">Danh sách dịch vụ đã khởi tạo</div>,
                    children: (
                        <div>
                            <Flex align="center">
                                <span className="document-method text-success font-bold">GET</span>
                                <span className="document-method flex-1 text-start">
                                    https://thegioicode.com/api/v2/cloud-server/orders?page=1
                                </span>
                            </Flex>

                            <Table className="mt-4" bordered columns={columns} dataSource={dataSource} pagination={false} />

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

export default Order;
