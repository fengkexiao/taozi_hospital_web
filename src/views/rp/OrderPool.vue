<template>
  <div >
  </div>
</template>

<script>

export default {
  name: "orderPool",
  components: {
  },
  data () {
    return {

    };
  },
  async mounted() {
    this.$store.dispatch("tagsView/delView", this.$route);
    this.$router.replace({name:"home"})
    window.open(window.location.origin + '/rp/orderPoolPage', "_blank");
  }
};
</script>
