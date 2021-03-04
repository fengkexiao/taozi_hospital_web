<template>
  <el-dialog :visible.sync="dialogVisible" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="50%">
    <div slot="title" class="dialog-title">选择优惠券<i class="el-icon-close" style="float: right;cursor: pointer" @click="closeFn"></i></div>
    <el-table :data="couponList" stripe>
      <el-table-column width="55" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked" @change="checkboxClick($event,scope.$index)" :disabled="scope.row.disabled">
          </el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="couponName" label="优惠券名称" align="center"></el-table-column>
      <el-table-column prop="description" label="活动介绍" align="center"></el-table-column>
      <el-table-column prop="isOver" label="叠加次数" align="center"></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeFn">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "chooseCoupon",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    couponList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    rpMedicines: {
      default: () => {
        return [];
      }
    }
  },
  data () {
    return {
      chooseConponList: []
    };
  },
  watch: {
    dialogVisible () {
      this.chooseConponList = [];
    }
  },
  methods: {
    checkboxClick (val, index) {
      let _this = this;
      let _couponList = this.couponList[index];
      if (val) {
        if (this.chooseConponList.length === 0) {
          this.chooseConponList.push(_couponList);
          this.couponList.forEach((item, i) => {
            let flag = _this.isTrue(item, this.chooseConponList);
            if (!flag) {
              item.disabled = true;
            } else {
              if (_couponList.isOver > 0) {
                item.disabled = false;
              } else {
                if (index !== i) {
                  item.disabled = true;
                } else {
                  item.disabled = false;
                }
              }

            }
          });
        } else {
          this.chooseConponList.push(_couponList);
        }
      } else {
        this.chooseConponList.splice(0, 1);
        if (this.chooseConponList.length == 0) {
          this.couponList.forEach((item) => {
            item.disabled = false;
          });
        }
      }
      console.log("chooseConponList:===>", this.chooseConponList);
    },
    isTrue (item, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].keyID === item.keyID) {
          return true;
        }
      }
      return false;
    },
    confirm () {
      if (this.chooseConponList.length === 0) {
        this.$message.warning("请选择优惠券");
        return;
      }
      let coupon = this.chooseConponList[0];
      let flag = false;
      let num = 0
      this.rpMedicines.forEach(item => {
        if (item.medicineID == this.chooseConponList[0].rule.medicineID) {
          if (item.medicineAmount < this.chooseConponList[0].rule.full * this.chooseConponList.length) {
            flag = true;
            num = Math.floor(item.medicineAmount / this.chooseConponList[0].rule.full)
          }
        }
      });
      if (flag) {
        this.$message.warning('此类优惠券最多使用' + num + '张');
        return;
      }
      if (this.chooseConponList.length > coupon.isOver && coupon.isOver != 0) {
        this.$message.warning("此类优惠券最多使用" + coupon.isOver + "张");
        return;
      }
      this.$emit("confirmFn", this.chooseConponList);
    },
    closeFn () {
      this.$emit("closeFn");
    }
  }
};
</script>

<style scoped>
ul,
li {
  list-style: none;
}

.dialog-title {
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  color: rgba(42, 44, 48, 1);
}
</style>
