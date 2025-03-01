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
        title: 'Params',
        parameter: 'order_id',
        type: 'Number | String',
        description: 'ID đơn máy chủ muốn lấy thông tin',
    },
];

const responseSuccess = {
    data: [
        {
            pricing: {
                price: 31072,
                cycle: '2.07 Tháng',
            },
            id: 65550677,
            disk: 20,
            core: 1,
            title: 'Premium #2',
            memory: 2048,
            status: true,
            priority: 2,
            sold_out: false,
            customize: false,
            bandwidth: 1000,
            description: '',
            network_speed: 100,
        },
        {
            pricing: {
                price: 62143,
                cycle: '2.07 Tháng',
            },
            id: 32483388,
            disk: 40,
            core: 2,
            title: 'Premium #3',
            memory: 2048,
            status: true,
            priority: 3,
            sold_out: false,
            customize: false,
            bandwidth: 0,
            description: '',
            network_speed: 200,
        },
        '...',
    ],
    status: 200,
    message: 'Lấy thông tin nâng cấp cấu hình thành công',
};

function ResizeInfo() {
    return (
        <Collapse
            items={[
                {
                    key: '1',
                    label: <div className="font-bold text-hover">Lấy thông tin cấu hình muốn đổi</div>,
                    children: (
                        <div>
                            <Flex align="center">
                                <span className="document-method text-success font-bold">GET</span>
                                <span className="document-method flex-1 text-start">
                                    https://thegioicode.com/api/v2/cloud-server/resize/:order_id
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

export default ResizeInfo;
