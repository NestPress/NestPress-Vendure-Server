export const extensionRoutes = [  {
    path: 'extensions/greet',
    loadChildren: () => import('./extensions/26436d7a25a948b71ae5e01b94b67bb7ac7bef8eca9080777d01d61f8cc5742d/post-permission.module').then(m => m.GreeterModule),
  }];
