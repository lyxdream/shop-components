import checkbox from "./src/index.vue";
import { withInstall,SFCWithInstall } from '@src/utils/with-install'
export const CqCheckbox:SFCWithInstall<typeof checkbox> = withInstall(checkbox);
export default CqCheckbox