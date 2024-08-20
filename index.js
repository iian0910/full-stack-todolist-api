const Express = require('express')
const { MongoClient } = require('mongodb')
const cors = require('cors')
const multer = require('multer')

const app = Express()
app.use(cors())

// Mongodb 設定
var CONNECTION_STRING = 'mongodb+srv://ianFan:ianFan@cluster0.ofmahog.mongodb.net/todo_app'
var PORT = 5038
var database

async function connectToDatabase() {
  try {
    const client = new MongoClient(CONNECTION_STRING)
    await client.connect()
    database = client.db()

    console.log('MongoDB Connection Successful')
  } catch (err) {
    console.error('Failed to connect to MongoDB', error)
  }
}

app.listen(PORT, async () => {
  await connectToDatabase()
  console.log(`Server is running on port ${PORT}`)
})

app.get('/api/todo_app/GetNote', async(request, response) => {
  try {
    if (!database) {
      return response.status(500).send('Database connection not initialized')
    }

    const result = await database.collection('todo_app_collection').find({}).toArray()
    response.send(result)
  } catch (err) {
    response.status(500).send(`Error: ${err}`)
  }
})

app.post('/api/todo_app/AddNote', multer().none(), async(request,response)=>{
  try {
    if (!database) {
      return response.status(500).send('Database connection not initialized')
    }

    const numOfDocs = await database.collection('todo_app_collection').countDocuments()
    await database.collection('todo_app_collection').insertOne({
      id: (numOfDocs + 1).toString(),
      description: request.body.newNotes
    })

    response.json('Add Successfully')
  } catch (err) {
    response.status(500).json(`Error: ${error.message}`)
  }
})

app.delete('/api/todo_app/DeleteNote',(request,response)=>{
  database.collection('todo_app_collection').deleteOne({
    id:request.query.id
  });
  response.json("Delete Successfully")
})