// // src/ai/ai.gateway.ts
// import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { AiService } from './ai.service';

// @WebSocketGateway({
//   cors: {
//     origin: '*', // تنظیم مجوزهای CORS به دلخواه
//   },
// })
// export class AiGateway implements OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   constructor(private readonly aiService: AiService) {}

//   @SubscribeMessage('generate-text')
//   async handleGenerateText(@MessageBody() prompt: string, client: Socket) {
//     // دریافت استریم از سرویس AI
//     console.log("hi")
//     const stream = this.aiService.generateTextStream(prompt);

//     try {
//       for await (const token of stream) {
//         // ارسال هر تکه به کلاینت
//         client.emit('text-stream', token);
//       }
//       // پس از پایان استریم، اطلاع‌رسانی به کلاینت
//       client.emit('text-stream-end');
//     } catch (error) {
//       // در صورت بروز خطا، ارسال پیغام خطا به کلاینت
//       client.emit('text-stream-error', error.message);
//     }
//   }

//   // مدیریت قطع ارتباط (اگر نیاز به متوقف کردن استریم باشد)
//   handleDisconnect(client: Socket) {
//     console.log(`کاربر ${client.id} قطع ارتباط کرد.`);
//     // در صورت نیاز می‌توانید منطق قطع استریم را در این متد اعمال کنید
//   }
// }
