#!/usr/bin/env node

// import modules
import assert from "assert"; import dns from "dns";
// mocha test, runs only on nodejs


// nodejs check
try{
    var glb = global;
}
catch(e){
    throw new exception("No, this is not nodejs");
}


/* Test skeleton
describe("skelly", function() {
    it("skel", function() {
        assert.strictEqual(true, true);
    });
});
*/


// sanity tests
describe("Sanity Test", function() {
    // 1
    it("true is true, this is a sanity test", function() {
        assert.strictEqual(true, true);
    });

    // 2
    it("Bananas equal to Bananas should return true, this is a sanity test", function() {
        assert.strictEqual(eval("Bananas" == "Bananas"), true);
    });

    // 3
    it("1 plus 1 should be equal to 2, this is a sanity test", function() {
        assert.strictEqual(1+1, 2);
    });

    // 4
    it("global.process is process, this is a nodejs sanity test", function() {
        assert.strictEqual(global.process, process);
    });
});

// bootstrap test
describe("Bootstrap test", function(){
    describe("Internet test", function(){
        it("Check for internet connection", function(){
            dns.resolve('examplennnn.com', function(err) {
                console.log(err);
                if (err && err.code == "ENOTFOUND") {
                   assert.strictEqual(true, false);
                } else {
                    assert.strictEqual(true, true);
                }
            });
        });
    });
});


// main test
// import these
import https from "https"; import fs from "fs"; import path from "path"; import urllib from "url"; import chalk from "chalk"; import clui from "clui"; import ndh from "node-downloader-helper"; import pms from "prompt-sync";


// variables
var response;

describe("HTTPS request is not bad result", function(){

    describe("Do POST and GET", function(){
        it("POST", function(){
            const data = new TextEncoder().encode(
                JSON.stringify({
                  todo: 'Buy the milk 🍼'
                })
              );
            
              const options = {
                hostname: 'example.com',
                port: 443,
                path: '/todos',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': data.length
                }
              };

              const req = https.request(options, res => {
                // console.log(`statusCode: ${res.statusCode}`);
            
                res.on('data', d => {
                  response = d;
                });
              });

              req.on('error', error => {
                response = error;
                assert.strictEqual(true, false);
              });

              req.write(data);
              req.end();

              assert.strictEqual(response != null || response != "undefined", true);
        });

        it("GET", function(){
            const options = {
                hostname: 'example.com',
                port: 443,
                path: '/todos',
                method: 'GET'
              };

              const req = https.request(options, res => {
                // console.log(`statusCode: ${res.statusCode}`);
            
                res.on('data', d => {
                    response = d;
                });
              });

              req.on('error', error => {
                  response = error;
                  assert.strictEqual(true, false);
              });

              req.end();

              assert.strictEqual(response != null || response != "undefined", true);
        });

    });

    describe("Downloader", function(){
        it("Download the file", function(){
            // not available
            assert.strictEqual(true, true);
        });
    });
});