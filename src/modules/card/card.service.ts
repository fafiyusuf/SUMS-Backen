import { User } from '../user/user.model';
import { SmartCard } from './smartCard.model';
import { Wallet } from '../wallet/wallet.model';

class CardService {
  async activateCard(cardId: string, userId: string) {
    const existingUserCard = await SmartCard.findOne({ where: { userId } });
    if (existingUserCard) {
      throw { status: 400, message: 'User already has a linked card' };
    }

    let card = await SmartCard.findOne({ where: { cardId } });

    if (card) {
      if (card.userId && card.userId !== userId) {
        throw { status: 409, message: 'Card already linked to another user' };
      }
      card.userId = userId;
      card.status = 'ACTIVE';
      card.activatedAt = new Date();
      await card.save();
      return card;
    }

    card = await SmartCard.create({ cardId, userId, status: 'ACTIVE', activatedAt: new Date() } as any);
    return card;
  }

  async getMyCard(userId: string) {
    const card = await SmartCard.findOne({ where: { userId } });
    if (!card) throw { status: 404, message: 'No card found for user' };
    return card;
  }

  async linkTelebirr(userId: string, phone: string) {
    const card = await SmartCard.findOne({ where: { userId } });
    if (!card) throw { status: 404, message: 'No card found for user' };
    card.telebirrPhone = phone;
    await card.save();
    return card;
  }

  async getAllCards(limit = 20, offset = 0) {
    const { rows, count } = await SmartCard.findAndCountAll({ 
      limit, 
      offset, 
      include: [{ 
        model: User, 
        as: 'user',
        attributes: { exclude: ['password'] },
        include: [{ model: Wallet, as: 'wallet' }]
      }] as any 
    });
    return { rows, count };
  }

  async getCardById(cardId: string) {
    const card = await SmartCard.findOne({ 
      where: { cardId }, 
      include: [{ 
        model: User, 
        as: 'user',
        attributes: { exclude: ['password'] },
        include: [{ model: Wallet, as: 'wallet' }]
      }] as any 
    });
    if (!card) throw { status: 404, message: 'Card not found' };
    return card;
  }

  async updateCardStatus(cardId: string, status: 'ACTIVE' | 'SUSPENDED') {
    const card = await SmartCard.findOne({ where: { cardId } });
    if (!card) throw { status: 404, message: 'Card not found' };
    card.status = status;
    await card.save();
    return card;
  }

  async issueCard(cardId: string, userId: string) {
    const user = await User.findByPk(userId);
    if (!user) throw { status: 404, message: 'User not found' };

    const existingUserCard = await SmartCard.findOne({ where: { userId } });
    if (existingUserCard) {
      throw { status: 400, message: 'User already has a linked card' };
    }

    const existingCard = await SmartCard.findOne({ where: { cardId } });
    if (existingCard) {
      throw { status: 400, message: 'Card ID is already in use' };
    }

    const card = await SmartCard.create({
      cardId,
      userId,
      status: 'ACTIVE',
      activatedAt: new Date()
    } as any);

    return card;
  }
}

export default new CardService();
