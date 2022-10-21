import React from "react";
import { Navigate, RouteObject } from "react-router-dom";
import Guard from "./guard";
import { RouterWaiterPropsType, MetaType, FunctionalImportType } from "./types";

export default class Fn {
  routes;
  onRouteBefore;
  loading;

  constructor(option: RouterWaiterPropsType) {
    this.routes = option.routes || [];
    this.onRouteBefore = option.onRouteBefore;
    this.loading = option.loading || null;
    // (
    //   <div style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>加载中</div>
    // );
  }

  /**
   * @description: 路由配置列表数据转换
   * @param {string} redirect 要重定向的路由路径
   * @param {function} asyncElement 函数形式import懒加载组件
   * @param {object} meta 自定义字段
   */
  transformRoutes(routeList = this.routes) {
    const list: RouteObject[] = [];
    routeList.forEach((route) => {
      const obj = { ...route };
      if (obj.path === undefined) {
        return;
      }
      if (obj.redirect) {
        obj.element = <Navigate to={obj.redirect} replace={true} />;
        delete obj.redirect;
      } else if (obj.asyncElement) {
        obj.element = this.asyncRender(obj.asyncElement, obj.meta || {});
        delete obj.asyncElement;
      }
      if (obj?.children) {
        obj.children = this.transformRoutes(obj.children);
      }
      delete obj.meta;

      list.push(obj);
    });

    return list;
  }

  /**
   * @description: 路由懒加载
   */
  asyncRender(importFn: FunctionalImportType, meta: MetaType) {
    const Element = React.lazy(importFn);
    const element = (
      <React.Suspense fallback={this.loading}>
        <Element _meta={meta} />
      </React.Suspense>
    );

    return <Guard element={element} meta={meta} onRouteBefore={this.onRouteBefore} />;
  }
}
