export default {
  methods: {
    // 获取患者信息
    getPersonUserByPersonID(personID) {
      let _this = this;
      let params = {
        personID: personID
      };
      _this.$_http.get(_this.$_API.API_PEACHUSER_PERSONUSER_GETPERSONUSERBYPERSONID,
        { params })
        .then(res => {
          if (!res.data) return;
          console.log("患者信息", res.data);
          res.data.allergyHistory = "";
          res.data.primaryDiagnosis = "";
          res.data.enjoin = "";
          console.log(res.data.personName);
          _this.patientInfo = {
            ...res.data,
            patientName: res.data.personName,
            patientIdNo: res.data.idNumber,
            patientPhone: res.data.phone
          };
          _this.radio = res.data.sex;
          const info = {
            faceImage: res.data.faceImage,
            phone: res.data.phone,
            medicineName: _this.medicineName
          };
          _this.handleVideo(true, {
            info,
            receive: this.receive,
            refuse: this.refuse
          });
        });
    },
    // 获取患者id + 药品信息
    getPrescribe(inquiryId) {
      let _this = this;
      _this.medicineName = "";
      _this.goodsId = [];
      _this.medicineId = [];
      _this.medicineCount = [];
      let params = {
        inquiryID: inquiryId
      };
      _this.$_http.get(_this.$_API.API_RP_INQUIRY_GETPRESCRIBE,
        { params })
        .then(res => {
          if (!res.data) return;
          _this.inquiryRecord = res.data;
          // 拆分用药信息
          let medJson = JSON.parse(_this.inquiryRecord.medicineInfo);
          medJson.medicineList.forEach(medicine => {
            _this.medicineName += "," + medicine.medicineName;
            _this.goodsId.push(medicine.goodsID);
            _this.medicineId.push(medicine.medicineID);
            let count = {
              medicineID: medicine.medicineID,
              medicineAmount: medicine.itemCount
            };
            _this.medicineCount.push(count);
          });
          _this.medicineName = _this.medicineName.slice(1, _this.medicineName.lenth);
          _this.providerType = medJson.providerType;
          _this.providerID = medJson.providerID;
          if (medJson.personID !== "") {
            _this.getPersonUserByPersonID(medJson.personID);
          }
        });
    },
    // 开具处方
    makeRp() {
      let _this = this;
      let medicines = [];
      for (let i = 0; i < _this.medicineInfo.length; i++) {
        let medicineInfo = _this.medicineInfo[i];
        let medicine = {};
        medicine.medicineID = medicineInfo.medicineID;
        medicine.goodsID = medicineInfo.goodsId;
        medicine.medicineName = medicineInfo.medicineName;
        medicine.specification = medicineInfo.productSpec;
        medicine.medicineAmount = medicineInfo.medicineAmount;
        medicine.unit = medicineInfo.productUnit;
        medicine.unitPrice = medicineInfo.price;
        medicine.takeDirection = medicineInfo.takeDirection;
        medicine.takeFrequence = medicineInfo.takeFrequence;
        medicine.medicineClassID = medicineInfo.medicineClass;
        medicine.medicineClassName = _this.formatClass(medicineInfo.medicineClass);
        medicine.formType = medicineInfo.formType;
        medicine.drugCode = medicineInfo.approveNo;
        // 服用剂量
        medicine.takeDose = medicineInfo.takeDose;
        // 疗程
        medicine.course = 0;
        // 备注
        medicine.memo = "";
        medicines.push(medicine);
      }
      _this.patientInfo.medicalHistory = "";
      _this.patientInfo.keyID = _this.inquiryRecord.patientID;
      _this.patientInfo.patientSex = _this.radio;
      if (_this.historyOfAllergy === 2) {
        _this.patientInfo.historyOfAllergy = "否";
      } else {
        _this.patientInfo.historyOfAllergy = "是";
      }
      let data = {
        recordID: _this.inquiryId,
        clientID: "19100717375019793291301001",
        rpTypeID: 0,
        rpTypeName: "西药",
        clientType: 0,
        rpSource: 0,
        doctorOrgType: 1,
        doctorOrgID: _this.userInfo.orgID,
        providerType: _this.providerType,
        providerID: _this.providerID,
        doctorHospitalID: _this.userInfo.orgID,
        doctorID: _this.doctorID,
        doctorName: _this.doctorName,
        primaryDiagnosis: _this.patientInfo.primaryDiagnosis,
        allergyHistory: _this.patientInfo.allergyHistory,
        patientInfo: _this.patientInfo,
        patientID: _this.patientInfo.keyID,
        patientName: _this.patientInfo.patientName,
        medicines: medicines,
        // 总价
        recipeAllPrice: _this.price,
        // 医嘱
        enjoin: _this.patientInfo.enjoin
      };
      _this.$_http
        .post(_this.$_API.API_RP_PRESCRIPTION_MAKERP, data)
        .then(res => {
          if (!res.data) return;
          _this.aiResultType = res.data.aiResultType;
          _this.errorCode = res.data.errorCode;
          _this.errorText = res.data.errorText;
          if (_this.errorCode === 1) {
            // 慎用
            _this.tab = true;
          } else if (_this.errorCode === 2) {
            // 禁用
            _this.tab = true;
          } else {
            // 清空表单数据
            this.$refs.fromPharmacist.resetFields();
            this.$_success("处方出具成功...");
          }
        });
    },
    // 批量获取商品信息信息
    getPartnerGoodsInfoByList() {
      let _this = this;
      let data = _this.goodsId;
      _this.$_http
        .post(_this.$_API.API_MEDICINE_MEDICINEGOODS_GETPARTNERGOODSINFOBYLIST, data)
        .then(res => {
          if (!res.data) return;
          _this.goodsInfo = res.data;
          _this.getMedicineInfoByList();
        });
    },
    // 批量获取药品信息信息
    getMedicineInfoByList() {
      let _this = this;
      let data = _this.medicineId;
      _this.$_http
        .post(_this.$_API.API_MEDICINE_MEDICINEPRODUCT_GETMEDICINEINFOBYLIST, data)
        .then(res => {
          if (!res.data) return;
          res.data.forEach(it => {
            it.takeDose = "";
            it.takeFrequence = "";
            it.takeDirection = "";
          });
          _this.medicineInfo = _this.assembleData(res.data);
          _this.getDictionaries();
        });
    },
    // 组装药品数据（商品信息+药品信息）
    assembleData(medicineInfo) {
      let _this = this;
      // 1. 把数量装进 药品信息
      for (let i = 0; i < _this.medicineCount.length; i++) {
        let medCount = _this.medicineCount[i];
        for (let j = 0; j < medicineInfo.length; j++) {
          let medInfo = medicineInfo[j];
          if (medInfo.medicineID === medCount.medicineID) {
            medInfo.medicineAmount = medCount.medicineAmount;
          }
        }
      }
      // 2. 获取药品对应的商品价格
      for (let j1 = 0; j1 < medicineInfo.length; j1++) {
        let medInfo = medicineInfo[j1];
        for (let i1 = 0; i1 < _this.goodsInfo.length; i1++) {
          let goodsIn = _this.goodsInfo[i1];
          if (goodsIn.medicineID === medInfo.medicineID) {
            medInfo.price = goodsIn.price;
            medInfo.goodsId = goodsIn.keyID;
          }
        }
      }
      return medicineInfo;
    },
    // 获取字典数据
    getDictionaries() {
      let _this = this;
      let params = {
        systemCode: "MEDICAL",
        groupCode: "D_MEDICAL_TREAT_FREQUENCY"
      };
      _this.$_http.get(_this.$_API.INTERFACE_HOSPITAL_DICTIONARY,
        { params })
        .then(res => {
          if (!res.data) return;
          _this.frequencyInfo = res.data;
        });
    },
    // 过滤药品类型
    formatClass(val) {
      if (val === 0) {
        return "西药";
      } else if (val === 1) {
        return "中药";
      } else if (val === 2) {
        return "中成药";
      } else if (val === 3) {
        return "保健品";
      } else if (val === 9) {
        return "其他";
      }
    },
    // 修改处方
    updataRp() {
      let _this = this;
      _this.tab = false;
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
    },
    // 验证表单
    validate() {
      let _this = this;
      _this.$refs.fromPharmacist.validate(valid => {
        // 检查表单：药师信息
        if (!valid) {
          return;
        };
        let params = {
          phone: _this.userInfo.phone
        };
        _this.$_http
          .get(_this.$_API.API_PEACHUSER_DOCTORMNG_GETDOCTORBYPHONE, {
            params
          })
          .then(res => {
            if (!res.data) return;
            // 改为doctorUserID
            _this.doctorID = res.data.keyID;
            _this.doctorName = res.data.doctorName;
            _this.makeRp();
          });
      });
    },
    // 过敏史
    allergyHistory() {
      let _this = this;
      _this.flag = true;
    },
    notAllergyHistory() {
      let _this = this;
      _this.flag = false;
      _this.patientInfo.allergyDetail = "";
    }
  }
};
