import { Games } from '../views/games/games';
import { Login } from '../views/login/login';
import { GameDashboard } from '../views/games/components/game-dashboard/game-dashboard';
import { PicksDashboard } from '../views/games/components/picks-dashboard/picks-dashboard';

export const routes = [

    {
        path: '/games/:view',
        component: Games,
        routes: [
            {
                path: "/games/pick",
                component: PicksDashboard
            },
            {
                path: "/games/game",
                component: GameDashboard
            }
        ]
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