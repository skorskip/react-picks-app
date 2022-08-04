import { Games } from '../views/games/games';
import { Login } from '../views/login/login';
import { GameDashboard } from '../views/games/sub-view/game-dashboard/game-dashboard';
import { PicksDashboard } from '../views/games/sub-view/picks-dashboard/picks-dashboard';
import { OthersDashboard } from '../views/games/sub-view/others-dashboard/others-dashboard';
import { Dashboard } from '../views/dashboard/dashboard';
import { Standings } from '../views/standings/standings';
import { Profile } from '../views/profile/profile';

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
            }, 
            {
                path: "/games/others",
                component: OthersDashboard
            }
        ]
    },
    {
        path: '/dashboard',
        component: Dashboard
    },
    {
        path: '/standings',
        component: Standings
    },
    {
        path: '/profile',
        component: Profile
    },
    {
        path: '/login',
        component: Login
    }
]