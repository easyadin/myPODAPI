const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./permissions.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-pci-restapi.firebaseio.com"
  });

const express = require('express');
const app = express();
const cors = require('cors');
const db = admin.firestore();

app.use(cors ( {origin:true} ) );

//Routes
app.get('/hello-world', (req, res) =>{
    return res.status(200).send('Hello-world');
});

//Create
//Post
app.post('/api/create', (req, res) =>{
    (async ()=> {
        try {
            await db.collection('audio').doc('/' + req.body.id + '/')
            .create({
                name: req.body.name,
                description: req.body.description,
                album: req.body.album,
                url: req.body.url
            })
            
            return res.status(200).send();
        }
        catch(error){
            console.log(error)
            return res.status(500).send(error);
        }

    })();
});
//Read speficif audio based on ID
//Get
app.get('/api/read/:id', (req, res) =>{
    (async () => {
        try {
            const document =  db.collection('audio').doc(req.params.id);
            let audio = await document.get();
            let response = audio.data();

            return res.status(200).send(response)
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error)
        }
    })();
})


//Read all audio
//Get
app.get('/api/read/', (req, res) => {
    (async ()=> {
        try {
        
            let query = db.collection('audio');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs; // the result of query

                for(let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        name:doc.data().name,
                        description:doc.data().description,
                        album:doc.data().album,
                        url: doc.data().url
                    };

                    response.push(selectedItem);
                }
                return response; // each then should return a value
            })
            return res.status(200).send(response)
        }
        catch(error){
            console.log(error)
            return res.status(500).send(error);
        }

    })();
});

//Update
//Put
app.put('/api/update/:id', (req, res) =>{
    (async ()=> {
        try {
            const document = db.collection('audio').doc(req.params.id);

            await document.update({
                name:req.body.name,
                description:req.body.description,
                album:req.body.album,
                url: req.body.url
            });

            return res.status(200).send();
        }
        catch(error){
            console.log(error)
            return res.status(500).send(error);
        }

    })();
});




//Delete
//Delete
app.delete('/api/delete/:id', (req, res) =>{
    (async ()=> {
        try {
            const document = db.collection('audio').doc(req.params.id);
            await document.delete();
            return res.status(200).send();
        }
        catch(error){
            console.log(error)
            return res.status(500).send(error);
        }

    })();
});





//Export the api to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);