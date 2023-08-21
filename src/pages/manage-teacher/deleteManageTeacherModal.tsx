import { statusCode } from "@/common/enum";
import {
  fetcher_$GET,
  notificationError,
  notificationSuccess,
} from "@/common/functionglobal";
import { category } from "@/services/category";
import { teacher } from "@/services/teacher";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import useSWR from "swr";

type Props = {
  show: boolean;
  handleDeleteManageTeacherModal: any;
  data: any;
};

const DeleteManageTeacherModal: React.FC<Props> = (props) => {


  const [isClick, SetIsClick] = useState(false);

  const {
    data: dataDelete,
    error,
    isLoading,
  } = useSWR((isClick) ? `${teacher().list}` : null, fetcher_$GET);

  const handleDeleteManageTeacherModalSubmit = () => {
    SetIsClick(true);  
  };

  useEffect(() => {
    if (dataDelete?.statusCode == statusCode.OK) {
      notificationSuccess("Xóa thành công");
      props.handleDeleteManageTeacherModal(props.data.index);
    } else {
      notificationError("Xóa thất bại");
    }
  }, [dataDelete, error]);

  return (
    <>
      <Modal
        title={"Xóa"}
        centered
        open={props.show}
        onOk={handleDeleteManageTeacherModalSubmit}
        onCancel={props.handleDeleteManageTeacherModal}
      >
        <p>Bạn có chắc chắn muốn xoá bản ghi này?</p>
      </Modal>
    </>
  );
};
export default DeleteManageTeacherModal;
