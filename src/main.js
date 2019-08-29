import "@/plugins/vuetify";
import Vue from "vue";
import App from "@/App";
import AppCombobox from "@/components/AppCombobox";

Vue.config.productionTip = false;

Vue.component("app-combobox", AppCombobox);

new Vue({
  render: h => h(App)
}).$mount("#app");
