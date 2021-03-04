import Layout from "@/components/layout";

export default {
  path: "/examine",
  component: Layout,
  meta: { title: "检查检验" },
  redirect: "/examine/hospitalItem",
  children: [
    {
      path: "hospitalItem",
      name: "examine-hospitalItem",
      meta: { title: "检查项目管理" },
      component: () => import(/* webpackChunkName:"examine" */"@/views/examine/HospitalItem")
    },
    { 
      path: "orderDeal",
      name: "examine-orderDeal",
      meta: { title: "检查单处理" },
      component: () => import(/* webpackChunkName:"examine" */"@/views/examine/ExamineOrders")
    },
    {
      path: "order/recept/:keyID",
      name: "examine-orderDeal-recept",
      props: true,
      meta: { title: "开单" },
      component: () => import(/* webpackChunkName:"examine" */"@/views/examine/OrderRecept")
    },
    {
      path: "orderReport",
      name: "examine-orderReport",
      props: true,
      meta: { title: "检查报告上传" },
      component: () => import(/* webpackChunkName:"examine" */"@/views/examine/ExamineReport")
    },
    {
      path: "orderReportBack",
      name: "examine-orderReportBack",
      props: true,
      meta: { title: "报告上传成功后跳转" },
      component: () => import(/* webpackChunkName:"examine" */"@/views/examine/ReportBack")
    },
    {
      path: "order/detail/:orderID",
      name: "examine-order-detail",
      props: true,
      meta: { title: "订单详情" },
      component: () => import(/* webpackChunkName:"examine" */"@/views/examine/OrderDetail")
    }
  ]
};
