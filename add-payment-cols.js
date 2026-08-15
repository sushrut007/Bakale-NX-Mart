require('dotenv/config');
const { createClient } = require('@libsql/client');

async function main() {
  const db = createClient({ url: process.env.DATABASE_URL });

  const columns = [
    { name: 'paymentMethod', def: "TEXT NOT NULL DEFAULT 'COD'" },
    { name: 'paymentStatus', def: "TEXT NOT NULL DEFAULT 'PENDING'" },
    { name: 'razorpayOrderId', def: 'TEXT' },
    { name: 'razorpayPaymentId', def: 'TEXT' },
  ];

  for (const col of columns) {
    try {
      await db.execute(`ALTER TABLE \`Order\` ADD COLUMN ${col.name} ${col.def}`);
      console.log(`Added column: ${col.name}`);
    } catch (e) {
      console.log(`Column ${col.name} may already exist: ${e.message}`);
    }
  }

  console.log('Done!');
}

main().catch(console.error);
