## Bugs:
```
- [x] Be sure not to commit node_modules folder.
Add this path to a .gitignore file;
commit that file and remove this folder. 
- [x] on login attempt of a correct email/pw, I get: TypeError: Cannot set property 'user_id' of undefined. This is a major feature that doesn't work.
- [x] on register, seems to be logged in, but /urls doesn't have a link for creating a new shorturl.
- [x] on hitting /, if logged in, should redirect to /urls.
- [x] on accessing /login or /register while logged in, should redirect to /urls. currently displays that page.
```

- [x]accessing something like 
http://localhost:8080/u/086mL doesn't work.
```
 this should redirect to the url entered. It looks like the code for that is completely commented out. This is the main feature and should be functional before submitting.

- [x] Add in morgan npm to log request data

```
