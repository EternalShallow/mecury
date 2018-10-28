import Main from 'views/mainline/main'; // 主路由

// app 的 路由
export const otherRouters = {
  path: '/',
  name: 'otherRouter',
  component: Main,
  children: [
    {
      path: 'borrowBooks',
      icon: 'key',
      name: 'home_index',
      title: '借书',
      meta: { title: '小宝图书管理 - 借书' },
      component: r =>
        require.ensure(
          [],
          () => r(require('views/mainline/book/borrowBooks')),
          'ml.book.borrowBooks',
        ),
    },
  ],
};

// 左侧列表路由
export const appRouters = [
  {
    path: '/returnBooks',
    name: 'appRouters',
    title: '图书管理',
    icon: 'social-buffer',
    component: Main,
    children: [
      {
        path: 'borrowBooks',
        icon: 'lock-combination',
        name: 'home_index',
        title: '借书',
        meta: { title: '小宝图书管理 - 借书' },
        component: r =>
          require.ensure(
            [],
            () => r(require('views/mainline/book/borrowBooks')),
            'ml.book.borrowBooks',
          ),
      },
      {
        path: 'index',
        icon: 'arrow-graph-up-right',
        name: 'returnBooks',
        title: '还书',
        meta: { title: '小宝图书管理 - 还书' },
        component: r =>
          require.ensure(
            [],
            () => r(require('views/mainline/book/returnBooks')),
            'ml.book.returnBooks',
          ),
      },
    ],
  },
  {
    //准备发货
    path: '/prepareForDelivery',
    icon: 'lock-combination',
    name: 'prepare',
    title: '准备发货',
    component: Main,
    children: [
      {
        path: 'index',
        name: 'prepare_index',
        meta: { title: '小宝图书管理 - 准备发货' },
        component: r =>
          require.ensure(
            [],
            () => r(require('views/mainline/prepareForDelivery')),
            'ml.prepareForDelivery',
          ),
      },
    ],
  },
  {
    //到店取
    path: '/toStore',
    icon: 'lock-combination',
    name: 'toStore',
    title: '到店取',
    component: Main,
    children: [
      {
        path: 'index',
        icon: 'lock-combination',
        name: 'toStore_index',
        title: '到店取',
        meta: { title: '小宝图书管理 - 到店取' },
        component: r =>
          require.ensure(
            [],
            () => r(require('views/mainline/toStore')),
            'ml.toStore',
          ),
      },
    ],
  },
  {
    //图书录库存编码
    path: '/bookCodings',
    icon: 'lock-combination',
    name: 'toStore',
    title: '图书录库存编码',
    component: Main,
    children: [
      {
        path: 'index',
        icon: 'lock-combination',
        name: 'bookCoding_index',
        title: '图书录库存编码',
        meta: { title: '小宝图书管理 - 图书录库存编码' },
        component: r =>
          require.ensure(
            [],
            () => r(require('views/mainline/bookCoding')),
            'ml.bookCodings',
          ),
      },
    ],
  },
  {
    //订单状态
    path: '/orderListStatus',
    icon: 'lock-combination',
    name: 'orderListStatus',
    title: '图书订单管理',
    component: Main,
    children: [
      {
        path: 'index',
        icon: 'lock-combination',
        name: 'orderListStatus_index',
        title: '订单管理',
        meta: { title: '小宝图书管理 - 订单管理码' },
        component: r =>
          require.ensure(
            [],
            () => r(require('views/mainline/orderListStatus')),
            'ml.orderListStatus',
          ),
      },
    ],
  },
];
