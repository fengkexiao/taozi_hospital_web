import Layout from "@/components/layout";

export default {
  path: "/transfer",
  component: Layout,
  meta: { title: "转诊管理" },
  redirect: "/transfer/transferOrders",
  children: [
    {
      path: "hospitalOrders",
      name: "TransferOrders",
      meta: { title: "转诊订单" },
      component: () => import(/* webpackChunkName:"transfer" */"@/views/transfer/TransferOrders")
    },
    {
      path: "order/detail/:orderID",
      name: "OrderDetail",
      props: true,
      meta: { title: "订单详情" },
      component: () => import(/* webpackChunkName:"transfer" */"@/views/transfer/OrderDetail")
    },
    {
      path: "profitRule",
      name: "ProfitRule",
      meta: { title: "转诊分润规则设置" },
      component: () => import(/* webpackChunkName:"transfer" */"@/views/transfer/ProfitRule")
    },
    {
      path: "transferProfitRule",
      name: "transfer-transferProfitRule",
      meta: { title: "转诊分润规则设置" },
      component: () => import(/* webpackChunkName:"transfer" */"@/views/transfer/TransferProfitRule")
    },
    {
      path: "newProfitRule/:keyID/:isUpdate",
      props: true,
      name: "transfer-newProfitRule",
      meta: { title: "分润规则" },
      component: () => import(/* webpackChunkName:"transfer" */"@/views/transfer/NewProfitRule")
    },
    {
      path: "confirmDoctor/:ruleName/:keyID/:orgID",
      name: "confirmDoctor",
      props: true,
      meta: { title: "指定医生" },
      component: () => import(/* webpackChunkName:"transfer" */"@/views/transfer/ConfirmDoctor")
    },
    {
      path: "ruleDetail/:isPlatRule/:keyID",
      name: "transfer-ruleDetail",
      props: true,
      meta: { title: "规则详情" },
      component: () => import(/* webpackChunkName:"transfer" */"@/views/transfer/RuleDetail")
    }

  ]
};
