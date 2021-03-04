import Layout from "@/components/layout";

export default {
  path: "/rp",
  component: Layout,
  meta: {
    title: "云处方"
  },
  children: [
    {
      path: "doctor",
      name: "doctor",
      props: true,
      meta: {
        title: "接诊开方"
      },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/doctor")
    },
    {
      path: "pharmacist",
      name: "pharmacist",
      meta: {
        title: "药师审方"
      },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/pharmacist")
    },
    {
      path: "rpTemplate/:inquiryId/:state",
      name: "rpTemplate",
      props: true,
      meta: {
        title: "审方、处方详情"
      },
      component: () => import(/* webpackChunkName:"rp" */"@/views/components/rp/rpTemplate")
    },
    {
      path: "rpTemplateYS/:inquiryId/:state",
      name: "rpTemplateYS",
      props: true,
      meta: {
        title: "审方、处方详情"
      },
      component: () => import(/* webpackChunkName:"rp" */"@/views/components/rp/rpTemplateYS")
    },
    {
      path: "rpTemplateHf/:inquiryId/:state",
      name: "rpTemplateHf",
      props: true,
      meta: {
        title: "审方、处方详情"
      },
      component: () => import("@/views/components/rp/rpTemplateHuafu")
    },
    {
      path: "inquiryOrders",
      name: "inquiryOrders",
      props: true,
      meta: {
        title: "问诊订单查询"
      },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/inquiryOrders")
    },
    {
      path: "orderPool",
      name: "orderPool",
      props: true,
      meta: { title: "医生开方" },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/OrderPool")
    },
    {
      path: "rpPool",
      name: "rpPool",
      meta: { title: "药师审方" },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/RpPool")
    },
    {
      path: "orderPoolpage",
      name: "orderPoolPage",
      meta: { title: "药师审方" },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/OrderPoolPage")
    },
    {
      path: "patientDetails",
      name: "patientDetails",
      meta: { title: "处方详情" },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/PatientDetails")
    },
    {
      path: "orderList",
      name: "orderList",
      props: true,
      meta: { title: "话术库" },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/HistoryPrescription")
    },
    {
      path: "rpList",
      name: "rpList",
      props: true,
      meta: { title: "历史审方" },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/RpList")
    },

    // {
    //   path: "rpTemplateDetail/:inquiryId/:state",
    //   name: "rpTemplateDetail",
    //   props: true,
    //   meta: {
    //     title: "审方详情"
    //   },
    //   component: () => import("@/views/rp/rpTemplateDetail")
    // }

  ]
};
