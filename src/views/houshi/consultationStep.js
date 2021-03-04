export default {
  methods: {
    // 获取 患者病情1~5步的显示与隐藏
    goone() {
      this.one = true;
      this.two = false;
      this.three = false;
      this.four = false;
      this.five = false;
    },
    gotwo() {
      this.one = false;
      this.two = true;
      this.three = false;
      this.four = false;
      this.five = false;
    },
    gothree() {
      this.one = false;
      this.two = false;
      this.three = true;
      this.four = false;
      this.five = false;
    },
    gofour() {
      this.one = false;
      this.two = false;
      this.three = false;
      this.four = true;
      this.five = false;
    },
    gofive() {
      this.one = false;
      this.two = false;
      this.three = false;
      this.four = false;
      this.five = true;
    },
    // 计算风险类型
    countRisk(risk) {
      if (risk === "warning") {
        // 标黄
        return true;
      }
    },
    count(risk) {
      if (risk === "forbidden") {
        // 标红
        return true;
      }
    },
    // 根据订单ID 获取患者信息
    getPatientByOrderID(orderId) {
      let params = {
        orderId: orderId
      };
      let requests = this.$_http.get(this.$_API.API_HOU_ORDER_PATIENTINFO, {
        params
      });
      requests.then(res => {
        if (!res.data) return;
        this.patient = res.data;
        // 获取风险类型
        this.getageRiskType(this.patient.patientAge);
      });
    },
    // 获取年龄风险类型
    getageRiskType(age) {
      let params = {
        age: age
      };
      let requests = this.$_http.get(this.$_API.API_HOU_PATIENT_GETPATIENTAGE, { params });
      requests.then(res => {
        if (!res.data) return;
        this.ageRiskType = res.data;
      });
    },
    // 第二步操作
    // 点击下一步请求辨病基础数据
    getDisease() {
      // 保存 修改就诊患者信息
      let data = {
        keyID: this.patient.keyID,
        modifyUser: this.userInfo.keyID,
        orderID: this.patient.orderID,
        patientAge: this.patient.patientAge,
        patientName: this.patient.patientName,
        patientPhone: this.patient.patientPhone,
        patientSex: this.patient.patientSex
      };
      this.$_http.post(
        this.$_API.API_HOU_PATIENT_UPDATAPATIENTINFO,
        data
      ).then(res => {
        if (!res.data) return;
        let requests = this.$_http.get(this.$_API.API_HOU_BASIC_GETDISEASE);
        requests.then(res => {
          if (!res.data) return;
          // 获取辨病基础数据
          this.disease = res.data;
          // 跳转第二步界面
          this.gotwo();
          // 获取订单数据
          this.getRead();
        });
      });
    },
    // 获取订单其他信息
    getRead() {
      let params = {
        keyID: this.orderId
      };
      this.tableLoading = true;
      let requests = this.$_http.get(this.$_API.API_HOU_ORDER_READ, {
        params
      });
      requests.then(res => {
        if (!res.data) return;
        this.orderInfo = res.data;
        // 计算辨病结果
        this.countSelect(this.orderInfo, this.disease);
      });
    },
    // 计算辨病数据选中
    countSelect(orderInfo, disease) {
      for (let i = 0; i < disease.length; i++) {
        let dis = disease[i];
        if (orderInfo.diseaseCode === dis.diseaseCode) {
          this.diseaseCode = orderInfo.diseaseCode;
        }
      }
    },
    // 第三步
    getHistortClassify() {
      // 先更新第二步请求的数据
      let orderDis = {
        "sign": 1,
        "diseaseCode": this.diseaseCode,
        "keyID": this.orderId,
        "modifyUser": this.userInfo.keyID
      };
      this.$_http.post(this.$_API.API_HOU_TREAT_MODIFYORDERDISEASE, { ...orderDis }).then(res => {
        // 跳转第三个界面
        this.gothree();
        // 获取基础数据
        this.getClassify();
      });
    },
    // 获取第三步基础数据
    getClassify() {
      this.historyGroup = [];
      this.$_http.get(this.$_API.API_HOU_HISTORY_CLASSIFY).then(res => {
        if (!res.data) return;
        // 病史基础类别
        this.historyClass = res.data;
        // 根据分组获取分组数据
        for (let i = 0; i < this.historyClass.length; i++) {
          let clas = this.historyClass[i];
          let params = {
            classifyCode: clas.classifyCode
          };
          // 根据类别获取分组
          this.$_http.get(this.$_API.API_HOU_BASIC_GETHISTORYGROUP, { params }).then(res => {
            if (!res.data) return;
            this.historyGroup.push({
              key: clas.classifyCode,
              value: res.data
            });
          });
        }
        // 获取以前病史版本数据
        this.getShowHistory();
      });
    },
    // 获取展示数据
    getShowHistory() {
      let params = {
        patientID: this.orderInfo.patientID
      };
      this.$_http.get(this.$_API.API_HOU_PATIENT_GETSHOWHISTORY, { params }).then(res => {
        if (!res.data) return;
        this.showData = res.data;
      });
    },
    // 获取基础渲染数据
    getHistoryItem(group) {
      let params = {
        groupCode: group.groupCode
      };
      this.$_http.get(this.$_API.API_HOU_BASIC_GETHISTORYITEM, { params }).then(res => {
        if (!res.data) return;
        this.dialog = true;
        this.historyItemSon = res.data;
        // 获取上个版本选择的数据
        if (group.valueType === 1) {
          this.inputFrame(group);
        } else {
          this.selectFrame(group);
        }
      });
    },
    // 第三步的选择弹框 数据
    selectFrame(group) {
      // 获取原始数据 (选择框的数据)
      this.groupName = group.groupName;
      this.checkList = [];
      let params = {
        patientID: this.orderInfo.patientID,
        groupCode: group.groupCode
      };
      this.$_http.get(this.$_API.API_HOU_PATIENT_GETHISTORYBYGROUPCODE, { params }).then(res => {
        if (!res.data) return;
        this.selectData = res.data.patientHistoryItems;
        this.summaryKeyID = res.data.summaryKeyID;
        // 计算选中数据
        for (let i = 0; i < this.selectData.length; i++) {
          this.checkList.push(this.selectData[i].itemCode);
        }
        for (let i1 = 0; i1 < this.historyItemSon.length; i1++) {
          let son = this.historyItemSon[i1];
          this.historyItemSon[i1].sign = false;
          for (let i2 = 0; i2 < this.checkList.length; i2++) {
            let check = this.checkList[i2];
            if (son.value === check && son.valueType === 1) {
              this.historyItemSon[i1].sign = true;
            }
          }
        }
      });
    },
    // 文本数据
    inputFrame(group) {
      this.groupName = group.groupName;
      let params = {
        patientID: this.orderInfo.patientID,
        groupCode: group.groupCode
      };
      this.$_http.get(this.$_API.API_HOU_PATIENT_GETHISTORYGROUPBYGROUPCODE, { params }).then(res => {
        if (!res.data) return;
        this.dialog1 = true;
        this.inputData = res.data;
      });
    },
    addHistoryItems(vue) {
      // 选中数据与原始数据进行比对
      let delet = [];
      let update = [];
      let addData = [];
      let groupCod;
      let add = [];
      for (let i4 = 0; i4 < vue.length; i4++) {
        let son = vue[i4];
        groupCod = son.groupCode;
      }
      if (this.selectData.length === 0) {
        for (let i4 = 0; i4 < this.historyItemSon.length; i4++) {
          let son = this.historyItemSon[i4];
          groupCod = son.groupCode;
          for (let i5 = 0; i5 < this.checkList.length; i5++) {
            let check = this.checkList[i5];
            if (check === son.value) {
              addData.push(son);
            }
          }
        }
      } else if (this.checkList.length === 0) {
        // 判断原始是否有数据  有全部删除
        if (this.selectData.length === 0) {
          return;
        }
        for (let i2 = 0; i2 < this.selectData.length; i2++) {
          delet.push(this.selectData[i2]);
        }
      } else {
        // 1.先根据选中的数据  获取相应的基础数据
        for (let i4 = 0; i4 < this.historyItemSon.length; i4++) {
          let son = this.historyItemSon[i4];
          groupCod = son.groupCode;
          for (let i5 = 0; i5 < this.checkList.length; i5++) {
            let check = this.checkList[i5];
            if (check === son.value) {
              add.push(son);
            }
          }
        }
        // 添加
        for (let i = 0; i < add.length; i++) {
          let sign = false;
          let check = add[i];
          for (let i3 = 0; i3 < this.selectData.length; i3++) {
            let slesct = this.selectData[i3];
            if (check.value === slesct.itemCode) {
              sign = true;
              break;
            }
          }
          if (!sign) {
            addData.push(check);
          }
        }
        // 删除
        for (let i = 0; i < this.selectData.length; i++) {
          let sign = false;
          let slesct = this.selectData[i];
          for (let i3 = 0; i3 < add.length; i3++) {
            let check = add[i3];
            if (check.value === slesct.itemCode) {
              sign = true;
              break;
            }
          }
          if (!sign) {
            delet.push(slesct);
          }
        }
        // 修改
        for (let i = 0; i < add.length; i++) {
          let check = add[i];
          if (check.valueType === 1) {
            for (let i9 = 0; i9 < this.selectData.length; i9++) {
              let select = this.selectData[i9];
              if (check.value === select.itemCode) {
                update.push(select);
              }
            }
          }
        }
      }
      let data = {
        "sign": 1,
        "patientId": this.orderInfo.patientID,
        "orderId": this.orderId,
        "summId": this.summaryKeyID,
        "user": this.userInfo.keyID,
        "groupCode": groupCod,
        "newMap": {
          "add": addData,
          "delete": delet,
          "update": update
        }
      };
      this.$_http.post(
        this.$_API.API_HOU_TREAT_ADDHISTORYITEMS,
        data
      ).then(res => {
        this.dialog = false;
        // 加载第三步
        this.getShowHistory();
      });
    },
    // 修改第三部数据
    updateHistoryGroups() {
      let data = {
        "sign": 1,
        "patientId": this.orderInfo.patientID,
        "orderId": this.orderId,
        "summId": this.inputData.summaryID,
        "user": this.userInfo.keyID,
        "groupCode": this.inputData.groupCode,
        "keyId": this.inputData.keyID,
        "valueDesc": this.inputData.valueDesc
      };
      this.$_http.post(
        this.$_API.API_HOU_TREAT_UPDATEHISTORYGROUPS,
        data
      ).then(res => {
        this.dialog1 = false;
        // 加载第三步
        this.getShowHistory();
      });
    },
    // 第四部辩病论治
    argueDiseaseTreatment() {
      let params = {
        diseaseCode: this.diseaseCode
      };
      let requests = this.$_http.get(
        this.$_API.API_HOU_ARGUE_DISEASETREATMENT, {
          params
        }
      );
      requests.then(res => {
        if (!res.data) return;
        this.argueDisease = res.data;
        this.gofour();
        // 计算病症选中
        this.readSymptom1();
      });
    },
    countDis() {
      this.dsiCheckList = [];
      // 给病症多选赋值
      if (this.readSymptom.items.length !== 0) {
        this.readSymptom.items.forEach(dis => {
          this.dsiCheckList.push(dis.symptomCode);
        });
      }
    },
    // 读取病症选中数据
    readSymptom1() {
      let params = {
        orderID: this.orderId
      };
      let requests = this.$_http.get(
        this.$_API.API_HOU_ORDER_READSYMPTOM, {
          params
        }
      );
      requests.then(res => {
        if (!res.data) return;
        this.readSymptom = res.data;
        this.countDis();
      });
    },
    // 保存辩证结果项
    addSymptom() {
      let symptomItems = [];
      for (let i = 0; i < this.dsiCheckList.length; i++) {
        let dsi = this.dsiCheckList[i];
        for (let j = 0; j < this.argueDisease.length; j++) {
          let arg = this.argueDisease[j];
          if (dsi === arg.symptomCode) {
            symptomItems.push(arg);
            break;
          }
        }
      }
      let data = {
        "sign": 1,
        "patientId": this.orderInfo.patientID,
        "orderID": this.orderId,
        "user": this.userInfo.keyID,
        "diseaseCode": this.orderInfo.diseaseCode,
        "symptomItems": symptomItems
      };
      this.$_http.post(
        this.$_API.API_HOU_TREAT_ADDSYMPTOM,
        data
      ).then(res => {
        this.kindCode = res.data[0].kindCode;
        // 获取一次订单信息
        this.getRead();
        // 获取当前订单下的处方
        this.getOrdetrRP();
        this.gofive();
        // 根据病种Code 病症Code 获取数据
        let params = {
          diseaseCode: this.diseaseCode,
          kindCode: this.kindCode
        };
        this.$_http.get(
          this.$_API.API_HOU_BASIC_GETKINDNAMEBYDISCODE, {
            params
          }
        ).then(res => {
          if (!res.data) return;
          this.disKin = res.data;
        });
      });
    },
    // 获取订单有无处方
    getOrdetrRP() {
      let params = {
        orderID: this.orderId
      };
      this.$_http.get(
        this.$_API.API_HOU_ORDER_READRP, {
          params
        }
      ).then(res => {
        if (!res.data) return;
        if (res.data.treatRpAddress.address === undefined) {
          res.data.treatRpAddress.address = "";
        }
        if (res.data.treatRpAddress.contacts === undefined) {
          res.data.treatRpAddress.contacts = "";
        }
        if (res.data.treatRpAddress.phone === undefined) {
          res.data.treatRpAddress.phone = "";
        }
        // 处方总表数据
        this.treatRpSummary = res.data.treatRpSummary || {};
        // 处方地址数据
        this.treatRpAddress = res.data.treatRpAddress;
        // 处方药品数据
        this.treatRpMedicines = res.data.treatRpMedicines || [];
        if (this.treatRpAddress) {
          let provinceCode = this.treatRpAddress.provinceCode;
          let cityCode = this.treatRpAddress.cityCode;
          let areaCode = this.treatRpAddress.areaCode;
          let province = this.treatRpAddress.provinceName;
          let city = this.treatRpAddress.cityName;
          let area = this.treatRpAddress.areaName;
          let place = [provinceCode, cityCode, areaCode];
          this.treatRpAddress.place = place;
          this.treatRpAddress.province = province;
          this.treatRpAddress.city = city;
          this.treatRpAddress.area = area;
        }
      });
    },
    minusSign(medicinces) {
      // 减少药品
      for (let i = 0; i < this.treatRpMedicines.length; i++) {
        let rpmedic = this.treatRpMedicines[i];
        if (medicinces.medicineCode === rpmedic.medicineCode) {
          if (i === 0) {
            this.treatRpMedicines.splice(i, 1);
            break;
          }
          this.treatRpMedicines.splice(i, i);
        }
      }
    },
    handleChange() {
      let node3 = this.$refs.place.getCheckedNodes();
      if (node3.length === 0) {
        return;
      }
      let node2 = node3[0].parent;
      let node1 = node2.parent;
      this.treatRpAddress.area = node3[0].label;
      this.treatRpAddress.areaCode = node3[0].value;
      this.treatRpAddress.city = node2.label;
      this.treatRpAddress.cityCode = node2.value;
      this.treatRpAddress.province = node1.label;
      this.treatRpAddress.provinceCode = node1.value;
    },
    // 模板开方
    templatePrescribing() {
      this.dialogVisible = true;
      let params = {
        diseaseCode: this.orderInfo.diseaseCode,
        kindCode: this.orderInfo.kindCode
      };
      let requests = this.$_http.get(this.$_API.API_HOU_TEMPLATES_EVOLUTIONS, {
        params
      });
      requests.then(res => {
        if (!res.data) return;
        this.tableData = res.data.data;
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => { });
    },
    // 模板开方 选择
    goPatientContrasr(val) {
      // 获取模版开方数据
      let params = {
        kindCode: val.kindCode,
        rpCode: val.rpCode
      };
      let requests = this.$_http.get(this.$_API.API_HOU_MEDICINE_GETSYMPTOMMEDICINE, {
        params
      });
      requests.then(res => {
        if (!res.data) return;
        // 比对数据 不重复添加 追加数量
        if (this.treatRpMedicines.length > 0) {
          let fig = false;
          for (let i = 0; i < this.treatRpMedicines.length; i++) {
            let rpmedic = this.treatRpMedicines[i];
            for (let j = 0; j < res.data.length; j++) {
              let medicince = res.data[j];
              if (rpmedic.medicineCode === medicince.medicineCode) {
                rpmedic.amount += medicince.amount;
                fig = true;
              }
            }
          }
          if (fig === false) {
            res.data.forEach(it => {
              this.treatRpMedicines.push(it);
            });
          }
        } else {
          this.treatRpMedicines = res.data;
        }
        this.dialogVisible = false;
      });
    },
    addRp() {
      // 获取模版开方数据
      for (let i = 0; i < this.treatRpMedicines.length; i++) {
        let treat = this.treatRpMedicines[i];
        if (treat.doseDayTimes === undefined) {
          treat.doseDayTimes = treat.usageAmount;
        }
      }
      let data = {
        orderID: this.orderId,
        user: this.userInfo.keyID,
        kindCode: this.kindCode,
        rpCode: "",
        treatRpSummary: {
          rpDoctorType: 1,
          doctorID: this.userInfo.keyID,
          doctorName: this.userInfo.staffName
        },
        treatRpAddress: {
          postcode: "",
          provinceName: this.treatRpAddress.province,
          provinceCode: this.treatRpAddress.provinceCode,
          cityName: this.treatRpAddress.city,
          cityCode: this.treatRpAddress.cityCode,
          areaName: this.treatRpAddress.area,
          areaCode: this.treatRpAddress.areaCode,
          address: this.treatRpAddress.address,
          phone: this.treatRpAddress.phone,
          contacts: this.treatRpAddress.contacts
        },
        "treatRpMedicines": this.treatRpMedicines
      };
      let requests = this.$_http.post(this.$_API.API_HOU_TREAT_ADDRP, data);
      requests.then(res => {
        // 跳转等待界面
        this.$_success("处方出具成功...");
        // 数据清空
        this.$refs.fromPharmacist.resetFields();
      });
    },
    // 添加药品
    addDrug() {
      let params = {
        pageSize: 10,
        pageIndex: 1
      };
      let requests = this.$_http.get(this.$_API.API_HOU_MEDICINE_LIST, {
        params
      });
      requests.then(res => {
        if (!res.data) return;
        this.dialogmedic = true;
        res.data.datas.forEach(it => {
          it.amount = 1;
        });
        this.tableData1 = res.data.datas;
        this.pageInfo = res.data.pageInfo;
      });
    },
    // 点击选择药品
    choiceDrugs(row) {
      let fig = false;
      for (let i = 0; i < this.treatRpMedicines.length; i++) {
        let treat = this.treatRpMedicines[i];
        if (row.medicineCode === treat.medicineCode) {
          treat.amount += 1;
          fig = true;
          break;
        }
      }
      if (fig === false) {
        this.treatRpMedicines.push(row);
      }
      this.dialogmedic = false;
    },
    // 验证表单
    validate() {
      let _this = this;
      _this.$refs.fromPharmacist.validate(valid => {
        // 检查表单：药师信息
        if (!valid) {
          return;
        }
        _this.addRp();
      });
    },
    // 修改医生响应状态
    responseInquiry() {
      let _this = this;
      let inquiryRecord = {
        keyID: _this.inquiryId
      };
      let data = inquiryRecord;
      _this.$_http
        .post(_this.$_API.API_RP_INQUIRY_RESPONSEINQUIRY, data)
        .then(res => {
        });
    }
  }
};
