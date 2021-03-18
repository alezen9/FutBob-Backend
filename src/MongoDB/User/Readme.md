# User
## Description
> The __User__ represents a person in real life and it contains information linked to the user itself like the registry, credentials if the user has an account  on the platform, what priviledges the user has and a reference to the __Player__ entity if the user it's also a player on the platform.
Like every main entity in the platform it also contains information about who created that record (reference to a User, it can be itself), when it was created and the last time it wass updated.

- A manager can also be a player.
- A regular user MUST also be a player.

&nbsp;
&nbsp;
&nbsp;
&nbsp;
## Entity
```typescript
class User {
    _id: ObjectId
    createdBy: ObjectId
    createdAt: Date|string
    updatedAt: Date|string
    registry: {
        name: string
        surname: string
        dateOfBirth: Date|string
        sex: Sex // Male|Female
        country: string
        phone: string
        additionalInfo?: {
            email?: string
        }
    }
    credentials?: {
        email: string
        password: string
        verifyAccount?: {
            confirmed: boolean
            code?: {
                value: string
                createdAt: Date|string
            }
        }
        resetPassword?: {
            confirmed: boolean
            code?: {
                value: string
                createdAt: Date|string
            }
        }
    }
    privileges: Privilege[] // (Manager|User)[]
    player?: ObjectId // => Player
}
```

&nbsp;
&nbsp;
&nbsp;
&nbsp;
## Actions that can be performed directly on the user

&nbsp;
&nbsp;
### Create
See [__Authentication__](#auth) for Manager  
See [__Player__](../Player/Readme.md#description) for regular user

&nbsp;
&nbsp;
&nbsp;
&nbsp;
### Update
&nbsp;
| PROPERTY | When can be changed |
| -------- | ------------------- |
| __registry__ |  |
| => name | Everytime |
| => surname | Everytime |
| => dateOfBirth | Everytime |
| => sex | Everytime |
| => phone | Everytime |
| => additionalInfo => email | Everytime |
| __credentials__ |  |
| => password | Everytime |

&nbsp;
&nbsp;
&nbsp;
&nbsp;
### Delete
A manager can delete his users (players) at anytime but can't delete himself as a user.

&nbsp;
&nbsp;

# Authentication

## Registration flow
1. User compiles required fields for registration on the frontend
```typescript
class RegisterInput {
   name: string // max length 50 chars
   surname: string // max length 50 chars
   dateOfBirth: string|Date // between 5-70 years
   sex: Sex // Male|Female
   country: string // max length 4 chars (eg: IT, UK, FR,...)
   phone: string
   email: string // max length 50 chars and must be a valid email
}
```

2. Once the registration request has been done an email is sent to the user on the provided email address containing a link with a verification code  
=> a User entity is being created with the registry information and a partial credentials entity
```typescript
const User = {
    _id,
    createdBy,
    createdAt,
    updatedAt,
    registry: new Registry({...}), // populated aside of the email that is not an additionalInfo
    credentials: {
        email,
        verifyAccount: {
            confirmed: false,
            code: {
                value, // eg. 5a5f080c-e647-46b1-8fc2-82b7b31cf734
                createdAt
            }
        }
    },
    privileges: [Privilege.Manager]
}
```
=> {base-frontend-URL}/{uuidV4-generated-code}  
=> eg. https://localhost:3000/5a5f080c-e647-46b1-8fc2-82b7b31cf734

3. The user clicks on the button/link and is redirected to a frontend page and here we have 2 scenarios:  
=> __Valid code__  
The user chooses a password, creates the account and if the registration is successfull he/she is being redirected to the homepage of the platform.  
The field User.credentials.verifyAccount.confirmed is being set to __true__  
=> __Expired code__  
The user can request another confirmation email with a new code by pressing a button on that same page and:  
-- a code will be recreated replacing the expired one  
-- an email will be sent again to the same email address  

&nbsp;
&nbsp;
&nbsp;
&nbsp;
## Forgot password flow
> Forgot password flow is very similar to the registration flow but only the email is required
&nbsp;
&nbsp;
1. A not logged user goes into the _forgot passowrd_ page and fills the form providing the email
2. Once the reset password request has been received, an email is sent to the user on the provided email address containing a link with a reset password code  
=> the User entity is being updated filling the credentials.resetPassword field as follows
```typescript
const User = {
    // ...restOfTheUser
    credentials: {
        email,
        resetPassword: {
            confirmed: false,
            code: {
                value, // eg. 5a5f080c-e647-46b1-8fc2-82b7b31cf734
                createdAt
            }
        }
    }
}
```
=> {base-frontend-URL}/{uuidV4-generated-code}  
=> eg. https://localhost:3000/5a5f080c-e647-46b1-8fc2-82b7b31cf734
3. The user clicks on the button/link and is redirected to a frontend page and here we have 2 scenarios:  
=> __Valid code__  
The user chooses a new password, if the password is successfully changed the user is redirected to the homepage of the platform.  
The field User.credentials.resetPassword.confirmed is being set to __true__  
=> __Expired code__  
The user can request another confirmation email with a new code by pressing a button on that same page and:  
-- a code will be recreated replacing the expired one  
-- an email will be sent again to the same email address  
