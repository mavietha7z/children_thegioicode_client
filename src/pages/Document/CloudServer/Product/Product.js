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
        parameter: 'plan_id',
        type: 'Number | String',
        description: 'ID của loại máy chủ',
    },
];

const responseSuccess = {
    data: [
        {
            pricings: [
                {
                    id: 74188112,
                    price: 40000,
                    cycles: {
                        unit: 'months',
                        value: 1,
                        display_name: '1 Tháng',
                    },
                },
                '...',
            ],
            id: 91900449,
            disk: 20,
            core: 1,
            title: 'Premium #1',
            memory: 1024,
            status: true,
            priority: 1,
            sold_out: false,
            customize: false,
            bandwidth: 1000,
            description: '',
            network_speed: 100,
        },
        '...',
    ],
    status: 200,
    message: 'Lấy danh sách gói dịch vụ máy chủ thành công',
};

function Product() {
    return (
        <Collapse
            items={[
                {
                    key: '1',
                    label: <div className="font-bold text-hover">Danh sách gói dịch vụ</div>,
                    children: (
                        <div>
                            <Flex align="center">
                                <span className="document-method text-success font-bold">GET</span>
                                <span className="document-method flex-1 text-start">
                                    https://thegioicode.com/api/v2/cloud-server/products/:plan_id
                                </span>
                            </Flex>

                            <Table className="mt-4" bordered columns={columns} dataSource={dataSource} pagination={false} />

                            <div className="mt-4 mb-2">Thành công:</div>
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

export default Product;
