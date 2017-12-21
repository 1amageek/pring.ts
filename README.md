# pring.ts

This library has an interface similar to iOS's Pring.
https://github.com/1amageek/Pring

⚠️ This library still contains bugs.

## Installation ⚙

`npm install pring --save `


## Usage

``` typescript
import { Pring } from "pring"

// On your server
const serviceAccount = require("path/to/serviceAccountKey.json");
 Pring.initialize({
    projectId: 'YOUR_PROJECT_ID',
    keyFilename: '/path/to/keyfile.json'
 })

// cloud functions
Pring.initialize(functions.config().firebase)
```

### Scheme
``` typescript

class Group extends Pring.Base {
    name: string
    users: NestedCollection<User> = NestedCollection(this)
}

class User extends Pring.Base {
    name: string
    groups: ReferenceCollection<Group> = ReferenceCollection(this)
}
```

### Manage data

#### Save
``` typescript
let user = new User()
user.name = "hoge"
user.save()
```

#### Get
``` typescript
User.get("x8lJLxtHYbQEFFBs52Hq").then((document) => {
    let user = document as User
    user.name = "NAME"
})
```

#### Update
``` typescript
User.get("x8lJLxtHYbQEFFBs52Hq").then((document) => {
    let user = document as User
    user.name = "UPDATE NAME"
    user.update()
})
```

#### Delete
``` typescript
User.get("x8lJLxtHYbQEFFBs52Hq").then((document) => {
    let user = document as User
    user.delete()
})
```
