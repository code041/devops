const fs = require('fs')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

readline.question('Nome do arquivo: ' , filename => {
    readline.question('Conteúdo do arquivo' , text =>{
        fs.writeFile(`${filename}.txt` , text, err =>{
            if(err) throw err
            console.log("arquivo criado com sucesso")
            readline.close()
        })
    })
})