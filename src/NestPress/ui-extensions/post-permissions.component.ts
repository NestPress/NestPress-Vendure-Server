import { Component } from "@angular/core";
import { DataService } from "@vendure/admin-ui/core";
import gql from "graphql-tag";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "post-permissions",
  templateUrl: "./post-permissions.component.html",
})
export class PostPermissionsComponent {
  constructor(private dataService: DataService) {}

  postPermissions: any = null;

  roles: any = null;

  createPostPermissionForm: FormGroup = new FormGroup({
    role: new FormControl("", Validators.required),
    customType: new FormControl("", Validators.required),
    scope: new FormControl("author", Validators.required),
    shouldAllow: new FormControl("true", Validators.required),
    operation: new FormControl("create", Validators.required),
  });

  ngOnInit() {
    const roles$ = this.dataService.query(gql`
      query getRoles {
        roles {
          items {
            id
            description
            permissions
            code
          }
          totalItems
        }
      }
    `);

    roles$.single$.subscribe((data: any) => {
      this.roles = data.roles.items;
    });

    this.fetchList();
  }

  fetchList() {
    const result$ = this.dataService.query(gql`
      query getPostPermissions {
        getPostPermissions {
          list {
            id
            shouldAllow
            customType
            scope
            role {
              id
              code
              description
            }
            operation
          }
          totalItems
        }
      }
    `);

    result$.single$.subscribe((data) => {
      this.postPermissions = data;
    });
  }

  deletePostPermission(id: string) {
    const response$ = this.dataService.mutate(
      gql`
        mutation deletePostPermission($id: ID!) {
          deletePostPermission(id:$id)
        }
      `,
      {
       id,
      }
    );

    response$.subscribe((data: any) => {
      this.fetchList();
    });
  }

  onCreateEntrySubmit() {
    const values = this.createPostPermissionForm.value;

    const variables = {
      ...values,
      shouldAllow: values.shouldAllow === "true" ? true : false,
    };

    const response$ = this.dataService.mutate(
      gql`
        mutation createPostPermission($input: CreatePostPermissionInput) {
          createPostPermission(input: $input) {
            role {
              id
              code
            }
            shouldAllow
            customType
            operation
            scope 
          }
        }
      `,
      {
        input: variables,
      }
    );

    response$.subscribe((data: any) => {
      this.fetchList();
    });
  }
}
