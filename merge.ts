import fs from 'fs'

const dataDirFls = fs.readdirSync("./data")
const data = []
dataDirFls.forEach((file) => {
    const flData = fs.readFileSync('./data/' + file);
    try {
     

            const fl_data:[]=JSON.parse(flData.toString())
            data.push(...fl_data)
       
    } catch (error) {

    }

})
 fs.writeFileSync('./data.json',JSON.stringify(data))
