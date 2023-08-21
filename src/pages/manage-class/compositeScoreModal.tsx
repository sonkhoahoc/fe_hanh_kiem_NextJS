import { statusCode, userType } from "@/common/enum";
import {
  deepCopy,
  fetcher_$GET,
  fetcher_$POST,
  formatDate,
  notificationError,
  notificationSuccess,
} from "@/common/functionglobal";
import { classSV } from "@/services/class";
import { student } from "@/services/student";
import { EditOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Space, Tooltip, Table, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import * as XLSX from 'xlsx';

const { Item } = Form;

type Props = {
  show: boolean;
  handleCompositeScoreModalClose: any;
  data: any;
};
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
  total_point: number,
  sort: string,
  note: string
}

const CompositeScoreModal: React.FC<Props> = (props) => {
  const router = useRouter();

  const getInfoCurrentUser = useSelector(
    (state: any) => state.infoCurrentUserReducers
  );

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      align: "center",
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
      title: "Tiêu chuẩn 1",
      dataIndex: "officer_point_1",
      key: "officer_point_1",

    },
    {
      title: "Tiêu chuẩn 2",
      dataIndex: "officer_point_2",
      key: "officer_point_2",

    },
    {
      title: "Tiêu chuẩn 3",
      dataIndex: "officer_point_3",
      key: "officer_point_3",
    },
    {
      title: "Tiêu chuẩn 4",
      dataIndex: "officer_point_4",
      key: "officer_point_4",
    },
    {
      title: "Tiêu chuẩn 5",
      dataIndex: "officer_point_5",
      key: "officer_point_5",
    },
    {
      title: "Tổng điểm",
      dataIndex: "total_point",
      key: "total_point",
    },
    {
      title: "Xếp loại",
      dataIndex: "sort",
      key: "sort",
    },
    {
      title: "Ghi chú",
      key: "note",
      align: "center",
      render: (value, record, index) => (
        <div>
          <Input name={`note${index}`}
            value={record.note} disabled={getInfoCurrentUser.type == userType.teacher}
            onChange={(value: any) => {
              let copylstTable: any = lstTable;
              copylstTable = copylstTable.map((obj: any, indextable: number) => {
                if (index == indextable) {
                  obj.note = value.target.value;
                }
                return obj
              })
              setListTable(copylstTable)
            }}
          />
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      className:`${getInfoCurrentUser?.type == userType.ministry ? 'hidden' : ''}`,
      render: (_, record, index) => (
        <Space size="middle">
          <Tooltip placement="topLeft" title='Cập nhật'>
            <EditOutlined
              onClick={() => router.push(`/banghanhkiem/${record.id}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const [lstTable, setListTable] = useState<Array<any>>([]);
  const [lstDetailTable, setListDetailTable] = useState();
  const [lstStudent, setListStudent] = useState([]);
  const [compositeScore, setCompositeScore] = useState<any>();
  const [jsonExport, setJsonExport] = useState<any>([]);

  const {
    data: dataStudent,
    error: errorStudent,
  } = useSWR(((props?.show) && (props.data?.id)) ? `${student().list(props.data.id)}` : null, fetcher_$GET);

  const {
    data: listRes,
    error,
    isLoading,
    mutate,
  } = useSWR((dataStudent?.data) ? `${classSV().detail(props.data.teacher_id)}` : null, fetcher_$GET);

  const {
    trigger,
    data: dataConductFormupDate,
    error: errorConductFormupDate,
  } = useSWRMutation(student().conductformupdate(), fetcher_$POST);

  useEffect(() => {
    if (!!dataStudent && !errorStudent) {
      let dataTalbe: any = dataStudent.data;
      dataTalbe?.map((obj: any, index: number) => {
        obj.key = index + 1;
        return obj
      });
      setListStudent(dataTalbe);
    }
    if (!!listRes && !error) {
      let dataTalbe = dataStudent?.data;

      (async () => {

        dataTalbe.map((obj: any, index: number) => {
          obj.total_point = listRes.data.conduct_Forms[index].total_point;
          obj.officer_point_1 = listRes.data.conduct_Forms[index].officer_point_1 || 0;
          obj.officer_point_2 = listRes.data.conduct_Forms[index].officer_point_2 || 0;
          obj.officer_point_3 = listRes.data.conduct_Forms[index].officer_point_3 || 0;
          obj.officer_point_4 = listRes.data.conduct_Forms[index].officer_point_4 || 0;
          obj.officer_point_5 = listRes.data.conduct_Forms[index].officer_point_5 || 0;
          obj.note = listRes.data.conduct_Forms[index].note || '';
          if (obj.total_point >= 90) {
            obj.sort = 'Xuất sắc';
          }
          else if (obj.total_point >= 80) {
            obj.sort = 'Tốt';
          }
          else if (obj.total_point >= 65) {
            obj.sort = 'Khá';
          }
          else if (obj.total_point >= 50) {
            obj.sort = 'Trung bình';
          }
          else if (obj.total_point >= 35) {
            obj.sort = 'Yếu kém';
          }
        });
        setListTable(await dataTalbe);
        setListDetailTable(listRes.data.conduct_Forms);
      })();
    }
  }, [error, listRes, dataStudent, errorStudent]);

  const handleSubmit = async (values: any) => {
    let valueDetailTable: any = lstDetailTable;
    let valueTable: any = lstTable;
    valueDetailTable.forEach((element: any, index_valueDetailTable: number) => {
      valueTable.forEach((obj: any, index_valueTable: number) => {
        if (index_valueDetailTable == index_valueTable && (!!obj.note)) {
          element.note = obj.note;
          trigger(element);
        };
      });
    })

  };

  const exportExcel = () => {
    let dataJson: any = [];
    lstTable.forEach((obj, index) => {
      let data = {
        "STT": index + 1,
        "Mã HSSV": obj.student_code || "",
        "Họ và tên": obj.full_name || "",
        "Ngày sinh": `'${formatDate(obj.birthday)}` || '',
        "Tiêu chuẩn 1": obj.officer_point_1 || 0,
        "Tiêu chuẩn 2": obj.officer_point_2 || 0,
        "Tiêu chuẩn 3": obj.officer_point_3 || 0,
        "Tiêu chuẩn 4": obj.officer_point_4 || 0,
        "Tiêu chuẩn 5": obj.officer_point_5 || 0,
        "Tổng": obj.total_point || 0,
        "Xếp Loại": obj.sort || '',
      };
      dataJson.push(data);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    // **note**
    // s = start, r = row, c=col, e= end
    // merge col & row    
    const merge = [
      { s: { c: 0, r: 0 }, e: { c: 3, r: 0 } },
      { s: { c: 4, r: 0 }, e: { c: 10, r: 0 } },
      { s: { c: 0, r: 1 }, e: { c: 3, r: 1 } },
      { s: { c: 4, r: 1 }, e: { c: 10, r: 1 } },
      { s: { c: 0, r: 3 }, e: { c: 10, r: 3 } },
    ];
    ws["!merges"] = merge;
    // ws['!cols'] = [
    //   { 'width': 6 },
    //   { 'width': 40 },
    //   { 'width': 40 },
    //   { 'width': 40 },
    //   { 'width': 40 },
    // ]
    // let start_date: Date = convertToDate(this.filter.start_date);
    // let end_date: Date = convertToDate(this.filter.end_date);


    XLSX.utils.sheet_add_aoa(ws, [[`TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT HƯNG YÊN`]], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [[`CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM`]], { origin: 'E1' });
    XLSX.utils.sheet_add_aoa(ws, [[`KHOA CÔNG NGHỆ THÔNG TIN`]], { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(ws, [[`Độc lập - Tự do - Hạnh phúc`]], { origin: 'E2' });
    XLSX.utils.sheet_add_aoa(ws, [[`BẢNG TỔNG HỢP ĐIỂM RÈN LUYỆN`]], { origin: 'A4' });
    XLSX.utils.sheet_add_aoa(ws, [[`Mã lớp`]], { origin: 'A5' });
    XLSX.utils.sheet_add_aoa(ws, [[`${props.data.code}`]], { origin: 'B5' });
    XLSX.utils.sheet_add_aoa(ws, [[`Tên lớp: ${props.data.name}`]], { origin: 'C5' });


    // add json
    XLSX.utils.sheet_add_json(ws, dataJson, { origin: 'A6' });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Tổng hợp điểm.xlsx`)
  }


  return (
    <>
      <Modal
        title={"Bảng điểm tổng hợp"}
        centered
        open={props.show}
        onOk={handleSubmit}
        okText="Xác nhận"
        cancelText="Thoát"
        onCancel={props.handleCompositeScoreModalClose}
        width={1800}
        okButtonProps={{ style: { display: getInfoCurrentUser.type == userType.admin ? '' : 'none' }, className: "bg-blue-500" }}
      >
        <div className="w-full flex justify-end my-4">
          <Button
            type="primary"
            className={`bg-blue-500 me-2 ${getInfoCurrentUser?.type == userType.teacher ? 'hidden' : ''}`}
            onClick={() => exportExcel()}

          >
            Xuất excel
          </Button>
        </div>

        <Table columns={columns} dataSource={lstTable ?? []} />
      </Modal>
    </>
  );
};

export default CompositeScoreModal;