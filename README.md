## KPI Trek

**KPI Trek is a website designed to help your team to manage Key Performance Indicators (KPIs) and collaborate seamlessly through ticket-based requests.**  

![mockup](/public/assets/images/mockup.png)  

This project was ideated and executed within 2 weeks as a capstone project for BrainStation's full-stack bootcamp. 

**Front End:**  
create-react-app  
react-router  
SASS  
Chart.js  
Moment.js  

**Back End:**  
Node  
Express  
Passport  
jsonwebtoken (JWT)  
Nodemailer  
Knex  
MySQL2  


## Install

_(You'll need node, npm, and MySQL already installed.)_



1. Clone or download this repo.

2. Create a new database in MySQL called kpirek.

3. Install server dependencies:

```
$ npm install
```
5. Run migrations

```
$ npm run migrate
```
6. Run seeds
```
$ npm run seed
```
7. Create an Ethereal account

[Click here](https://ethereal.email) to create a fake email that Nodemailer will use to send update emails.  

8. Set environment variables:  

Rename .env_sample to .env and change placeholder values, including the email created on the previous step.  

```
PORT=<PORT>    
DB_HOST=<DB_HOST>    
DB_NAME=<DB_NAME>    
DB_USER=<DB_USER>    
DB_PASSWORD=<DB_PASSWORD>    
CLIENT_HOST=<CLIENT_HOST>    
GOOGLE_CLIENT_ID=<GOOGLE_CLIENT_ID>    
GOOGLE_CLIENT_SECRET=<GOOGLE_CLIENT_SECRET>   
GOOGLE_CALLBACK_URL=<GOOGLE_CALLBACK_URL>   
SESSION_SECRET=<SESSION_SECRET>    
EMAIL=<EMAIL>    
EMAIL_PASSWORD=<EMAIL_PASSWORD>   
```

9. Start the server:
```
$ node server.js
```

10. [Click here](https://github.com/tavaresflavia/kpi-trek) to set up the frontend.