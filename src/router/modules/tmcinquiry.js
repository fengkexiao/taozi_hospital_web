import Layout from "@/components/layout";

export default {
  path: "/tmcinquiry",
  component: Layout,
  meta: { title: "问诊管理" },
  redirect: "/tmcinquiry/myInquiry",
  children: [
    {
      path: "myInquiry",
      name: "TMCInquiry-MyInquiry",
      meta: { title: "我的问诊" },
      component: () => import(/* webpackChunkName:"tmcinquiry" */"@/views/tmcinquiry/MyInquiry")
    },
    // 右侧工具栏
    // 右侧工具栏首页
    {
      path: "tmcinquiry/PatientIndex",
      name: "TMCInquiry-patientIndex",
      props: true,
      component: () => import(/* webpackChunkName:"tmcinquiry" */"@/views/tmcinquiry/docAssistant/PatientIndex")
    },
    // 患者信息
    {
      path: "tmcinquiry/PatientInfoAddEditDetail",
      name: "TMCInquiry-patientInfo",
      // props: true,
      component: () => import(/* webpackChunkName:"tmcinquiry" */"@/views/tmcinquiry/docAssistant/PatientInfoAddEditDetail")
    },
    // 症状描述
    {
      path: "tmcinquiry/PatientSymptomsDescribed",
      name: "TMCInquiry-symptomsDescribed",
      component: () => import(/* webpackChunkName:"tmcinquiry" */"@/views/tmcinquiry/docAssistant/PatientSymptomsDescribed")
    },
    // 处方建议
    {
      path: "tmcinquiry/PatientRpAdvise",
      name: "TMCInquiry-rpAdvise",
      component: () => import(/* webpackChunkName:"tmcinquiry" */"@/views/tmcinquiry/docAssistant/PatientRpAdvise")
    },
    // 修改价格
    {
      path: "tmcinquiry/PatientOrderPrice",
      name: "TMCInquiry-orderPrice",
      component: () => import(/* webpackChunkName:"tmcinquiry" */"@/views/tmcinquiry/docAssistant/PatientOrderPrice")
    },
    // 创建复诊任务
    {
      path: "tmcinquiry/PatientRegularReturnVisitCreate",
      name: "TMCInquiry-regularReturnVisitCreate",
      component: () => import(/* webpackChunkName:"tmcinquiry" */"@/views/tmcinquiry/docAssistant/PatientRegularReturnVisitCreate")
    },
    // 沟通记录
    {
      path: "tmcinquiry/PatientCommunication",
      name: "TMCInquiry-communication",
      component: () => import(/* webpackChunkName:"tmcinquiry" */"@/views/tmcinquiry/docAssistant/PatientCommunication")
    },
    // 历史订单
    {
      path: "tmcinquiry/PatientOrder",
      name: "TMCInquiry-order",
      component: () => import(/* webpackChunkName:"tmcinquiry" */"@/views/tmcinquiry/docAssistant/PatientOrder")
    },
    // 二维码
    {
      path: "myQrcode",
      name: "TMCInquiry-myQrcode",
      meta: { title: "我的二维码" },
      component: () => import("@/views/tmcinquiry/myQrcode")
    },
    // 患者评价详情
    {
      path: "commentDetail/:keyID",
      name: "TMCInquiry-commentDetail",
      meta: { title: "评价详情" },
      props: true,
      component: () => import("@/views/tmcinquiry/content/CommentDetail")
    },
    {
      path: "inquiryRecord",
      name: "TMCInquiry-InquiryRecord",
      meta: { title: "问诊记录" },
      component: () => import("@/views/tmcinquiry/InquiryRecord")
    }
    // 需要的后面继续加
  ]
};
