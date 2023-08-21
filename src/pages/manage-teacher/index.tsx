import React, { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import useSWR from "swr";

import { DataType } from "@/common/interfacetable";
import CreateManageTeacherModal from "./createManageTeacherModal";
import ModifyManageTeacherModal from "./modifyManageTeacherModal";
import DeleteManageTeacherModal from "./deleteManageTeacherModal";
import { teacher } from "@/services/teacher";
import { fetcher_$GET } from "@/common/functionglobal";

export default function ManageTeacher(props: any) {
  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      render: (_, record, index) => (
        <div className="center">{index + 1}</div>
      ),
    },
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
    {
      title: "Thao tác",
      key: "action",
      render: (_, record, index) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => handleOpenModifyManageTeacherModal(record)}
          />
        </Space>
      ),
    },
  ];
  const item = {
    name: "",
    description: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    type: 1,
    id: 0,
    userAdded: 0,
    dateAdded: new Date(),
    is_delete: false,
  };

  const initFilter = {
    keyword: "",
  };

  const [lstTable, setListTable] = useState();
  const [manageTeacherData, setManageTeacherData] = useState<any>();

  const [isVisibleDeleteManageTeacherModal, setVisibleDeleteManageTeacherModal] =
    useState(false);

  const [isVisibleModifyManageTeacherModal, setVisibleModifyManageTeacherModal] =
    useState(false);

  const [isVisibleCreateManageTeacherModal, setVisibleCreateManageTeacherModal] =
    useState(false);

  const {
    data: listRes,
    error,
    isLoading,
    mutate,
  } = useSWR(teacher().list, fetcher_$GET);

  useEffect(() => {
    if (listRes && !error) {
      listRes.data?.map((obj: any, index: number) => obj.key = index + 1);
      setListTable(listRes.data);
    }
  }, [error, listRes]);

  // tạo mới
  const handleCreateManageTeacherModalClose = (res: any) => {
    setVisibleCreateManageTeacherModal(false);
    if (res) {
      mutate({ ...listRes.data, res });
    }
  };

  const handleOpenCreateManageTeacherModal = () => {
    setVisibleCreateManageTeacherModal(true);
  };

  // cập nhật
  const handleModifyManageTeacherModal = (res: any) => {
    setVisibleModifyManageTeacherModal(false);
    if (res) {
      mutate({ ...listRes.data, res });
    }
  };

  const handleOpenModifyManageTeacherModal = (data: any) => {
    setManageTeacherData(data);
    setVisibleModifyManageTeacherModal(true);
  };

  return (
    <>
      <Button
        type="primary"
        className="bg-blue-500"
        onClick={() => handleOpenCreateManageTeacherModal()}
      >
        Thêm mới
      </Button>
      <Table columns={columns} dataSource={lstTable ?? []} />
      {isVisibleCreateManageTeacherModal && (
        <CreateManageTeacherModal
          show={isVisibleCreateManageTeacherModal}
          handleCreateManageTeacherModalClose={
            handleCreateManageTeacherModalClose
          }
        />
      )}
      {isVisibleModifyManageTeacherModal && (
        <ModifyManageTeacherModal
          show={isVisibleModifyManageTeacherModal}
          data={{ id: manageTeacherData.id }}
          handleModifyManageTeacherModal={handleModifyManageTeacherModal}
        />
      )}

    </>
  );
}
