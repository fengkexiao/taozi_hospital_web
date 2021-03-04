import { RISK } from '../../common/Constant'
export default {
    data () {
        return {
            interactionClass: '',
            dialogVisible: false,
            riskList: RISK,
            interactionTypeList: [
                { name: "拮抗", val: "1" },
                { name: "十八反", val: "2" },
                { name: "十九畏", val: "3" },
                { name: "禁忌", val: "4" }
            ],
            interactionObj: {
                1: '拮抗',
                2: '十八反',
                3: '十九畏',
                4: '禁忌'
            },
            query: {
                medicineContentA: "",
                medicineContentB: "",
                interactionType: "",
                risk: "",
                riskName: "",
                staffName: "",
                isDisable: "",
                time: "",
                startTime: "",
                endTime: ""
            },
            isEdit: false,
            list: [],
            page: {
                pageIndex: 1,
                pageSize: 10
            },
            selData: {},
            multipleSelection: [],
            tableLoading: false
        };
    },
    created () {
    },
    methods: {
        // 编辑药品作用
        handleEdit (row) {
            this.selData = row
            this.isEdit = true
            this.dialogVisible = true
        },
        // 选择行
        handleSelectionChange (val) {
            this.multipleSelection = val;
        },
        // 行/禁用启用
        handleDisabled (row) {
            if (row.isDisable === 0) {
                this.enable(1, [{ keyID: row.keyID }])
            } else {
                this.enable(0, [{ keyID: row.keyID }])
            }
        },
        // 批量启用
        handleAllEnable () {
            this.enable(0, this.multipleSelection)
        },
        // 批量禁用
        handleAllDisable () {
            this.enable(1, this.multipleSelection)
        },
        // 启用/禁用接口
        async enable (type, list) {
            if (list.length <= 0) {
                this.$message({
                    type: "warning",
                    message: `请勾选需要${type === 0 ? "启用" : "禁用"}的行`
                });
                return false
            }
            let keyIDs = []
            list.map(item => {
                keyIDs.push(item.keyID)
            })
            const res = await this.$_http.post(this.$_API.INTERFACE_RM_POST_MEDICINEINTERACTION_DISABLE, {
                keyIDs,
                disable: type
            })
            if (res.data) {
                this.$message({
                    type: "success",
                    message: "操作成功"
                });
                this.getList()
            }
        },
        // 批量删除
        handleAllDel () {
            this.del(this.multipleSelection)
        },
        // 删除行
        handleDel (row) {
            this.del([{ keyID: row.keyID }])
        },
        // 删除接口
        del (list) {
            if (list.length <= 0) {
                this.$message({
                    type: "warning",
                    message: `请勾选需要删除的行`
                });
                return false
            }
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let keyIDs = []
                list.map(item => {
                    keyIDs.push(item.keyID)
                })
                const res = await this.$_http.post(this.$_API.INTERFACE_RM_POST_MEDICINEINTERACTION_DELETE, {
                    keyIDs
                })
                if (res.data) {
                    this.$message({
                        type: "success",
                        message: "删除成功"
                    });
                    this.getList()
                }
            })
        },
        handleReset () {
            this.query = {
                medicineContentA: "",
                medicineContentB: "",
                interactionType: "",
                risk: "",
                staffName: "",
                isDisable: "",
                time: "",
                startTime: "",
                endTime: ""
            }
        },
        // 添加药品作用
        addMedicineInteraction () {
            this.selData = {}
            this.isEdit = false
            this.dialogVisible = true
        },
        // 获取客户列表
        async getList () {
            if (this.query.risk) {
                const riskObj = this.riskList.find(item => {
                    return item.val == this.query.risk
                })
                this.query.riskName = riskObj.name
            }
            this.query.startTime = this.query.time ? this.query.time[0] : ""
            this.query.endTime = this.query.time ? this.query.time[1] : ""
            try {
                this.tableLoading = true
                this.query.interactionClass = this.interactionClass
                const res = await this.$_http.get(this.$_API.INTERFACE_RM_GET_MEDICINEINTERACTION_LIST, { params: Object.assign({}, this.query, this.page) })
                this.tableLoading = false
                if (res) {
                    this.list = res.data.datas;
                    let pageInfo = {
                        totalRow: res.data.totalRow,
                        pageIndex: res.data.pageIndex,
                        pageSize: res.data.pageSize
                    }
                    this.page = pageInfo;
                }
            } catch (error) {
                this.tableLoading = false
            }
        },
        getInteractionClassName (key) {
            return this.interactionObj[key]
        }
    }
};