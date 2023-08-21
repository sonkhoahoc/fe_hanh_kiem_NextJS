import { host } from "./host";

export function admin() {
  let url = `${host}/admin/`;
  return {
    list: () => `${url}list`,
    create: () => `${url}create`,
    modify: () => `${url}modify`,
    user: (id: number = 0) => `${url}user?id=${id}`,
    login: () => `${url}login`,
  };
}
