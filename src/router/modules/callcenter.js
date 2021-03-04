import Layout from "@/components/layout";

export default {
  path: "/callcenter",
  component: Layout,
  meta: { title: "推广管理" },
  // redirect: "/callcenter/callSeat",
  children: [
    {
      path: "callSeat",
      name: "callSeat",
      meta: { title: "坐席管理" },
      component: () => import(/* webpackChunkName:"callcenter" */"@/views/tmcinquiry/callcenter/callSeat")
    },
    {
      path: "seatAllocation/:keyID/:groupName",
      name: "seatAllocation",
      props: true,
      meta: { title: "坐席组分配" }, 
      component: () => import(/* webpackChunkName:"callcenter" */"@/views/tmcinquiry/callcenter/seatAllocation")
    },
    {
      path: "popGroup",
      name: "pop-group",
      meta: { title: "推广组管理" },
      component: () => import(/* webpackChunkName:"callcenter" */"@/views/tmcinquiry/callcenter/popGroup")
    },
    {
      path: "popGroupTeam/:groupID",
      name: "pop-group-team",
      props: true,
      meta: { title: "推广组成员管理" },
      component: () => import(/* webpackChunkName:"callcenter" */"@/views/tmcinquiry/callcenter/popGroupTeam")
    }
  ]
};
