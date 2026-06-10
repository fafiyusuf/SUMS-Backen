import request from 'supertest';
import app from '../../../src/app';

jest.mock('../../../src/modules/telebirr/telebirr.service', () => ({
  processWebhook: jest.fn(),
  createWalletTopup: jest.fn()
}));

import telebirrService from '../../../src/modules/telebirr/telebirr.service';

describe('Telebirr Routes Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TELEBIRR_WEBHOOK_SECRET = 'test_secret';
  });

  it('should return 401 for webhook with invalid signature', async () => {
    const payload = { outTradeNo: 'T1', status: 'SUCCESS', amount: 10 };

    const res = await request(app)
      .post('/api/v1/wallet/webhook/telebirr')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid webhook signature');
    expect(telebirrService.processWebhook).not.toHaveBeenCalled();
  });

  it('should accept webhook with valid signature and call service', async () => {
    const payload = { outTradeNo: 'T2', status: 'SUCCESS', amount: 20 };
    const signature = require('crypto').createHmac('sha256', process.env.TELEBIRR_WEBHOOK_SECRET).update(JSON.stringify(payload)).digest('hex');

    const res = await request(app)
      .post('/api/v1/wallet/webhook/telebirr')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('x-telebirr-signature', signature);

    expect(res.status).toBe(200);
    expect(telebirrService.processWebhook).toHaveBeenCalledWith(payload);
  });
});
