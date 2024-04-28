import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';

dotenv.config();

// database initialisation
    const db =new pg.Client({
         user: "postgres",
        database:"postgres",
        password:"password$$",
        host: "localhost",
        port:5432,


        // user: process.env.DB_USER,
        // database: process.env.DB_NAME,
        // password: String(process.env.DB_PASSWORD),
        // host: process.env.DB_HOST,
        // port: process.env.DB_PORT,
    })

    db.connect()


const app = express()
const PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

  let ITEMS =[]

app.get('/', async (req, res) => {

    try{
        const data =await db.query(`SELECT * FROM Note`)
        ITEMS = data.rows
        res.render('CRUD.ejs',{titleToday:"today",ITEMS:ITEMS});
    }catch (e) {
        console.log(e)
    }
})

app.post('/add', async (req, res) => {
   const entry = req.body.list;
  await  db.query("INSERT INTO Note(listItem ) VALUES($1)", [entry]);

    res.redirect('/')

})

app.post("/edit", async (req, res) => {
  const item = req.body.newItemTitle;
  const id = req.body.newItemId;
  try {
    await db.query("UPDATE Note SET listItem=($1) where id= $2 ",[item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});



app.post('/delete', async (req, res) => {
   const deleteOne = req.body.deleteItem;

   try{
       await db.query("DELETE FROM Note Where id=$1",[deleteOne]);
   }catch (e) {
       console.log(e)
   }
   res.redirect('/');

})






app.listen(PORT,()=>console.log(`Listening on port http://localhost:${PORT}`));
