export default [
  {
    path: "/home",
    name: "home",
    meta: { title: "首页", icon: "home" }
  },
  {
    path: "/user",
    meta: {
      title: "用户管理",
      icon: "user"
    },
    children: [
      {
        path: "staff",
        meta: {
          title: "员工管理",
          icon: "user-staff"
        }
      },
      {
        path: "doctor",
        meta: {
          title: "医生管理",
          icon: "user-doctor"
        }
      },
      {
        path: "nurse",
        meta: {
          title: "护士管理",
          icon: "user-nurse"
        }
      },
      {
        path: "pharmacist",
        meta: {
          title: "药师管理",
          icon: "user-pharmacist"
        }
      },
      {
        path: "shareHospital",
        meta: {
          title: "共享医院",
          icon: "user-hospital"
        }
      }
    ]
  },
  {
    path: "/shareroom",
    meta: {
      title: "共享诊室",
      icon: "shareroom"
    },
    children: [
      {
        path: "hospitalRoom",
        meta: {
          title: "共享诊室管理",
          icon: "shareroom-hospitalRoom"
        }
      },
      {
        path: "doctorHold",
        meta: {
          title: "医生预定诊室",
          icon: "shareroom-doctorHold"
        }
      },
      {
        path: "personBook",
        meta: {
          title: "患者预约到院",
          icon: "shareroom-personBook"
        }
      }
    ]
  },
  {
    path: "/nursing",
    meta: {
      title: "医护上门"
      // icon: "nursing"
    },
    children: [
      {
        path: "hospitalOrders",
        meta: {
          title: "护理订单"
          // icon: "nursing-hospitalOrders"
        }
      },
      {
        path: "hospitalPrice",
        meta: {
          title: "护理价格管理"
          // icon: "nursing-hospitalPrice"
        }
      }
    ]
  }
];
