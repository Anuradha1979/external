const fs=require('fs');
const stu=require('./students.json');
const exp=require('express')
const app=exp();
const bp=require('body-parser');
app.use(bp.urlencoded({extended:true}));
app.use(bp.json())
app.get("/",function(req,res){
    fs.readFile('./students.json','utf-8',function(err,data)
{
    if(err)
    {
        res.write("Unable to read");
        res.end();
    }
    else
    {
        res.write(data);
        res.end();
    }
})
})
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
});s

app.listen(3000,()=>
{
    console.log("Server is listening at 3000");
})