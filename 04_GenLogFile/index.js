const http = require('http');
const fs = require("fs");
const path = require("path");
const url = require("url");
const { json } = require('stream/consumers');

const server = http.createServer((req, res) => {
    if (req.url === "/favicon.ico") return res.end();
    const date = new Date();
    const time = date.toLocaleString();

    const extUrl = url.parse(req.url, true)
    const log = `${time} :: ${extUrl.pathname}\n ${JSON.stringify(extUrl.query)}`


    fs.appendFile("access.log", log + "\n", (err) => {
        if (err) {
            console.error(err)
            return;
        }
        switch (extUrl.pathname) {
            case '/': res.end("Home Page")
                break;

            case '/about': res.end("About Page")
                break;

            case '/contact': res.end("Contact Page")
                break;

            case '/search':
                const { name, age } = extUrl.query
                res.end(`Hello dear , your name is ${name} and your age is ${age}`)
                break;

            default: res.end("Page Not Found")
                break;
        }

    })
})

server.listen("8000", "localhost", () => {
    console.log("Server start with :: ", "http://localhost:8000");
})