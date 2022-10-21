import classnames from "classnames/bind";
import { ChangeEvent, useCallback, useEffect, useReducer } from "react";
import { message, Modal, Spin } from "antd";
import { decode } from "js-base64";

import request from "@/api-pre";
import { storage } from "@/utils/storage";

import styles from "./index.module.scss";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useLoginMutation } from "@/store/api/module/login";
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

  const [login, result] = useLoginMutation();

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

    login({
      ttl: 7200,
      username,
      password,
      ip: storage.getItem("ip")
    });

    // try {
    //   const res = await request(
    //     "/api/auth/login",
    //     {
    //       username,
    //       password,
    //       ttl: 86400, // 一天
    //       ip: storage.get("ip")
    //     },
    //     {
    //       method: "post",
    //       noNeedLogin: true
    //     }
    //   );

    //   if ((res as any).code === 0) {
    //     const token = (res as any)?.data.access_token;
    //     if (token) {
    //       const base64 = token.split(".")[1];
    //       const userInfo = decode(base64);
    //       const roles = JSON.parse(userInfo).roles;
    //       if (!roles) {
    //         message.info("账号权限不足");
    //         return;
    //       }
    //       storage.set("token", token);
    //       localStorage.setItem("userInfo", userInfo);
    //       message.success("登录成功");
    //       const redirect = searchParams.get("redirect");

    //       if (redirect) {
    //         window.location.replace(redirect);
    //       } else {
    //         navigate("/", { replace: true });
    //       }
    //     }
    //   } else {
    //     message.error((res as any).message);
    //   }
    // } finally {
    //   dispatch({
    //     type: "update",
    //     payload: {
    //       spinning: false
    //     }
    //   });
    // }
  }, [username, password, searchParams, navigate]);

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
            <h2 onClick={() => errorTimesModal(2)}>{"login.welcome.pre"}</h2>
            <h1 onClick={() => accountFreeze()}>{"login.welcome"}</h1>
          </div>
          <div className={classNames("tip")}>{"login.tip"}</div>
          <form className={classNames("form")}>
            <div className={classNames("item")}>
              <img src={require("@/assets/images/login/account.png")} />
              <span>{"login.username"}</span>
              <input value={username} onChange={(e) => onChange(e, "username")} />
            </div>
            <div className={classNames("item")}>
              <img src={require("@/assets/images/login/pass.png")} />
              <span>{"login.password"}</span>
              <input type="password" value={password} onChange={(e) => onChange(e, "password")} />
            </div>
            <div className={classNames("btn")} onClick={onLogin}>
              {"login.login"}
            </div>
          </form>
        </div>
      </div>
    </Spin>
  );
};

export default Login;
