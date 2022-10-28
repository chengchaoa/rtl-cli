import { RoutesType } from "react-router-waiter";
import Layout from "@/layout";
import { HomeOutlined, AppstoreOutlined, DatabaseOutlined, ToTopOutlined } from "@ant-design/icons";

const routes = [
  {
    path: "/",
    element: <Layout />,
    meta: {
      noLogin: true
    },
    children: [
      {
        path: "home",
        component: () => import("@/pages/Home"),
        meta: {
          title: "首页",
          icon: <HomeOutlined />
          // disabled: true
        }
      },
      {
        path: "shelves",
        meta: {
          title: "上架风控",
          icon: <ToTopOutlined />
        },
        children: [
          {
            path: "package-name",
            component: () => import("@/pages/Shelves/PackageName"),
            meta: {
              title: "包名风控",
              icon: <AppstoreOutlined />
            }
          },
          {
            path: "ip",
            component: () => import("@/pages/Shelves/Ip"),
            meta: {
              title: "IP风控",
              icon: <AppstoreOutlined />
            }
          }
        ]
      },

      {
        path: "vest",
        component: () => import("@/pages/Vest"),
        meta: {
          title: "马甲数据",
          icon: <DatabaseOutlined />
        }
      }
    ]
  },
  {
    path: "/login",
    component: () => import("../pages/Login"),
    meta: {
      title: "登录"
    }
  },
  {
    path: "/403",
    component: () => import("../pages/Page403"),
    meta: {
      title: "403"
    }
  },
  {
    path: "*",
    component: () => import("../pages/Page404"),
    meta: {
      title: "404"
    }
  }
];

export default routes;
