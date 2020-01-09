<!--
 * @Date: 2020-01-09 16:40:40
 * @LastEditors  : zhengxi
 * @LastEditTime : 2020-01-09 17:49:06
 -->
# qn-dva
简单抽离dva中的model逻辑, 用法和dva一样
```js
// model 配置
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
## 运用场景
- 结合reducer和saga，方便开发

## 使用方式
```js
import dva from 'qn-dva'
import models from './models' // models 是个数组, [model1,model2]


const app = dva();

models.forEach(app.model);

let store = app.start();
export default store   // redux 的store
```