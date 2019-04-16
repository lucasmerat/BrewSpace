# BeerSpace

![header image](/public/img/demo.png)

## Deployed app
	
Check out the app [here](https://brewspace.herokuapp.com/).

## Description

BrewSpace is a place for beer enthusiasts to track their drinks, discover new beers, and see what others are drinking.

To use the app,
- Visit the link above
- Sign up to create an account
- Sign in with your account details
- Click the "Log a beer" button to log a drink
- If the beer is not in our database, feel free to add your own custom beer, it will then be available for all users
- On your dashboard, you can see what others are drinking and visit their profiles for more info

## Technologies
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Sequelize ORM](http://docs.sequelizejs.com/)
- [Bcrypt for password hashing](https://www.npmjs.com/package/bcrypt)
- [Moment](https://momentjs.com/)
- [jQuery](https://jquery.com/)
- [Handlebars](https://handlebarsjs.com/)
- [Materialize](http://materializecss.com/)
- [Chai](https://www.npmjs.com/package/chai)
- [Mocha](https://www.npmjs.com/package/mocha)
- [Cookies](https://www.npmjs.com/package/cookies)

### Installing
 
If you would like to run the application locally:
- Clone this repository to your local machine with `git clone <repo-url>`.
- Install NPM dependencies by running `npm install` in the project directory.
- Open `config/config.json` and update the development password to your local mySQL password
- Open a SQL IDE like MySQL Workbench
- Run `CREATE DATABASE brewspace;`
- Ensure that you are in the root project directory, then run `node server`.
- The application will be running at `localhost:3000/`

### Future features
- [ ] Add a friend and only see what your friends are drinking
- [ ] Like and comment on users' activities
- [ ] Beer suggestions to auto-fill when logging a beer
- [ ] Add Google Maps API with places to enter where you had the brew
