import { useNavigate } from "react-router-dom";
import classnames from "classnames/bind";
import img403 from "@/assets/images/403/403.png";
import styles from "./index.scss";

const classNames = classnames.bind(styles);

const Page403 = () => {
  const navigate = useNavigate();
  const onBack = () => {
    navigate("/");
  };

  return (
    <div className={classNames("page-403")}>
      <img src={img403} className={classNames("img-403")} />
      <div className={classNames("tip")}>抱歉，您无权访问该页面~</div>
      <div className={classNames("go-home")} onClick={onBack}>
        首页
      </div>
    </div>
  );
};

export default Page403;
