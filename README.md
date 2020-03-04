# 多人聊天室后端

## 运行环境

- node.js
- mongo DB

## 分工机制

- apiServer负责各类api接口的功能包括登陆验证（待完善）3000端口

- webServer负责页面资源的发送 80端口（后续改为https服务是为443端口）
- socketServer负责多人广播聊天的功能（待强化完善）