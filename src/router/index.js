import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'system',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'system/ad/index',
        component: _import('system/ad/index'),
        name: 'ad',
        meta: {
          title: 'ad',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'system/config/index',
        component: _import('system/config/index'),
        name: 'config-index',
        meta: {
          title: 'config',
          roles: ['admin'], // or you can only set roles in sub nav,
          noCache: false
        }
      },
      {
        path: 'adPosition/index',
        component: _import('system/ad_position/index'),
        name: 'ad_position',
        meta: {
          title: 'ad_position',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'nav/index',
        component: _import('system/nav/index'),
        name: 'nav',
        meta: {
          title: 'nav',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'freight/index',
        component: _import('system/freight/index'),
        name: 'freight-index',
        meta: {
          title: 'freight',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: 'permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'permission/index',
        component: _import('system/permission/index'),
        name: 'permission-index',
        meta: {
          title: 'permission',
          roles: ['admin'], // or you can only set roles in sub nav
          noCache: false
        }
      },
      {
        path: 'role/index',
        component: _import('system/role/index'),
        name: 'role-index',
        meta: {
          title: 'role',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'admin/index',
        component: _import('system/admin/index'),
        name: 'admin-index',
        meta: {
          title: 'admin',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/goods_manage',
    component: Layout,
    redirect: '/goods_manage/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'shop_manage',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'goods/index',
        component: _import('goods_manage/goods/index'),
        name: 'goods-index',
        meta: {
          title: 'goods',
          roles: ['admin'], // or you can only set roles in sub nav
          noCache: false
        }
      },
      {
        path: 'goods/edit/:id?',
        component: _import('goods_manage/goods/edit'),
        name: 'goods_edit',
        hidden: true,
        meta: {
          title: 'goods_edit',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'goodsCategory/tree',
        component: _import('goods_manage/category/tree'),
        name: 'goods_category_tree',
        meta: {
          title: 'goods_category',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'goodsModel/index',
        component: _import('goods_manage/model/index'),
        name: 'goods_model_index',
        meta: {
          title: 'goods_model',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'goodsModelAttribute/index/:model_id?',
        component: _import('goods_manage/model/attribute'),
        name: 'goods_model_attribute',
        meta: {
          title: 'goods_model_attribute',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'goodsModelSpec/index',
        component: _import('goods_manage/model/spec'),
        name: 'goods_model_spec',
        meta: {
          title: 'goods_model_spec',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'brand/index',
        component: _import('goods_manage/brand/index'),
        name: 'brand',
        meta: {
          title: 'brand',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'comment/index',
        component: _import('goods_manage/comment/index'),
        name: 'comment',
        meta: {
          title: 'comment',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    meta: {
      title: 'user',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index',
        component: _import('user/index'),
        name: 'user',
        meta: { title: 'user', icon: 'icon', noCache: true }
      },
      {
        path: 'suggestion',
        component: _import('user/suggestion'),
        name: 'suggestion',
        meta: { title: 'suggestion', icon: 'icon', noCache: true }
      },
      {
        path: 'case/:id?',
        component: _import('user/case'),
        hidden: true,
        name: 'case',
        meta: { title: 'case', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '/region',
    component: Layout,
    name: 'region',
    meta: {
      title: 'region',
      icon: 'component'
    },
    children: [
      {
        path: 'index/:id?',
        component: _import('region/index'),
        name: 'region_index',
        meta: { title: 'region', icon: 'icon', noCache: true }
      },
      {
        path: 'country',
        component: _import('region/country'),
        name: 'country_index',
        meta: { title: 'country', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    name: 'article_manage',
    meta: {
      title: 'article_manage',
      icon: 'component'
    },
    children: [
      {
        path: 'article/index',
        component: _import('article/article/index'),
        name: 'article',
        meta: { title: 'article', icon: 'icon', noCache: true }
      },
      {
        path: 'category/index',
        component: _import('article/category/index'),
        name: 'article_category',
        meta: { title: 'article_category', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '/promotion',
    component: Layout,
    name: 'promotion_manage',
    meta: {
      title: 'promotion_manage',
      icon: 'component'
    },
    children: [
      {
        path: 'promotion/promotion/index',
        component: _import('promotion/promotion/index'),
        name: 'promotion',
        meta: { title: 'promotion', icon: 'icon', noCache: true }
      },
      {
        path: 'product/index/:id',
        component: _import('promotion/product/index'),
        hidden: true,
        name: 'product',
        meta: { title: 'product', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    name: 'order_manage',
    meta: {
      title: 'order_manage',
      icon: 'component'
    },
    children: [
      {
        path: 'index',
        component: _import('order_manage/order/index'),
        name: 'order-index',
        meta: { title: 'order', icon: 'icon', noCache: false }
      },
      {
        path: 'order/detail/:id',
        component: _import('order_manage/order/detail'),
        name: 'order-detail',
        hidden: true,
        meta: { title: 'order_detail', icon: 'icon', noCache: false }
      },
      {
        path: 'delivery',
        component: _import('order_manage/delivery/index'),
        name: 'delivery',
        meta: { title: 'delivery', icon: 'icon', noCache: false }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
