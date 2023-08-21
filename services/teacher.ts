import { host } from "./host";

export function teacher() {
  let url = `${host}/teacher/`;
  return {
    list: () => `${url}list`,
    detail: (id: number = 0) => `${url}detail?id=${id}`,
    create: () => `${url}create`,
    modify: () => `${url}modify`,
    login: () => `${url}login`,
  };
}
