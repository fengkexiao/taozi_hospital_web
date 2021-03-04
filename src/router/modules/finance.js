import Layout from "@/components/layout";

export default {
  path: "/finance",
  component: Layout,
  meta: { title: "财务管理" },
  redirect: "/finance/financeAccount",
  children: [
    {
      path: "financeAccount",
      name: "finance-financeAccount",
      props: true,
      meta: { title: "资金账户" },
      component: () => import(/* webpackChunkName:"finance" */"@/views/finance/FinanceAccount")
    },
    {
      path: "roomSettle",
      name: "finance-roomSettle",
      meta: { title: "共享诊室结算审核" },
      component: () => import(/* webpackChunkName:"finance" */"@/views/shareRoom/RoomSettle")
    },
    {
      path: "roomPay",
      name: "finance-roomPay",
      meta: { title: "共享诊室付款" },
      component: () => import(/* webpackChunkName:"finance" */"@/views/shareRoom/RoomPay")
    },
    {
      path: "examinePay", 
      name: "finance-examinePay",
      meta: { title: "检查单出纳付款" },
      component: () => import(/* webpackChunkName:"finance" */"@/views/examine/ExaminePay")
    },
    {
      path: "examineSettle",
      name: "finance-examineSettle",
      meta: { title: "检查单结算" },
      component: () => import(/* webpackChunkName:"finance" */"@/views/examine/ExamineSettle")
    },
    {
      path: "transferPay",
      name: "TransferPay",
      meta: { title: "转诊出纳付款" },
      component: () => import(/* webpackChunkName:"finance" */"@/views/transfer/TransferPay")
    },
    {
      path: "OrderDetailForFinance/:orderID/:address",
      name: "OrderDetailForFinance",
      props: true,
      meta: { title: "订单财务详情" },
      component: () => import(/* webpackChunkName:"finance" */"@/views/transfer/OrderDetailForFinance")
    },
    {
      path: "transferSettle",
      name: "TransferSettle",
      meta: { title: "转诊结算审核" },
      component: () => import(/* webpackChunkName:"finance" */"@/views/transfer/TransferSettle")
    },
    {
      alias: "tmcOrders/:sign",
      props: true,
      path: "tmcOrders",
      name: "finance-examine",
      meta: { title: "订单审核" },
      component: () => import(/* webpackChunkName:"finance" */"@/views/finance/TmcOrdersExamine")
    },
    {
      path: "ToExamine/:orderID/:sign/:route",
      props: true,
      name: "to-Examine",
      meta: { title: "订单详情" },
      component: () => import(/* webpackChunkName:"finance" */"@/views/finance/ToExamine")
    },
    {
      path: "doctorFinancial",
      name: "finance-doctorFinancial",
      props: true,
      meta: { title: "医生明细" },
      component: () => import(/* webpackChunkName:"finance" */"@/views/finance/DoctorFinancial")
    },
    {
      path: "doctorFinancialDetails/:totalAmount/:doctorID",
      name: "finance-doctorFinancialDetails",
      props: true,
      meta: { title: "个人收支明细" },
      component: () => import(/* webpackChunkName:"finance" */"@/views/finance/DoctorFinancialDetails")
    }
  ]
};
