import Layout from "@/components/layout";

export default {
  path: "/chronic",
  component: Layout,
  meta: { title: "慢病管理" },
  children: [
    {
      path: "data",
      name: "data",
      meta: { title: "数据统计" },
      component: () => import(/* webpackChunkName:"content" */"@/views/assistant/home")
    },
    {
      path: "patient",
      name: "patient",
      meta: { title: "患者管理" },
      component: () => import(/* webpackChunkName:"content" */"@/views/assistant/patientManage")
    },
    {
      path: "chronic-patientDetail",
      name: "chronic-patientDetail",
      meta: { title: "患者详情" },
      component: () => import(/* webpackChunkName:"content" */"@/views/assistant/patientDetail")
    },
    {
      path: "rp",
      name: "rp",
      meta: { title: "处方管理" },
      component: () => import(/* webpackChunkName:"content" */"@/views/assistant/rpManage")
    },
  ]
};
