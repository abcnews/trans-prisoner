import { whenOdysseyLoaded } from "@abcnews/env-utils";
import { selectMounts } from "@abcnews/mount-utils";
import App from "./components/App";

const PROJECT_NAME = "trans-prisoner";
const root = document.querySelector(`[data-${PROJECT_NAME}-root]`);

function init() {

  const rootEl = selectMounts("transprisonerroot")[0];

  // apply full screen class
  rootEl.className = "u-full";

  rootEl.appendChild(
    new App({
      projectName: PROJECT_NAME,
      env: location.href.indexOf('localhost:8000') > 0 || location.href.indexOf('ws104545.local') > 0 ? "dev" : "prod"
    }).el
  );
}

whenOdysseyLoaded.then(() => {
  init();
});

if (module.hot) {
  module.hot.accept("./components/App", () => {
    root.removeChild(root.firstChild);

    try {
      init();
    } catch (err) {
      import("./components/ErrorBox").then(exports => {
        const ErrorBox = exports.default;
        root.appendChild(new ErrorBox({ error: err }).el);
      });
    }
  });
}

if (process.env.NODE_ENV === "development") {
  console.debug(`[${PROJECT_NAME}] public path: ${__webpack_public_path__}`);
}
