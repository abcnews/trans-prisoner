import { whenOdysseyLoaded } from "@abcnews/env-utils";
import { selectMounts } from "@abcnews/mount-utils";
import App from "./components/App";

const PROJECT_NAME = "trans-prisoner";

function init() {
  const rootEl = selectMounts("transprisonerroot")[0];

  // apply full screen class
  rootEl.className = "u-full";

  rootEl.appendChild(new App({}).el);
}

whenOdysseyLoaded.then(() => {
  init();
});

if (process.env.NODE_ENV === "development") {
  console.debug(`[${PROJECT_NAME}] public path: ${__webpack_public_path__}`);
}
