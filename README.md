<!--
 * @Date: 2020-01-09 16:40:40
 * @LastEditors: zhengxi
 * @LastEditTime: 2020-01-09 17:38:18
 -->
# qn-dva

## 使用方式
```js
import dva from 'qn-dva'
import models from './models' // models 是个数组


const app = dva();

models.forEach(app.model);

let store = app.start();
export default store   // redux 的store
```