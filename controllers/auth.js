const mariadb = require('mariadb');
const {v4:uuid} = require('uuid');
 

const pool = mariadb.createPool({
    host:'https://admin-mariadb-cf24lcbkizu9.gksl2.cloudtype.app/',
    user:'root',
    port:'3306',
    database:'mystory',
    password:'12345',
    connectionLimit: 5
})

const path = require('path');
const bcrypt = require('bcrypt'); 


const handleLogin = async (req,res) => {    
     //
     const { userid, userpwd } = req.body;
     console.log( userid, userpwd );
     if (!userid || !userpwd) return res.status(400).json({ "success" : false,'message': '아이디, 비밀번호를 입력하세요.' });

     let conn; 
     try{
          conn = await pool.getConnection();
          const sqlCheck = `select count(1) as cnt , userpwd from users where userid = '${userid}';`;
          const rowsCheck = await conn.query( sqlCheck );
          console.log( rowsCheck[0].cnt);

          if( parseInt(rowsCheck[0].cnt) !== 1){
            const params = { "success" : false, "message" : `아이디  를 확인하세요.`}
            return res.json(params);
          }
         const match = await bcrypt.compare(userpwd, rowsCheck[0].userpwd); 
        
        if( !match ){
            const params = { "success" : false, "message" : `  비밀번호를 확인하세요.`}
            return res.json(params);
            //return res.sendStatus(409).json(params);
        }
        
        // res.setHeader('set-cookie', `user=${userid}`) 
         res.cookie('user', userid ,{    
          // maxAge: 5000,
          // expires: new Date('26 July 2021'),
          httpOnly: false,  // 브라우저단에서 읽지 못함 
          secure: true,
          // domain: 'example.com',            
          Expires:`${new Date()+1}` ,  
          authorized: true // 인증됨
   })
        
          
       const login =   { "success" : true,  "message": `${userid}님 로그인` ,  "userid" : userid }  
       return res.status(200).cookie('fizz', 'buzz').json( login );
          
     }catch( err){
          throw err; 
     }finally{
          if( conn ){  conn.end(); }
     }
 };
 
 const viewLogin =  async (req, res)=>{
     const mycookie =  await  JSON.stringify(req.cookies)
     console.log('login page : ', mycookie);
     if(  mycookie.includes('fizz')   ){
         res.redirect("/");
     }else{
          res.sendFile(path.join(__dirname, '..', 'client', 'login.html'));
     }
      
  }

  const logout =  async (req, res)=>{
      const myCookie = req.cookies;
      console.log('cookie', JSON.stringify(myCookie)  );
       //if(myCookie.contains('user'))
           res.clearCookie('user');
           res.clearCookie('fizz');
           res.send({ "success" : true  })       
  }
  const registerUser =  async (req, res)=>{
     const { userid, userpwd } = req.body;
     if (!userid || !userid) return res.status(400).json({ 'message': '아이디, 비밀번호를 입력하세요.' });
 
     let conn; 
     try{
          conn = await pool.getConnection();
          const sqlCheck = `select count(1) as cnt from users where userid = '${userid}';`;
          const rowsCheck = await conn.query( sqlCheck );
 
          if( parseInt(rowsCheck[0].cnt) === 1){
             const params = { "success" : false, "message" : `${userid}는 이미 존재하는 아이디입니다.`}
             return res.json(params);
             //return res.sendStatus(409).json(params);
          }
          console.log('정상처리 ',  rowsCheck );
  
          const hashedPwd = await bcrypt.hash(userpwd, 10); 
          const user = { "userid": userid, "userpwd": hashedPwd , "id":uuid()};
          console.log('createUser : ', user ); 
 
          const sql = `insert into users(userid, userpwd, id) values('${user.userid}', '${user.userpwd}', '${user.id}');`;
          const rows = await conn.query( sql );
          console.log(  rows  ); 
          // OkPacket { affectedRows: 1, insertId: 2n, warningStatus: 0 }
         
          const signUp = rows.affectedRows ? { "success" : true,  "message": `가입완료`} : { "success" : false,  "message":  '데이터 확인'}
          res.json( signUp );
   
     }catch( err){
          throw err; 
     }finally{
          if( conn ){  conn.end(); }
     }
 }
 
 // 수정할 데이터를 가지고 있어야 수정할 수 있음
 // 업데이트는 아이디를 가지고 있는 것이 아니라 쿠키나 세션 정보를 필요로 함 
 const updateUser = async (req,res) => {    
      const { userid, userpwd , username } = req.body;
      if (!userid || !userpwd) return res.status(400).json({ 'message': '아이디, 비밀번호를 입력하세요.' });
 
      const myCookie = req.cookies;
      console.log('cookie', myCookie );
      let conn; 
      try{
           conn = await pool.getConnection();
           const sqlCheck = `select * from users where userid = '${userid}';`;
           const user = await conn.query( sqlCheck );
           console.log('tt', user[0] );


 
           //if( parseInt(rowsCheck[0].cnt) === 1){
           if( user ){
                const match = await bcrypt.compare(userpwd, user[0].userpwd); 
                 
                if( !match ){
                     const params = { success : false, message : `아이디 또는 비밀번호를 확인하세요.`}
                     return res.json(params);
                     //return res.sendStatus(409).json(params);
                } 
             }
            
 
           // 처리 필요 수정할 데이터가 없음 
           const sql = `UPDATE users SET username = '${username}'  WHERE id = '${user[0].id}';`;
           const rows = await conn.query( sql );
           console.log(  rows.affectedRows  );
          
           const login = rows.affectedRows ? { "success" : true,  "message": `수정완료`} : { "success" : false,  "message":  '수정 불가'}
           res.json( login );
    
      }catch( err){
           throw err; 
      }finally{
           if( conn ){  conn.end(); }
      }
  };
 
 module.exports = {handleLogin, viewLogin, logout, registerUser, updateUser };
 

 
 /*
  // res.setHeader('set-cookie', 'foo=bar')
  res.cookie('foo', 'bar', {
    // maxAge: 5000,
    // expires: new Date('26 July 2021'),
    // httpOnly: true,
    // secure: true,
    // domain: 'example.com',
  })
  // res.cookie('fizz', 'buzz')
 */