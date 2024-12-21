import { Injectable } from '@nestjs/common';
import { Neo4jConfigService } from 'config/neo4j.config';
import axios from 'axios';

@Injectable()
export class PaymentService {
  constructor(private readonly neo4jConfigService: Neo4jConfigService) {}

  private async runQuery(query: string, params: Record<string, any>) {
    const session = this.neo4jConfigService.getDriver().session();
    try {
      return await session.run(query, params);
    } finally {
      await session.close();
    }
  }

  //create order with carts of user

  async createPayment(orderId: string, amount: number) {
    //random 9 digits
    const feUrl = process.env.FE_URL;
    const orderCode = Math.floor(100000000 + Math.random() * 900000000);
    const returnUrl = `${feUrl}/checkout/checkout-success`;
    const cancelUrl = `${feUrl}/checkout/checkout-cancel`;
    const description = `Thanh toán đơn hàng ${orderId}`;
    const payload = {
      amount,
      orderCode,
      returnUrl,
      cancelUrl,
      description,
    };
    //call https://tienclay.me/payment/payments/create with payload
    //using axios or fetch
    try {
      console.log(
        'object :>> ',
        `${process.env.PAYMENT_API_URL}/payments/create`,
      );
      console.log('payload :>> ', payload);
      const response = await axios.post(
        `${process.env.PAYMENT_API_URL}/payments/create`,
        payload,
      );
      return response.data.data.checkoutUrl;
    } catch (error) {
      throw new Error(`Payment creation failed: ${error.message}`);
    }
  }
}
