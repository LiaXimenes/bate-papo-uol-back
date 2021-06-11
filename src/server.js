import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';

const server = express();
server.use(cors());
server.use(express.json());

const participants = [];
const messages = [];

server.get("/participants", (request, response) =>{
    response.send(participants);
})

server.post("/participants", (request, response) => {
    const participant = request.body.name;
    if (participant === ""){
        response.status(400)
    } else {
        participants.push({name: participant, lastStatus: Date.now()});
        messages.push({
            from: participant,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: dayjs().format('HH:mm:ss')
        })
        response.status(200);
    }    
})

server.post("/messages", (request, response) => {
    const user = request.headers.user;
    if(request.body.to === "" || request.body.text === ""){
        response.status(400);

    } else{
        messages.push({
            from: user,
            to: request.body.to,
            text: request.body.text,
            type:request.body.type,
            time: dayjs().format('HH:mm:ss') 
        });
        response.status(200);
    }
})

server.get("/messages", (request, response) =>{
    const user = request.headers.user;

    response.send(messages);
    
})

server.post("/status", (request, response) =>{
    const user = request.headers.user;
    console.log(user);
    response.send(user)
    //if(participants){}
    
})

server.listen(4000);