# React-map

## 项目初始化

1. 通过`create-react-app`脚手架创建`react`项目

   ```shell
   cd dev-summit-2021-customizing-widgets
   npx create-react-app react-map
   ```

2. 启动项目

   `cd react-map`进入项目路径，

   执行`npm start`或者`yarn start`启动项目，

   在`http://localhost:3000`，我们就可以看到项目启动起来啦！
   
   > 为了节省时间，脚手架的安装、项目的初始化都已经提前做好了。

## 简单的地图应用

1. 安装`js api`
   执行`npm install @arcgis/core`或者`yarn add @arcgis/core `安装。

2. 引入`api`实现一个简单的地图
   进入`App.jsx`，删除无用代码，`render`返回一个地图容器

   ```jsx
   import React, { useEffect, useRef, useState } from 'react';
   import './App.css';
   
   function App() {
     return <div id='viewDiv'></div>;
   }
   
   export default App;
   ```
   
   引入api
   
   ```jsx
   import Map from "@arcgis/core/Map";
   import MapView from "@arcgis/core/views/MapView";
   ```
   
   在`useEffect`中，初始化地图
   
   ``` jsx
     useEffect(() => {
       const map = new Map({
         basemap: "streets",
       });
   
       const mapView = new MapView({
         map,
         container: "viewDiv", // 地图容器
         zoom: 7,
         center: [120, 30],
         ui: { components: [] }, // 清空页面默认微件
       });
       return () => {
         mapView && mapView.destroy();
       }
     }, []);
   ```
   
   修改`App.css`,在最前面引入api的样式
   
   ```css
   @import "https://js.arcgis.com/4.19/@arcgis/core/assets/esri/css/main.css";
   
   html,
   body,
   #viewDiv {
     padding: 0;
     margin: 0;
     height: 100vh;
     width: 100vw;
   }
   ```
   
   页面刷新，可以看到地图已经出现。现在是一个非常纯净的地图，什么微件都没有添加。
   
   我们来仔细的看一下代码
   
   > useEffect接收两个参数，一个是callback，一个是依赖列表。callback中执行了地图的初始化，返回值是一个函数，用来清除副作用，防止内存泄露，比如我们在页面挂载的时候，创建了地图，在页面卸载的时候，就销毁掉地图。可以近似的理解为vue的mounted。
   
   使用`ref`，在虚拟dom的框架下，一般都不再使用id去绑定dom节点，而是使用ref。所以使用`ref`帮助我们绑定地图容器。
   
   ```jsx
   const elRef = useRef();
   
   const mapView = new MapView({
     map,
     container: elRef.current,
     zoom: 7,
     center: [120, 30],
     ui: { components: [] },
   });
   
   return <div id="viewDiv" ref={elRef}></div>;
   ```
   
   完整代码：
   
   ``` jsx
   import React, { useEffect, useRef, useState } from 'react';
   import Map from "@arcgis/core/Map";
   import MapView from "@arcgis/core/views/MapView";
   import Home from "@arcgis/core/widgets/Home";
   import "./App.css";
   
   function App() {
     const elRef = useRef();
     useEffect(() => {
       const map = new Map({
         basemap: "streets",
       });
   
       const mapView = new MapView({
         map,
         container: elRef.current,
         zoom: 7,
         center: [120, 30],
         ui: { components: [] },
       });
       const home = new Home({
         view: mapView,
       });
   
       mapView.ui.add(home, "top-left");
       return () => {
         mapView && mapView.destroy();
       };
     }, []);
     return <div id="viewDiv" ref={elRef}></div>;
   }
   
   export default App;
   
   ```
   
   至此，我们已经创建了一个简单的地图应用。

## 微件的使用

1. 引入`Home`微件

   ```jsx
   import Home from "@arcgis/core/widgets/Home";
   ```
   
   添加微件到地图
   
   ```jsx
       mapView.when(() => {
         const home = new Home({
           view: mapView,
         });
   
         mapView.ui.add(home, "top-left");
       });
   ```
   
   在页面左上角，可以看到微件加载上了，点击也能触发事件。
   
   （回ppt）

## 样式文件

1. 开箱即用的主题样式
   在`App.css`中注释之前的样式，加入新样式

   ```css
   @import "https://js.arcgis.com/4.19/@arcgis/core/assets/esri/themes/light-red/main.css";
   ```

2. 自己的样式
   如果所有的主题都不满足用户的要求。那么可以在api样式引入之后，引入自己的样式文件，对api提供的样式文件进行覆盖。达到样式修改的目的。
   新建`custom.css`文件，写入想覆盖的样式，如我希望按钮大一些，并且换个颜色。
   
   ```css
   .esri-widget--button {
     background-color: orange;
     color: green;
     width: 64px;
     height: 64px;
   }
   
   [class*=esri-icon] {
     font-size: 32px;
   }
   ```

   在`App.css`中引入，放到`main.css`之后
   
   ```css
   @import "./custom.css";
   ```

   可以看到home微件的样式已经发生了改变。
   
   （回ppt）

## ViewModel的使用

1. 新建文件夹`components`，里面新建文件夹`HomeWidget`，新建`index.jsx`和`index.css`文件，填入空的模板。

   ```jsx
   import React, { useEffect, useRef } from "react";
   import "./index.css";
   
   const HomeWidget = () => {
     return <></>;
   };
   export default HomeWidget;
   ```

2. 通过浏览器调试复制`Home`微件的`dom`结构，在`return`中返回。

   ```jsx
     return (
       <div
         class="esri-component esri-home esri-widget--button esri-widget"
         role="button"
         tabindex="0"
         aria-label="默认地图视图"
         title="默认地图视图"
       >
         <span aria-hidden="true" class="esri-icon esri-icon-home"></span>
         <span class="esri-icon-font-fallback-text">主页</span>
       </div>
     );
   ```

   `className`、`tabIndex`替换，增加`id`进行样式绑定，并修改图标为文字。

   ```jsx
     return (
       <div
         id="homeWidget"
         className="esri-component esri-home esri-widget--button esri-widget"
         role="button"
         tabIndex="0"
         aria-label="默认地图视图"
         title="默认地图视图"
       >
         <span>Home</span>
       </div>
     );
   ```

   编辑`index.css`文件，增加样式，通过绝对定位把微件放到地图左下角。

   ``` css
   #homeWidget {
     position: absolute;
     bottom: 15px;
     left: 15px;
   }
   ```

3. 在`App.jsx`中引入`HomeWidget.jsx`

   ```jsx
   import HomeWidget from "./components/HomeWidget";
   
     return (
       <div id="viewDiv" ref={elRef}>
         <div>
           <HomeWidget></HomeWidget>
         </div>
       </div>
     );
   ```
   
   地图上已经能看到新加的微件。但是现在只有壳，没有内核。我们需要再给微件绑定点击事件。
   
4. 微件中初始化`ViewModel`，并绑定点击事件
   加入引用
   
   ```jsx
   import HomeViewModel from "@arcgis/core/widgets/Home/HomeViewModel";
   ```
   
   在`useEffect`中初始化
   
   ```jsx
   // 初始化
     useEffect(() => {
       const homeViewModel = new HomeViewModel({
         // 参数稍后填写
       });
       return () => {
         homeViewModel && homeViewModel.destroy();
       }
     }, []);
   
   // 给div绑定点击事件
     const onClick = () => {
       homeViewModel.go();
     }
     
     onClick={onClick}
   ```
   
   给div绑定点击事件
   
   ```jsx
     const onClick = () => {
       homeViewModel.go();
     }
     
     onClick={onClick}
   ```
   
   这时，我们期望调用`homeViewModel`的`go`函数来实现逻辑。我们需要一个`ref`变量来保存`homeViewModel`
   
   ```jsx
   // 增加useRef保存homeViewModel
     const homeViewModelRef = useRef();
     useEffect(() => {
       const homeViewModel = new HomeViewModel({
         
       });
       homeViewModelRef.current = homeViewModel;
       return () => {
         homeViewModel && homeViewModel.destroy();
       }
     }, []);
     const onClick = () => {
       homeViewModelRef.current.go();
     }
   ```
   
5. 在`App.jsx`中增加`view`变量，并传参给微件

   ```jsx
     const [view, setView] = useState();
   
   // view.when
         setView(mapView);
   // props传参
           <HomeWidget view={view}></HomeWidget>
   ```

   `HomeWidget/index.jsx`中也对应调整

   ```jsx
   // 接收参数
   ({ view })
   
       const homeViewModel = new HomeViewModel({
         view,
       });
   // 依赖项
   [view]
   ```

   现在功能就加上了。自定义的微件内容，业务逻辑是复用的viewmodel的函数。

6. 修改`onClick`中的逻辑
   一般我们需要回到初始视角功能的时候，都是在放大到小比例尺的时候，找不到初始位置了。如果在大比例尺的时候，容易找到初始位置，不会用到这个功能。所以我们假定一个需求：当zoom层级大于等于7的时候，才启用该功能。

   ```jsx
     const onClick = () => {
       if (view.zoom >= 7) {
         homeViewModelRef.current.go();
       }
     };
   ```

   浏览器上，可以测试一下功能。大比例尺和小比例尺。

   （回ppt）

## 开发Center微件

1. 在`components`里面新建文件夹`CenterWidget`，新建`index.jsx`和`index.css`文件。根据需求，填上内容。

   ```jsx
   import React, { useState, useEffect, useCallback } from "react";
   import "./index.css";
   
   const CenterWidget = ({ view }) => {
     const [longitude, setLongitude] = useState(0);
     const [latitude, setLatitude] = useState(0);
     const [scale, setScale] = useState(0);
     const onClick = () => {};
     return (
       <div id="centerWidget" onClick={onClick}>
         <p>longitude: {Number(longitude).toFixed(3)}</p>
         <p>latitude: {Number(latitude).toFixed(3)}</p>
         <p>scale: {Number(scale).toFixed(0)}</p>
       </div>
     );
   };
   export default CenterWidget;
   
   ```

   ```css
   #centerWidget {
     position: absolute;
     top: 15px;
     right: 15px;
     padding: 15px;
     color: #2e2e2e;
     background: rgba(255, 255, 255);
     cursor: pointer;
   }
   #centerWidget p {
     margin: 0;
   }
   ```

   在`App.jsx`中引入微件。

   ```jsx
   import CenterWidget from "./components/CenterWidget";
   
           <CenterWidget view={view}></CenterWidget>
   ```

   页面上微件已经加上，有默认值0,0,0

3. 接收`view`参数，在`useEffect`设置初始值。通过`react`的`useState`，`set`来赋值。

   ```jsx
     useEffect(() => {
       const { scale, center } = view;
       const { latitude, longitude } = center;
       setLatitude(latitude);
       setLongitude(longitude);
       setScale(scale);
     }, [view]);
   ```

   页面上坐标值和比例已经赋值上，但是还没有监听地图改变。

3. 增加地图监听,（覆盖之前的设置初始值）

   ```jsx
     const onViewChange = useCallback(() => {
       const { scale, center } = view;
       const { latitude, longitude } = center;
       setLatitude(latitude);
       setLongitude(longitude);
       setScale(scale);
     }, [view]);
     useEffect(() => {
       if (!view) {
         return;
       }
       onViewChange();
       const handle = view.watch("center, scale", onViewChange);
       return function removeHandle() {
         handle.remove();
       };
     }, [view, onViewChange]);
   ```

   拖拽，缩放，可以看到微件的显示发生了变化。实现是通过`view`的`watch`函数，监听了地图的属性变化。

   瞅一眼代码。

4. 地图的点击事件
   通过`view.on`也可以绑定地图事件

   ```jsx
     const onViewClick = useCallback((e) => {
       const { mapPoint } = e;
       const { longitude, latitude } = mapPoint;
       console.log(longitude, latitude);
     }, []);
     useEffect(() => {
       if (!view) {
         return;
       }
       const handle = view.on("click", onViewClick);
       return function removeHandle() {
         handle.remove();
       };
     }, [view, onViewClick]);
   ```
   
   我们打开控制台，我们点击地图，控制台就打印出了当前点击点的坐标。
   
5. 增加微件点击事件

   这里的点击事件不再使用viewmodel的方法，而是直接调用`view`上的方法。

   我们通过`view.goTo`来实现跳转。我们需要先存下初始的中心点位。

   ```jsx
     const [initialCenter, setInitialCenter] = useState([0, 0]);
     const onClick = () => {
       view.goTo(initialCenter);
     };
     useEffect(() => {
       if (!view) {
         return;
       }
       const { center } = view;
       setInitialCenter(center);
     }, [view]);
   ```

   测试微件的点击事件。只回到了中心，比例尺是没有变化的。

   完整代码：

   ``` jsx
   import React, { useState, useEffect, useCallback } from "react";
   import "./index.css";
   
   const CenterWidget = ({ view }) => {
     const [longitude, setLongitude] = useState(0);
     const [latitude, setLatitude] = useState(0);
     const [scale, setScale] = useState(0);
     const [initialCenter, setInitialCenter] = useState([0, 0]);
     const onClick = () => {
       view.goTo(initialCenter);
     };
     useEffect(() => {
       const { center } = view;
       setInitialCenter(center);
     }, [view]);
     const onViewChange = useCallback(() => {
       const { scale, center } = view;
       const { latitude, longitude } = center;
       setLatitude(latitude);
       setLongitude(longitude);
       setScale(scale);
     }, [view]);
     const onViewClick = useCallback((e) => {
       const { mapPoint } = e;
       const { longitude, latitude } = mapPoint;
       console.log(longitude, latitude);
     }, []);
     useEffect(() => {
       if (!view) {
         return;
       }
       const handle = view.on("click", onViewClick);
       return function removeHandle() {
         handle.remove();
       };
     }, [view, onViewClick]);
     useEffect(() => {
       if (!view) {
         return;
       }
       onViewChange();
       const handle = view.watch("center, scale", onViewChange);
       return function removeHandle() {
         handle.remove();
       };
     }, [view, onViewChange]);
     return (
       <div id="centerWidget" onClick={onClick}>
         <p>longitude: {Number(longitude).toFixed(3)}</p>
         <p>latitude: {Number(latitude).toFixed(3)}</p>
         <p>scale: {Number(scale).toFixed(0)}</p>
       </div>
     );
   };
   export default CenterWidget;
   
   ```
   
   至此，自己的微件也开发完成。
   
   现在看到的三个微件，一个是官网微件；一个是自定义限制了go条件，替换了内容；一个是开发的自己的微件。

## 自定义hooks

在react中，也可以像api中一样，把逻辑层拆分出来。拆到自定义hooks中。在`index.jsx`同目录下，新建`useCenter.js`，把之前写的代码剪切过来。

```jsx
import { useState, useEffect, useCallback } from "react";

const useCenter = (view) => {
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [scale, setScale] = useState(0);
  const [initialCenter, setInitialCenter] = useState([0, 0]);
  const onViewChange = useCallback(() => {
    const { scale, center } = view;
    const { latitude, longitude } = center;
    setLatitude(latitude);
    setLongitude(longitude);
    setScale(scale);
  }, [view]);
  useEffect(() => {
    if (!view) {
      return;
    }
    onViewChange();
    const handle = view.watch("center, scale", onViewChange);
    return function removeHandle() {
      handle.remove();
    };
  }, [view, onViewChange]);
  const go = useCallback(() => {
    view.goTo(initialCenter);
  }, [view, initialCenter]);
  useEffect(() => {
    if (!view) {
      return;
    }
    const { center } = view;
    setInitialCenter(center);
  }, [view]);

  return { longitude, latitude, scale, go };
};

export default useCenter;

```

在`index.jsx`中就使用`useCenter`

```jsx
import useCenter from './useCenter';

  const { longitude, latitude, scale, go } = useCenter(view);
  const onClick = () => {
    go();
  };
```

## 闲聊交流

+ 官网推荐的微件开发
  https://developers.arcgis.com/javascript/latest/custom-widget/
  https://geodaoyu.github.io/2021/04/22/%E7%BF%BB%E8%AF%91-%E5%BE%AE%E4%BB%B6%E5%BC%80%E5%8F%91/
+ 开源的tsx
  https://github.com/Esri/arcgis-js-api/tree/4master/widgets
+ view状态管理
  1.props  2.contex  3.redux  4.single-instance store 5.window.view
+ 微件不通过view.ui.add添加

