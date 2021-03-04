import Layout from "@/components/layout";

export default {
  path: "/content",
  component: Layout,
  meta: { title: "内容管理" },
  // redirect: "/content/staff",
  children: [
    // 展示医生
    {
      path: "tmcDoctorShow",
      name: "tmcDoctorShow",
      meta: { title: "展示医生" },
      component: () => import(/* webpackChunkName:"content" */"@/views/tmcinquiry/content/TMCDoctorShow")
    },
    // 康复案例
    {
      alias: "tmcInquiryCase/:isLoad",
      path: "tmcInquiryCase",
      name: "content-tmcInquiryCase",
      meta: { title: "康复案例" },
      props: true,
      component: () => import(/* webpackChunkName:"content" */"@/views/tmcinquiry/content/TMCInquiryCase")
    },
    // 患者分享
    {
      alias: "tmcInquiryCase/:isLoad",
      path: "tmcPatientShare",
      name: "content-tmcPatientShare",
      meta: { title: "患者分享" },
      props: true,
      component: () => import(/* webpackChunkName:"content" */"@/views/tmcinquiry/content/TMCPatientShare")
    },
    // 文章管理
    {
      alias: "tmcInquiryCase/:isLoad",
      props: true,
      path: "tmcArticle",
      name: "content-tmcArticle",
      meta: { title: "文章管理" },
      component: () => import(/* webpackChunkName:"content" */"@/views/tmcinquiry/content/TMCArticle")
    },
    // 文章评论
    {
      path: "tmcArticleComment",
      name: "content-tmcArticleComment",
      meta: { title: "文章评论" },
      component: () => import(/* webpackChunkName:"content" */"@/views/contentaudit/contentaudit")
    },
    // 患者评价
    {
      path: "tmcDoctorComment",
      name: "content-tmcDoctorComment",
      meta: { title: "患者评价" },
      component: () => import(/* webpackChunkName:"content" */"@/views/tmcinquiry/content/TMCDoctorComment")
    },
    // 添加康复案例
    {
      alias: "addInquiryCase/:keyID/:isEdit",
      path: "addInquiryCase",
      name: "content-addInquiryCase",
      meta: { title: "添加、编辑康复案例" },
      props: true,
      component: () => import(/* webpackChunkName:"content" */"@/views/tmcinquiry/content/AddInquiryCase")
    },
    // 添加文章界面
    {
      alias: "addArticle/:keyID/:isEdit",
      path: "addArticle",
      name: "content-addArticle",
      meta: { title: "添加、编辑文章" },
      props: true,
      component: () => import(/* webpackChunkName:"content" */"@/views/tmcinquiry/content/AddArticle")
    },
    // 添加患者分享
    {
      alias: "addPatientShare/:keyID",
      path: "addPatientShare",
      name: "content-addPatientShare",
      meta: { title: "添加、编辑患者分享" },
      props: true,
      component: () => import(/* webpackChunkName:"content" */"@/views/tmcinquiry/content/AddPatientShare")
    }
  ]
};
