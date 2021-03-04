// 用户子系统相关api
export default {
  API_LIST_USER: {
    // 获取字典
    INTERFACE_HOSPITAL_DICTIONARY: "api/peachUser/sysdict/list",

    // 获取菜单
    INTERFACE_USER_FEATURES: "api/peachUser/hospitalAuth/getFeatures",
    // 获取全部角色
    INTERFACE_USER_ROLES: "api/peachUser/hospitalAuth/getHospitalRoles",
    // 修改密码
    INTERFACE_USER_CHANGE_PASSWORD: "api/peachUser/hospitalStaff/modifyPass",

    // 医院员工管理
    // 员工查询
    INTERFACE_USER_STAFF_LIST: "api/peachUser/hospitalStaff/getStaffList",
    // 员工启用禁用
    INTERFACE_USER_STAFF_DISABLE: "api/peachUser/hospitalStaff/disableStaff",
    // 单个员工查询
    INTERFACE_USER_STAFF_GET: "api/peachUser/hospitalStaff/getStaffByKeyID",
    // 新增员工
    INTERFACE_USER_STAFF_ADD: "api/peachUser/hospitalStaff/addStaff",
    // 修改员工
    INTERFACE_USER_STAFF_UPDATE: "api/peachUser/hospitalStaff/modifyStaff",
    // 获取医院单个员工的角色
    INTERFACE_USER_STAFFROLE_GET: "api/peachUser/hospitalAuth/getHospitalStaffRoles",
    // 保存员工角色
    INTERFACE_USER_STAFFROLE_SAVE: "api/peachUser/hospitalStaff/saveStaffRoles",

    // 医院医生管理
    // 医生查询
    INTERFACE_USER_DOCTOR_LIST: "api/peachUser/hospitalDoctor/getDoctorList",
    // 单个医生查询
    INTERFACE_USER_DOCTOR_GET: "api/peachUser/hospitalDoctor/getDoctor",
    // 新增医生、护士、药师
    INTERFACE_USER_DOCTOR_ADD: "api/peachUser/hospitalDoctor/addDoctor",
    // 互联网医院新增医生、护士、药师
    INTERFACE_USER_HIDOCTOR_ADD: "api/peachUser/hospitalDoctor/addHiDoctor",
    // 获取验证码
    INTERFACE_USER_DOCTOR_VALICODE_GET: "api/peachUser/hospitalDoctor/valicodeForAddHospitalDoctor",
    // 医生擅长疾信息查询
    INTERFACE_USER_DOCTOR_DISEASE_GET: "api/peachUser/hospitalDoctor/getDoctorDiseaseByDoctorID",
    // 医生、护士、药师实名认证信息查询
    INTERFACE_USER_DOCTOR_CERTIFY_GET: "api/peachUser/doctorCertify/getDoctorInfoByDoctorID",
    // 保存医生工作照
    INTERFACE_USER_DOCTOR_WORKPHOTO_SAVE: "api/peachUser/hospitalDoctor/saveDoctorPhoto",
    // 保存医生信息
    INTERFACE_USER_DOCTOR_INFO_SAVE: "api/peachUser/hospitalDoctor/saveDoctorInfo",
    // 保存擅长疾病信息
    INTERFACE_USER_DOCTOR_DISEASE_SAVE: "api/peachUser/hospitalDoctor/saveDoctorDisease",
    // 保存医生、护士、药师证书信息
    INTERFACE_USER_DOCTOR_CERTIFY_SAVE: "api/peachUser/doctorCertify/saveDoctorCertifyNo",
    // 医生、护士、药师实名认证图片上传
    INTERFACE_USER_DOCTOR_CERTIFY_PHOTO: "api/peachUser/doctorCertify/saveDoctorCertifyPhoto",
    // 删除资质照片
    INTERFACE_USER_DOCTOR_CERTIFY_DEL: "api/peachUser/doctorCertify/deleteDoctorCertifyPhoto",
    // 医生、护士、药师提交审核
    INTERFACE_USER_DOCTOR_REVIEW: "api/peachUser/doctorInfo/commitToReview",

    // 护士查询
    INTERFACE_USER_NURSE_LIST: "api/peachUser/hospitalDoctor/getNurseList",
    // 单个护士查询
    INTERFACE_USER_NURSE_GET: "api/peachUser/hospitalDoctor/getNurse",
    // 保存护士工作照
    INTERFACE_USER_NURSE_WORKPHOTO_SAVE: "api/peachUser/hospitalDoctor/saveNursePhoto",
    // 保存护士信息
    INTERFACE_USER_NURSE_INFO_SAVE: "api/peachUser/hospitalDoctor/saveNurseInfo",

    // 药师查询
    INTERFACE_USER_PHARMACIST_LIST: "api/peachUser/hospitalDoctor/getPharmacistList",
    // 单个药师查询
    INTERFACE_USER_PHARMACIST_GET: "api/peachUser/hospitalDoctor/getPharmacist",
    // 保存药师工作照
    INTERFACE_USER_PHARMACIST_WORKPHOTO_SAVE: "api/peachUser/hospitalDoctor/savePharmacistPhoto",
    // 保存药师信息
    INTERFACE_USER_PHARMACIST_INFO_SAVE: "api/peachUser/hospitalDoctor/savePharmacistInfo",
    // 得到二维码
    INTERFACE_USER_GETQRCODE: "api/peachUser/qrCode/getQrCode",

    // 医院获取签约患者
    API_PEACHUSER_SIGNPATIENT_GETSIGNPATIENT: "api/peachUser/signPatient/getSignPatient",
    // 获取所有医助/医生
    INTERFACE_TMC_POST_ASSISTANT_DOCTOR_LIST: "api/peachUser/hospitalDoctor/getHospitalDoctors",
    // 获取医生医助（TMC没有组别的）
    INTERFACE_TMC_POST_ASSISTANT_DOCTOR: "api/peachUser/hospitalDoctor/getTmcDoctorsGroup",
    // 查询医院员工信息（有医生 医助 jobType 字段）
    INTERFACE_GET_DOCTOR_INFO: "api/peachUser/hospitalStaff/getDoctorInfoByStaffID",

    // 医助分组
    // 获取分组列表
    INTERFACE_TMC_GET_ASSISTANT_GROUP_LIST: "api/peachUser/assistantGroup/list",
    // 添加分组
    INTERFACE_TMC_POST_ASSISTANT_GROUP_ADD: "api/peachUser/assistantGroup/add",
    // 获取分组详情
    INTERFACE_TMC_GET_ASSISTANT_GROUP_DETAIL: "api/peachUser/assistantGroup/get",
    // 编辑分组
    INTERFACE_TMC_POST_ASSISTANT_GROUP_SAVE: "api/peachUser/assistantGroup/save",
    // 启用/禁用分组
    INTERFACE_TMC_POST_ASSISTANT_GROUP_DISABLE: "api/peachUser/assistantGroup/disable",

    // 我的二维码
    INTERFACE_TMC_GET_CODE: "api/peachUser/assistantGroup/getAssistantQR",
    // 修改医院医生科室
    INTERFACE_USER_POST_UPDATEHOSPITALDOCTORBYKEYID: "api/peachUser/hospitalDoctor/updateHospitalDoctorByKeyID",
    // 查询医院医生员工列表
    INTERFACE_USER_GET_ORG_DOCTOR_LIST: "api/peachUser/hospitalStaff/getOrgDoctorList",
    // 根据KeyID查询科室信息
    INTERFACE_GET_HOSPITAL_SECTION: "api/peachUser/hospitalSection/getSectionByKeyID",

    /**
     * -------------------his---------------------
     */
    // 同步科室码表
    // INTERFACE_GET_HIS_SECTIONCODE: "api/peachUser/hisDepartment/getSectionCodeTable",
    // // 同步医生码表
    // INTERFACE_GET_HIS_DOCTORCODE: "api/peachUser/hisDoctor/getDoctorCodeTable",
    // 获取机构下的HIS科室列表
    INTERFACE_GET_HIS_SECTIONLIST: "api/peachUser/hospitalSection/getOrgHisSectionList",
    // 平台医生与his医生信息建立联系
    INTERFACE_GET_HIS_ADDRELATION: "api/peachUser/hisDoctorCode/addRelation",
    // 医生同步
    INTERFACE_GET_HIS_DOCTORCODETABLE: "api/his/hisDoctor/getDoctorCodeTable",
    // 科室同步
    INTERFACE_GET_HIS_SECTIONCODETABLE: "api/his/hisDepartment/getSectionCodeTable",
    // 搜索HIS医生信息
    INTERFACE_GET_HIS_SERACHHISINFO: "api/peachUser/hisDoctorCode/getHisDoctorBySectionIDAndName",
    // 申请签章
    INTERFACE_POST_PEACHUSET_APPLYHISIGN: "api/peachUser/hospitalDoctor/applyHiSign",
    // 获取用户信息
    INTERFACE_GET_PERSONUSERBYPERSON: "api/peachUser/personUser/getPersonUserByPersonID",

  }
};
