import { Games } from '../views/games/games';
import { Login } from '../views/login/login';
import { GameDashboard } from '../views/games/components/game-dashboard/game-dashboard';
import { PicksDashboard } from '../views/games/components/picks-dashboard/picks-dashboard';
import { OthersDashboard } from '../views/games/components/others-dashboard/others-dashboard';
import { Announcements } from '../views/announcements/announcements';
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
        path: '/announcements',
        component: Announcements
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