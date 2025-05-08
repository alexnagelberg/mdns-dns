const dgram = require('dgram')
const packet = require('dns-packet')
const child_process = require('node:child_process')

const server = dgram.createSocket('udp4')

server.on('message', (msg, rinfo) => {
  const query = packet.decode(msg)

  // Rewrites *.lan as *.local, resolves with avahi, and returns the IP from avahi output
  // TODO: write without avahi
  const response = {
    type: 'response',
    id: query.id,
    flags: packet.RECURSION_DESIRED,
    questions: query.questions,
    answers: query.questions.filter(q => q.type === 'A').map(q => ({
      type: 'A',
      name: q.name,
      ttl: 300,
      data: child_process.execSync(`avahi-resolve -n ${q.name.replace(/\.lan$/g, '.local')}`).toString()?.trim()?.split('\t')?.at(1)
    }))
  }

  const buf = packet.encode(response)
  server.send(buf, 0, buf.length, rinfo.port, rinfo.address, () => {
    console.log(`Replied to ${rinfo.address}:${rinfo.port} for ${query.questions.map(q => q.name).join(', ')}`)
  })
})

server.on('listening', () => {
  const address = server.address()
  console.log(`DNS server listening on ${address.address}:${address.port}`)
})

server.bind(30053)
