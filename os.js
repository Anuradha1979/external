const os=require('os');
console.log(os.type());
console.log(os.platform())
console.log(os.arch())
console.log(os.totalmem());
const c=os.cpus()
console.log("Number of cpus:"+c.length());
for(i in c)
{
    console.log(c[i]);
}