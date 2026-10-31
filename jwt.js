const express = require('express');
const fs = require('fs');
const bp = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 6003;

let stu = require('./students.json');

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

const SECRET_KEY = "mysecretkey";

// Login API
app.post('/login', function(req, res) {
    const { username, password } = req.body;

    if (username === "admin" && password === "12345") {
        const token = jwt.sign(
            { username: username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ token: token });
    } else {
        res.status(401).send("Invalid credentials");
    }
});

// Verify Token Middleware
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];

        if (!token || bearer[0] !== 'Bearer') {
            return res.status(403).send("Token missing");
        }

        jwt.verify(token, SECRET_KEY, function(err, authData) {
            if (err) {
                return res.status(403).send("Invalid Token");
            }

            req.user = authData;
            next();
        });
    } else {
        res.status(403).send("Token missing");
    }
}
app.get('/students', verifyToken, function(req, res) {
    res.json(stu);
});


app.post("/",function(req,res)
{
    const newStu=req.body;
    stu.push(newStu);
    fs.writeFileSync('./students.json',JSON.stringify(stu,null,2));
    res.write("Successfull write");
    res.end();

})
app.put("/",function(req,res){
    const upstu=req.body;
    for(let s in stu)
    {
        if(stu[s]['roll']==upstu['roll'])
        {
            stu[s]['roll']=upstu['roll'];
            stu[s]['name']=upstu['name'];
            stu[s]['branch']=upstu['branch'];
            stu[s]['cgpa']=upstu['cgpa'];
            fs.writeFileSync('./students.json',JSON.stringify(stu,null,2));
            res.write("Updated Successfully");
            res.end();
            return;
        }
    }
    res.status(404).send("Students not found");
})


app.delete("/", function(req, res) {
    const roll = req.query.roll;

    if (!roll) {
        return res.status(400).send("Please provide roll number");
    }

    const index = stu.findIndex(s => s.roll == roll);

    if (index === -1) {
        return res.status(404).send("Student not found");
    }

    stu.splice(index, 1);

    fs.writeFileSync(
        './students.json',
        JSON.stringify(stu, null, 2)
    );

    res.send("Deleted Successfully");
});

app.listen(6003,()=>
{
    console.log("Server is listening at 6003");
})