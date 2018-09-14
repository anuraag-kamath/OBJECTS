Clone the repository using:-

git clone https://<>@bitbucket.org/m4vr1ck/objects.git

Go to the directory where the repository where the code is cloned.

Set process environment variables before proceeding:- WINDOWS:-

set JWT_KEY="keyofyourchoice"

set OBJ_PORT=12004 #or any other port

set OBJ_MONGODB_URL: mongodb://localhost:27017/obj #or any other mongodb url

Once the variable is set, the server can be then started using either node app.js or nodemon app.js or pm2 start app.js --name Objects
