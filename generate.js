const fs = require('fs')
const {execSync: exec} = require("child_process")

let buffer = ""
const print = (...args) => buffer += args.join('')+'\n'
const range = n => [...Array(n).keys()]

exec('rm -rf out')
fs.mkdirSync('out')

const frames = 99

for (const frame of range(frames+1)) {
    console.log(`Frame ${frame+1}/${frames+1}`)
    let time = (frame/frames).toPrecision(2)
    exec(`./evert -time ${time} > out/evert${frame}.out`)

    const text = fs.readFileSync(`out/evert${frame}.out`, {encoding: 'utf8'})
    const lines = text.trim().split('\n')

    lines.shift()   // { NMESH
    const [Nu, Nv] = lines.shift().split(' ').map(n => parseInt(n))
    lines.pop()     // }

    print(`o evert${frame}`)

    let groups = 0
    let vert = 0

    for (const line of lines) {
        if (line.length == 0) {
            continue
        }
        const [pos, normal] = line.split('    ')
            .map(l =>
                l.split(' ')
                .map(n => parseFloat(n).toPrecision(7))
                .join(' ')
            )

        print(`v ${pos}`)
        print(`vn ${normal}`)
        vert++
    }

    print('')

    // f 1 2 14 15
    // f 2 3 15 16

    for (let v = 0; v < Nv-1; v++) {
        for (let u = 1; u <= Nu-1; u++) {
            let i = (frame*Nu*Nv) + ((v * Nu) + u)
            let coords = [i, i+Nu, i+Nu+1, i+1].map(c => c+'//'+c).join(' ')
            print(`f ${coords}`)
        }
    }
}

fs.writeFileSync(`combined.obj`, buffer)
