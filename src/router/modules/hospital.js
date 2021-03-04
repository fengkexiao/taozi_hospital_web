import Layout from "@/components/layout";

export default {
  path: "/hospital",
  component: Layout,
  meta: { title: "医院管理" },
  redirect: "/hospital/hospitalPromote",
  children: [
    {
      path: "hospitalPromote",
      name: "HospitalPromote",
      meta: { title: "医院推广" },
      component: () => import(/* webpackChunkName:"hospital" */"@/views/hospital/HospitalPromote")
    },
    {
      path: "hospitalInformation",
      name: "HospitalInformation",
      meta: { title: "医院信息" },
      component: () => import(/* webpackChunkName:"hospital" */"@/views/hospital/HospitalInformation")
    },
    {
      path: "hospitalSection",
      name: "HospitalSection",
      meta: { title: "科室管理" },
      component: () => import(/* webpackChunkName:"hospital" */"@/views/hospital/HospitalSection")
    },
    {
      path: "hospitalPromoteBack",
      name: "hospitalPromoteBack",
      props: true,
      meta: { title: "报告照片后跳转" },
      component: () => import(/* webpackChunkName:"hospital" */"@/views/hospital/hospitalPromoteBack")
    }

  ]
};
