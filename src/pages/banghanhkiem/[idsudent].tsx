import React, { useEffect, useState } from 'react';
import { Avatar, Breadcrumb, Button, Dropdown, Form, Input, InputNumber, Layout, Menu, MenuProps, Space, Table, theme } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { clear_info_current_user } from '@/store/action/info_current_user_action';
import { ColumnsType } from 'antd/es/table';
import { listConductPoints } from '../../../common/datajson';

const { Header, Content, Footer } = Layout;

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { student } from '@/services/student';
import { deepCopy, fetcher_$GET, fetcher_$POST, notificationError, notificationSuccess } from '@/common/functionglobal';
import { statusCode, userType } from '@/common/enum';
import useSWRWithFallbackData from "@/common/use-swr-with-fallback-data";
import { fetcher } from '@/common/const';
import { classSV } from '@/services/class';

interface DataType {
    note: string;
    point_frame: number;
    self_assessment: number;
    cadre_points: number;
    stt: string;
    key: number
}

const { Item } = Form;

export default function BangHanhKiem() {
    const [form] = Form.useForm();
    const min: number = 0;
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const router = useRouter();
    // get info user
    const getInfoCurrentUser = useSelector(
        (state: any) => state.infoCurrentUserReducers
    );
    console.log('getInfoCurrentUser :', getInfoCurrentUser);
    const dispatch = useDispatch();
    const items: MenuProps["items"] = [
        // {
        //     label: (
        //         <a href="" style={{ textDecoration: "none" }}>
        //             Thông tin
        //         </a>
        //     ),
        //     key: "1",
        // },
        {
            label: (
                <a href="" style={{ textDecoration: "none" }} onClick={() => dispatch(clear_info_current_user())}>
                    Đăng xuất
                </a>
            ),
            key: "0",
        },
    ];

    const [getIdStudent, setIdStudent] = useState(0);
    const [getItemStudent, setItemStudent] = useState<any>();
    const [lstClass, setListClass] = useState<any>(undefined);
    const [getModifyConduct, setModifyConduct] = useState<any>({});
    const [lstTable, setListTable] = useState<any>(listConductPoints);
    const [self_assessment, setSelf_assessment] = useState(0);
    const [cadre_points, setCadre_points] = useState(0);
    const [total_point, setTotal_point] = useState(0);


    const {
        data: dataStudent,
        error: errorStudent,
    } = useSWR((getInfoCurrentUser?.class_id && (!!lstClass)) ? `${student().list(getInfoCurrentUser?.class_id)}` : null, fetcher_$GET);

    const {
        data: dataClass,
        error: errorClass,
    } = useSWR(classSV().list, fetcher_$GET);


    const {
        data: itemRes,
        error,
        isLoading,
    } = useSWRWithFallbackData(
        !!getIdStudent ? student().conductform(getIdStudent) : null,
        fetcher,
        { fallbackData: getIdStudent }
    );

    useEffect(() => {
        getInfoCurrentUser.type == userType.ministry && router.push("/admin");
        if (!getInfoCurrentUser?.token) {
            router.push("/login/student");
        }
        if (router.isReady) {
            setIdStudent(+`${router.query.idsudent}`);
        }
        if (!!dataClass && !errorClass) {
            setListClass(dataClass.data)
        }
        if (!!dataStudent && !errorStudent && getIdStudent && lstClass) {
            let dataTalbe = dataStudent.data;

            (async () => {
                let classname = lstClass.find((obj: any) => obj.id === getInfoCurrentUser?.class_id).name;
                dataTalbe?.map((obj: any, index: number) => {
                    obj.key = index + 1;
                    obj.classname = classname;
                    return obj
                });
                let ItemStudent = dataTalbe.find((obj: any) => obj.id === getIdStudent);
                setItemStudent(await ItemStudent)
            })();
        }
    }, [getInfoCurrentUser, router, dataStudent, errorStudent, getIdStudent, dataClass, errorClass]);

    useEffect(() => {
        if (itemRes && !error) {
            setModifyConduct(itemRes.data);
            setTotal_point(getModifyConduct.total_point);
            // form.setFieldsValue(getModifyConduct);
            form.setFieldsValue({
                total_point: getModifyConduct.total_point
            });
        }
        if (getModifyConduct?.student_point_1_1) {
            let copyLstTable = lstTable;
            copyLstTable[1].self_assessment = getModifyConduct.student_point_1_1;
            copyLstTable[2].self_assessment = getModifyConduct.student_point_1_2;
            copyLstTable[3].self_assessment = getModifyConduct.student_point_1_3;
            copyLstTable[4].self_assessment = getModifyConduct.student_point_1_4;
            copyLstTable[5].self_assessment = getModifyConduct.student_point_1_5;

            copyLstTable[7].self_assessment = getModifyConduct.student_point_2_1;
            copyLstTable[8].self_assessment = getModifyConduct.student_point_2_2;
            copyLstTable[9].self_assessment = getModifyConduct.student_point_2_3;
            copyLstTable[10].self_assessment = getModifyConduct.student_point_2_4;
            copyLstTable[11].self_assessment = getModifyConduct.student_point_2_5;
            copyLstTable[12].self_assessment = getModifyConduct.student_point_2_6;

            copyLstTable[14].self_assessment = getModifyConduct.student_point_3_1;
            copyLstTable[15].self_assessment = getModifyConduct.student_point_3_2;
            copyLstTable[16].self_assessment = getModifyConduct.student_point_3_3;

            copyLstTable[18].self_assessment = getModifyConduct.student_point_4_1;
            copyLstTable[19].self_assessment = getModifyConduct.student_point_4_2;
            copyLstTable[20].self_assessment = getModifyConduct.student_point_4_3;

            copyLstTable[22].self_assessment = getModifyConduct.student_point_5_1;
            copyLstTable[23].self_assessment = getModifyConduct.student_point_5_2;

            copyLstTable[1].cadre_points = getModifyConduct.officer_point_1_1;
            copyLstTable[2].cadre_points = getModifyConduct.officer_point_1_2;
            copyLstTable[3].cadre_points = getModifyConduct.officer_point_1_3;
            copyLstTable[4].cadre_points = getModifyConduct.officer_point_1_4;
            copyLstTable[5].cadre_points = getModifyConduct.officer_point_1_5;

            copyLstTable[7].cadre_points = getModifyConduct.officer_point_2_1;
            copyLstTable[8].cadre_points = getModifyConduct.officer_point_2_2;
            copyLstTable[9].cadre_points = getModifyConduct.officer_point_2_3;
            copyLstTable[10].cadre_points = getModifyConduct.officer_point_2_4;
            copyLstTable[11].cadre_points = getModifyConduct.officer_point_2_5;
            copyLstTable[12].cadre_points = getModifyConduct.officer_point_2_6;

            copyLstTable[14].cadre_points = getModifyConduct.officer_point_3_1;
            copyLstTable[15].cadre_points = getModifyConduct.officer_point_3_2;
            copyLstTable[16].cadre_points = getModifyConduct.officer_point_3_3;

            copyLstTable[18].cadre_points = getModifyConduct.officer_point_4_1;
            copyLstTable[19].cadre_points = getModifyConduct.officer_point_4_2;
            copyLstTable[20].cadre_points = getModifyConduct.officer_point_4_3;

            copyLstTable[22].cadre_points = getModifyConduct.officer_point_5_1;
            copyLstTable[23].cadre_points = getModifyConduct.officer_point_5_2;
            setTotal_point(getModifyConduct.total_point);


            setListTable(copyLstTable);
            sumSelf_assessment(copyLstTable);
            sumCadre_points(copyLstTable);
        }
    }, [error, itemRes, getModifyConduct]);


    const columns: ColumnsType<DataType> = [
        {
            title: "STT",
            key: "stt",
            render: (value, record, index) => {
                const obj: any = {
                    children: <div className='font-bold text-center'>{record.stt}</div>,
                    props: {},
                };
                if (index === 23) {
                    obj.props.colSpan = 0;
                }
                return obj;
            },
        },
        {
            title: "Nội dung đánh giá",
            key: "note",
            render: (value, record, index) => {
                const obj: any = {
                    children: <div style={{ whiteSpace: 'pre-line', textAlign: (index == 23) ? "center" : "left" }}>{record.note}</div>,
                    props: {},
                };

                if (index === 23) {
                    obj.props.colSpan = 5;
                }
                return obj;
            },
        },
        {
            title: "Khung điểm",
            key: "point_frame",
            render: (value, record, index) => {
                const obj: any = {
                    children: <div className='font-bold'>{record.point_frame}</div>,
                    props: {},
                };
                if (index === 23) {
                    obj.props.colSpan = 0;
                }
                return obj;
            },
        },
        {
            title: "Điểm SV tự đánh giá",
            key: "self_assessment",
            render: (value, record, index) => {
                if (index != 0 && index != 6 && index != 13 && index != 17 && index != 21) {
                    const obj: any = {
                        children: (
                            ((getInfoCurrentUser.type == 'student' || (getInfoCurrentUser.is_officer)) && index != 25) ?
                                <InputNumber name={`self_assessment${index}`}
                                    value={record.self_assessment}
                                    min={min}
                                    max={record.point_frame}
                                    onChange={(value: any) => {
                                        let copylstTable = lstTable;
                                        copylstTable.map((obj: any, indextable: number) => {
                                            if (index == indextable) {
                                                obj.self_assessment = value;
                                                return obj
                                            }
                                        })

                                        setListTable(copylstTable);
                                        sumSelf_assessment(copylstTable);
                                    }} /> :
                                <div className='font-bold'>
                                    {(index === 25) ? self_assessment : record.self_assessment}
                                </div>
                        ),
                        props: {},
                    };

                    if (index === 23) {
                        obj.props.colSpan = 0;
                    }

                    return obj;
                }
            },
        },
        {
            title: "Điểm lớp đánh giá",
            key: "cadre_points",
            render: (value, record, index) => {
                if (index != 0 && index != 6 && index != 13 && index != 17 && index != 21) {
                    const obj: any = {
                        children: (
                            ((getInfoCurrentUser.type == 'teacher' || (getInfoCurrentUser.type == 'student' && (getInfoCurrentUser.is_officer))) && index != 25) ?
                                <InputNumber name={`cadre_points${index}`}
                                    value={record.cadre_points}
                                    min={min}
                                    max={record.point_frame}
                                    onChange={(value: any) => {
                                        let copylstTable = lstTable;
                                        copylstTable.map((obj: any, indextable: number) => {
                                            if (index == indextable) {
                                                obj.cadre_points = value;
                                                return obj
                                            }
                                        })
                                        setListTable(copylstTable);
                                        sumCadre_points(copylstTable);
                                    }} /> :
                                <div className='font-bold'>
                                    {(index === 25) ? cadre_points : record.cadre_points}
                                </div>
                        ),
                        props: {},
                    };

                    if (index === 23) {
                        obj.props.colSpan = 0;
                    }
                    return obj;
                }
            },
        },
    ];


    const sumSelf_assessment = (list: any) => {
        const some = list.reduce((accumulator: any, curValue: any) => {
            return accumulator + curValue.self_assessment
        }, 0)
        setSelf_assessment(some);
    }

    const sumCadre_points = (list: any) => {
        const some = listConductPoints.reduce((accumulator: any, curValue: any) => {
            return accumulator + curValue.cadre_points
        }, 0)
        setCadre_points(some);
    }

    const {
        trigger,
        data: dataConductFormupDate,
        error: errorConductFormupDate,
    } = useSWRMutation(student().conductformupdate(), fetcher_$POST);

    const handleFormSubmit = async (values: any) => {
        let data: any = {
            "is_delete": false,
            "student_point_1": lstTable[1].self_assessment + lstTable[2].self_assessment + lstTable[3].self_assessment + lstTable[4].self_assessment + lstTable[5].self_assessment,
            "student_point_1_1": lstTable[1].self_assessment,
            "student_point_1_2": lstTable[2].self_assessment,
            "student_point_1_3": lstTable[3].self_assessment,
            "student_point_1_4": lstTable[4].self_assessment,
            "student_point_1_5": lstTable[5].self_assessment,
            "student_point_2": lstTable[7].self_assessment + lstTable[8].self_assessment + lstTable[9].self_assessment + lstTable[10].self_assessment + lstTable[11].self_assessment + lstTable[12].self_assessment,
            "student_point_2_1": lstTable[7].self_assessment,
            "student_point_2_2": lstTable[8].self_assessment,
            "student_point_2_3": lstTable[9].self_assessment,
            "student_point_2_4": lstTable[10].self_assessment,
            "student_point_2_5": lstTable[11].self_assessment,
            "student_point_2_6": lstTable[12].self_assessment,
            "student_point_3": lstTable[14].self_assessment + lstTable[15].self_assessment + lstTable[16].self_assessment,
            "student_point_3_1": lstTable[14].self_assessment,
            "student_point_3_2": lstTable[15].self_assessment,
            "student_point_3_3": lstTable[16].self_assessment,
            "student_point_4": lstTable[18].self_assessment + lstTable[19].self_assessment + lstTable[20].self_assessment,
            "student_point_4_1": lstTable[18].self_assessment,
            "student_point_4_2": lstTable[19].self_assessment,
            "student_point_4_3": lstTable[20].self_assessment,
            "student_point_5": lstTable[22].self_assessment + lstTable[23].self_assessment,
            "student_point_5_1": lstTable[22].self_assessment,
            "student_point_5_2": lstTable[23].self_assessment,
            "officer_point_1": lstTable[1].cadre_points + lstTable[2].cadre_points + lstTable[3].cadre_points + lstTable[4].cadre_points + lstTable[5].cadre_points,
            "officer_point_1_1": lstTable[1].cadre_points,
            "officer_point_1_2": lstTable[2].cadre_points,
            "officer_point_1_3": lstTable[3].cadre_points,
            "officer_point_1_4": lstTable[4].cadre_points,
            "officer_point_1_5": lstTable[5].cadre_points,
            "officer_point_2": lstTable[7].cadre_points + lstTable[8].cadre_points + lstTable[9].cadre_points + lstTable[10].cadre_points + lstTable[11].cadre_points + lstTable[12].cadre_points,
            "officer_point_2_1": lstTable[7].cadre_points,
            "officer_point_2_2": lstTable[8].cadre_points,
            "officer_point_2_3": lstTable[9].cadre_points,
            "officer_point_2_4": lstTable[10].cadre_points,
            "officer_point_2_5": lstTable[11].cadre_points,
            "officer_point_2_6": lstTable[12].cadre_points,
            "officer_point_3": lstTable[14].cadre_points + lstTable[15].cadre_points + lstTable[16].cadre_points,
            "officer_point_3_1": lstTable[14].cadre_points,
            "officer_point_3_2": lstTable[15].cadre_points,
            "officer_point_3_3": lstTable[16].cadre_points,
            "officer_point_4": lstTable[18].cadre_points + lstTable[19].cadre_points + lstTable[20].cadre_points,
            "officer_point_4_1": lstTable[18].cadre_points,
            "officer_point_4_2": lstTable[19].cadre_points,
            "officer_point_4_3": lstTable[20].cadre_points,
            "officer_point_5": lstTable[22].cadre_points + lstTable[23].cadre_points,
            "officer_point_5_1": lstTable[22].cadre_points,
            "officer_point_5_2": lstTable[23].cadre_points,
            "total_point": total_point,
            "student_id": getModifyConduct.student_id,
            "teacher_id": getModifyConduct.teacher_id,
            "class_id": getModifyConduct.class_id,
            "id": getModifyConduct.id,
        }

        switch (getInfoCurrentUser.type) {
            case userType.student:
                // data.student_id = getInfoCurrentUser.id;
                // data.teacher_id = getInfoCurrentUser.teacher_id;
                // data.class_id = getInfoCurrentUser.class_id;
                data.status = (data.is_officer) ? 1 : 0;
                break;
            case userType.teacher:
                // data.student_id = getIdStudent;
                // data.teacher_id = getInfoCurrentUser.id;
                // data.class_id = getInfoCurrentUser.class_id;
                data.status = 2;
                break;
            default:
                // data.student_id = getIdStudent;
                // data.teacher_id = getInfoCurrentUser.teacher_id;
                // data.class_id = getInfoCurrentUser.class_id;
                break;
        }

        trigger({ ...data });
    };

    useEffect(() => {
        if (dataConductFormupDate?.statusCode == statusCode.OK) {
            notificationSuccess("Thêm mới thành công");
        }
        else if (dataConductFormupDate?.statusCode == statusCode.Error) {
            notificationError(`${dataConductFormupDate?.message}`);
        }
        if (errorConductFormupDate) {
            notificationError(`${errorConductFormupDate}`);
        }
    }, [dataConductFormupDate, errorConductFormupDate]);

    return (
        <Layout id='components-layout-demo-top' className="layout h-full">
            <Header>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    className='flex justify-end'
                >
                    <Dropdown className="mx-3" menu={{ items }} trigger={["click"]}>
                        <a
                            onClick={(e) => e.preventDefault()}
                            style={{ textDecoration: "none" }}
                        >
                            <Space>
                                <Avatar
                                    style={{ backgroundColor: "#0984e3" }}
                                    icon={<UserOutlined />}
                                />
                                {getInfoCurrentUser.username}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </Menu>

            </Header>
            <Content style={{ padding: '0 50px' }} className='h-full'>
                <div className="site-layout-content h-full" style={{ background: colorBgContainer }}>
                    <Form layout="inline" form={form}>
                        <Item
                            label="Họ và tên :"
                        > {getItemStudent?.full_name} </Item>
                        <Item
                            label="Lớp :"
                        > {getItemStudent?.classname}</Item>
                    </Form>
                    <Table
                        columns={columns} dataSource={lstTable ?? []}
                        pagination={false}
                        className='mb-5'
                    >
                    </Table>
                    {
                        (getInfoCurrentUser.type == userType.teacher)
                        && <div className="grid justify-items-end">
                            <Form layout="horizontal" form={form} >
                                <Item
                                    name="total_point"
                                    label="Giáo viên chủ nhiệm kết luận về điểm rèn luyện của SV"
                                >
                                    <InputNumber onChange={(e: any) => setTotal_point(e)} />
                                </Item>
                            </Form>
                        </div>
                    }
                    <div className="grid justify-items-end">
                        <Button className="bg-blue-500" onClick={handleFormSubmit} type="primary">Lưu</Button>
                    </div>

                </div>
            </Content>
        </Layout>
    );
}