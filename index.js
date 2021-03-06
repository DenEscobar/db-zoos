const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const dbConfig = require('./knexfile');

const db =knex(dbConfig.development)
const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

//POST /api/zoos

server.post('/api/zoos', (req, res) => {
  const zoo = req.body;
  if(zoo.name){
    db('zoos').insert(zoo)
    .then( id => {
      res
      .status(201)
      .json({message: `Zoo ${id} created`} )
    })
    .catch(err=>{
      res
      .status(500)
      .json({error: "There was an error while saving your zoo to the database"})
    })
  } else {
    res
    .status(400)
    .json({errorMessage: "Please provide a name for the zoo"})
  }
  
});

//GET /api/zoos

server.get('/api/zoos', (req, res) => {
  db('zoos')
  .then(zoos => {
    res
    .status(200)
    .json(zoos)
  })
  .catch(err=>{
    res
    .status(500)
    .json({error:"Unable to get zoos"})
  })
} )

//GET /api/zoos/:id

server.get('/api/zoos/:id', (req, res) =>{
  const {id} = req.params;
  db('zoos').where('id', id)
    .then(zoo =>{
        if(zoo.length !== 0){
          console.log(zoo)
          res
          .status(200)
          .json(zoo)
        } else {
        res
          .status(404)
          .json({error: "The post with the specified ID does not exist"})
      }
    })
    .catch(err =>{
      res
      .status(500)
      .json({error: "The zoo could not be retrieved."})
    })
  })


//DELETE  /api/zoos/:id

server.delete('/api/zoos/:id', (req, res) =>{
  const {id} = req.params;
  db('zoos').where('id', id).del()
  .then(count => {
    if(count===1){
      res
      .status(200)
      .json({message: "Specified Zoo deleted"})
    } else {
      res
      .status(404)
      .json({message: "The post with the specified ID does not exist "})
    }
  })
  .catch(err =>{
    res
    .status(500)
    .json({error: "The zoo could not be removed"})
  })
})

//PUT /api/zoos/:id

server.put('/api/zoos/:id', (req, res) =>{
  const {id} = req.params;
  const zoo = req.body;
  db('zoos').where('id', id).update(zoo)
  .then(count =>{
    if(count === 1){
      if(zoo.name){
        res
        .status(200)
        .json({message: `Zoo ${id} updated`})
      } else {
        res
        .status(400)
        .json({errorMessage: "Please provide a unique name for the zoo. "})
      } 
    } else {
      res
      .status(404)
      .json({message: "The post with the specified ID does not exist"})
    }
  })
  .catch(err =>{
    res
    .status(500)
    .json({error: "The zoos information could not be modified. "})
  })
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
