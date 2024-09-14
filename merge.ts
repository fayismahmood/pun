import fs from 'fs'

const dataDirFls = fs.readdirSync("./data")
const data = []
dataDirFls.forEach((file) => {
    const flData = fs.readFileSync('./data/' + file);
    try {


        const fl_data: [] = JSON.parse(flData.toString())
        data.push(...fl_data)

    } catch (error) {

    }

})
const _data = data.map((e: any) => {
    const inp = e.output.replace(/[\,,\",\n,\!]/g, "").replace(/\. ./g, (e) => {
        return e.replace(". ", " ").toLowerCase()
    }).replace(/\./g,"")
    return {
        input: inp,
        output: e.output
    }
})
fs.writeFileSync('./data.json', JSON.stringify(_data))
