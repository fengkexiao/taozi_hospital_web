import Layout from "@/components/layout";

export default {
  path: "/medicine",
  component: Layout,
  meta: { title: "云药房" },
  redirect: "/medicine/hospitalOrders",
  children: [
    {
      path: "hospitalOrders",
      name: "hospitalOrders",
      meta: { title: "药品订单管理" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/medicine/HospitalOrders")
    },
    {
      path: "orderDetail/:orderID",
      name: "medicine-order-detail",
      props: true,
      meta: { title: "订单详情" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/medicine/OrderDetail")
    },
    {
      path: "deliverGoods/:orderID/:payTypeID",
      name: "medicine-deliverGoods",
      props: true,
      meta: { title: "发货" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/medicine/DeliverGoods")
    },
    {
      path: "medicineChinese",
      name: "medicineChinese",
      meta: { title: "中药管理" },
      component: () => import("@/views/medicine/MedicineChinese")
    },
    {
      path: "medicineWestern",
      name: "medicineWestern",
      meta: { title: "西药中成药管理" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/medicine/MedicineWestern")
    },
    {
      path: "tmcRps",
      name: "tmcRps",
      meta: { title: "处方管理" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/tmcinquiry/tmcRps")
    },
    {
      path: "tmc-RpDetail/:rpID",
      name: "tmc-RpDetail",
      props: true,
      meta: { title: "处方详情" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/tmcinquiry/tmcRpDetail")
    },
    {
      path: "rpTemplate",
      name: "tmcRpTemplate",
      meta: { title: "西成药处方模板" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/tmcinquiry/template/tmcRpTemplate")
    },
    {
      path: "rpTemplateZy",
      name: "rpTemplate-zy",
      meta: { title: "中药处方模板" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/tmcinquiry/template/rpTemplateZy")
    },
    {
      path: "tmcRpAudit",
      name: "pharmacistTrialParty",
      props: true,
      meta: { title: "药师审方" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/medicine/PharmacistTrialParty")
    },
    {
      path: "tmcOrders",
      name: "tmc-Orders-Run",
      meta: { title: "订单查询" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/medicine/TmcOrdersRun")
    },
    {
      path: "trialPartyAndDetails/:rpID/:sign/:route",
      name: "trialPartyAndDetails",
      props: true,
      meta: { title: "处方详情" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/medicine/TrialPartyAndDetails")
    },
    {
      path: "tmcDelivery",
      name: "tmc-tmcDelivery",
      props: true,
      meta: { title: "药房发货" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/medicine/TmcDelivery")
    },
    {
      path: "tmcRpAuditHuafu",
      name: "hf-pharmacistTrialParty",
      props: true,
      meta: { title: "TMC药师审方" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/huafu/HFPharmacistTrialParty")
    },
    {
      path: "tmcDeliveryHuafu",
      name: "hf-tmcDelivery",
      props: true,
      meta: { title: "TMC药房发货" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/huafu/HFTmcDelivery")
    },
    {
      path: "tmcMyOrders",
      name: "tmcMyOrders",
      meta: { title: "我的订单" },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/medicine/TmcOrders")
    },
    {
      path: "pharmacist",
      name: "pharmacist-medicine",
      meta: {
        title: "药师审方"
      },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/medicine/pharmacist")
    },
    {
      path: "rpTemplate/:inquiryId/:state",
      name: "rpTemplate-medicine",
      props: true,
      meta: {
        title: "审方、处方详情"
      },
      component: () => import(/* webpackChunkName:"medicine" */"@/views/components/rp/rpTemplate")
    },
    {
      path:"tmcStock",
      name:"tmcStock",
      props: true,
      meta: {
        title: "库存管理"
      },
      component: () => import(/* webpackChunkName:"medicine" */'@/views/stock/stock')
    }
  ]
};
