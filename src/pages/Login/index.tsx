import classnames from "classnames/bind";
import { ChangeEvent, useCallback, useEffect, useReducer } from "react";
import { message, Modal, Spin } from "antd";
import { decode } from "js-base64";

import { storage } from "@/utils/storage";

import styles from "./index.module.scss";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useLoginMutation } from "@/api/module/login.service";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
const classNames = classnames.bind(styles);

const initialState = {
  username: "",
  password: "",
  spinning: false
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "update":
      return { ...state, ...action.payload };
  }
}

const Login = () => {
  const navigate = useNavigate();
  const [{ username, password, spinning }, dispatch] = useReducer(reducer, initialState);
  const [searchParams] = useSearchParams();

  const [loginApi] = useLoginMutation();

  const onLogin = useCallback(async () => {
    if (!username) {
      message.warning("login.username-require");
      return;
    }

    if (!password) {
      message.warning("login.password-require");
      return;
    }

    dispatch({
      type: "update",
      payload: {
        spinning: true
      }
    });

    try {
      const { data: res }: QueryReturnValue = await loginApi({
        ttl: 7200,
        username,
        password,
        ip: storage.getItem("ip")
      });

      if ((res as any).code === 0) {
        const token = (res as any)?.data.access_token;
        if (token) {
          const base64 = token.split(".")[1];
          const userInfo = decode(base64);
          const roles = JSON.parse(userInfo).roles;
          if (!roles) {
            message.info("账号权限不足");
            return;
          }
          storage.setItem("token", token);
          localStorage.setItem("userInfo", userInfo);
          message.success("登录成功");
          const redirect = searchParams.get("redirect");

          if (redirect) {
            window.location.replace(redirect);
          } else {
            navigate("/", { replace: true });
          }
        }
      } else {
        message.error((res as any).message);
      }
    } finally {
      dispatch({
        type: "update",
        payload: {
          spinning: false
        }
      });
    }
  }, [loginApi, navigate, password, searchParams, username]);

  const onKeyDown = useCallback(
    (e: any) => {
      if (e.keyCode === 13) {
        onLogin();
      }
    },
    [onLogin]
  );

  useEffect(() => {
    document.body.addEventListener("keydown", onKeyDown);

    return () => document.body.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const onChange = useCallback((e: ChangeEvent, type: string) => {
    dispatch({
      type: "update",
      payload: {
        [type]: (e.target as any).value
      }
    });
  }, []);

  const errorTimesModal = (times: number) => {
    // 账号密码错误弹窗
    Modal.confirm({
      content: (
        <>
          <p>{"login.username-password-error"}</p>
          <p>{"login.err-five-frozen"}</p>
          <p>
            <span className={classNames("error-times")}>{times}</span>/5
          </p>
          <div className={classNames("customer-service")}>{"login.contact-service"}</div>
        </>
      ),
      wrapClassName: "aaaaaa",
      className: classNames("cover-ant-modal-confirm login-page-modal-cover"),
      width: 495,
      icon: null,
      centered: true,
      maskClosable: true,
      okText: "common.button.confirm"
    });
  };

  const accountFreeze = () => {
    // 账号冻结弹窗
    Modal.confirm({
      content: (
        <>
          <p>
            {"login.account-has-freeze"}
            <span className={classNames("freeze-customer-service")}>{"login.contact-service"}</span>
          </p>
        </>
      ),
      wrapClassName: "aaaaaa",
      className: classNames("cover-ant-modal-confirm login-page-modal-cover"),
      width: 495,
      icon: null,
      centered: true,
      maskClosable: true,
      okText: "common.button.confirm"
    });
  };

  return (
    <Spin spinning={spinning} size="large">
      <div className={classNames("login-page")}>
        <div className={classNames("content")}>
          <div className={classNames("welcome")}>
            <h2 onClick={() => errorTimesModal(2)}>马甲包风控系统</h2>
          </div>
          <div className={classNames("tip")}></div>
          <form className={classNames("form")}>
            <div className={classNames("item")}>
              <img src={require("@/assets/images/login/account.png")} />
              <span>账号</span>
              <input value={username} onChange={(e) => onChange(e, "username")} />
            </div>
            <div className={classNames("item")}>
              <img src={require("@/assets/images/login/pass.png")} />
              <span>密码</span>
              <input type="password" value={password} onChange={(e) => onChange(e, "password")} />
            </div>
            <div className={classNames("btn")} onClick={onLogin}>
              登录
            </div>
          </form>
        </div>
      </div>
    </Spin>
  );
};

export default Login;
