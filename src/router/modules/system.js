import Layout from "@/components/layout";

export default {
  path: "/system",
  component: Layout,
  meta: { title: "系统管理" },
  redirect: "/system/tmcPatientLevel",
  children: [
    {
      path: "tmcPatientLevel",
      name: "tmcPatientLevel",
      meta: { title: "患者分级" },
      component: () => import(/* webpackChunkName:"system" */"@/views/tmcinquiry/tmcPatientLevel")
    },
    {
      path: "tmcPhrase",
      name: "tmcPhrase",
      meta: { title: "常用语模板" },
      component: () => import(/* webpackChunkName:"system" */"@/views/tmcinquiry/template/tmcPhrase")
    },
    {
      path: "tmcMaterial",
      name: "tmcMaterial",
      meta: { title: "素材模板" },
      component: () => import(/* webpackChunkName:"system" */"@/views/tmcinquiry/template/tmcMaterial")
    },
    {
      path: "feeItemMng",
      name: "feeItemMng",
      meta: { title: "收费项目管理" },
      component: () => import(/* webpackChunkName:"system" */"@/views/system/feeItemMng")
    },
    {
      path: "hospitalProjectMap/:orgID/:standProjectCode/:addUser",
      name: "hospitalProjectMap",
      props: true,
      meta: { title: "医院项目映射" },
      component: () => import(/* webpackChunkName:"system" */"@/views/system/HospitalProjectMap")
    },
    {
      path: "doctorGroup",
      name: "system-doctorGroup",
      meta: { title: "院外医生分组" },
      component: () => import(/* webpackChunkName:"system" */"@/views/system/DoctorGroup")
    },
    {
      path: "doctorGroupManager/:groupId/:addUser/:groupName",
      name: "system-doctorGroupManager",
      props: true,
      meta: { title: "医生组管理" },
      component: () => import(/* webpackChunkName:"system" */"@/views/system/DoctorGroupManager")
    }
  ]
};
