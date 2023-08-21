import { host } from "./host";

export function category() {
  let url = `${host}/category/category`;
  return {
    product: () => {
      url += "-product";
      return {
        list: () => `${url}-list`,
        item: (id: number = 0) => `${url}?id=${id}`,
        create: () => `${url}-create`,
        modify: () => `${url}-modify`,
        delete: (id: number = 0) => `${url}-delete?id=${id}`,
      };
    },
    news: () => {
      url += "-news";
      return {
        list: (data: any) => `${url}-list?keyword=${data.keyword}`,
        item: (id: number = 0) => `${url}?id=${id}`,
        create: () => `${url}-create`,
        modify: () => `${url}-modify`,
        delete: (id: number = 0) => `${url}-delete?id=${id}`,
      };
    },
    size: () => {
      url += "-size";
      return {
        list: () => `${url}-list`,
        item: (id: number = 0) => `${url}?id=${id}`,
        create: () => `${url}-create`,
        modify: () => `${url}-modify`,
        delete: (id: number = 0) => `${url}-delete?id=${id}`,
      };
    },
  };
}
