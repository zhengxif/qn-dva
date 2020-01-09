<!--
 * @Date: 2020-01-09 16:40:40
 * @LastEditors  : zhengxi
 * @LastEditTime : 2020-01-09 17:49:06
 -->
# qn-dva
简单抽离dva中的model逻辑, 用法和dva一样

## 运用场景
- 结合reducer和saga，方便开发
- 利用connect 连接组件

## 使用方式
- model 配置
```js
export default {
    namespace: 'xx',
    reducers: {
        aa(action, state){}
    },
    effects: {
        *syncaa(action, {put, take, select,takeEvery}) {

        }
    }
}
```
- 引入dva并初始化
> 注意调用start会返回store，此store就是redux创建好的；connect方法可以连接组件和page
```js
import dva from 'qn-dva'
import models from './models' 

const app = dva();
models.forEach(app.model);
let { store, connect } = app.start();
export {
    store,
    connect
}
```

- 连接组件或者page
``` js
import { connect } from '../../store'
const config = {
    mixins: [],
    data: {
        
    },
    props: {
    },
    didMount() { }, // 此生命周期一定要有
    didUnmount() { }, // 此生命周期一定要有
    methods: {
        aa() {
            this.dispatch({
                type: 'xx/xx',
                payload: {
                    xxx
                }
            })
        }
    },
}
const mapState = state => {
    return {
        xxx: state[命名空间名称]
    }
}
Component(connect(mapState, config));
```