import { createFormWorker } from "./index.js";
import developmentStorage from "./development/reset.js.txt";
import diagnostics from "./development/diagnostics.js.txt";
import developmentUI from "./development/ui.js.txt";
import developmentMarkup from "./development/dialog.js.txt";
import developmentStyles from "./development/styles.css";
// Explicit development entry point; never imported by the release Worker.
export default createFormWorker({startup:developmentStorage+"\n"+"const storageRecoveryBlocked=(()=>{try{completeCleanSlate(localStorage);return false}catch{return true}})();",extraScript:developmentUI+"\n"+diagnostics,extraMarkup:developmentMarkup,extraStyles:developmentStyles});
