import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';
import { GreeterComponent } from './post-permissions.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{
      path: '',
      pathMatch: 'full',
      component: GreeterComponent,
      data: { breadcrumb: 'Greeter' },
    }]),
  ],
  declarations: [GreeterComponent],
})
export class PostPermissionModule {}

export class GreeterModule {}
