/** 任务池相关路由 */
import Layout from "@/components/layout";

export default {
  path: "/returnVisit",
  component: Layout,
  meta: { title: "回访管理" },
  children: [
    {
      path: "taskPool",
      name: "taskPool",
      props: true,
      meta: {
        title: "任务池"
      },
      component: () => import(/* webpackChunkName:"returnVisit" */"@/views/returnVisit/taskPool")
    },
    {
      path: "taskDetail",
      name: "taskDetail",
      props: true,
      meta: {
        title: "任务处理详情"
      },
      component: () => import(/* webpackChunkName:"returnVisit" */"@/views/returnVisit/taskDetail")
    },
    {
      path: "commissioner",
      name: "commissioner",
      props: true,
      meta: {
        title: "专员管理"
      },
      component: () => import(/* webpackChunkName:"returnVisit" */"@/views/returnVisit/commissioner")
    },
    {
      path: "workOrder",
      name: "workOrder",
      props: true,
      meta: {
        title: "今日工单"
      },
      component: () => import(/* webpackChunkName:"returnVisit" */"@/views/returnVisit/workOrder")
    }
  ]
};
