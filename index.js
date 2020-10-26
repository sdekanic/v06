const express = require('express')
const app = express()

const Poruka = require('./models/poruke')

const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))


const zahtjevInfo = (req, res, next) => {
    console.log('Metoda:', req.method)
    console.log('Putanja:', req.path)
    console.log('Tijelo:', req.body)
    console.log('---')
    next()
  }
  
  app.use(zahtjevInfo)
  
let poruke = [
    {
        id: 4,
        sadrzaj: 'HTML nije jednostavan',
        vazno: true
    },
    {
        id: 8,
        sadrzaj: 'React koristi JSX sintaksu',
        vazno: false
    },
    {
        id: 13,
        sadrzaj: 'GET i POST su najvaznije metode HTTP protokola',
        vazno: true
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Pozdrav od Express servera + nodemona</h1>')
})

app.get('/api/poruke', (req, res) => {
    Poruka.find({}).then( svePoruke =>{
        res.json(svePoruke)
    })
})

app.get('/api/poruke/:id', (req, res, next) => {
    const id = req.params.id
    Poruka.findById(id)
    .then(poruka => {
        if(poruka){
            res.json(poruka)
        } else{
            res.status(404).end()
        }
    })
    .catch(err => next(err))
})

app.delete('/api/poruke/:id', (req, res, next) => {
    const id = req.params.id
    Poruka.findByIdAndRemove(id).then(result => {
        res.status(204).end()
    })
    .catch(err => next(err))
})

app.put('/api/poruke/:id', (req, res, next) => {
    const id = req.params.id
    const podatak = req.body

    const poruka = {
        sadrzaj: podatak.sadrzaj,
        vazno: podatak.vazno
    }

    Poruka.findByIdAndUpdate(id, poruka, {new: true})
        .then(poruka => {
            res.json(poruka)
        })
        .catch(err => next(err))
})

app.post('/api/poruke', (req, res, next) => {
    const podatak = req.body
    const poruka = new Poruka({
        sadrzaj: podatak.sadrzaj,
        vazno: podatak.vazno || false,
        datum: new Date(),   
    })

    poruka.save().then( result => {
        console.log("Podatak spremljen");
        res.json(result);
    })
    .catch(err => next(err))
})

const nepoznataRuta = (req, res) => {
    res.status(404).send({ error: 'nepostojeca ruta' })
}
  
app.use(nepoznataRuta)

const errorHandler = (err, req, res, next) => {
    console.log("Middleware za pogreške");

    if(err.name === "CastError"){
        return res.status(400).send({error: "Krivi format ID paramatra"})
    } else if(err.name === "ValidationError"){
        return res.status(400).send({error: "Krivi format podatka"})
    }
    next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server sluša na portu ${PORT}`);
})
