/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: router
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/17-下午4:04
 Description:
 Param:
 Return:
 *************************************************/
import Vue from 'vue'
import Router from 'vue-router'

import Main from '../pages/main'

Vue.use(Router)

const router = new Router({
  mode:'hash',
  routes: [
    {
      path:'/',
      redirect:'/main'
    },
    {
      path:'/main',
      meta:{
        title:'页面标题',
        needAuth:true
      },
      component: Main,
    }
  ]
})

export default router
