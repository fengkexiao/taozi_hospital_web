import Layout from "@/components/layout";

export default {
  path: "/yuninquiry",
  component: Layout,
  meta: { title: "问诊管理" },
  redirect: "/yuninquiry/hospitalOrders",
  children: [
    {
      path: "hospitalOrders",
      name: "HospitalOrdersForYunInquiry",
      meta: { title: "问诊订单" },
      component: () => import(/* webpackChunkName:"yuninquiry" */"@/views/yuninquiry/HospitalOrdersForYunInquiry")
    },
    {
      path: "dutyPlan",
      name: "DutyPlanForYunInquiry",
      meta: { title: "问诊设置" },
      component: () => import(/* webpackChunkName:"yuninquiry" */"@/views/yuninquiry/DutyPlanForYunInquiry")
    },
    {
      path: "schedule/:keyID",
      name: "PractiseOnInternetSchedule",
      props: true,
      meta: { title: "排班" },
      component: () => import(/* webpackChunkName:"yuninquiry" */"@/views/yuninquiry/PractiseOnInternetSchedule")
    }
  ]
};
