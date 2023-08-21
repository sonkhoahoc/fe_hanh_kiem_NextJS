import React, { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import useSWR from "swr";

import { DataType } from "@/common/interfacetable";
import CreateManageAdminModal from "./createManageAdminModal";
import ModifyManageAdminModal from "./modifyManageAdminModal";
import { admin } from "@/services/admin";
import { fetcher_$GET } from "@/common/functionglobal";

export default function ManageAdmin(props: any) {
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
            onClick={() => handleOpenModifyManageAdminModal(record)}
          />        
        </Space>
      ),
    },
  ];
  
  const initFilter = {
    keyword: "",
  };

  const [lstTable, setListTable] = useState([]);
  const [manageAdminData, setManageAdminData] = useState<any>();

  const [isVisibleModifyManageAdminModal, setVisibleModifyManageAdminModal] =
    useState(false);

  const [isVisibleCreateManageAdminModal, setVisibleCreateManageAdminModal] =
    useState(false);

  const {
    data: listRes,
    error,
    isLoading,
    mutate,
  } = useSWR(admin().list, fetcher_$GET);

  useEffect(() => {
    if (listRes && !error) {
      setListTable(listRes.data);
    }
  }, [error, listRes]);

  // tạo mới
  const handleCreateManageAdminModalClose = (res: any) => {
    setVisibleCreateManageAdminModal(false);
    if (res) {
      mutate({ ...listRes.data, res });
    }
  };

  const handleOpenCreateManageAdminModal = () => {
    setVisibleCreateManageAdminModal(true);
  };

  // cập nhật
  const handleModifyManageAdminModal = (res: any) => {
    setVisibleModifyManageAdminModal(false);
    if (res) {
      mutate({ ...listRes.data, res });
    }
  };

  const handleOpenModifyManageAdminModal = (data: any) => {
    setManageAdminData(data);
    setVisibleModifyManageAdminModal(true);
  };
 
  return (
    <>
      <Button
        type="primary"
        className="bg-blue-500"
        onClick={() => handleOpenCreateManageAdminModal()}
      >
        Thêm mới
      </Button>
      <Table columns={columns} dataSource={lstTable ?? []} />
      {isVisibleCreateManageAdminModal && (
        <CreateManageAdminModal
          show={isVisibleCreateManageAdminModal}
          handleCreateManageAdminModalClose={
            handleCreateManageAdminModalClose
          }
        />
      )}
      {isVisibleModifyManageAdminModal && (
        <ModifyManageAdminModal
          show={isVisibleModifyManageAdminModal}
          data={{ id: manageAdminData.id }}
          handleModifyManageAdminModal={handleModifyManageAdminModal}
        />
      )}    
    </>
  );
}
