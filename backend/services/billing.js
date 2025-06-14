const stripe = require('stripe')(process.env.STRIPE_KEY);
const ApiUsage = require('../models/ApiUsage');
const User = require('../models/User');

class Billing {
  async calculateUsage(userId) {
    const usage = await ApiUsage.aggregate([
      { $match: { user: userId, date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { 
        _id: null,
        totalChars: { $sum: "$charsProcessed" },
        apiCalls: { $sum: 1 }
      }}
    ]);
    
    return {
      chars: usage[0]?.totalChars || 0,
      calls: usage[0]?.apiCalls || 0
    };
  }

  async createInvoice(userId) {
    const user = await User.findById(userId);
    const { chars, calls } = await this.calculateUsage(userId);
    
    const invoice = await stripe.invoices.create({
      customer: user.stripeId,
      description: `API Usage - ${calls} calls (${chars.toLocaleString()} chars)`,
      auto_advance: true,
      metadata: { userId: userId.toString() }
    });
    
    await stripe.invoiceItems.create({
      invoice: invoice.id,
      customer: user.stripeId,
      amount: this.calculateCost(chars, calls),
      currency: 'usd',
      description: 'PaipersumAI Usage'
    });
    
    return stripe.invoices.finalizeInvoice(invoice.id);
  }

  calculateCost(chars, calls) {
    const baseFee = 2000; // $20/month base
    const perChar = 0.0001; // $0.10 per 1k chars
    const perCall = 0.02; // $0.02 per call
    
    return Math.round(
      baseFee + 
      (chars * perChar) + 
      (calls * perCall)
    );
  }
}

module.exports = new Billing();