import { statusCode } from "@/common/enum";
import {
  fetcher_$POST,
  notificationError,
  notificationSuccess,
} from "@/common/functionglobal";
import { teacher } from "@/services/teacher";
import { Form, Input, Modal } from "antd";

import dayjs from "dayjs";
import { useEffect } from "react";
import useSWRMutation from "swr/mutation";

const { Item } = Form;

type Props = {
  show: boolean;
  handleCreateManageTeacherModalClose: any;
};

const CreateManageTeacherModal: React.FC<Props> = (props) => {
  const [form] = Form.useForm();

  const {
    trigger,
    data: dataCreateTeacher,
    error,
  } = useSWRMutation(teacher().create, fetcher_$POST);

  const handleFormSubmit = async (values: any) => {
    trigger({
      ...values,
      id: 0,
      userAdded: 0,
    });
  };
  useEffect(() => {
    if (dataCreateTeacher?.statusCode == statusCode.OK) {
      notificationSuccess("Thêm mới thành công");
      props.handleCreateManageTeacherModalClose(dataCreateTeacher?.data);
    }
    else if(dataCreateTeacher?.statusCode == statusCode.Error){
      notificationError(`${dataCreateTeacher?.message}`);
    }
    if (error) {
      notificationError(`${error}`);
    }
  }, [dataCreateTeacher, error]);
  return (
    <>
      <Modal
        title={"Thêm mới"}
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
        onCancel={props.handleCreateManageTeacherModalClose}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input required/>
          </Item>
          <Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input required />
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

export default CreateManageTeacherModal;
