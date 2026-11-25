import { createFormWorker } from "./index.js";
import developmentStorage from "./development/reset.js.txt";
import diagnostics from "./development/diagnostics.js.txt";
import developmentUI from "./development/ui.js.txt";
import developmentMarkup from "./development/dialog.js.txt";
import developmentStyles from "./development/styles.css";
// Explicit development entry point; never imported by the release Worker.
export default createFormWorker({development:true,startup:developmentStorage+"\n"+"const storageRecoveryBlocked=(()=>{try{if(!formWorkspace.demo&&!formWorkspace.preview)completeCleanSlate(window.localStorage);return false}catch{return true}})();",extraScript:developmentUI+"\n"+diagnostics,extraMarkup:developmentMarkup,extraStyles:developmentStyles});
