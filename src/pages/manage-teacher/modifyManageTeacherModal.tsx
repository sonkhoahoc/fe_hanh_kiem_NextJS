import { Form, Input, Modal } from "antd";
import { fetcher } from "@/common/const";
import useSWRWithFallbackData from "@/common/use-swr-with-fallback-data";

import { useEffect, useState } from "react";
import { category } from "@/services/category";
import useSWRMutation from "swr/mutation";
import {
  fetcher_$GET,
  fetcher_$POST,
  notificationError,
  notificationSuccess,
} from "@/common/functionglobal";
import { statusCode } from "@/common/enum";
import { teacher } from "@/services/teacher";

const { Item } = Form;

type Props = {
  show: boolean;
  handleModifyManageTeacherModal: any;
  data: any;
};

const ModifyManageTeacherModal: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const [getModifyTeacherData, setModifyTeacherData] = useState<any>({});
  const [getId, setid] = useState<number>(0);

  const {
    data: itemRes,
    error,
    isLoading,
  } = useSWRWithFallbackData(
    !!getId ? teacher().detail(getId) : null,
    fetcher_$GET,
    { fallbackData: getId }
  );

  const {
    trigger,
    data: dataModifyTeacher,
    error: errorModifyTeacher,
  } = useSWRMutation(teacher().modify, fetcher_$POST);

  useEffect(() => {
    if (props?.data) {
      setid(props?.data.id);
    }
    if (itemRes && !error) {
      setModifyTeacherData(itemRes.data);
      form.setFieldsValue(getModifyTeacherData);
    }
  }, [error, itemRes, props, getId, getModifyTeacherData, form]);

  const handleFormSubmit = async (values: any) => {
    trigger({ ...getModifyTeacherData, ...values });
  };
  
  useEffect(() => {
    if (dataModifyTeacher?.statusCode == statusCode.OK) {
      notificationSuccess("Cập nhật thành công");
      props.handleModifyManageTeacherModal(dataModifyTeacher?.data);
    }
    else if (dataModifyTeacher?.statusCode == statusCode.Error){
      notificationError(`${dataModifyTeacher?.message}`);
    }
    if (error) {
      notificationError(`${errorModifyTeacher}`);
    }
  }, [dataModifyTeacher, errorModifyTeacher]);
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
        onCancel={props.handleModifyManageTeacherModal}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Item
            name="username"
            label="Tên đăng nhập"            
          >
            <Input disabled/>
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
export default ModifyManageTeacherModal;
