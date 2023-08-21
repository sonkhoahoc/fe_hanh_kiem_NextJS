import { statusCode } from "@/common/enum";
import {
  fetcher_$GET,
  notificationError,
  notificationSuccess,
} from "@/common/functionglobal";
import { classSV } from "@/services/class";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import useSWRWithFallbackData from "@/common/use-swr-with-fallback-data";

type Props = {
  show: boolean;
  handleDeleteManageClassModal: any;
  data: any;
};

const DeleteManageClassModal: React.FC<Props> = (props) => {


  const [isClick, SetIsClick] = useState(false);

  const {
    data: dataDelete,
    error,
    isLoading,
  } = useSWRWithFallbackData((isClick) ? `${classSV().delete(props.data.id)}` : null, fetcher_$GET);

  const handleDeleteManageClassModalSubmit = () => {
    SetIsClick(true);  
  };

  useEffect(() => {
    if (dataDelete?.statusCode == statusCode.OK) {
      notificationSuccess("Xóa thành công");
      props.handleDeleteManageClassModal(props.data.index);
    } else if(dataDelete?.statusCode == statusCode.Error) {
      notificationError("Xóa thất bại");
    }
  }, [dataDelete]);

  return (
    <>
      <Modal
        title={"Xóa"}
        centered
        open={props.show}
        onOk={handleDeleteManageClassModalSubmit}
        onCancel={props.handleDeleteManageClassModal}    
        okButtonProps={{
          className: "bg-blue-500",
        }}
        okText="Xác nhận"
        cancelText="Thoát"      
      >
        <p>Bạn có chắc chắn muốn xoá bản ghi này?</p>
      </Modal>
    </>
  );
};
export default DeleteManageClassModal;
