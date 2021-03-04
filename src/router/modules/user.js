import Layout from "@/components/layout";

export default {
  path: "/user",
  component: Layout,
  meta: { title: "用户管理" },
  redirect: "/user/staff",
  children: [
    {
      path: "staff",
      name: "user-staff",
      meta: { title: "员工管理" },
      component: () => import(/* webpackChunkName:"user" */"@/views/user/Staff")
    },
    {
      path: "staff/edit/:mode/:keyID",
      name: "user-staff-edit",
      props: true,
      meta: { title: "员工管理", modeName: { E: "认证" } },
      component: () => import(/* webpackChunkName:"user" */"@/views/user/StaffEdit")
    },
    {
      path: "doctor",
      name: "user-doctor",
      meta: { title: "医生管理" },
      component: () => import(/* webpackChunkName:"user" */"@/views/user/Doctor")
    },
    {
      path: "doctor/edit/:mode/:keyID/:backUrl",
      name: "user-doctor-edit",
      props: true,
      meta: { title: "医生管理", modeName: { C: "认证", E: "认证" } },
      component: () => import(/* webpackChunkName:"user" */"@/views/user/DoctorEdit")
    },
    {
      path: "nurse",
      name: "user-nurse",
      meta: { title: "护士管理" },
      component: () => import(/* webpackChunkName:"user" */"@/views/user/Nurse")
    },
    {
      path: "nurse/edit/:mode/:keyID",
      name: "user-nurse-edit",
      props: true,
      meta: { title: "护士管理", modeName: { C: "认证", E: "认证" } },
      component: () => import(/* webpackChunkName:"user" */"@/views/user/NurseEdit")
    },
    {
      path: "pharmacist",
      name: "user-pharmacist",
      meta: { title: "药师管理" },
      component: () => import(/* webpackChunkName:"user" */"@/views/user/Pharmacist")
    },
    {
      path: "pharmacist/edit/:mode/:keyID",
      name: "user-pharmacist-edit",
      props: true,
      meta: { title: "药师管理", modeName: { C: "认证", E: "认证" } },
      component: () => import(/* webpackChunkName:"user" */"@/views/user/PharmacistEdit")
    },
    {
      path: "practiceDoctor",
      name: "user-practice-doctor",
      meta: { title: "多点执业医生" },
      component: () => import(/* webpackChunkName:"user" */"@/views/user/PracticeDoctor")
    },
    {
      path: "shareHospital",
      name: "user-hospital",
      meta: { title: "共享医院" },
      component: () => import(/* webpackChunkName:"user" */"@/views/user/ShareHospital")
    },
    {
      path: "shareHospital/edit/:mode/:keyID",
      name: "user-hospital-edit",
      props: true,
      meta: { title: "共享医院" },
      component: () => import(/* webpackChunkName:"user" */"@/views/user/ShareHospitalEdit")
    },
    {
      path: "doctor/code/:keyID",
      name: "user-doctor-code",
      props: true,
      meta: { title: "二维码" },
      component: () => import(/* webpackChunkName:"user" */"@/views/user/qrCode")
    },
    {
      path: "signPatient",
      name: "signPatient",
      props: true,
      meta: { title: "签约患者管理" },
      component: () => import(/* webpackChunkName:"user" */"@/views/user/SignPatient")
    },
    {
      path: "tmcpatient",
      name: "tmc-patient",
      meta: { title: "患者管理" },
      component: () => import("@/views/tmcinquiry/tmcpatient")
    },
    {
      path: "addPatient/:keyID/:orgID/:state",
      name: "addPatient",
      props: true,
      meta: { title: "患者信息" },
      component: () => import("@/views/tmcinquiry/AddPatient")
    },
    {
      path: "TMCInquiry-HelthyIndex",
      name: "TMCInquiry-HelthyIndex",
      props: true,
      meta: { title: "患者档案" },
      component: () => import("@/views/tmcinquiry/HelthyDossier/HelthyIndex")
    },
    {
      path: "assisGroup",
      name: "assisGroup",
      meta: { title: "IP医生分组" },
      component: () => import("@/views/tmcinquiry/assisGroup")
    },
    {
      path: "assisGroupEdit/edit/:mode/:keyID",
      name: "assisGroupEdit",
      props: true,
      meta: { title: "IP医生分组详情", modeName: { C: "添加", E: "编辑" } },
      component: () => import("@/views/tmcinquiry/assisGroupEdit")
    }
  ]
};
