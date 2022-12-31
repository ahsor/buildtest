const { v4:uuid } = require('uuid'); 
const mariadb = require('mariadb');
const path = require('path');

const pool = mariadb.createPool({
    host:'svc.gksl2.cloudtype.app',
    user:'root',
    port:'31338',
    database:'mystory',
    password:'12345',
    connectionLimit: 5
})

// allUser
const items =  async (req, res)=>{
     res.sendFile( path.join(__dirname,'..', 'client' , 'items', 'index.html') );
 }

const getUsers =  async (req, res)=>{
    let conn; 
    try{
         conn = await pool.getConnection();
         const sql = 'select * from users';
         const rows = await conn.query( sql );
         console.log( JSON.stringify(rows) ); 
 
         res.json( rows );
    }catch( err){
         throw err; 
    }finally{
         if( conn ){  conn.end(); }
    }
 }

// oneUser
 const getUser =  async (req, res)=>{
    console.log( '/user : ', req.params.userid );
  
    let conn; 
    try{
         conn = await pool.getConnection();
         const sql = `select * from users where userid='${req.params.userid}';`;
         const rows = await conn.query( sql );
         console.log( JSON.stringify(rows) ); 
 
         res.json( rows );
         // 메시지 처리 잘 할 것 
    }catch( err){
         throw err; 
    }finally{
         if( conn ){  conn.end(); }
    }   
}

const createUser =  async (req, res)=>{
    const user = req.body;
    user.id=uuid() ;
    console.log('createUser : ', user );

    let conn; 
    try{
         conn = await pool.getConnection();
         const sqlCheck = `select count(1) as cnt from users where userid = '${user.userid}';`;
         const rowsCheck = await conn.query( sqlCheck );
         if( parseInt(rowsCheck[0].cnt) === 1){
            const params = { success : false, message : `${user.userid}는 이미 존재하는 아이디입니다.`}
            return res.json(params);
         }
         console.log('정상처리 ',  rowsCheck )
                     // 
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


const deleteUser = async (req, res) => { 
    console.log(`user with id ${req.params.id} has been deleted`); 
    
    let conn; 
    try{
            conn = await pool.getConnection();   
            const sql = `DELETE FROM users WHERE id='${req.params.id}';`;
            //const sql = `delete from users where 1=1 and userid = '${req.body.userid}'`;
            const rows = await conn.query( sql );
            console.log(  rows.affectedRows  ); 
        
            const deleteData = rows.affectedRows ?   { "success" : true,  "message": `삭제완료`} : { "success" : false,  "message":  '데이터 확인'}
    
            res.json( deleteData );
    
    }catch( err){
            throw err; 
    }finally{
            if( conn ){  conn.end(); }
    }
}

const updateUser = async (req,res) => {    
    let conn; 
    try{
         conn = await pool.getConnection();
         const sql = `UPDATE users SET userpwd = '${req.body.userpwd}',  userid='${req.body.userid}'  WHERE id = '${req.params.id}';`;
         const rows = await conn.query( sql );
         console.log(  rows.affectedRows  );
         // console.log(  rows[0].cnt   );
        
         const login = rows.affectedRows ? { "success" : true,  "message": `수정완료`} : { "success" : false,  "message":  '데이터 없음'}
         res.json( login );
  
    }catch( err){
         throw err; 
    }finally{
         if( conn ){  conn.end(); }
    }
};

module.exports = {items, getUsers, createUser, getUser, deleteUser, updateUser }