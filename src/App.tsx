import { Fragment } from "react";
import { BrowserRouter } from "react-router-dom";
import { Inspector } from "react-dev-inspector";
import { ConfigProvider } from "antd";

import { routes } from "./router";
import { onRouteBefore } from "./router/utils";
import RouterWaiter from "./components/AuthRouter";

// 业务自定义语言

import { publicIpv4 } from "public-ip";
import { storage } from "@/utils/storage";

publicIpv4().then((res) => {
  storage.setItem("ip", res);
});

const InspectorWrapper = process.env.NODE_ENV === "development" ? Inspector : Fragment;

publicIpv4().then((res) => {
  storage.setItem("ip", res);
});

function App() {
  const getPopupContainer = (node: any) => {
    if (node) {
      return node.parentNode;
    }
    return document.body;
  };
  return (
    <InspectorWrapper keys={["alt", "z"]} disableLaunchEditor={false}>
      <ConfigProvider getPopupContainer={getPopupContainer}>
        <BrowserRouter>
          <RouterWaiter routes={routes} onRouteBefore={onRouteBefore} />
        </BrowserRouter>
      </ConfigProvider>
    </InspectorWrapper>
  );
}

export default App;
