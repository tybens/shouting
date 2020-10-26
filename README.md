## SHOUTING - Twitter but only yelling
 *a full stack webpage for "shouting" into a database and listing the database for users to see*

#### Unique features
- input text is capitalized so everyone is SHOUTING :)
- between 1-10 exclamation points are appended
- a guarantee of unparalleled happiness

#### Starting web-page on a local machine:
*must have mongodb-org installed and the database running*

To start the back-end server:
```Bash
cd ~/shouting/server
npm install
npm run dev
```
To start the front-end server:
```Bash
cd ~/shouting/client
live-server
```

#### in order to eventually deploy:
- *mlab* for live database
- *now* for deploy hosting

#### for the future:
- Add comments/replies to shouts
- User Accounts
  - Not just a name box
  - Sign up/Login
- User Profiles
  - only show shouts from a given user
- search through shouts
- hashtags
- user @mentions
- real-time feed of shouts, rapid refreshing
