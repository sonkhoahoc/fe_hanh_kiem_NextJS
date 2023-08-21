import { Form, Input, Modal } from "antd";
import { fetcher } from "@/common/const";
import useSWRWithFallbackData from "@/common/use-swr-with-fallback-data";

import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import {
  fetcher_$POST,
  notificationError,
  notificationSuccess,
} from "@/common/functionglobal";
import { statusCode } from "@/common/enum";
import { admin } from "@/services/admin";

const { Item } = Form;

type Props = {
  show: boolean;
  handleModifyManageAdminModal: any;
  data: any;
};

const ModifyManageAdminModal: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const [getModifyAdminData, setModifyAdminData] = useState<any>({});
  const [getId, setid] = useState<number>(0);

  const {
    data: itemRes,
    error,
    isLoading,
  } = useSWRWithFallbackData(
    !!getId ? admin().user(getId) : null,
    fetcher,
    { fallbackData: getId }
  );

  const {
    trigger,
    data: dataModifyAdmin,
    error: errorModifyAdmin,
  } = useSWRMutation(admin().modify, fetcher_$POST);

  useEffect(() => {
    if (props?.data) {
      setid(props?.data.id);
    }
    if (itemRes && !error) {
      setModifyAdminData(itemRes.data);
      form.setFieldsValue(getModifyAdminData);
    }
  }, [error, itemRes, props, getId, getModifyAdminData, form]);

  const handleFormSubmit = async (values: any) => {
    trigger({ ...getModifyAdminData, ...values });
  };
  useEffect(() => {
    if (dataModifyAdmin?.statusCode == statusCode.OK) {
      notificationSuccess("Cập nhật thành công");
      props.handleModifyManageAdminModal(dataModifyAdmin?.data);
    }
    else if (dataModifyAdmin?.statusCode == statusCode.Error) {
      notificationError(`${dataModifyAdmin?.message}`);
    }
    if (errorModifyAdmin) {
      notificationError(`${errorModifyAdmin}`);
    }
  }, [dataModifyAdmin, errorModifyAdmin]);
  return (
    <>
      <Modal
        title={"Cập Nhật"}
        centered
        open={props.show}
        onOk={() => {
          form.submit();
        }}
        okButtonProps={{
          className: "bg-blue-500",
        }}
        okText="Xác nhận"
        cancelText="Thoát"
        onCancel={props.handleModifyManageAdminModal}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Item
            name="username"
            label="Tên đăng nhập"            
          >
            <Input disabled />
          </Item>
          <Item
            name="password"
            label="Mật khẩu"            
          >
            <Input disabled />
          </Item>
          <Item
            name="full_name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập Họ và tên!" }]}
          >
            <Input required />
          </Item>
          <Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập Email!" }]}
          >
            <Input required />
          </Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModifyManageAdminModal;
