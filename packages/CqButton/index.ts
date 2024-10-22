import type { App } from 'vue'
import CqButton from "./src/CqButton.vue";
CqButton.install = (app: App) => {
  app.component(CqButton.name, CqButton);
};
export {
  CqButton
}
export default CqButton;

