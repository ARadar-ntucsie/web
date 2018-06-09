import Vue from 'vue';
import Router from 'vue-router';

import login_with from '@/components/login';
import dashboard  from '@/components/dashboard';
import event_edit from '@/components/event_edit';
import firebase from 'firebase/app'
import fireauth from 'firebase/auth'

Vue.use(Router)

let router = new Router({
    routes: [
        {
            path: '*',
            redirect: '/login'
        }, {
            path: '/',
            redirect: '/login'
        }, {
            path: '/login',
            name: 'login',
            component: login_with
        }, {
            path: '/dashboard',
            name: 'dashboard',
            component: dashboard,
            meta: {
                requiresAuth: true
            }
        }, {
            path: '/event/:id',
            name: 'event',
            component: event_edit,
            props: true,
            meta: {
                requiresAuth: true
            }
        }
    ]
});

router.beforeEach( (to, from, next) => {
    let currentUser = firebase.auth().currentUser;
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !currentUser) { next('login'); }
    else { next(); }
});

export default router;
