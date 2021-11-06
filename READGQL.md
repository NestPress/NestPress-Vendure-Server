Example playground for customer

query customers{
  customers(options:{}){
    items{
      id
      firstName
      lastName
      history{
        items{
          type
          data
        }
      }
    }
  }
}

query current{
  me{
    ... on CurrentUser{
      id
      identifier
      channels{
        permissions
      }
    }
  }
}

mutation createCustomer{
  createCustomer(input:{
    firstName:"Tim",
    lastName:"Dalton"
    title:"BigMan"
    emailAddress:"tim@gmail.com"
  }){
  ... on Customer{
    id
  }
  }
}
mutation authenticate{
  authenticate(input:{
    native:{
      username:"superadmin",
      password:"superadmin"
    }
  }){
   ... on CurrentUser {
      id
    	identifier
      channels{
        id
        token
        code
        permissions
      }
    }
  }
}