---
title: NPM Playground is live!
---
Hi! These days there are many code fiddles offering HTML / JS / CSS. So I've made one too! You can try it [here](https://npm-playground.web.app).

## NPM Packages support
You can import a NPM package as you would do it with bundler.

```js
import $ from "jquery";

$("body").css("background-color", "#FF0");
```

## Multi-file support
My code fiddle supports multiple files, and they can be connected with ECMAScript import / export. But be aware - you have to exclude these extensions:
* .js
* .jsx
* .ts
* .tsx

index.tsx
```tsx
import Counter from "./counter";

/// ....
```

counter.jsx
```jsx
export default function Counter({count}) {
    return <h1>Counter: {count}</h1>
}
```

## Supports multiple files
It currently supports:
* JS
* JSX
* TS
* TSX
* CSS

Support for HTML is planned.