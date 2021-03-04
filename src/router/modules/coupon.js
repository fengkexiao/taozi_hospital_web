import Layout from "@/components/layout";

export default {
  path: "/activity",
  component: Layout,
  meta: { title: "优惠活动" },
  children: [
    {
      path:"coupon",
      name:"coupon",
      props: true,
      meta: {
        title: "优惠券"
      },
      component: () => import(/* webpackChunkName:"activity" */'@/views/coupon/coupon')
    },
    {
      path:"add",
      name:"add",
      props: true,
      meta: {
        title: "新增优惠券"
      },
      component: () => import(/* webpackChunkName:"activity" */'@/views/coupon/aEtLk')
    },
    {
      path:"edit/:id",
      name:"edit",
      props: true,
      meta: {
        title: "修改优惠券"
      },
      component: () => import(/* webpackChunkName:"activity" */'@/views/coupon/aEtLk')
    },
    {
      path:"view/:id",
      name:"view",
      props: true,
      meta: {
        title: "预览优惠券"
      },
      component: () => import(/* webpackChunkName:"activity" */'@/views/coupon/aEtLk')
    }
  ]
}
