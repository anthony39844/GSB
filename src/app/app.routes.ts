import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { MatchDetailsComponent } from './match-details/match-details.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => { return import('./home/home.component').then((m) => m.HomeComponent)}
    },
    {
        path: 'summoner/:summoner', component: ProfileComponent,
    },
    {
        path: 'summoner/:summoner/:match-id', component: MatchDetailsComponent,
    }
];
