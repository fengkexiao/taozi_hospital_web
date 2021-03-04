import Layout from "@/components/layout";

export default {
  path: "/rational",
  component: Layout,
  meta: {
    title: "云处方"
  },
  children: [
    {
      path: "medicineRule",
      name: "medicineRule",
      props: true,
      meta: { title: "药品字典管理" },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/drugDictionary")
    },
    {
      path: "drugInstructions",
      name: "drugInstructions",
      props: true,
      meta: { title: "药品说明书" },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/drugInstructions")
    },
    {
      path: "medicineInteraction",
      name: "medicineInteraction",
      meta: { title: "相互作用管理" },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/roleDrugsManage")
    },
    {
      path: "report",
      name: "ruleManagement",
      props: true,
      meta: { title: "合理用药管理" },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/ruleManagement")
    },
    {
      path: "ruleManagementEdit/:mode/:keyID",
      name: "ruleManagementEdit",
      props: true,
      meta: { title: "合理用药管理" ,modeName: { C: "", E: "" }},
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/ruleManagementEdit")
    },
    {
      path: "speechcraft",
      name: "speechcraft",
      meta: { title: "话术库" },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/speechcraftClass")
    },
    {
      path: "speechcraftScenePage/:speechcraftClass/:speechcraftType",
      name: "speechcraftScenePage",
      props: true,
      meta: { title: "话术库类型场景" },
      component: () => import(/* webpackChunkName:"rp" */"@/views/rp/speechcraftScenePage")
    }
  ]
};
