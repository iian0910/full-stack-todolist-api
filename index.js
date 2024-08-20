const Express = require('express')
const { MongoClient } = require('mongodb')
const cors = require('cors')
const multer = require('multer')

const app = Express()
app.use(cors())

// Mongodb 設定
var CONNECTION_STRING = process.env.CONNECTION_STRING
var PORT = process.env.PORT || 5038
let client
let database

async function connectToDatabase() {
  if (!client || !client.isConnected) {
    try {
      const client = new MongoClient(CONNECTION_STRING)
      await client.connect()
      database = client.db()
  
      console.log('MongoDB Connection Successful')
    } catch (err) {
      console.error('Failed to connect to MongoDB', error)
    }
  }
}

app.get('/api/todo_app/GetNote', async(request, response) => {
  await connectToDatabase()

  try {
    const result = await database.collection('todo_app_collection').find({}).toArray()
    response.json({
      success: true,
      data: result,
      message: 'get list successfully'
    })
  } catch (err) {
    response.status(500).send(`Error: ${err}`)
  }
})

app.post('/api/todo_app/AddNote', multer().none(), async(request,response)=>{
  try {
    const numOfDocs = await database.collection('todo_app_collection').countDocuments()
    await database.collection('todo_app_collection').insertOne({
      id: (numOfDocs + 1).toString(),
      description: request.body.newNotes
    })

    response.json({
      success: true,
      message: 'add todo successfully'
    })
  } catch (err) {
    response.status(500).json(`Error: ${error.message}`)
  }
})

app.delete('/api/todo_app/DeleteNote',(request,response)=>{
  database.collection('todo_app_collection').deleteOne({
    id:request.query.id
  });
  response.json({
    success: true,
    message: 'delete todo successfully'
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})