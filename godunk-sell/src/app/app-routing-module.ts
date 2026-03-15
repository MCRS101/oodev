import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login'
import { Register } from './register/register'
import { Home } from './home/home'
import { About } from './about/about'

const routes: Routes = [ 
  {path: "", component: Login},
  {path: "register", component: Register},
  {path: "home", component: Home },
  {path: "about", component: About}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
