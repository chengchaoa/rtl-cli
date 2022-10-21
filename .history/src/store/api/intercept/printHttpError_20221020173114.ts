interface IPrintPanel {
  method?: string;
  url?: string;
  data?: string;
}

/**
 * 打印http请求错误的时候
 * @param httpStatus
 * @param path
 */
export const printHttpError = (httpStatus: number, path: string): void => {
  switch (httpStatus) {
    case 400:
      console.log(`错误的请求:${path}`);
      break;
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    case 401:
      console.log('你没有登录,请先登录');
      window.location.reload();
      break;
    // 跳转登录页面
    case 403:
      console.log('登录过期，请重新登录');
      // 清除全部的缓存数据
      window.localStorage.clear();
      window.location.reload();
      break;
    // 404请求不存在
    case 404:
      console.log('网络请求不存在');
      break;
    // 其他错误，直接抛出错误提示
    default:
      console.log('我也不知道是什么错误');
      break;
  }
};

/**
 * 打印错误信息
 * @param type
 * @param params
 */
export const printPanel = (params: IPrintPanel): void => {
  const str: string = `
    ==================请求错误=======================>
    请求方式: ${params?.method} \n
    请求的url: ${params?.url} \n
    请求体: ${params?.data}
    <=========================================
    `;
  console.log(str);
};
