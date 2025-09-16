import React, { useState } from "react";
import { Modal, Form, Input, Select, message, Space } from "antd";
import authService, { IUser } from "../../services/authService";
import { useSelector } from "react-redux";
import { RootState } from "../../store/types/store";
import { PERMISSION_GROUPS, ROLE_PERMISSIONS } from "../../services/interfaces/permission";

interface UserEditModalProps {
  visible: boolean;
  user: IUser | null;
  onClose: () => void;
  isEdit: boolean;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ visible, user, onClose }) => {
  const [form] = Form.useForm();
  const { user: userInfo } = useSelector((root: RootState) => root.user);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (user) {
        delete values.email;
        const response = await authService.updateClient({ ...values, userId: user.id });
        message.success("User updated successfully");
        setLoading(false);
        onClose();
      }
    } catch (error) {
      setLoading(false);
      message.error("Failed to update user");
    }
  };

  React.useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
    if (!user?.role) {
      form.setFieldValue("role", "");
    }
  }, [user, form]);

  return (
    <Modal
      title='Edit User'
      okText='Update'
      okButtonProps={{ loading: loading }}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      maskClosable={false}
      confirmLoading={false}
      destroyOnClose>
      <Form form={form} layout='vertical'>
        <Form.Item name='username' label='Name' rules={[{ required: true, message: "Please enter name" }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name='email'
          label='Email'
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}>
          <Input disabled />
        </Form.Item>

        <Form.Item name='phone' label='Phone'>
          <Input />
        </Form.Item>

        <Form.Item name='permissions' label='Permissions'>
          <Select
            mode='multiple'
            style={{ width: "100%" }}
            placeholder='Please select permissions'
            defaultValue={[PERMISSION_GROUPS?.Dashboard[0]]}
            options={Object.keys(PERMISSION_GROUPS).map((key) => ({
              label: key,
              title: key,
              options: PERMISSION_GROUPS[key].map((permission: string) => ({
                label: permission,
                value: permission,
              })),
            }))}
          />
        </Form.Item>

        {/* <Form.Item name='role' label='Role' rules={[{ required: true, message: "Please select role" }]}>
          <Select>
            <Select.Option value='SUPERADMIN'>SuperAdmin</Select.Option>
            <Select.Option value='ADMIN'>Admin</Select.Option>
            <Select.Option value='CLIENT'>Client</Select.Option>
            <Select.Option value='USER'>User</Select.Option>
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default UserEditModal;
