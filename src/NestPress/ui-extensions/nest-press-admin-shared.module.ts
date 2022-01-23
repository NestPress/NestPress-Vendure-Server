import { NgModule } from '@angular/core';
import { SharedModule, addNavMenuSection } from '@vendure/admin-ui/core';

@NgModule({
  imports: [SharedModule],
  providers: [
    addNavMenuSection({
      id: 'nestpress',
      label: 'NestPress',
      items: [{
        id: 'post-permissions',
        label: 'Post permissions',
        routerLink: ['/extensions/post-permissions'],
        // Icon can be any of https://clarity.design/icons
        icon: 'no-access',
      }],
    },
    // Add this section before the "settings" section
    'settings'),
  ]
})
export class NestPressAdminSharedModule {}
