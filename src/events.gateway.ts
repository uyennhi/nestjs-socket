import { SubscribeMessage, WebSocketGateway, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'
@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() server;

  
  @SubscribeMessage('events')
  handleMessage(client: any, payload: any): Observable<WsResponse<any>> | any {
     // this.server.emit('resmsg', data);  // io.emit('resmsg', payload)
     
     let { name } = payload;
     if (name === 'nhi') {
       return of({
         event: 'events',
         data: {
           msg: 'hello nhi!'
         }
       })
     }
     if (name === 'uyennhi') {
       return of('hi', 'Im nhi')
         .pipe(
           map($_ =>
             ({
               event: 'events', data: {
                 msg: $_
               }
             }))
         );
     }
     return of(payload);
   }

  num = 0;
  roomno = 1;
   handleConnection(client: Socket)  {
     this.num++ ;
      console.log(`a user connected: `);
    //   setTimeout(function() {
    //     //Sending an object when emmiting an event
    //     client.emit('testerEvent', { description: 'A custom event named testerEvent!'});
    //  }, 1000);
    client.on('clientEvent', data => {
      console.log(data);
   
    });
    client.emit('broadcast',{ description: this.num + ' clients connected!'});
    
    //Increase roomno 2 clients are present in a room.
   
   }

   handleDisconnect( client: Socket) {
     console.log("a user disconnected");
     this.num--;
      client.emit('broadcast',{ description: this.num + ' clients connected!'});
   }
 
  
}
