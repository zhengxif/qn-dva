
import diff from './diff'

let listener;
function stateHandle(mapState, store) {
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
function connect(mapState, config, store) {
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
        stateHandle.bind(this)(mapState, store);
        didMountOld.bind(this)();
    }
    let didUnmount = function () {
        listener();
        didUnmountOld.bind(this)();
    }
    let onLoad = function () {
        stateHandle.bind(this)(mapState, store);
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
function injectStore(store) {
    return function(mapState, config) {
        return connect(mapState,config, store)
    }
}
export default injectStore;