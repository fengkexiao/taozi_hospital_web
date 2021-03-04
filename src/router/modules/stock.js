import Layout from "@/components/layout";

export default {
  path: "/stock",
  component: Layout,
  meta: { title: "库存管理" },
  children: [
    {
      path:"stockStatus",
      name:"stockStatus",
      props: true,
      meta: {
        title: "库存状态"
      },
      component: () => import(/* webpackChunkName:"stock" */'@/views/stock/stock')
    }
    ]
}
