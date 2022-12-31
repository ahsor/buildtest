const express = require("express");
const app = express();
const usersRoutes = require("./routes/users.js");
//const register = require("./routes/register.js");
const auth = require("./routes/auth.js");
const { logger } = require( './middleware/logEvents.js') ;
const path = require('path');
const dotenv = require( 'dotenv');
dotenv.config();

const cookieParser = require('cookie-parser');
app.use(cookieParser());
// req.cookies로 접근 가능해짐
const PORT = process.env.PORT || 3500;

//1.
const cors = require('cors');
app.use(cors());

// 2. 
// app.use(cors({
//      origin:"http://localhost:3000",
//      method :["GET", "POST"],
//      credentials : true // cookie 정보를 사용하기 위한 설정
// }))

//3.
// import corsOptions from './config/corsOptions';
// app.use(cors(corsOptions));
app.use(express.urlencoded({extended:false}));

app.use(logger);
app.use(express.json());
app.use("/users", usersRoutes);

// app.use("/register", register);
// app.use("/login", auth);

// 원래 하나로 합침
app.use('/auth' , auth)

app.get("/", (req, res) => {
     console.log('root page : ', JSON.stringify(req.cookies) );
    
     res.sendFile(path.join(__dirname, 'client', 'index.html'))
});
app.all("*", (req, res) =>res.send("존재하지 않습니다."));

app.listen(PORT, () =>console.log(`Server running on port: http://localhost:${PORT}`));
