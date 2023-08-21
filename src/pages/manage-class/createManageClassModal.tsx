import { statusCode } from "@/common/enum";
import {
  fetcher_$POST,
  notificationError,
  notificationSuccess,
} from "@/common/functionglobal";
import { classSV } from "@/services/class";
import { teacher } from "@/services/teacher";
import { Form, Input, Modal } from "antd";

import dayjs from "dayjs";
import { useEffect } from "react";
import useSWRMutation from "swr/mutation";

const { Item } = Form;

type Props = {
  show: boolean;
  handleCreateManageClassModalClose: any;
};

const CreateManageClassModal: React.FC<Props> = (props) => {
  const [form] = Form.useForm();

  const {
    trigger,
    data: dataCreateClass,
    error,
  } = useSWRMutation(classSV().create, fetcher_$POST);

  const handleFormSubmit = async (values: any) => {
    trigger({
      ...values,
      id: 0,
      userAdded: 0,
      is_delete: false,
      teacher_id: 0,
      status: 0,
    });
  };

  useEffect(() => {
    if (dataCreateClass?.statusCode == statusCode.OK) {
      notificationSuccess("Thêm mới thành công");
      props.handleCreateManageClassModalClose(dataCreateClass?.data);
    }
    else if (dataCreateClass?.statusCode == statusCode.Error) {
      notificationError(`${dataCreateClass?.message}`);
    }
    if (error) {
      notificationError(`${error}`);
    }
  }, [dataCreateClass, error]);
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
        onCancel={props.handleCreateManageClassModalClose}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Item
            name="code"
            label="Mã"
            rules={[{ required: true, message: "Vui lòng nhập mã lớp!" }]}
          >
            <Input required />
          </Item>
          <Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên lớp!" }]}
          >
            <Input required />
          </Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateManageClassModal;
