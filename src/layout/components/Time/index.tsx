import dayjs from "dayjs";
import classnames from "classnames";
import { useEffect, useState } from "react";

const Time = () => {
  const [date, setDate] = useState(dayjs().format("hh:mm:ss"));

  useEffect(() => {
    const current = setInterval(() => {
      setDate(dayjs().format("hh:mm:ss"));
    }, 1000);

    return () => {
      current && clearInterval(current);
    };
  }, []);

  return (
    <div className={classnames("date-wrap")}>
      <div>
        {"common.button.timestamp"}
        {dayjs.tz.guess()}
      </div>
      <div className={classnames("date")}>{date}</div>
    </div>
  );
};

export default Time;
