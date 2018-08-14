import Vue from 'vue'
import Router from 'vue-router'
import Result from '@/components/Result'
import AddResult from '@/components/AddResult'
import EditResult from '@/components/EditResult'
import LeagueTable from '@/components/LeagueTable'
import PageNotFound from '@/components/PageNotFound'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'result',
      component: Result
    },
    {
      path: '/add',
      name: 'add-result',
      component: AddResult
    },
    {
      path: '/edit/:id',
      name: 'edit-result',
      component: EditResult
    },
    {
      path: '/league',
      name: 'league-table',
      component: LeagueTable
    },
    { path: "*",
      component: PageNotFound
    }
  ]
})
