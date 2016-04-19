Project - IT 353
================

# Requirements:
- Node.js v5.10.1
- MongoDB v3.2.1
- NPM v3.8.6
- Gulp 3.9.0

# How to Install:

After installing the requirements, execute those commands on your command line (inside the project folder):
```
$ npm install
```

# How to Execute:

Inside the project folder, execute (make sure you already start the MongoDB):
```
$ node start
```
After that, you can access [`http://localhost:3000`](http://localhost:3000).

# Resources:

@TODO

# Filters:

Node-restful accepts many options to manipulate the list results. These options can be added to your request either via the querystring or the POST body. They are passed into the mongoose query to filter your resultset.

## Selecting the entity-properties you need

If you only need a few properties instead of the entire model, you can ask the service to only give just the properties you need:

A `GET` request to `/users/?select=name%20email` will result in:

```json
[
    {
        "_id": "543adb9c7a0f149e3ac29438",
        "name": "user1",
        "email": "user1@test.com"
    },
    {
        "_id": "543adb9c7a0f149e3ac2943b",
        "name": "user2",
        "email": "user2@test.com"
    }
]
```

## Limiting the number and skipping items

When implementing pagination you might want to use `skip` and `limit` filters. Both do exactly what their name says and just skip given amount of items or limit to a set amount of items.

`/users/?limit=5` will give you the first 5 items  
`/users/?skip=5` will skip the first 5 and give you the rest  
`/users/?limit=5&skip=5` will skip the first 5 and then give you the second 5

## Sorting the result

Getting a sorted list is as easy as adding a `sort` querystring parameter with the property you want to sort on. `/users/?sort=name` will give you a list sorted on the name property, with an ascending sort order.

Changing the sort order uses the same rules as the string notation of [mongoose's sort filter](http://mongoosejs.com/docs/api.html#query_Query-sort). `/users/?sort=-name` will return the same list as before with a descending sort order.

## Filtering the results

Sometimes you just want to get all people older than 18, or you are want to get all people living in a certain city. Then you would want to
use filters for that. You can ask the service for equality, or values greater or less than, give it an array of values it should match to, or even a regex.

| Filter                       | Query  | Example                                              | Description                     |
|------------------------------|--------|------------------------------------------------------|---------------------------------|
| **equal**                    | `equals` | `/users?gender=male` or `/users?gender__equals=male` | both return all male users      |
| **not equal**                | `ne`     | `/users?gender__ne=male`                             | returns all users who are not male (`female` and `x`)        |
| **greater than**             | `gt`     | `/users?age__gt=18`                                  | returns all users older than 18                                   |
| **greater than or equal to** | `gte`    | `/users?age__gte=18`                                 | returns all users 18 and older (age should be a number property) |
| **less than**                | `lt`     | `/users?age__lt=30`                                  | returns all users age 29 and younger                              |
| **less than or equal to**    | `lte`    | `/users?age__lte=30`                                 | returns all users age 30 and younger                             |
| **in**                       | `in`     | `/users?gender__in=female,male`                         | returns all female and male users                    |
| **nin**                      | `nin`    | `/users?age__nin=18,30`                                 | returns all users with age other than 18 or 30                |
| **Regex**                    | `regex`  | `/users?username__regex=/^baugarten/i` | returns all users with a username starting with baugarten           |

## Populating a sub-entity

When you have setup a mongoose Schema with properties referencing other entities, you can ask the service to populate them for you.

A `GET` request to `/users/542edff9fffc55dd29d99346` will result in:

```json
{
    "_id": "542edff9fffc55dd29d99346",
    "name": "the employee",
    "email": "employee@company.com",
    "boss": "542edff9fffc55dd29d99343",
    "__v": 0
}
```
A `GET` request to `/users/542edff9fffc55dd29d99346?populate=boss` will result in:

```json
{
    "_id": "542edff9fffc55dd29d99346",
    "name": "the employee",
    "email": "employee@company.com",
    "boss": {
        "_id": "542edff9fffc55dd29d99343",
        "name": "the boss",
        "email": "boss@company.com",
        "__v": 0
    },
    "__v": 0
}
```

# Credits

Internally, we use the awesome npm library [node-restful](https://github.com/baugarten/node-restful) for implementing this RESTful API. Also we copied part of their README. So please, take a look at this awesome library. :smile:


# License

See [LICENSE](https://github.com/matheussampaio/dota-quiz/blob/master/LICENSE) file.
