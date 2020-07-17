import App from './components/App';

const PROJECT_NAME = 'trans-prisoner';
const root = document.querySelector(`[data-${PROJECT_NAME}-root]`);


// apply full screen class
root.parentElement.className = 'u-full';

function init() {
  root.appendChild(new App({ projectName: PROJECT_NAME, env: process.env.NODE_ENV === 'development' ? 'dev' : 'prod' }).el);
}

init();

if (module.hot) {
  module.hot.accept('./components/App', () => {
    root.removeChild(root.firstChild);

    try {
      init();
    } catch (err) {
      import('./components/ErrorBox').then(exports => {
        const ErrorBox = exports.default;
        root.appendChild(new ErrorBox({ error: err }).el);
      });
    }
  });
}

if (process.env.NODE_ENV === 'development') {
  console.debug(`[${PROJECT_NAME}] public path: ${__webpack_public_path__}`);
}


