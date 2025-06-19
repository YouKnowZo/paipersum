import React from "react";
export default function Pricing() {
  return (
    <section className="my-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Pricing & Plans</h2>
      <div className="flex flex-wrap justify-center gap-8">
        <div className="bg-white text-slate-900 rounded shadow p-6 w-64">
          <h3 className="font-bold text-xl mb-2">Starter</h3>
          <p className="mb-2">$0/month</p>
          <ul className="mb-4 text-left text-sm">
            <li>• Limited uploads</li>
            <li>• Basic AI extraction</li>
          </ul>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled>Current Plan</button>
        </div>
        <div className="bg-white text-slate-900 rounded shadow p-6 w-64 border-2 border-blue-600">
          <h3 className="font-bold text-xl mb-2">Pro</h3>
          <p className="mb-2">$12/month</p>
          <ul className="mb-4 text-left text-sm">
            <li>• Unlimited uploads</li>
            <li>• Advanced AI fill & formatting</li>
            <li>• Priority support</li>
          </ul>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Upgrade with Stripe</button>
        </div>
        <div className="bg-white text-slate-900 rounded shadow p-6 w-64">
          <h3 className="font-bold text-xl mb-2">Business</h3>
          <p className="mb-2">$29/month</p>
          <ul className="mb-4 text-left text-sm">
            <li>• Team access</li>
            <li>• API integration</li>
            <li>• Custom branding</li>
          </ul>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Contact Sales</button>
        </div>
      </div>
    </section>
  );
}