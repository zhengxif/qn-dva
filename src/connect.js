
import diff from './diff'

const app = getApp();
const { store } = app.globalData;
let listener;

function stateHandle(mapState) {
    this.dispatch = store.dispatch;
    if (!mapState) return;
    listener = store.subscribe(() => {
        let prevState = this.data;
        let preStatePartials = {};
        let currentState = mapState(store.getState());
        Object.keys(currentState).forEach(key => {
            preStatePartials[key] = prevState[key];
        })
        let pathState = diff(currentState, preStatePartials);
        this.setData(pathState);
    })
}
function connect(mapState, config) {
    let props = mapState && mapState(store.getState()) || {};
    let didMountOld = config.didMount;
    let didUnmountOld = config.didUnmount;
    let onLoadOld = config.onLoad;
    let onUnloadOld = config.onUnload;
    config.data = {
        ...config.data,
        ...props
    }
    let didMount = function () {
        stateHandle.bind(this)(mapState);
        didMountOld.bind(this)();
    }
    let didUnmount = function () {
        listener();
        didUnmountOld.bind(this)();
    }
    let onLoad = function () {
        stateHandle.bind(this)(mapState);
        onLoadOld.bind(this)()
    }
    let onUnload = function () {
        listener();
        onUnloadOld.bind(this)();
    }
    config.didMount = didMount;
    config.didUnmount = didUnmount;
    config.onLoad = onLoad;
    config.onUnload = onUnload;
    return config;
}

export default connect;