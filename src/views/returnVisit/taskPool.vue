<template>
    <div class="coupon">
        <div class="app-container">
            <el-card class="box-card" style="margin:5px 0">
                <el-form :model="searchKey" inline>
                    <el-form-item label="任务号：">
                        <el-input v-model="searchKey.couponName" maxlength="10" clearable placeholder="请输入任务号"
                                  @keyup.native="setNum" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="患者姓名：">
                        <el-input v-model="searchKey.couponName" maxlength="20" clearable placeholder="请输入患者姓名"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="电话：">
                        <el-input v-model="searchKey.couponName" maxlength="20" clearable placeholder="请输入电话"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item label="计划回访时间：">
                        <el-date-picker
                                style="width: 100%"
                                v-model="searchKey.dateRangeTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                unlink-panels
                                type="datetimerange"
                                range-separator="至"
                                clearable
                                start-placeholder="开始时间"
                                end-placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="购药状态：">
                        <el-select v-model="searchKey.couponName" placeholder="请选择">
                            <el-option
                                    v-for="item in buyStatus"
                                    :key="item.value"
                                    clearable
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="最新购药状态：">
                        <el-select v-model="searchKey.couponName" placeholder="请选择">
                            <el-option
                                    v-for="item in buyStatus"
                                    :key="item.value"
                                    clearable
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="成单金额：">
                        <el-input v-model="searchKey.couponName" maxlength="7"
                                  clearable style="width: 100px" placeholder="金额"></el-input>
                        <span style="margin: 0 5px">-</span>
                        <el-input v-model="searchKey.couponName" maxlength="7"
                                  clearable style="width: 100px" placeholder="金额"></el-input>
                    </el-form-item>
                    <el-form-item label="任务状态：">
                        <el-select v-model="searchKey.couponName" placeholder="请选择">
                            <el-option
                                    v-for="item in taskStatus"
                                    :key="item.value"
                                    clearable
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="最终/当前处理专员：">
                        <el-select v-model="searchKey.couponName" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    clearable
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
                        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card>
                <el-table :data="tableData" border fit>
                    <el-table-column prop="couponName" label="任务号" align="center"></el-table-column>
                    <el-table-column prop="startTime" label="患者姓名" align="center"></el-table-column>
                    <el-table-column prop="endTime" label="电话" align="center"></el-table-column>
                    <el-table-column prop="couponName" label="计划回访时间" align="center"></el-table-column>
                    <el-table-column prop="startTime" label="购药状态" align="center"></el-table-column>
                    <el-table-column prop="endTime" label="最新购药状态" align="center"></el-table-column>
                    <el-table-column prop="couponName" label="成单金额" align="center"></el-table-column>
                    <el-table-column prop="startTime" label="任务状态" align="center"></el-table-column>
                    <el-table-column prop="endTime" label="最终/当前处理专员" align="center"></el-table-column>
                    <el-table-column prop="endTime" label="备注" align="center"></el-table-column>
                    <el-table-column prop="keyID" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDetal(scope.row)">
                                查看详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
        <taskDetail :dialogVisible="taskDetailVisible"></taskDetail>
    </div>
</template>

<script>
  import taskDetail from "./components/taskDetail";

  export default {
    name: "taskPool",
    components: {
      taskDetail
    },
    data() {
      return {
        taskDetailVisible: false,
        searchKey: {},
        tableData: [{}],
        buyStatus: [  //购药状态
          {
            value: "0",
            label: "未购药"
          },
          {
            value: "1",
            label: "已购药"
          },
        ],
        taskStatus: [ //任务状态
          {
            value: "0",
            label: "未派单"
          },
          {
            value: "1",
            label: "已派单"
          },
          {
            value: "2",
            label: "已处理"
          }
        ],
        options: [{
          value: "选项1",
          label: "黄金糕"
        }, {
          value: "选项2",
          label: "双皮奶"
        }, {
          value: "选项3",
          label: "蚵仔煎"
        }, {
          value: "选项4",
          label: "龙须面"
        }, {
          value: "选项5",
          label: "北京烤鸭"
        }]
      };
    },
    mounted() {
      // this.setNum()
    },
    methods: {
      setNum() {
        let reg = /[^0-9]/ig;
        ///^((([1-9]+[\d]*)|0)(.[0-9]{1,2})?)$/ 2位小数正则
        this.searchKey.couponName = this.searchKey.couponName.replace(reg, "");
      },
      searchData() {
      },
      reset() {
      },
      showDetal(row) {
        this.taskDetailVisible = true;
      }
    }
  };
</script>

<style scoped>
    /deep/ .el-form--inline .el-form-item {
        margin-right: 40px;
    }
</style>
