const socket = io('/')

// const peers = {};

const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
});

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
}).then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    myPeer.on('call', (call) => {
        call.answer(stream);
        const video = document.createElement('video');

        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        }); 
   });
        
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);

    });
})
    
myPeer.on('open', id => {
    // console.log(id);
    socket.emit('join-room', ROOM_ID, id);
});

socket.on('user-disconnected', (userId) => {
    if (peers[userId]) {
        peers[userId].closed();
    }
})

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
};

const connectToNewUser = (userId, stream) => {
    console.log('frontend user');
    console.log(userId);
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });

        call.on('close', () => {
            video.remove();
        });
        
    peers[userId] = call;
};

















// // This where our frontend is living. Create function to see our own video 

// const socket = io('http://local5000')
// // const socket = io('/') //it's kicked out after after first connect

// const videoGrid = document.getElementById('video-grid')
// const myVideo = document.createElement('video'); //this will create video tag
// myVideo.muted = true;

// var peer = new Peer(undefined, {
//     path: '/peerjs',
//     host: '/',
//     port: '5000'
// })

// let myVideoStream

// navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: false,
// }).then((stream) => {
//     myVideoStream = stream; //stream is in the promise (either resolve or rejected )
//     addVideoStream(myVideo, stream);

//     peer.on('call', call => {
//         call.answer(stream) //when the user call us we answer it 
//         const video = document.createElement('video')
//         call.on('stream', userVideoStream => { //add the user to the vidow stream
//             addVideoStream(video, userVideoStream)
//         })
//     })

//     socket.on('user-connected', (userId) => {
//         connectToNewUser(userId, stream); //stream comes from in the promise
//     })
    
// })

// peer.on('open', id => { //this where automathcally generate id for new user
//     // console.log(id); //this is the id for me
//     socket.emit('join-room', ROOM_ID, id);
// })
// socket.emit('join-room', ROOM_ID);


// const connectToNewUser = (userId, stream) => {   //connect new user right here
//     console.log('new user');
//     console.log(userId); //This is someelse new id
//     const call = peer.call(userId, stream) //calling that user
//     const video = document.createElement('video')
//     call.on('stream', userVideoStream => {  // 
//         addVideoStream(video, userVideoStream)
//     })
// }

// const addVideoStream = (video, stream) => {
//     video.srcObject = stream;
//     video.addEventListener('loadedmetadata', () => {
//         video.play()
//     })
//     videoGrid.append(video); //this function create your own video
// }