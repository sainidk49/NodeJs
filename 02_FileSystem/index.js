const fs = require("fs");

/// create file Sync.....
fs.writeFileSync("./text.txt", "Hello, World!");

/// create file Aysc.....
fs.writeFile("./text1.txt", "Hello, Duniya!", (err) => {
    if (err) {
        console.error("Error writing file:", err);
    } else {
        console.log("File written successfully!");
    }
});


///// read file Sync.....call as blocking => read threads
const result = fs.readFileSync("./text.txt", "utf-8");
console.log(result);


///// read file Aync.....call as non-blocking => instant return result
fs.readFile("./text1.txt", "utf-8", (err, result)=>{
    if(err){
        console.error("Error reading file:", err);
    }
    else{
        console.log(result);
    }
});