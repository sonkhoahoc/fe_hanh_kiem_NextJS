import { Form, Input, Modal } from "antd";
import useSWRWithFallbackData from "@/common/use-swr-with-fallback-data";

import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import {
  fetcher_$GET,
  fetcher_$POST,
  notificationError,
  notificationSuccess,
} from "@/common/functionglobal";
import { statusCode, userType } from "@/common/enum";
import { classSV } from "@/services/class";
import { useSelector } from "react-redux";

const { Item } = Form;

type Props = {
  show: boolean;
  handleModifyManageClassModal: any;
  data: any;
};

const ModifyManageClassModal: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const [getModifyClassData, setModifyClassData] = useState<any>({});
  const [getId, setid] = useState<number>(0);

  // get user
  const getInfoCurrentUser = useSelector(
    (state: any) => state.infoCurrentUserReducers
  );

  const {
    data: itemTeacher,
    error: errorTeacher,
  } = useSWRWithFallbackData(
    (!!getId && getInfoCurrentUser?.type == userType.teacher) ? classSV().detail(getId) : null,
    fetcher_$GET,
    { fallbackData: getId }
  );

  const {
    data: itemAdmin,
    error: errorAdmin,
  } = useSWRWithFallbackData(
    (!!getId && getInfoCurrentUser?.type == userType.admin) ? classSV().detailadmin(getId) : null,
    fetcher_$GET,
    { fallbackData: getId }
  );

  const {
    trigger,
    data: dataModifyClass,
    error: errorModifyClass,
  } = useSWRMutation(classSV().modify, fetcher_$POST);

  useEffect(() => {
    if (props?.data) {
      setid(getInfoCurrentUser?.type == userType.admin ? props?.data.id : getInfoCurrentUser?.id);
    }
    if (getInfoCurrentUser?.type == userType.admin) {
      if (itemAdmin && !errorAdmin) {
        setModifyClassData(itemAdmin.data);
        form.setFieldsValue(getModifyClassData);
      }
    }
    else {
      if (itemTeacher && !errorTeacher) {
        setModifyClassData(itemTeacher.data);
        form.setFieldsValue(getModifyClassData);
      }
    }
  }, [itemAdmin, errorAdmin, itemTeacher, errorTeacher, props, getId, getModifyClassData, form]);

  const handleFormSubmit = async (values: any) => {
    trigger({ ...getModifyClassData, ...values });
  };

  useEffect(() => {
    if (dataModifyClass?.statusCode == statusCode.OK) {
      notificationSuccess("Cập nhật thành công");
      props.handleModifyManageClassModal(dataModifyClass?.data);
    }
    else if (dataModifyClass?.statusCode == statusCode.Error) {
      notificationError(`${dataModifyClass?.message}`);
    }
  }, [dataModifyClass, errorModifyClass]);
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
        onCancel={props.handleModifyManageClassModal}
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
export default ModifyManageClassModal;
