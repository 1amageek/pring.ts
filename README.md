# pring.ts

This library has an interface similar to iOS's Pring.
https://github.com/1amageek/Pring

⚠️ This library still contains bugs.

## Installation ⚙

`npm install pring --save `


## Usage

### tsconfig.json

Pring uses a decorator.
Set `experimentalDecorators` to `true`.

```JSON
{
    "compilerOptions": {
        "target": "es2017",
        "lib": ["es2017"],
        "module": "commonjs",
        "experimentalDecorators": true,
        "sourceMap": true
    }
}
```

### Initialize

``` typescript
import { Pring, property } from "pring"

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

- Please add `@property` for property declaration.
- SubCollection can not be optional. Please initialize here.

``` typescript

class Group extends Pring.Base {
    @property name: string
    @property users: NestedCollection<User> = NestedCollection(this)
}

class User extends Pring.Base {
    @property name: string
    @property groups: ReferenceCollection<Group> = ReferenceCollection(this)
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
let user: User = await User.get("USER_ID")
```

#### Update
``` typescript
let user: User = await User.get("USER_ID")
user.name = "UPDATE NAME"
user.update()
```

#### Delete
``` typescript
let user: User = await User.get("USER_ID")
user.delete()
```

### SubCollection
You can use ReferenceCollection and NestedCollection.
The inserted Object is saved simultaneously with the save of the parent.


``` typescript
let user = new User()
let group = new Group()
user.groups.insert(group)
user.save()
```

If you insert the parent after it is saved, you need to use `await` to guarantee the count of SubCollection.
``` typescript
let user = new User()
user.save()

let group0 = new Group()
let group1 = new Group()
try {
  await user.groups.insert(group0)
  await user.groups.insert(group1)
} catch(error) {
  console.log(error)
}
```

The SubCollection of Pring has a Count.
``` typescript
user.groups.count
```

## Test

https://facebook.github.io/jest/

```shell
npm install -g jest 
```

```shell
jest
```
