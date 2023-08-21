import { statusCode } from "@/common/enum";
import {
  fetcher_$GET,
  fetcher_$POST,
  notificationError,
  notificationSuccess,
} from "@/common/functionglobal";
import { classSV } from "@/services/class";
import { teacher } from "@/services/teacher";
import { Form, Input, Modal, Space, Table } from "antd";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { ColumnsType } from "antd/es/table";

const { Item } = Form;

type Props = {
  show: boolean;
  handleSelecTeacherModalClose: any;
  data: any;
  selectedRowKeys: number;
  listTeacher: Array<any>;
};

interface DataType {
  key: number;
  username: string;
  full_name: string;
  email: string;
}

const SelecTeacherModal = (props: Props) => {
  const columns: ColumnsType<DataType> = [
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Họ & tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Mail",
      dataIndex: "email",
      key: "email",
    },
  ];

  const [lstTable, setListTable] = useState<Array<any>>([]);
  const [selectTeacherData, setSelectTeacherData] = useState<any>();
  const [isClick, SetIsClick] = useState(false); 

  const [selectedRowKeys, setSelectedRowKeys] = useState<number>(0)

  const {
    data: dataAddTeacher,
    error: errorAddTeacher,
  } = useSWR((isClick) ? classSV().addteacher(props.data.id, selectTeacherData.id) : null, fetcher_$GET);

  const handleFormSubmit = () => {
    SetIsClick(true);
  };

  useEffect(() => {
    if (props.listTeacher) {
      setListTable(props.listTeacher);
    }
    if (dataAddTeacher?.statusCode == statusCode.OK) {
      notificationSuccess("Thêm mới thành công");
      props.handleSelecTeacherModalClose(dataAddTeacher?.data);
    }
    else if (dataAddTeacher?.statusCode == statusCode.Error) {
      notificationError(`${dataAddTeacher?.message}`);
    }
  }, [dataAddTeacher, props]);

  const rowSelection = {

    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {

      setSelectTeacherData(selectedRows[0])
    },
    onselect: (record: any, selected: boolean, selectedRows: any, nativeEvent: Event) => {
      // console.log(record);
      // console.log(selected);
      // console.log(selectedRows);
      // console.log(nativeEvent);
    },
    getCheckboxProps: (record: DataType) => ({
      // disabled: record.username === 'Disabled User', // Column configuration not to be checked
      // name: record.username,
    }),
  };

  return (
    <>
      <Modal
        title={"Chọn giáo viên chủ nhiệm"}
        centered
        open={props.show}
        onOk={handleFormSubmit}
        okButtonProps={{
          className: "bg-blue-500",
        }}
        okText="Xác nhận"
        cancelText="Thoát"
        onCancel={props.handleSelecTeacherModalClose}
        width={1500}
      >
        {
          lstTable.length > 0 && <Table columns={columns} dataSource={lstTable ?? []} rowSelection={{
            defaultSelectedRowKeys: [props.selectedRowKeys],
            type: 'radio',
            ...rowSelection
          }} />
        }
      </Modal>
    </>
  );
};

export default SelecTeacherModal;
