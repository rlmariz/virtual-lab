const io = require("socket.io-client");
const sio = io("http://127.0.0.1:2812", {
  transportOptions: {    
    polling: {
      extraHeaders: {
        'X-Username': 'aaaa'
      }
    }
  }
});

sio.on('connect', () => {
  console.log('connected');
  sio.emit('sum', {numbers: [1, 2]}, (result) => {
    console.log(result);
  });
});

sio.on('connect_error', (e) => {
  console.log(e.message);
});

sio.on('disconnect', () => {
  console.log('disconnected');
});

sio.on('mult', (data, cb) => {dir
  const result = data.numbers[0] * data.numbers[1];
  cb(result);
});

sio.on('client_count', (count) => {
  console.log('There are ' + count + ' connected clients.');
});

sio.on('room_count', (count) => {
  console.log('There are ' + count + ' clients in my room.');
});

sio.on('user_joined', (username) => {
  console.log('User ' + username + ' has joined.');
});

sio.on('user_left', (username) => {
  console.log('User ' + username + ' has left.');
});

async function run(tf) {

  console.log('**** Inicio ****** ');

  while (!sio.connected){
    console.log('Connecting... ');
    await new Promise(resolve => setTimeout(resolve, 500));    
  }

  await sio.emit('tfset', tf, (result) => { 
    console.log(result);
  });

  for (let t = 0; t <= 60; t++) {
  
    tfinput = {
      name: tf.name,
      t: t
    }

    await sio.emit('tfinput', tfinput, (result) => { 
       console.log(result);
    });
  }    

  await sio.emit('tfplot', tf, (result) => { 
    console.log(result);
  });

  await new Promise(resolve => setTimeout(resolve, 2000));  

  sio.disconnect();

  while (!sio.disconnected){
    console.log('Disconnecting... ');
    await new Promise(resolve => setTimeout(resolve, 500));    
  }

  console.log('**** Fim ****** ');
  
}

var tf1 = {
  name: 'tf-1',
  func: '8/(8*s**2+s)'
}

run(tf1);

var tf2 = {
  name: 'tf-2',
  func: '4/(s^2+2*s+3)'
}

run(tf2);