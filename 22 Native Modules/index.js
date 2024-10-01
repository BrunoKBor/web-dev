const fs = require("fs")

// write a file 
fs.writeFile("message.txt", "Hello from Bruno!", (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

//read contents of the file 
fs.readFile("message.txt", "utf-8", (err, data) => {
    if (err) throw err;
    console.log('File contents:', data)
})