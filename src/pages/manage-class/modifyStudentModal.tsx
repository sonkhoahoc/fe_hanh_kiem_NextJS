import { Checkbox, DatePicker, Form, Input, Modal } from "antd";
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
import dayjs from "dayjs";
import { student } from "@/services/student";

const { Item } = Form;

type Props = {
  show: boolean;
  handleModifyStudentModal: any;
  data: any;
};

const ModifyStudentModal: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const [getModifyStudentnData, setModifyStudentnData] = useState<any>({});
  const [getId, setid] = useState<number>(0);

  const {
    data: itemRes,
    error,
    isLoading,
  } = useSWRWithFallbackData(
    !!getId ? student().detail(getId) : null,
    fetcher,
    { fallbackData: getId }
  );

  const {
    trigger,
    data: dataModifyStudent,
    error: errorModifyStudent,
  } = useSWRMutation(student().modify, fetcher_$POST);

  useEffect(() => {
    if (props?.data) {
      setid(props?.data.id);
    }
    if (itemRes && !error) {
      let item = itemRes.data;
      item.birthday = dayjs(item.birthday);
      setModifyStudentnData(item);
      (async () => {
        form.setFieldsValue(await getModifyStudentnData);
      })();
    }
  }, [error, itemRes, props, getId, getModifyStudentnData, form]);

  const handleFormSubmit = async (values: any) => {
    trigger({ ...getModifyStudentnData, ...values, is_officer: (values.is_officer == 'checked') });
  };

  useEffect(() => {
    if (dataModifyStudent?.statusCode == statusCode.OK) {
      notificationSuccess("Cập nhật thành công");
      props.handleModifyStudentModal(dataModifyStudent?.data);
    }
    else if (dataModifyStudent?.statusCode == statusCode.Error) {
      notificationError(`${dataModifyStudent?.message}`);
    }
    if (errorModifyStudent) {
      notificationError(`${errorModifyStudent}`);
    }
  }, [dataModifyStudent, errorModifyStudent]);
  return (
    <>
      <Modal
        title={"Cập nhật"}
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
        onCancel={props.handleModifyStudentModal}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Item
            name="student_code"
            label="Mã sinh viên"
            rules={[{ required: true, message: "Vui lòng nhập Mã sinh viên!" }]}
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
            name="username"
            label="Tên tài khoản"
            rules={[{ required: true, message: "Vui lòng nhập Tên tài khoản!" }]}
          >
            <Input required />
          </Item>
          <Item
            name="password"
            label="Mật khẩu"
          >
            <Input disabled />
          </Item>

          <Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập Email!" }]}
          >
            <Input required />
          </Item>
          <Item name="is_officer" label='Cán bộ' valuePropName="checked">
            <Checkbox></Checkbox>
          </Item>
          <Item name="birthday" label="Ngày sinh">
            <DatePicker format='DD/MM/YYYY' className="w-full" />
          </Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModifyStudentModal;
