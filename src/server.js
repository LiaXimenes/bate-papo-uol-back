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
        response.sendStatus(400)
    } else {
        participants.push({name: participant, lastStatus: Date.now()});
        messages.push({
            from: participant,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: dayjs().format('HH:mm:ss')
        })
        response.sendStatus(200);
    }    
})

server.post("/messages", (request, response) => {
    const user = request.headers.user;
    
    if(request.body.to === "" || request.body.text === ""){
        response.sendStatus(400);

    // } else if(tipo de mensagem !== 'message ou private_message'){
    //     response.sendStatus(400);  
    } else{
        for (let i = 0; i < participants.length; i++){
            if(participants[i].name.includes(user)){
                messages.push({
                    from: user,
                    to: request.body.to,
                    text: request.body.text,
                    type:request.body.type,
                    time: dayjs().format('HH:mm:ss') 
                });
                response.sendStatus(200);
                
            } else{
                response.sendStatus(400);
            }
        }
    }
})

server.get("/messages", (request, response) =>{
    const user = request.headers.user;
    const quantity  = parseInt(request.query.limit);
    if(quantity === null){
        response.send(messages);
    } else{
        const selectedMessages = messages.slice((-quantity));
        response.send(selectedMessages);
    }
})

server.post("/status", (request, response) =>{
    const user = request.headers.user;
    console.log(user);
    for (let i = 0; i < participants.length; i++){
        if(participants[i].name.includes(user)){
            participants[i].lastStatus = Date.now();
            response.sendStatus(200);
            
        } else{
            response.sendStatus(400);
        }
    }
})




// setInterval(() => {
//     for(let i = 0; i < participants.length; i++){
//         const aa = Date.now() - participants[i].lastStatus;
//         console.log(aa)
//         if(Date.now() - participants[i].lastStatus > 10){
//             messages.push({
//                 from: participants[i].name,
//                 to: 'Todos',
//                 text: 'sai da sala...', 
//                 type: 'status', 
//                 time: dayjs().format('HH:mm:ss')
//             })
//         }
//         console.log(messages)
//     }
   
// },15000)



server.listen(4000);