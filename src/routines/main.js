const http = require('http')
const CurrencyHelper = require('../helper/CurrencyHelper')
const QuoteHelper = require('../helper/QuoteHelper')

const main = (app) => {
    let server = http.createServer(app)

    const { Server } = require('socket.io')
    io = new Server(server)

    io.on('connection', (socket) => {
        socket.on('get_currencies', async () => {
            try {
                const helper = new CurrencyHelper()
                const data = await helper.getData()
                io.emit('set_currencies', data)
            } catch (error) {
                console.log(error)
                io.emit('server_error')
            }
        })

        socket.on('get_quotes', async () => {
            try {
                const helper = new QuoteHelper()
                const data = await helper.getData()
                console.log('sending quote to client');
                io.emit('set_quotes', data)
            } catch (error) {
                console.log(error)
                io.emit('server_error')
            }
        })
    })

    return server
}

module.exports = main