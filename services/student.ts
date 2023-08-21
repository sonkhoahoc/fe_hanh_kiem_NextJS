import { host } from "./host";

export function student() {
  let url = `${host}/student/`;
  return {
    list: (class_id: number) => `${url}list?class_id=${class_id}`,
    modify: () => `${url}modify`,
    detail: (id: number = 0) => `${url}detail?id=${id}`,
    login: () => `${url}login`,    
    conductform: (student_id: number = 0) => `${url}conduct-form?student_id=${student_id}`,
    conductformupdate: () => `${url}conduct-form-update`,
  };
}
