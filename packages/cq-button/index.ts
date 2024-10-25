
import button from "./src/index.vue";

import { withInstall,SFCWithInstall } from '../../src/utils/with-install'
export const CqButton:SFCWithInstall<typeof button> = withInstall(button);
export default CqButton;
// export * from './src/index.ts'

