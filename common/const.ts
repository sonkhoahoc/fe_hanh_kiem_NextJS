import { RcFile } from "antd/es/upload";

export const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());    