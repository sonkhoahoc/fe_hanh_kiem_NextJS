import React, { useEffect, useState } from "react";
import { Button, Space, Table, Tooltip, Upload } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CheckCircleOutlined, CheckOutlined, DeleteOutlined, EditOutlined, ProfileOutlined, TableOutlined, UploadOutlined } from "@ant-design/icons";
import useSWR from "swr";

// import { DataType } from "@/common/interfacetable";
import { fetcher_$GET, fetcher_$POST, formatDate, notificationError, notificationSuccess } from "@/common/functionglobal";
import CreateManageClassModal from "./createManageClassModal";
import ModifyManageClassModal from "./modifyManageClassModal";
import DeleteManageClassModal from "./deleteManageClassModal";
import { classSV } from "@/services/class";
import ListStudentModal from "./listStudentModal";
import SelecTeacherModal from "./selectTeacherModal";
import { teacher } from "@/services/teacher";
import type { UploadProps } from 'antd';
var XLSX = require("xlsx");
import useSWRMutation from "swr/mutation";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import CompositeScoreModal from "./compositeScoreModal";
import { useSelector } from "react-redux";
import { userType } from "@/common/enum";
// import CompositeScoreModal from "./compositeScoreModal";

dayjs.extend(utc);
dayjs.extend(timezone);

interface DataType {
  key: React.Key;
  name: string;
  id: number;
  code: string;
  index: number;
  teacher_id: number
}
const initialState_selectedRowKeys = 0;

export default function ManageClass(props: any) {

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      render: (_, record, index) => (
        <div className="center">{index + 1}</div>
      ),
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giáo viên",
      key: "name",
      render: (_, record, index) => (
        <Space size="middle">
          {
            (record.teacher_id > 0) && <CheckOutlined className="text-green-600 " />
          }
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record, index) => (
        <Space size="middle">
          <Tooltip placement="topLeft" title='Cập nhật' className={`${getInfoCurrentUser?.type == userType.ministry ? 'hidden' : ''}`}>
            <EditOutlined
              onClick={() => handleOpenModifyManageClassModal(record)}
            />
          </Tooltip>

          <Tooltip placement="topLeft" title='Xoá' className={`${getInfoCurrentUser?.type == userType.ministry ? 'hidden' : ''}`}>
            <DeleteOutlined
              onClick={() => handleOpenDeleteManageClassModal(record, index)}
            />
          </Tooltip>

          <Tooltip placement="topLeft" title='Bảng điểm tổng hợp'>
            <TableOutlined onClick={() => handleOpenCompositeScoreModal(record, index)} />
          </Tooltip>
          <Tooltip placement="topLeft" title='Chọn giáo viên vào lớp' className={`${getInfoCurrentUser?.type == userType.ministry ? 'hidden' : ''}`}>
            <CheckCircleOutlined onClick={() => handleOpenSelecTeacherModal(record, index)} />
          </Tooltip>
          <Tooltip placement="topLeft" title='Danh sách sinh viên' className={`${getInfoCurrentUser?.type == userType.ministry ? 'hidden' : ''}`}>
            <ProfileOutlined onClick={() => handleOpenListStudentModal(record, index)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const initFilter = {
    keyword: "",
  };

  const [lstTable, setListTable] = useState();
  const [manageClassData, setManageClassData] = useState<any>();
  const [selectClassData, setSelectClassData] = useState<any>();

  const [isVisibleDeleteManageClassModal, setVisibleDeleteManageClassModal] =
    useState(false);

  const [isVisibleModifyManageClassModal, setVisibleModifyManageClassModal] =
    useState(false);

  const [isVisibleCompositeScoreModal, setVisibleCompositeScoreModal] =
    useState(false);

  const [isVisibleCreateManageClassModal, setVisibleCreateManageClassModal] =
    useState(false);

  const [isVisibleSelecTeacherModal, setVisibleSelecTeacherModal] =
    useState(false);

  const [isVisibleListStudentModal, setVisibleListStudentModal] =
    useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState<number>(initialState_selectedRowKeys);

  const getInfoCurrentUser = useSelector(
    (state: any) => state.infoCurrentUserReducers
  );

  const {
    data: listRes,
    error,
    isLoading,
    mutate,
  } = useSWR((getInfoCurrentUser.type == userType.admin || getInfoCurrentUser.type == userType.ministry) ? classSV().list : '', fetcher_$GET);

  const {
    data: listResbyteacher,
    error: errorbyteacher,
    mutate: mutatebyteacher,
  } = useSWR(((getInfoCurrentUser.type == userType.teacher)) ? classSV().listbyteacherid(getInfoCurrentUser.id) : '', fetcher_$GET);

  const {
    data: listTeacher,
    error: errorTeacher,
  } = useSWR((isVisibleSelecTeacherModal) ? teacher().list : null, fetcher_$GET);

  const {
    trigger: triggerAddstudentToclass,
    data: dataAddstudentToclass,
    error: errorAddstudentToclass,
  } = useSWRMutation(classSV().addstudenttoclass, fetcher_$POST);

  useEffect(() => {
    if (listRes && !error) {
      listRes.data?.map((obj: any, index: number) => obj.key = index + 1);
      setListTable(listRes.data);
    }
    if (listResbyteacher && !errorbyteacher) {
      listResbyteacher.data?.map((obj: any, index: number) => obj.key = index + 1);
      setListTable(listResbyteacher.data);
    }
    if (listTeacher && !errorTeacher) {
      listTeacher.data.map((obj: any, index: number) => obj.key = index + 1);
      (!!manageClassData.teacher_id) && setSelectedRowKeys(listTeacher.data?.find((item: any) => item.id == manageClassData.teacher_id).key)
    }
    if (errorTeacher) {
      notificationError(`${props.errorTeacher}`);
    }
  }, [error, listRes, listTeacher, errorTeacher, listResbyteacher, errorbyteacher]);

  // tạo mới
  const handleCreateManageClassModalClose = (res: any) => {
    setVisibleCreateManageClassModal(false);
    if (res) {
      // let dataold: any = lstTable;
      // mutate(dataold.push(res));
      mutate({ ...listRes?.data, res });
    }
  };

  const handleOpenCreateManageClassModal = () => {
    setVisibleCreateManageClassModal(true);
  };

  // cập nhật
  const handleModifyManageClassModal = (res: any) => {
    setVisibleModifyManageClassModal(false);
    if (res) {
      mutate({ ...listRes?.data, res });
    }
  };

  const handleOpenModifyManageClassModal = (data: any) => {
    setManageClassData(data);
    setVisibleModifyManageClassModal(true);
  };

  // xoá
  const handleDeleteManageClassModal = (index: number) => {
    setVisibleDeleteManageClassModal(false);
    mutate({ ...listRes?.data });
  };

  const handleOpenDeleteManageClassModal = (data: any, index: number) => {
    setManageClassData({ ...data, index: index });
    setVisibleDeleteManageClassModal(true);
  };

  // tổng điểm
  const handleCompositeScoreModal = (res: any) => {
    setVisibleCompositeScoreModal(false);
    if (res) {
      mutate({ ...listRes?.data, res });
    }
  };

  const handleOpenCompositeScoreModal = (data: any, index: number) => {
    setManageClassData(data);
    setVisibleCompositeScoreModal(true);
  };

  // danh sách giáo viên
  const handleSelecTeacherModal = (index: number) => {
    setVisibleSelecTeacherModal(false);
    setSelectedRowKeys(initialState_selectedRowKeys);
  };

  const handleOpenSelecTeacherModal = (data: any, index: number) => {
    setManageClassData(data);
    setVisibleSelecTeacherModal(true);
  };

  // danh sách sinh viên
  const handleListStudentModal = (index: number) => {
    setVisibleListStudentModal(false);
  };

  const handleOpenListStudentModal = (data: any, index: number) => {
    setManageClassData(data);
    setVisibleListStudentModal(true);
  };

  // upload
  const propsUpload: UploadProps = {
    name: 'file',
    accept: ".xls, .xlsm, .xlsx,.xlt",
    openFileDialogOnClick: (!!selectClassData) || false,
    beforeUpload(file, FileList) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        const valueTrigger = json.map((obj: any) => {
          let data: any = {};
          data.id = 0;
          data.is_delete = false;
          data.username = obj['Tên tài khoản'];
          data.password = "123456";
          data.pass_code = "";
          data.email = obj['Email'];
          data.full_name = obj['Họ và Tên'];
          data.is_officer = obj['Cán bộ'];
          data.class_id = selectClassData.id;
          data.teacher_id = selectClassData.teacher_id;
          if (!!obj['Ngày Sinh']) {
            let arrayBirthday = obj['Ngày Sinh'].toString().split("/");
            data.birthday = dayjs(`${arrayBirthday[2]}-${arrayBirthday[1]}-${arrayBirthday[0]}`).utc().hour(0);
            data.birthday.toISOString();
            // console.log('arrayBirthday :', arrayBirthday);
            // console.log('birthdayToISOString :', birthdayToISOString);
            // console.log("format", formatDate(birthdayToISOString));
            // data.birthday = dayjs(`${birthdayToISOString}`).utc().hour(0);
          }
          else {
            data.birthday = "";
          }
          data.student_code = obj['MSSV'].toString();
          return data
        });
        triggerAddstudentToclass(valueTrigger)
      };
      reader.readAsArrayBuffer(file);
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {

      }
      if (info.file.status === 'done') {
        notificationSuccess("Đọc File thành công");
      } else if (info.file.status === 'error') {
        notificationError("Đọc File không thành công");
      }
    },
  };

  const rowSelection = {

    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {

      setSelectClassData(selectedRows[0])
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

  function selectClass() {
    (!selectClassData) && notificationError("Yêu cầu chọn lớp cần thêm sinh viên");
  }

  return (
    <>
      <Button
        type="primary"
        className={`bg-blue-500 me-2 ${(getInfoCurrentUser?.type == userType.teacher || getInfoCurrentUser?.type == userType.ministry) ? 'hidden' : ''}`}
        onClick={() => handleOpenCreateManageClassModal()}

      >
        Thêm lớp
      </Button>
      <Upload {...propsUpload} className={`${getInfoCurrentUser?.type == userType.ministry ? 'hidden' : ''}`}>
        <Button type="primary"
          className="bg-blue-500" icon={<UploadOutlined />} onClick={selectClass}>Thêm mới sinh viên</Button>
      </Upload>
      <Table columns={columns} dataSource={lstTable ?? []} rowSelection={{
        type: 'radio',
        ...rowSelection
      }} />
      {isVisibleCreateManageClassModal && (
        <CreateManageClassModal
          show={isVisibleCreateManageClassModal}
          handleCreateManageClassModalClose={
            handleCreateManageClassModalClose
          }
        />
      )}
      {isVisibleModifyManageClassModal && (
        <ModifyManageClassModal
          show={isVisibleModifyManageClassModal}
          data={{ id: manageClassData.id }}
          handleModifyManageClassModal={handleModifyManageClassModal}
        />
      )}
      {isVisibleDeleteManageClassModal && (
        <DeleteManageClassModal
          show={isVisibleDeleteManageClassModal}
          data={{ id: manageClassData.id, index: manageClassData.index }}
          handleDeleteManageClassModal={handleDeleteManageClassModal}
        />
      )}
      {isVisibleCompositeScoreModal && (
        <CompositeScoreModal
          show={isVisibleCompositeScoreModal}
          data={{ id: manageClassData.id, teacher_id: manageClassData.teacher_id, code: manageClassData.code, name: manageClassData.name }}
          handleCompositeScoreModalClose={handleCompositeScoreModal}
        />
      )}
      {isVisibleSelecTeacherModal && (
        <SelecTeacherModal
          show={isVisibleSelecTeacherModal}
          data={{ id: manageClassData.id, teacher_id: manageClassData.teacher_id }}
          selectedRowKeys={selectedRowKeys}
          listTeacher={listTeacher.data}
          handleSelecTeacherModalClose={handleSelecTeacherModal}
        />
      )}
      {isVisibleListStudentModal && (
        <ListStudentModal
          show={isVisibleListStudentModal}
          data={{ id: manageClassData.id }}
          handleListStudentModalClose={handleListStudentModal}
        />
      )}
    </>
  );
}
