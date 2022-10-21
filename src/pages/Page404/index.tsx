import { useNavigate } from "react-router-dom";
import classnames from "classnames/bind";
import img404 from "@/assets/images/404/404.png";
import styles from "./index.scss";

const classNames = classnames.bind(styles);

const Page404 = () => {
  const navigate = useNavigate();
  const onBack = () => {
    navigate("/");
  };

  return (
    <div className={classNames("page-404")}>
      <img src={img404} className={classNames("img-404")} />
      <div className={classNames("tip")}>抱歉，您访问的页面不存在~</div>
      <div className={classNames("go-home")} onClick={onBack}>
        首页
      </div>
    </div>
  );
};

export default Page404;
