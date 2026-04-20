import telebirrService from '../../../src/services/walletTelebirrService';

jest.mock('../../../src/models', () => ({
  Transaction: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('../../../src/services/walletService', () => ({
  __esModule: true,
  default: {
    addBalance: jest.fn()
  }
}));

import { Transaction } from '../../../src/models';
import walletService from '../../../src/services/walletService';

describe('TelebirrService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processWebhook idempotency', () => {
    it('should skip processing when transaction status is not pending', async () => {
      const mockTransaction: any = {
        get: jest.fn((key: string) => (key === 'status' ? 'completed' : undefined)),
        update: jest.fn()
      };

      (Transaction as any).findOne.mockResolvedValue(mockTransaction);

      await telebirrService.processWebhook({ outTradeNo: 'X1', status: 'SUCCESS', amount: 100 });

      expect(Transaction.findOne).toHaveBeenCalledWith({ where: { outTradeNo: 'X1' } });
      expect(mockTransaction.get).toHaveBeenCalledWith('status');
      expect(mockTransaction.update).not.toHaveBeenCalled();
      expect((walletService as any).addBalance).not.toHaveBeenCalled();
    });
  });

  describe('processWebhook success path', () => {
    it('should mark transaction completed and credit wallet on SUCCESS', async () => {
      const mockTransaction: any = {
        get: jest.fn((key: string) => (key === 'status' ? 'pending' : key === 'userId' ? 'user-123' : undefined)),
        update: jest.fn()
      };

      (Transaction as any).findOne.mockResolvedValue(mockTransaction);

      await telebirrService.processWebhook({ outTradeNo: 'X2', status: 'SUCCESS', amount: 42.5 });

      expect(Transaction.findOne).toHaveBeenCalledWith({ where: { outTradeNo: 'X2' } });
      expect(mockTransaction.get).toHaveBeenCalledWith('status');
      expect(mockTransaction.update).toHaveBeenCalledWith({ status: 'completed' });
      expect((walletService as any).addBalance).toHaveBeenCalledWith('user-123', 42.5);
    });
  });

  describe('createWalletTopup', () => {
    it('should create a pending transaction and return checkout url', async () => {
      (Transaction as any).create.mockResolvedValue({});

      // Spy on createCheckoutUrl on the instance
      const spy = jest.spyOn(telebirrService as any, 'createCheckoutUrl').mockResolvedValue({ checkoutUrl: 'https://checkout', outTradeNo: 'ORDER_ABC' });

      const result = await telebirrService.createWalletTopup('user-1', 10.0, '0912345678');

      expect((Transaction as any).create).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      expect(result).toHaveProperty('checkoutUrl', 'https://checkout');
      expect(result).toHaveProperty('outTradeNo');

      spy.mockRestore();
    });
  });
});
