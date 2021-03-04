<template>
  <div class="app-container">
    <img :src="img" />
  </div>
</template>
<script>
export default {
  inject: ["close"],
  props: {
    // 查询主键
    keyID: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      img: ""
    };
  },
  computed: {},
  mounted() {
    let params = {
      typeCode: "S",
      biz: "H",
      code: this.keyID
    };
    this.$_http
      .get(this.$_API.INTERFACE_USER_GETQRCODE, {
        params
      })
      .then(res => {
        if (!res.data) return;
        this.img = res.data;
      });
  },
  watch: {},
  methods: {}
};
</script>
