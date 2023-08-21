import { host } from "./host";

export function classSV() {
    let url = `${host}/class/`;
    return {
        list: () => `${url}list`,
        detail: (teacher_id: number = 0) => `${url}detail?teacher_id=${teacher_id}`,
        delete: (class_idl: number = 0) => `${url}delete?class_idl=${class_idl}`,
        create: () => `${url}create`,
        modify: () => `${url}modify`,
        addteacher: (class_id: number, teacher_idl: number) => `${url}add-teacher?class_id=${class_id}&teacher_idl=${teacher_idl}`,
        detailadmin: (class_id: number) => `${url}detail-admin?class_id=${class_id}`,
        addstudenttoclass: () => `${url}add-student-to-class`,
        removestudent: (student_id: number) => `${url}remove-student?student_id=${student_id}`,
        listbyteacherid: (teacher_id: number) => `${url}list-by-teacher-id?teacher_id=${teacher_id}`,        
    };
}
