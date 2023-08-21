import React, { useEffect, useState } from 'react';
import {
  ApartmentOutlined,
  DownOutlined,
  InsertRowBelowOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, MenuProps, Space, theme } from 'antd';
import ManageTeacher from '../manage-teacher';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import ManageAdmin from '../manage-admin';
import ManageClass from '../manage-class';
import { userType } from '@/common/enum';
import { clear_info_current_user } from '@/store/action/info_current_user_action';

const { Header, Sider, Content } = Layout;

const Admin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const router = useRouter();
  // get info user
  const getInfoCurrentUser = useSelector(
    (state: any) => state.infoCurrentUserReducers
  );

  const dispatch = useDispatch();

  const [selectedMenuItem, setSelectedMenuItem] = useState((getInfoCurrentUser?.type == userType.teacher || getInfoCurrentUser?.type == userType.ministry) ? '3' : '1');

  const items: MenuProps["items"] = [
    {
      label: (
        <a href="" style={{ textDecoration: "none" }} onClick={() => dispatch(clear_info_current_user())}>
          Đăng xuất
        </a>
      ),
      key: "0",
    },
  ];

  useEffect(() => {
    if (getInfoCurrentUser?.type == userType.student && (!getInfoCurrentUser.is_officer)) {
      router.push(`/banghanhkiem/${getInfoCurrentUser.id}`);
    }
    if (!getInfoCurrentUser?.token) {
      router.push("/login/student");
    }
  }, [getInfoCurrentUser, router]);

  const componentsSwtich = (key: any) => {
    switch (key) {
      case "1":
        return <ManageTeacher />;
      case "2":
        return <ManageAdmin />;
      case "3":
        return <ManageClass />;
      default:
        break;
    }
  };

  return (
    <Layout id='components-layout-demo-custom-trigger' className='h-screen'>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={(getInfoCurrentUser?.type == userType.teacher || getInfoCurrentUser?.type == userType.ministry) ? ['3'] : ['1']}
          onClick={(e) => setSelectedMenuItem(e.key)}
          items={[
            {
              key: '1',
              icon: <UserSwitchOutlined />,
              label: 'Quản lý giáo viên',
              disabled: getInfoCurrentUser.type == userType.teacher || getInfoCurrentUser.type == userType.ministry,
            },
            {
              key: '2',
              icon: <UserAddOutlined />,
              label: 'Quản lý admin',
              disabled: getInfoCurrentUser.type == userType.teacher || getInfoCurrentUser.type == userType.ministry,
            },
            {
              key: '3',
              icon: <InsertRowBelowOutlined />,
              label: 'Lớp học',
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }} className='flex justify-between'>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
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
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {componentsSwtich(selectedMenuItem)}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;