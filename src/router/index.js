import Vue from 'vue'
import Router from 'vue-router'
import devicelogin from '@/components/baritems/devicelogin'
import devicemonitor from '@/components/baritems/devicemonitor'
import installed from '@/components/baritems/installed'
import apkinstall from '@/components/baritems/apkinstall'
import vedioinstall from '@/components/baritems/vedioinstall'
import setmenuandflag from '@/components/baritems/setmenuandflag'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'devicelogin',
      component: devicelogin
    },
    {
      path: '/devicelogin',
      name: 'devicelogin',
      component: devicelogin
    },
    {
      path: '/devicemonitor',
      name: 'devicemonitor',
      component: devicemonitor
    },
    {
      path: '/installed',
      name: 'installed',
      component: installed
    },
    {
      path: '/vedioinstall',
      name: 'vedioinstall',
      component: vedioinstall
    },
    {
      path: '/apkinstall',
      name: 'apkinstall',
      component: apkinstall
    },
    {
      path: '/setmenuandflag',
      name: 'setmenuandflag',
      component: setmenuandflag
    },
  ]
})
