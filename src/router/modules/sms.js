import Layout from "@/components/layout";

export default {
  path: "/sms",
  component: Layout,
  meta: { title: "营销短信" },
  redirect: "/sms/tmcSmsTemplate",
  children: [
    {
      path: "tmcSmsTemplate",
      name: "smsTemplate",
      meta: { title: "短信模板管理" },
      component: () => import(/* webpackChunkName:"sms" */"@/views/sms/smsTemplate")
    },
    {
      path: "tmcSmsTask",
      name: "smsTask",
      meta: { title: "短信任务管理" },
      component: () => import(/* webpackChunkName:"sms" */"@/views/sms/smsTask")
    },
    {
      path: "tmcSmsRecord",
      name: "smsRecord",
      meta: { title: "短信发送记录" },
      component: () => import(/* webpackChunkName:"sms" */"@/views/sms/smsRecord")
    },
    {
      path: "addSmsTemplate",
      name: "addSmsTemplate",
      props: true,
      meta: { title: "添加模板" },
      component: () => import(/* webpackChunkName:"sms" */"@/views/sms/addSmsTemplate")
    },
    {
      path: "detailSmsTemplate/:keyID/:isDetail",
      name: "detailSmsTemplate",
      props: true,
      meta: { title: "模板详情" },
      component: () => import(/* webpackChunkName:"sms" */"@/views/sms/addSmsTemplate")
    },
    {
      path: "editSmsTemplate/:keyID/:isDetail",
      name: "editSmsTemplate",
      props: true,
      meta: { title: "修改模板" },
      component: () => import(/* webpackChunkName:"sms" */"@/views/sms/addSmsTemplate")
    },
    {
      path: "addSmsTask",
      name: "addSmsTask",
      props: true,
      meta: { title: "添加任务" },
      component: () => import(/* webpackChunkName:"sms" */"@/views/sms/addSmsTask")
    },
    {
      path: "editSmsTask/:keyID/:isSee",
      name: "editSmsTask",
      props: true,
      meta: { title: "修改任务" },
      component: () => import(/* webpackChunkName:"sms" */"@/views/sms/addSmsTask")
    },
    {
      path: "detailSmsTask/:keyID/:isSee",
      name: "detailSmsTask",
      props: true,
      meta: { title: "任务详情" },
      component: () => import(/* webpackChunkName:"sms" */"@/views/sms/addSmsTask")
    },
    {
      path: "copySmsTask/:keyID/:isSee",
      name: "copySmsTask",
      props: true,
      meta: { title: "复制任务" },
      component: () => import(/* webpackChunkName:"sms" */"@/views/sms/addSmsTask")
    }
  ]
};
