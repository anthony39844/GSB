import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => { return import('./home/home.component').then((m) => m.HomeComponent)}
    },
    {
        path: 'summoner/:summoner', component: ProfileComponent,   

    }
];
