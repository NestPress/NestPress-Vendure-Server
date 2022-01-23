import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';
import { PostPermissionsComponent } from './post-permissions.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '',
      pathMatch: 'full',
      component: PostPermissionsComponent,
      data: { breadcrumb: 'Post permissions' },
    }]),
  ],
  declarations: [PostPermissionsComponent],
})
export class PostPermissionModule {}
