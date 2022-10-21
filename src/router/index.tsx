import { RoutesType } from "../components/AuthRouter/types";
import Layout from "@/layout";

export const routes: RoutesType = [
  {
    path: "/",
    element: <Layout />,
    meta: {
      noLogin: true
    },
    children: [
      {
        path: "order-manage",
        meta: {
          title: "router.order-manage",
          index: true
        },
        children: [
          {
            path: "transfer-accounts",
            asyncElement: () => import("@/pages/Home"),
            meta: {
              title: "router.order-manage.transfer-accounts",
              index: true
            }
          }
        ]
      }
    ]
  },
  {
    path: "/login",
    asyncElement: () => import("../pages/Login"),
    meta: {
      title: "router.login",
      noLogin: true,
      hideMenu: true
    }
  },
  {
    path: "/403",
    asyncElement: () => import("../pages/Page403"),
    meta: {
      title: "403",
      noLogin: true,
      hideMenu: true
    }
  },
  {
    path: "*",
    asyncElement: () => import("../pages/Page404"),
    meta: {
      title: "404",
      noLogin: true,
      hideMenu: true
    }
  },
  {
    // 仅用于侧边栏外链菜单
    url: "https://github.com/neohan666/react-antd-mobx-admin",
    meta: {
      title: "GitHub"
    }
  }
];
