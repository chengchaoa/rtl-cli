export * from "./storage";
/**
 * @description 递归查询对应的路由
 * @param {String} path 当前访问地址
 * @param {Array} routes 路由列表
 * @returns array
 */
export const getTitleList = (key: string, routes: any) => {
  let result = {};
  for (const item of routes) {
    if (item.key === key) return item.title;
    if (item.children) {
      const res = getTitleList(key, item.children);
      if (Object.keys(res).length) result = res;
    }
  }
  return result;
};
