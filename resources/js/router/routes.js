import Vue from 'vue'
import Router from 'vue-router'
import CreateEventView from '../views/event/Create.vue'
import ScheduleEventView from '../views/event/Schedule.vue'
import ScheduleConfirmView from '../views/event/ScheduleConfirm.vue'
import ScheduleConfirmationView from '../views/event/Confirmed.vue'
import DashboardView from '../views/event/Dashboard.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: DashboardView
    },
    {
      path: '/create',
      name: 'CreateEvent',
      component: CreateEventView
    },
    {
      path: '/schedule',
      name: 'ScheduleEvent',
      component: ScheduleEventView
    },
    {
      path: '/schedule/confirm',
      name: 'ScheduleConfirm',
      component: ScheduleConfirmView
    },
    {
      path: '/schedule/confirmation',
      name: 'ScheduleConfirmation',
      component: ScheduleConfirmationView
    },
  ]
})