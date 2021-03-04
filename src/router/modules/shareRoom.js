import Layout from "@/components/layout";

export default {
  path: "/shareroom",
  component: Layout,
  meta: { title: "共享诊室" },
  redirect: "/shareroom/hospitalRoom",
  children: [
    {
      path: "hospitalRoom",
      name: "room-manage",
      meta: { title: "共享诊室管理" },
      component: () => import(/* webpackChunkName:"shareroom" */"@/views/shareRoom/Room")
    },
    {
      path: "hospitalRoom/edit/:mode/:keyID",
      name: "room-manage-edit",
      props: true, 
      meta: { title: "诊室管理" },
      component: () => import(/* webpackChunkName:"shareroom" */"@/views/shareRoom/RoomEdit")
    }, 
    {
      path: "hospitalRoom/plan/:keyID/:roomName",
      name: "room-manage-plan",
      props: true,
      meta: { title: "设置排期" },
      component: () => import(/* webpackChunkName:"shareroom" */"@/views/shareRoom/RoomPlan")
    },
    {
      path: "doctorHold",
      name: "room-order",
      meta: { title: "医生预订诊室" },
      component: () => import(/* webpackChunkName:"shareroom" */"@/views/shareRoom/Order")
    },
    {
      path: "doctorHold/detail/:roomOrderID/:yearMonth",
      name: "room-order-detail",
      props: true,
      meta: { title: "医生预订详情" },
      component: () => import(/* webpackChunkName:"shareroom" */"@/views/shareRoom/OrderDetail")
    },
    {
      path: "personBook",
      name: "room-book",
      meta: { title: "患者预约到院" },
      component: () => import(/* webpackChunkName:"shareroom" */"@/views/shareRoom/Book")
    },
    {
      path: "personBook/detail/:keyID",
      name: "room-book-detail",
      props: true,
      meta: { title: "预约到院详情" },
      component: () => import(/* webpackChunkName:"shareroom" */"@/views/shareRoom/BookDetail")
    },
    {
      path: "personBook/cost/:mode/:keyID",
      name: "room-book-cost",
      props: true,
      meta: { modeName: { F: "出院结算", R: "重新结算", A: "审核", B: "付款", AD: "审核详情", BD: "付款详情" } },
      component: () => import(/* webpackChunkName:"shareroom" */"@/views/shareRoom/BookCost")
    }
  ]
};
