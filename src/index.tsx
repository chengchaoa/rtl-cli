import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

import { rootStore } from "./store/store";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import "./index.scss";
dayjs.extend(utc);
dayjs.extend(timezone);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={rootStore}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
