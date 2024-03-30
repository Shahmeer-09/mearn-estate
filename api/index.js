const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const dbConnect = require('./config/dbCon');
const {errorChecker} = require('./middlewear/errorHandler');
const cookieParser = require('cookie-parser');
const corsOptionsDelegate = require('./config/corsOptions');
var cors = require('cors');
dbConnect();
const app = express();
app.use(cors(corsOptionsDelegate)) 
app.use(express.json());
app.use(cookieParser());
app.listen(3000, ()=>[
    console.log("app listening on port 3000")
])


app.use('/api/auth', require('./routes/authroute'))
app.use('/api/user', require('./routes/user.route'))
app.use('/api/listing', require('./routes/listing.route'))


app.use(errorChecker)