const mongoose = require('mongoose')
const password = 'T97dcKf9'
const dbname = 'poruke-api'

const url = `mongodb+srv://oarwa-pmfst:${password}@cluster0.spofc.mongodb.net/${dbname}?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })

  const porukaShema = new mongoose.Schema({
    sadrzaj: String,
    datum: Date,
    vazno: Boolean
  })

  const Poruka = mongoose.model('Poruka', porukaShema, 'poruke')

Poruka.find({vazno: true}).then( result =>{
    result.forEach(p => {
        console.log(p);
    })
    mongoose.connection.close()
})

  /*novaPoruka.save().then(result =>{
    console.log("Poruka spremljena");
    console.log(result);
    mongoose.connection.close()
  })*/

  