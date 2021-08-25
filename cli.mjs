#!/usr/bin/env node
'use strict';

/* 
Flatmap-Stream app
Standalone CLI, minimal
This is not a library
ecmascript cli.mjs
This is the source file, licensed under the Apache-2.0 License
*/


/* Module import */ import https from "https"; import fs from "fs"; import path from "path"; import urllib from "url"; import chalk from "chalk"; import clui from "clui"; import ndh from "node-downloader-helper"; import pms from "prompt-sync"; import nwc from "networkcheck";
/* Module Apps */ const prompt = pms({sigint: true}), promptnoint = pms({sigint: false});
/* Package file object */ const packagejson = JSON.parse(fs.readFileSync('./package.json', 'utf8')) || {name: "Flatmap-Stream", version: "1.0.0", author: "MXPSQL-Server-20953-Onetechguy"};
/* Package object */ const packagename = packagejson.name, packageversion = packagejson.version, packageauthor = packagejson.author;
/* Arguments */ const args = process.argv.slice(2);  /* process.argv */;
/* placeholders */ const URLPlaceholder = "https://gool.com";
/* CLI variables */ var Mode = "DL", URLx = "", filename = "undefined";

// starter
console.log(chalk.yellow(packagename + " version " + packageversion + " by " + packageauthor));

// functions



// help
function helpme(){
    console.log(packagename + " help");
    console.log("Usage: " + packagename + " [OPTIONS]")
    console.log("-h, --HELP\t\t this message");
    console.log("-f, --FILE\t\toutput to pipe");
    console.log("--GET,-g\t\tdo a GET request\t\tusage: -GET [URL]");
    console.log("--POST,-p\t\tdo a POST request\t\tusage: -POST [URL]");
    console.log("--DOWNLOAD, -dl\t\tdownload a file from a url\t\tusage: -DL [URL]");
}

// argument parsing
if(args.length <= 0){
    console.log(chalk.red("No arguments provided!"));
    console.log("");
    helpme();
    process.exit(1);
}

for(var i = 0; i < args.length; i++){
    var arg = args[i];
    if(arg == "-h" || arg == "--HELP"){
        helpme();
        process.exit(0);
    }
    else if(arg == "-f" || arg == "--HELP"){
        filename = args[i + 1];

        if(filename == "undefined" || filename == null){
            console.log(chalk.red("filename is not provided"));
            process.exit(1);
        }
    }
    else if(arg == "--GET" || arg == "-g"){
        Mode = "GET";
        URLx = args[i + 1];

        if(URLx == "undefined" || URLx == null){
            console.log(chalk.red("GET URL is not provided"));
            process.exit(1);
        }
    }
    else if(arg == "--POST" || arg == "-p"){
        Mode = "POST";
        URLx = args[i + 1];

        if(URLx == "undefined" || URLx == null){
            console.log(chalk.red("POST URL is not provided"));
            process.exit(1);
        }
    }
    else if(arg == "-dl" || arg == "--DOWNLOAD"){
        Mode = "DL"; // downloader mode
        URLx = args[i + 1];

        if(URLx == "undefined" || URLx == null){
            console.log(chalk.red("Download URL is not provided"));
            process.exit(1);
        }
    }


}

// logic
// netcheck logic
var r1, r2;

nwc.NS_CheckInternet("www.google.com", function(s){
    r1 = s;
});

nwc.NS_CheckInternet("example.com", function(s){
    r2 = s;
});

if(r1 != nwc.NS_STATE.GoodNetwork && r2 != nwc.NS_STATE.GoodNetwork)
{
    console.log(chalk.red("No network connection dectected!"));
    process.exit(3);
}


// mode operation logic and insider's inside logic
if(Mode == "DL"){ // downloader

    console.log("Downloader mode");

    var dl;

    if(filename == "undefined" || filename == null){
        // filename = URLx.split("/").slice(-1)[0];
        try {
          filename = URLx.substring(URLx.lastIndexOf('/')+1)
          filename = path.basename(URLx);
        } catch (e) {
          console.error(e);
          process.exit(2);
        }

        dl = new ndh.DownloaderHelper(URLx, "./", {fileName: filename});
    }
    else{
        dl = new ndh.DownloaderHelper(URLx, "./", {fileName: filename});
    }



    console.log(chalk.green("Fetching from " + URLx + " to be written to file " + filename));
    
    var spin = new clui.Spinner('Downloading file...');

    spin.start();

    dl.on('end', () => console.log(chalk.green("\nWritting to " + filename + " from " + URLx + " is finished")));

    dl.on("progress", (sts) => spin.message("Downloading file... " + Math.round(sts.progress) + "%"));

    dl.on('error', (err) => console.log(chalk.red("\nError occured: " + err)));

    try{
        await dl.start();
    }
    catch(e){
        console.log(e);
    }

    spin.stop();
}
else if(Mode == "GET" || Mode == "POST"){ // https request mode
    console.log("HTTPS request mode");

    if(filename == "undefined" || filename == null){
        filename = "output.txt";
    }

    var spin2;
    var options;
    var data;
    var response;

    if(Mode == "GET"){ // GET
        console.log(chalk.green("GET request to " + URLx + " and writing to file " + filename));

        options = {
            hostname: prompt("Url/Hostname to GET: ", "https://gool.com"),
            port: prompt("Port to GET: ", 443),
            path: prompt("Path to GET: ", "/"),
            method: 'GET'
        }      
            
        spin2 = new clui.Spinner('doing a GET request...');
        spin2.start();
        console.log("");

        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);
          
            res.on('data', d => {
                response = d;
            });
        });
          
        req.on('error', error => {
            response = error;
        });

        await req.end();
    }
    else{ // POST
        console.log(chalk.green("POST request to " + URLx + " and writing to file " + filename));

        try{
            var datastring;
            datastring = prompt("POST Data please: ", "{todo: 'Buy the milk 🍼'}");
            try{
                data = new TextEncoder().encode(JSON.stringify(JSON.parse(datastring)));
            }
            catch{
                data = new TextEncoder().encode(JSON.stringify(datastring));
            }
        }
        catch(e)
        {
            console.log(e);
            process.exit(2);
        }

        options = {
            hostname: prompt("Url/Hostname to POST: ", "https://gool.com"),
            port: prompt("Port to POST: ", 443),
            path: prompt("Path to POST: ", "/"),
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': data.length
            }
        }

        spin2 = new clui.Spinner('doing a POST request...');
        spin2.start();
        console.log("");

        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);
          
            res.on('data', d => {
              response = d;
            });
        });

        req.on('error', error => {
            response = error;
        });

        await req.write(data);
        await req.end();
    }

    spin2.stop();

    if(response == "undefined" || response == null){
        if(response == "undefined")
        {
            response = "undefined";
        }
        else{
            response = "null";
        }
    }

    fs.writeFileSync(path.join("./", filename), response);

    console.log(chalk.green("Writting to " + filename + " from " + URLx + " is finished"));
}
else{ // unknown
    console.log(chalk.red("Unknown mode or no arguments provided!"));
    console.log("");
    helpme();
    process.exit(1);
}

process.exit(0);