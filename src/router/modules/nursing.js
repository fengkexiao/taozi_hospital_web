import Layout from "@/components/layout";

export default {
  path: "/nursing",
  component: Layout,
  meta: { title: "医护上门" },
  redirect: "/nursing/hospitalOrders",
  children: [
    {
      path: "hospitalOrders",
      name: "nursing-hospitalOrders",
      meta: { title: "护理订单" },
      component: () => import(/* webpackChunkName:"nursing" */"@/views/nursing/HospitalOrders")
    },
    {
      path: "hospitalOrdersList/:keyID",
      name: "nursing-hospitalOrders-hospitalOrdersList",
      props: true,
      meta: { title: "服务列表" },
      component: () => import(/* webpackChunkName:"nursing" */"@/views/nursing/HospitalOrdersList")
    },
    {
      path: "hospitalOrdersDetail/:nursingOrderID",
      name: "nursing-hospitalOrders-hospitalOrdersDetail",
      props: true,
      meta: { title: "订单详情" },
      component: () => import(/* webpackChunkName:"nursing" */"@/views/nursing/HospitalOrdersDetail")
    },
    {
      path: "hospitalPrice",
      name: "nursing-hospitalOrders-hospitalPrice",
      meta: { title: "护理价格" },
      component: () => import(/* webpackChunkName:"nursing" */"@/views/nursing/HospitalPrice")
    }
  ]
};
