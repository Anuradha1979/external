const http=require('http');
const fs=require('fs');
const url=require('url');
const stu=require('./students.json');
const server=http.createServer(function(req,res){
    res.setHeader("Content-Type","text/html");
    if(req.method=="GET" && req.url=='/')
    {
        res.write("<h1> Welcome to Rest Api Server");
        res.end();
    }
    
if(req.method == "GET" && req.url == '/list')
{
    fs.readFile('./students.json', 'utf8', function(err, data)
    {
        if(err)
        {
            res.end("Error reading file");
            return;
        }

        res.write(data);
        res.end();
    });
}

    if(req.method=="POST")
{
    const newStu = url.parse(req.url, true).query;
    stu.push(newStu);
    fs.writeFileSync('./students.json', JSON.stringify(stu, null, 2));
    res.write("<h1>Data uploaded successfully</h1>");
    res.end();
}
    
if(req.method == "PUT")
{
    const upstu = url.parse(req.url, true).query;

    for(let s in stu)
    {
        if(stu[s]['roll'] == upstu['roll'])
        {
            stu[s]['name'] = upstu['name'];
            stu[s]['year'] = upstu['year'];
            stu[s]['branch'] = upstu['branch'];
            stu[s]['cgpa'] = upstu['cgpa'];

            fs.writeFileSync('./students.json', JSON.stringify(stu, null, 2));

            res.write("Data updated successfully");
            res.end();
            return;
        }
    }

    res.statusCode = 404;
    res.end("Student not found");
}


if(req.method == 'DELETE')
{
    const delstu = url.parse(req.url, true).query;

    for(let s in stu)
    {
        if(stu[s]['roll'] == delstu['roll'])
        {
            stu.splice(s, 1);

            fs.writeFileSync('./students.json', JSON.stringify(stu, null, 2));

            res.write("Deleted successfully");
            res.end();
            return;
        }
    }

    res.statusCode = 404;
    res.end("Student not found");
}

});
server.listen(3000,()=>
{
    console.log("Server is listening at 3000");
})