"use strict";

// Dependencies
const simpleAES256 = require("simple-aes-256")
const dirArchiver = require("./utils/dir-archiver.js")
const fs = require("fs")

// Variables
const args = process.argv.slice(2)

//Functions
function encrypt(text, useKey){
    let encryptedText = ""

    let key = 0;
    let useKeyLength = useKey.length + 72728532

    for( let i = 0; i <= useKeyLength; i++) key += useKey.length ** useKey.length + 72728532
    
    for( let i = 0; i < text.length; i++){
        let char = text.charCodeAt(i)
        let encryptedChar = char + useKey.charCodeAt(i % useKey.length)

        encryptedText += String.fromCharCode(encryptedChar)
    }

    return encryptedText
}

//Main
if(!args.length) return console.log("node index.js <password> <directory/encryptedFile> <outputName> <encrypt/decrypt>")

switch(args[3]){
    case "encrypt":
        if(!fs.existsSync(args[1])) return console.log("Invalid directory/encryptedFile.")

        console.log("Encrypting the directory, please wait(This might take a while).")
        const archive = new dirArchiver(args[1], `${args[2]}.zip`, [])
        archive.createZip()
        
        setTimeout(function(){
            let archivedData = fs.readFileSync(`${args[2]}.zip`)
            let encryptedData = simpleAES256.encrypt(encrypt("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZaBcDeFgHiJkLmNoPqRsTuVwXyZaBCDEFGHIJKLMNOPQRSTUVWXYZ", args[0]), archivedData)

            fs.writeFileSync(`${args[2]}.encvc`, encryptedData)
            fs.unlinkSync(`${args[2]}.zip`)
            console.log(`Directory successfully encrypted and saved as ${args[2]}.encvc`)
        }, 2000)
        break
    case "decrypt":
        if(!fs.existsSync(`${args[1]}.encvc`)) return console.log("Invalid directory/encryptedFile.")

        console.log("Decrypting the encrypted directory, please wait(This might take a while).")
        let encryptedData = fs.readFileSync(`${args[1]}.encvc`)
        let decryptedData = simpleAES256.decrypt(encrypt("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZaBcDeFgHiJkLmNoPqRsTuVwXyZaBCDEFGHIJKLMNOPQRSTUVWXYZ", args[0]), encryptedData)
        
        fs.writeFileSync(`${args[2]}.zip`, decryptedData)
        console.log(`Successfully decrypted and saved as ${args[2]}.zip`)
        break
    default:
        console.log("Invalid encrypt/decrypt option.")
        break
}