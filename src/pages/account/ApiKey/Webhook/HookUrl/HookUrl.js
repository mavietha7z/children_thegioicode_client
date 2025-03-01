import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row } from 'antd';

import { configValidateDomain } from '~/configs';

const HookUrl = () => {
    return (
        <Form.List name="url">
            {(fields, { add, remove }) => (
                <div className="flex-1 mb-4">
                    {fields.map((field) => (
                        <Card size="small" key={field.key}>
                            <Form.Item label="Danh sách tên miền được cấu hình">
                                <Form.List name={[field.name, 'list']}>
                                    {(subFields, subOpt) => (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 16,
                                            }}
                                        >
                                            {subFields.map((subField, index) => (
                                                <Row style={{ margin: '0 -4px' }} key={index}>
                                                    <Col span={23} style={{ padding: '0 4px' }}>
                                                        <Form.Item
                                                            noStyle
                                                            name={[subField.name, 'domain']}
                                                            rules={[{ validator: configValidateDomain }]}
                                                        >
                                                            <Input size="large" placeholder="Nhập tên miền" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={1} style={{ padding: '0 4px' }}>
                                                        <CloseOutlined
                                                            className="mt-3"
                                                            onClick={() => {
                                                                subOpt.remove(subField.name);
                                                            }}
                                                        />
                                                    </Col>
                                                </Row>
                                            ))}
                                            <div className="text-center">
                                                <Button size="large" type="dashed" className="mb-1" onClick={() => subOpt.add()}>
                                                    + Thêm tên miền
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </Form.List>
                            </Form.Item>
                        </Card>
                    ))}
                </div>
            )}
        </Form.List>
    );
};

export default HookUrl;
