// import axios from 'axios';
// import config from '../config/telebirr';
// import logger from '../utils/logger';

// export interface PaymentRequest {
//   amount: number;
//   phoneNumber: string;
//   description: string;
//   reference: string;
// }

// export class TelebirrService {
//   private client = axios.create({
//     baseURL: config.apiUrl,
//     timeout: config.timeout,
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });

//   async initiatePayment(paymentData: PaymentRequest): Promise<any> {
//     try {
//       const response = await this.client.post('/payment/initiate', {
//         appId: config.appId,
//         appKey: config.appKey,
//         amount: paymentData.amount,
//         phoneNumber: paymentData.phoneNumber,
//         description: paymentData.description,
//         reference: paymentData.reference
//       });

//       logger.info(`Payment initiated: ${paymentData.reference}`);
//       return response.data;
//     } catch (error) {
//       logger.error(`Telebirr payment error: ${error}`);
//       throw new Error('Payment initiation failed');
//     }
//   }

//   async verifyPayment(transactionId: string): Promise<any> {
//     try {
//       const response = await this.client.get(`/payment/verify/${transactionId}`, {
//         params: {
//           appId: config.appId,
//           appKey: config.appKey
//         }
//       });

//       logger.info(`Payment verified: ${transactionId}`);
//       return response.data;
//     } catch (error) {
//       logger.error(`Telebirr verification error: ${error}`);
//       throw new Error('Payment verification failed');
//     }
//   }

//   async getTransactionStatus(transactionId: string): Promise<any> {
//     try {
//       const response = await this.client.get(`/transaction/${transactionId}`, {
//         params: {
//           appId: config.appId,
//           appKey: config.appKey
//         }
//       });

//       return response.data;
//     } catch (error) {
//       logger.error(`Telebirr status check error: ${error}`);
//       throw new Error('Failed to get transaction status');
//     }
//   }
// }

// export default new TelebirrService();
