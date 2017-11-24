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
Pring.initialize({
    projectId: '',
    keyFilename: ''
})

// cloud functions
Pring.initialize(functions.config().firebase)
```

### Scheme
``` typescript
class User extends Pring.Base {
    public name: String
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
User.get("x8lJLxtHYbQEFFBs52Hq", (document) => {
    let user = document as User
    user.name = "NAME"
})
```

#### Update
``` typescript
User.get("x8lJLxtHYbQEFFBs52Hq", (document) => {
    let user = document as User
    user.name = "UPDATE NAME"
    user.update()
})
```

#### Delete
``` typescript
User.get("x8lJLxtHYbQEFFBs52Hq", (document) => {
    let user = document as User
    user.delete()
})
```
