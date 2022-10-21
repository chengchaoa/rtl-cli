import { Layout, Menu, Avatar, Modal } from "antd";
import { useEffect, useState, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import classnames from "classnames";
import { getMenuList } from "@/router/utils";
import storage from "@/utils/storage";
import Time from "./components/Time";
import "./index.scss";
import { compose, filter, isEmpty, not, isNil } from "ramda";
import { getTransformSize } from "@/utils";
// const classNames = classnames.bind(styles);

const { Header, Content, Sider } = Layout;

const CustomLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const routeData = useMemo(() => getMenuList(pathname), [pathname]);
  const { menuList, currentMenuPath, navList, currentNavPath } = routeData;

  useEffect(() => {
    const menuPath = (filter(compose(not, isEmpty), pathname.split("/")) || [])[0];
    if (isNil(currentMenuPath) || isNil(currentNavPath)) {
      navigate("/login");
    } else if (
      pathname === "/" ||
      menuList?.find((item: any) => item.key === menuPath || item.key === "/" + menuPath)
    ) {
      navigate(`/${currentMenuPath}/${currentNavPath}`);
    }
  }, [currentMenuPath, currentNavPath, menuList, navigate, pathname, routeData]);

  const onclick = (data: any) => {
    navigate(data.key);
  };

  const onNav = (data: any) => {
    navigate(`/${currentMenuPath}/${data.key}`);
  };

  const onExit = (data: any) => {
    Modal.confirm({
      content: "确定要退出登录吗?",
      wrapClassName: classnames("account-manage-ip-modal-white"),
      width: getTransformSize(668),
      icon: null,
      centered: true,
      maskClosable: true,
      okText: "common.button.confirm",
      onOk: onExitConfirm
    });
  };
  const onExitConfirm = () => {
    storage.del("token");
    storage.del("userInfo");
    navigate(`/login`);
  };

  return (
    <Layout hasSider className={classnames("global-layout")}>
      <Sider className={classnames("menu-wrap")} width={226 * Number(process.env.REACT_APP_UI_ZOOM_RATIOS || 1)}>
        <div className={classnames("logo")}>
          <img src={require("@/assets/images/layout/logo.png")} />
        </div>

        <div className={classnames("user")}>
          <Avatar
            className={classnames("avatar")}
            size={88}
            src="https://i.ytimg.com/vi/5zf2RKuxYFs/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLD2ydY8MotjRPNovShevmntr0VaDw"
          />
          <button onClick={onExit}>{"common.button.exit"}</button>
        </div>
        <Menu mode="inline" defaultSelectedKeys={["/" + currentMenuPath]} items={menuList} onClick={onclick} />
      </Sider>
      <Layout className={classnames("site-layout")}>
        <Header className={classnames("header")}>
          <div className={classnames("lang")}></div>
          <Time />
        </Header>
        <Content className={classnames("content")}>
          <ul className={classnames("nav")}>
            {navList?.map((item: any) => (
              <li
                key={item.key}
                className={classnames({ checked: item.key === currentNavPath || item.key === "/" + currentNavPath })}
                onClick={() => onNav(item)}
              >
                <div>{item.label}</div>
              </li>
            ))}
          </ul>
          <div className={classnames("main")}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;

// const Aa = () => <div>fddf</div>;

// export default Aa;
