const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', (req) => {return JSON.stringify(req.body)})

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time :body'))

data = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

function generateId() {
    const id = String(Math.floor(Math.random() * 10000000000))
    if (data.find(entry => entry.id === id))
        return generateId()
    else
        return id 
}

app.get('/info', (req, res) => {
    res.send(`Server has info for ${data.length} people\n` + (new Date()))
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const note = data.find(cur => (cur.id === id)) 
    if (note)
        res.json(note)
    else
        res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    data = data.filter(note => note.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const id = generateId()
    const body = req.body

    if (data.find(entry => body.name === entry.name))
    {
        res.status(404).send("{ error: 'name must be unique' }").end()
        return
    }

    if (!body.name || !body.number)
    {
        res.status(404).send("{ error: 'Name or number is missing' }").end()
        return
    }

    new_entry = {"id": id, "name": body.name, "number": body.number} 
    data.push(new_entry)
    res.json(new_entry)
})

app.get('/api/persons', (req, res) => {
    res.json(data)
})

const PORT = 3001 
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
