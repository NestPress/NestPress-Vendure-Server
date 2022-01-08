```
query getCategories {
  getPostTaxonomyValues(filter:{
    type:{
      eq:Category
    }
  }) {
    list { id, type, key, value }
    totalItems
  }
}

mutation createCategory {
	createPostTaxonomyValue(input:{
    type:Category,
    value:"example",
    key:"example"
  }) {
    id,
    type,
    value,
    key
  }
}

mutation updateCategory {
	updatePostTaxonomyValue(id:5,input:{
    value:"Example 4",
    key:"example"
  }) {
    id,
    type,
    value,
    key
  }
}

mutation deleteCategory {
	deletePostTaxonomyValue(id:4)
}

mutation createPostWithCategory {
  createPost(input:{
    title:"example",
    slug:"butty example 16",
    postType:Post,
    postTaxonomies:["2"]
  }) {
    id,
    title,
    slug,
    postTaxonomies { id }
  }
}

mutation updatePostWithCategory {
  updatePost(id:36, input:{
    postTaxonomies:["5"]
  }) {
    id,
    title,
    slug,
    postTaxonomies { id }
  }
}

query getPosts {
  getPosts(filter:{
    postTaxonomiesId:{
      eq:2
    }
  }) {
    list{
      id,
      postTaxonomies {
        id,
        value,
        key,
        type
      }
    }
  }
}
```
