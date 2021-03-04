<template>
  <div style="display: flex;height: 100%;" @click="clickoutside">
    <div id="chat">
      <chat></chat>
    </div>
    <div id="form">
      <patientIndex :key="tmc.patientID"></patientIndex>
    </div>
  </div>
</template>
<script>
import chat from "./chat";
import patientIndex from "../docAssistant/PatientIndex";
import { mapGetters } from "vuex";
export default {
  name: "index",
  components: {
    chat,
    patientIndex
  },
  computed: {
    ...mapGetters(["tmc"])
  },
  methods:{
    clickoutside(){
      this.$bus.$emit("hideSearchResult");
    }
  }
};
</script>
<style lang="scss" scoped>
#chat {
  flex: 5;
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
}
#form {
 // width: 485px;
  overflow: auto;
}
</style>
