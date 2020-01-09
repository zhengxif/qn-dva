/*
 * @Author: zhengxi 
 * @Date: 2020-01-09 13:10:28 
 * @Last Modified by: zhengxi
 * @Last Modified time: 2020-01-09 14:48:21
 */
import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import * as sagaEffects from 'redux-saga/effects'
import { NAMESPACE_SEP } from './constant'

export default function() {
    const app = {
        _models: [],
        model,
        start
    }
    function model(m) {
        const prefixedModel = prefixNamespace(m);
        app._models.push(prefixedModel);
    }
    function start() {
        let reducers = getReducers(app);
        let sagas = getSagas(app);
        let sagaMiddleware = createSagaMiddleware();
        let store = applyMiddleware(sagaMiddleware)(createStore)(reducers);
        sagas.forEach(sagaMiddleware.run);
        return store;
    }
    function getSagas(app) {
        let sagas = [];
        for (const model of app._models) {
            sagas.push(function* () {
                for (let key in model.effects) {
                    const watcher = getWatcher(key, model.effects[key], model);
                    yield sagaEffects.fork(watcher); // 开启watcher
                }
            })
        }
        return sagas;
    }
    function getWatcher(key, effects, model) {
        function put(action) {
            return sagaEffects.put({...action, type: prefixType(action.type, model)})
        }
        return function* () {
            yield sagaEffects.takeEvery(key, function* (...args) {
                yield effects(...args, {...sagaEffects, put});
            })
        }
    }
    function prefixType(type, model) {
        if (type.indexOf('/') == -1) {
            return `${model.namespace}${NAMESPACE_SEP}${type}`;
        } else {
            if (type.startsWith(model.namespace)) {
                console.error(`Warning: [sagaEffects.put] ${type} should not be prefixed with namespace ${model.namespace}`);
            }
        }
        return type;
    }
    function getReducers(app) {
        let reducers = {};
        for(const model of app._models) {
            reducers[model.namespace] = function (state = model.state, action) {
                let model_reducers = model.reducers;
                let reducer = model_reducers[action.type];
                if (reducer) {
                    return reducer(state, action);
                }
                return state;
            }
        }
        return combineReducers(reducers);
    }
    function prefix(o, namespace) {
        return Object.keys(o).reduce((memo, key) => {
            let newKeys = `${namespace}${NAMESPACE_SEP}${key}`;
            memo[newKeys] = o[key];
            return memo;
        }, {})
    }
    function prefixNamespace(m) {
        if (m.reducers) {
            m.reducers = prefix(m.reducers, m.namespace);
        }
        if (m.effects) {
            m.effects = prefix(m.effects, m.namespace);
        }
        return m;
    }
    return app;
}