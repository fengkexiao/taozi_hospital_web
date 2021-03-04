import Layout from "@/components/layout";

export default {
  path: "/hou",
  component: Layout,
  meta: {
    title: "候氏风湿"
  },
  children: [{
    path: "medicine",
    name: "medicine",
    props: true,
    meta: {
      title: "风湿药品管理"
    },
    component: () =>
      import(/* webpackChunkName:"hou" */"@/views/houshi/medicine")
  },
  {
    alias: "coTreatCenter/:orderId/:step",
    path: "coTreatCenter",
    name: "coTreatCenter",
    props: true,
    meta: {
      title: "风湿协诊中心"
    },
    component: () =>
      import(/* webpackChunkName:"hou" */"@/views/houshi/coTreatCenter")
  },
  {
    alias: "coTreatOrder/:sign",
    path: "coTreatOrder",
    name: "coTreatOrder",
    props: true,
    meta: {
      title: "风湿协诊管理"
    },
    component: () =>
      import(/* webpackChunkName:"hou" */"@/views/houshi/coTreatOrder")
  },
  {
    alias: "treatRpAudit/:sign",
    path: "treatRpAudit",
    name: "treatRpAudit",
    props: true,
    meta: {
      title: "风湿处方审核"
    },
    component: () =>
      import(/* webpackChunkName:"hou" */"@/views/houshi/treatRpAudit")
  },
  {
    path: "treatRpAuditDetails/:orderId/:sign",
    name: "treatRpAuditDetails",
    props: true,
    meta: {
      title: "风湿处方详情"
    },
    component: () =>
      import(/* webpackChunkName:"hou" */"@/views/houshi/treatRpAuditDetails")
  },
  {
    alias: "treatOrderDelivery/:sign",
    path: "treatOrderDelivery",
    name: "treatOrderDelivery",
    props: true,
    meta: {
      title: "风湿药品发货"
    },
    component: () =>
      import(/* webpackChunkName:"hou" */"@/views/houshi/treatOrderDelivery")
  },
  {
    alias: "treatOrderFinance/:sign",
    path: "treatOrderFinance",
    name: "treatOrderFinance",
    props: true,
    meta: {
      title: "风湿财务结算"
    },
    component: () =>
      import(/* webpackChunkName:"hou" */"@/views/houshi/treatOrderFinance")
  },
  {
    path: "patient",
    name: "patient",
    props: true,
    meta: {
      title: "患者管理"
    },
    component: () =>
      import(/* webpackChunkName:"hou" */"@/views/houshi/patient")
  },
  {
    // 携带参数
    path: "patient/patientContrast/:patientID/:kindCode/:diseaseCode",
    name: "patientContrast",
    props: true,
    meta: {
      title: "患者评分对比"
    },
    component: () =>
      import(/* webpackChunkName:"hou" */"@/views/houshi/patientContrast")
  }
  ]
};
