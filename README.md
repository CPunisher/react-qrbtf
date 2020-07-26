# [React Qrbtf](https://github.com/CPunisher/react-qrbtf)

[![Npm Version][npm-version-image]][npm-version-url]
[![License][license-image]][license-url]

- **6 Different QRCode Styles** - Change the parameters to show your favourite 

- **Make Your Own** - Use the API to make your own QRCode styles

## Demo

![QR codes](https://github.com/ciaochaos/qrbtf/raw/master/public/img/QRcodes.jpg)

[**Live Demo**](https://qrbtf.com)

### Installation & Usage

```sh
npm install react-qrbtf --save
```

### Docs

[Read docs here](http://cpunisher.github.io/react-qrbtf/) (not yet completed)

### Include the Componet

```js
import React from 'react'
import { QRNormal } from 'react-qrbtf'

class Component extends React.Component {

    render() {
        return <QRNormal value="https://qrbtf.com" />
    }
}
```

### 二维码中间图标参数

- icon: 图标地址，支持 jpg/png/svg等，gif动态图没测试过
- iconScale: 图标大小比例，不超过 0.33(默认)
- title: 显示的文字
- titleSize: 文字大小, 默认 12px
- titleColor: 文字颜色, 默认 黑色
- titleAlign: 文字位置, 支持 middel|bottom

> 说明：

> - titleSize、titleColor、titleAlign 三个参数也支持从 styles.title 中取值，分别对应 fontSize、color、verticalAlign
> - 如果在 styles.title 中设置 fontSize，请用数字（也即是不要带 px）
> - 文字位置默认值：如果有 icon，在二维码底部，否则居中。文字多的情况下建议传参 bottom，不会自动换行

[npm-version-image]: https://img.shields.io/npm/v/react-qrbtf
[npm-version-url]: https://www.npmjs.com/package/react-qrbtf
[license-image]: http://img.shields.io/npm/l/react-qrbtf.svg
[license-url]: LICENSE
