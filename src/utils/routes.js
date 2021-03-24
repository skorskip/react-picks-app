import { Games } from '../views/games/games';
import { Login } from '../views/login/login';

export const routes = [

    {
        path: '/games',
        component: Games
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/',
        component: Login
    }
]