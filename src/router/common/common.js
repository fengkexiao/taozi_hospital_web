import Layout from "@/components/layout";
import NotFound from "@/components/not-found";

export default [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        component: () => import(/* webpackChunkName:"home" */"@/views/Home"),
        name: "home",
        meta: { title: "首页" }
      }
    ]
  },
  {
    path: "*",
    name: "error",
    component: NotFound
  }
];
