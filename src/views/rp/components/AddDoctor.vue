<template>
  <el-dialog title="" :visible.sync="dialogVisible" width="20%" :before-close="handleClose">
    <el-form :model="query">
      <el-form-item>
        <el-select placeholder="科室" value="">
          <!-- <el-option v-for="(item,index) in orderStateOptions" :key="index" :label="item.orderName" :value="item.orderStatusID"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="组别" value="">
          <!-- <el-option v-for="(item,index) in orderStateOptions" :key="index" :label="item.orderName" :value="item.orderStatusID"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="医生姓名" value="">
          <!-- <el-option v-for="(item,index) in orderStateOptions" :key="index" :label="item.orderName" :value="item.orderStatusID"></el-option> -->
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "addDoctor",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    };
  },
  created () {
  },
  methods: {
    handleAdd () {

    },
    handleClose () {
      this.$emit("update:dialogVisible", false);
    }
  }
};
</script>

<style lang="scss">
</style>
