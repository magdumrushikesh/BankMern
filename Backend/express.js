var mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());

app.use(cors());

var con = mysql.createConnection({
    host: "localhost",
    database: "bank",
    user:"root",
    password:"cdac",
    port: 3306
})

con.connect((err)=>{
    if(err) throw err;
    console.log("Database Connection success");
    
})




app.post("/",(req, res) => {
    const {id,pass, name, balance} = req.body; 
    query= "insert into account values(?,?,?,?)";
    con.query(query,[id,pass,name,balance],(err,results) => {
        if(err) {
            console.log(err);
        }
        res.send("Account created Successfully "+ id +" "+name+" "+balance)
    })

    
})

app.post("/verify",(req, res) => {
    const {id,pass} = req.body; 
    query="SELECT * FROM account WHERE id = ? and pass=?";
    con.query(query,[id,pass],(err,rows)=>{
        if(err) {
            console.log(err);
        };
       if(rows.length >0){
        res.send("Login Successfully"+ id)
       }
       else{
        res.send("Invalid credential try again");
       }
    });
    
})

app.put("/deposit/:id/:balance",(req,res)=>{
    var id= req.params.id;
    var balance = parseInt(req.params.balance);
    query="select balance from account where id= ?;";
    con.query(query,[id],(err,rows)=>{
        if(err) throw err;
        var newbalance=rows[0].balance+balance;
        query="update account set balance = ? where id = ?;";
        con.query(query,[newbalance,id],(err,rows)=>{
            if(err) throw err;
        })

        res.send("Balance updated successfully");
    })

})

app.put("/withdraw/:id/:balance",(req,res)=>{
    var id= req.params.id;
    var balance= parseInt(req.params.balance);
    query="select balance from account where id= ?;";
    con.query(query,[id],(err,rows)=>{
        if(err) throw err;
        var newbalance=rows[0].balance-balance;
        query="update account set balance = ? where id = ?;";
        con.query(query,[newbalance,id],(err,rows)=>{
            if(err) throw err;
            res.send("Balance updated successfully");
            })
    })

})

app.delete("/delete/:id",(req,res)=>{
    var id= req.params.id;
    query="DELETE FROM account WHERE id = ?";
    con.query(query,[id],(err,rows)=>{
        if(err) throw err;
        res.send("Account deleted successfully");
        })
})



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});