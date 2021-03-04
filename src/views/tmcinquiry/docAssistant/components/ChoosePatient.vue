<template>
  <div>
    <el-dialog title="相同电话患者" :visible.sync="dialogVisible" width="300px" :before-close="handleClose">
      <ul>
        <el-radio-group v-model="currentPatient">
          <li v-for="(item,index) of patientList" :key="index" v-if="!item.wechat" class="mb15">
            <el-radio :label="item.keyID" :key="item.keyID">{{item.patientName}}</el-radio>
          </li>
        </el-radio-group>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConf">确 定</el-button>
      </span>
    </el-dialog>
    <merge-patient :patientList="patientList" :currentPatient="currentPatient" :visible.sync="visible"></merge-patient>
  </div>
</template>

<script>
import MergePatient from "./MergePatient";
export default {
  name: "choosePatient",
  components: {
    MergePatient
  },
  props: {
    patientList: {
      type: Array,
      default: () => []
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    dialogVisible (val) {
      if (val) {
        this.currentPatient = "";
      }
    }
  },
  data () {
    return {
      currentPatient: "",
      visible: false
    };
  },
  created () {
  },
  methods: {
    handleClose () {
      this.$emit("update:dialogVisible", false);
    },
    handleConf () {
      if (this.currentPatient) {
        this.handleClose();
        this.visible = true;
        this.$emit("updateCheckMerge");
      }
      this.handleClose();
    }
  }

};
</script>

<style lang="scss" scoped>
li {
  list-style: none;
}
</style>
