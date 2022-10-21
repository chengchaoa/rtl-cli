import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ReactElementType, MetaType, OnRouteBeforeType, OnRouteBeforeResType } from "./types";
import utils from "./utils";

let temp: ReactElementType | null = null;

function Guard({
  element,
  meta,
  onRouteBefore
}: {
  element: ReactElementType;
  meta: MetaType;
  onRouteBefore?: OnRouteBeforeType;
}) {
  meta = meta || {};

  const location = useLocation();
  const { pathname } = location;

  const navigate = useNavigate();

  if (onRouteBefore) {
    if (temp === element) {
      return element;
    }
    const pathRes = onRouteBefore({ pathname, meta });
    if (utils.getDataType(pathRes) === "Promise") {
      (pathRes as Promise<OnRouteBeforeResType>).then((res: OnRouteBeforeResType) => {
        if (res && res !== pathname) {
          navigate(res, { replace: true });
        }
      });
    } else {
      if (pathRes && pathRes !== pathname) {
        element = <Navigate to={pathRes as string} replace={true} />;
      }
    }
  }

  temp = element;
  return element;
}

export default Guard;
