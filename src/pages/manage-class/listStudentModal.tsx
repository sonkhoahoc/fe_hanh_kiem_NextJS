import { statusCode } from "@/common/enum";
import {
  fetcher_$GET,
  fetcher_$POST,
  formatDate,
  notificationError,
  notificationSuccess,
} from "@/common/functionglobal";
import { classSV } from "@/services/class";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Space, Tooltip, Table } from "antd";
import { ColumnsType } from "antd/es/table";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import DeleteStudentModal from "./deleteStudentModal";
import useSWR from "swr";
import { student } from "@/services/student";
import ModifyStudentModal from "./modifyStudentModal";

export interface DataType {
  birthday: string,
  class_id: string,
  email: string,
  full_name: string,
  id: number,
  is_delete: boolean,
  is_officer: boolean,
  pass_code: string,
  password: string,
  student_code: string,
  teacher_id: number,
  username: string,
}

type Props = {
  show: boolean;
  handleListStudentModalClose: any;
  data: any
};

const ListStudentModal: React.FC<Props> = (props) => {
  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      render: (_, record, index) => (
        <div className="center">{index + 1}</div>
      ),
    },
    {
      title: "Mã HSSV",
      dataIndex: "student_code",
      key: "student_code",
    },
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      render: (_, record, index) => (
        <div>
          {formatDate(record.birthday)}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record, index) => (
        <Space size="middle">
          <Tooltip placement="topLeft" title='Cập nhật'>
            <EditOutlined
              onClick={() => handleOpenModifyStudentModal(record)}
            />
          </Tooltip>
          <Tooltip placement="topLeft" title='Xoá'>
            <DeleteOutlined
              onClick={() => handleOpenDeleteStudentModal(record, index)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const [lstTable, setListTable] = useState();
  const [studentData, setStudentData] = useState<any>();
  const [isVisibleModifyStudentModal, setVisibleModifyStudentModal] =
    useState(false);
  const [isVisibleDeleteStudentModal, setVisibleDeleteStudentModal] =
    useState(false);

  const {
    data: listRes,
    error,
    isLoading,
    mutate,
  } = useSWR((props?.show) ? `${student().list(props.data.id)}` : null, fetcher_$GET);

  useEffect(() => {
    if (!!listRes && !error) {
      let dataTalbe = listRes.data;
      dataTalbe?.map((obj: any, index: number) => {
        obj.key = index + 1;
        return obj
      });
      (async () => {
        setListTable(await dataTalbe);;
      })();      
    }
  }, [error, listRes]);

  // cập nhật
  const handleModifyStudentModal = (res: any) => {
    setVisibleModifyStudentModal(false);
    if (res) {
      mutate({ ...listRes.data, res });
    }
  };

  const handleOpenModifyStudentModal = (data: any) => {
    setStudentData(data);
    setVisibleModifyStudentModal(true);
  };

  // xoá
  const handleDeleteStudentModal = (index: number) => {
    setVisibleDeleteStudentModal(false);
    mutate({ ...listRes.data });
  };

  const handleOpenDeleteStudentModal = (data: any, index: number) => {
    setStudentData({ ...data, index: index });
    setVisibleDeleteStudentModal(true);
  };

  return (
    <>
      <Modal
        title={"Danh sách sinh viên"}
        centered
        open={props.show}
        // onOk={() => {
        //   form.submit();
        // }}
        // okButtonProps={{
        //   className: "bg-blue-500",
        // }}
        okText="Xác nhận"
        cancelText="Thoát"
        onCancel={props.handleListStudentModalClose}
        width={1500}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <Table columns={columns} dataSource={lstTable ?? []} />
      </Modal>
      {isVisibleDeleteStudentModal && (
        <DeleteStudentModal
          show={isVisibleDeleteStudentModal}
          data={{ id: props.data.id }}
          handleDeleteStudentModal={handleDeleteStudentModal}
        />
      )}
      {isVisibleModifyStudentModal && (
        <ModifyStudentModal
          show={isVisibleModifyStudentModal}
          data={{ id: studentData.id }}
          handleModifyStudentModal={handleModifyStudentModal}
        />
      )}
    </>
  );
};

export default ListStudentModal;
