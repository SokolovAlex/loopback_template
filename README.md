## loopback template
---------------------------

resolve deps

```
npm i
```

to start server and watch changes
```
gulp
```

db would be updated after starting application

change creds to db server/datasources.json

Simple auth steps
1. registration - user/ post {"email": "a@a.com", "password": "123456"} --> return id;

2. get GET /Users/{id}  --->  "statusCode": 401, "code": "AUTHORIZATION_REQUIRED"

3. POST /Users/login  {"email": "a@a.com", "password": "123456"} --> return id (token)

4. set token (id)

5. get GET /Users/{id}  --->  Bingo

custom auth steps



