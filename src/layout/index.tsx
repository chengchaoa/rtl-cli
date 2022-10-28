import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, Tabs } from "antd";
import classNames from "classnames";
import React, { useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { getMenuList } from "@/router/onRouteBefore";
import { getTitleList } from "@/utils";
import "./index.scss";
import { useImmerReducer } from "use-immer";
import logo from "@/assets/images/layout/logo.png";
import MenuItem from "antd/lib/menu/MenuItem";
import { compose, filter, isEmpty, not, isNil } from "ramda";
const { Header, Content, Footer, Sider } = Layout;

function reducer(draft: any, action: Record<string, any>) {
  switch (action.type) {
    case "update":
      return { ...draft, ...action.payload };
    case "req":
      draft.req = { ...draft.req, ...action.payload };
      break;
    case "navList":
      draft.tabList = { ...draft.navList, ...action.payload };
      break;
  }
}
const initialState = {
  collapsed: false,
  breadcrumbList: []
};

const LayoutMenu = () => {
  const [{ breadcrumbList, collapsed }, dispatch] = useImmerReducer(reducer, initialState);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const routeData = useMemo(() => getMenuList(pathname), [pathname]);
  const { menuList } = routeData;

  const onMenuClick = ({ key }: any) => {
    const breadcrumbList = getTitleList(key, menuList);
    setState("update", {
      breadcrumbList
    });
    navigate(key);
  };
  const setState = (type: string, val: Record<string, any>) => {
    dispatch({ type, payload: val });
  };
  return (
    <Layout className={classNames("global-layout")}>
      <Sider
        className={classNames("menu-wrap")}
        collapsible
        collapsed={collapsed}
        onCollapse={(val) =>
          setState("update", {
            collapsed: val
          })
        }
      >
        <div className="logo-box">
          <img src={logo} alt="logo" className="logo-img" />
          {/* <div className={classNames("title")}>马甲包风控系统</div> */}
        </div>
        <Menu theme="dark" defaultSelectedKeys={["0"]} mode="inline" items={menuList} onClick={onMenuClick} />
      </Sider>
      <Layout className="site-layout">
        <Header>
          <div
            className="collapsed"
            onClick={() =>
              setState("update", {
                collapsed: !collapsed
              })
            }
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </Header>
        <Content>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            {breadcrumbList.map((item: any) => (
              <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div className="main-wrap">
            <div className={classNames("main")}>
              <Outlet />
            </div>
          </div>
        </Content>
        <Footer>马甲包风控系统</Footer>
      </Layout>
    </Layout>
  );
};
export default LayoutMenu;
