import { Button, Checkbox, Form, Input } from "antd";
import styles from '@/styles/login.module.css';
import Image from 'next/image';
import imgLogin from '../../../public/assets/images/login.avif';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { notificationError, notificationSuccess } from "@/common/functionglobal";
import { admin } from "@/services/admin";
import { teacher } from "@/services/teacher";
import { student } from "@/services/student";
import { useEffect, useState } from "react";
import { statusCode, userType } from "@/common/enum";
import { add_info_current_user } from "@/store/action/info_current_user_action";
import axios from "axios";


function Login() {
  const [getTypeLogin, setTypeLogin] = useState('');
  const router = useRouter();

  // get user
  const getInfoCurrentUser = useSelector(
    (state: any) => state.infoCurrentUserReducers
  );
  const dispatch = useDispatch();

  const callAPILogin = (url: string, values: any) => {
    return axios.post(url, values)
      .then(({ data }) => {
        if (data?.statusCode == statusCode.OK) {
          notificationSuccess(data.message);
          dispatch(add_info_current_user({ ...data.data, type: getTypeLogin }));
        }
        else {
          notificationError(data.message);
        }
      });
  }

  const handleFormSubmit = async (values: any) => {
    let url: any = '';
    switch (getTypeLogin) {
      case userType.admin:
        url = admin().login();
        callAPILogin(url, values)
        break;
      case userType.teacher:
        url = teacher().login();
        callAPILogin(url, values)
        break;
      case userType.ministry:
        url = admin().login();
        callAPILogin(url, values)
        break;
      default:
        url = student().login();
        callAPILogin(url, values)
        break;
    }
  };

  useEffect(() => {
    if (router.isReady) {
      setTypeLogin(`${router.query.type}`);
    }
  }, [router]);

  useEffect(() => {
    if (getInfoCurrentUser?.token) {
      switch (getTypeLogin) {
        case userType.admin:
          router.push("/admin");
          break;
        case userType.ministry:
          router.push("/admin");
          break;
        case userType.teacher:
          router.push("/admin");
          break;
        default:
          router.push(`/banghanhkiem/${getInfoCurrentUser.id}`);
          break;
      }
    }
  }, [getInfoCurrentUser]);

  return (
    <>
      <div className={styles.login_page}>
        <div className={styles.login_box}>
          <div className={styles.illustration_wrapper}>
            <Image
              src={imgLogin}
              alt="Login"
              className="w-full"
            />
          </div>
          <Form
            name={styles.login_form}
            initialValues={{ remember: true }}
            onFinish={handleFormSubmit}
            autoComplete="off"
          >
            <p className={`${styles.form_title} mb-1.5`}>Đăng nhập</p>
            <p>Đồ án quản lý hạnh kiểm</p>
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Yêu cầu nhập tài khoản' }]}
            >
              <Input
                placeholder="Tài khoản"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Yêu cầu nhập mật khẩu' }]}
            >
              <Input.Password
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" className='w-full bg-blue-500' htmlType="submit">
                LOGIN
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}

export default Login;