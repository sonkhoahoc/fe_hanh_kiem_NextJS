import { statusCode } from "@/common/enum";
import {
  fetcher_$GET,
  notificationError,
  notificationSuccess,
} from "@/common/functionglobal";
import { classSV } from "@/services/class";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import useSWR from "swr";

type Props = {
  show: boolean;
  handleDeleteStudentModal: any;
  data: any;
};

const DeleteStudentModal: React.FC<Props> = (props) => {


  const [isClick, SetIsClick] = useState(false);

  const {
    data: dataDelete,
    error,
    isLoading,
  } = useSWR((isClick) ? `${classSV().removestudent(props.data.id)}` : null, fetcher_$GET);

  const handleDeleteStudentModalSubmit = () => {
    SetIsClick(true);
  };

  useEffect(() => {
    if (dataDelete?.statusCode == statusCode.OK) {
      notificationSuccess("Xóa thành công");
      props.handleDeleteStudentModal(props.data.index);
    } else if (dataDelete?.statusCode == statusCode.Error) {
      notificationError("Xóa thất bại");
    }
  }, [dataDelete, error]);

  return (
    <>
      <Modal
        title={"Xóa"}
        centered
        open={props.show}
        onOk={handleDeleteStudentModalSubmit}
        onCancel={props.handleDeleteStudentModal}
        okButtonProps={{
          className: "bg-blue-500",
        }}
      >
        <p>Bạn có chắc chắn muốn xoá bản ghi này?</p>
      </Modal>
    </>
  );
};
export default DeleteStudentModal;
