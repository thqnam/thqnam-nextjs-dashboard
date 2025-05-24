import {
  User,
  Customer,
  Invoice,
  Revenue,
} from '../lib/definitions';
import postgres from 'postgres';

const NeonSQL = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const SupabaseSQL = postgres(process.env.QNEDSPB_POSTGRES_URL!, { ssl: 'require' });

async function prepareDatabase() {
  const result = await SupabaseSQL`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  return result;
}

async function seedUsers() {

  await SupabaseSQL`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const users = await NeonSQL<User[]>`SELECT * FROM users`;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      return SupabaseSQL`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedCustomers() {

  await SupabaseSQL`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const customers = await NeonSQL<Customer[]>`SELECT * FROM customers`;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => SupabaseSQL`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCustomers;
}

async function seedInvoices() {

  await SupabaseSQL`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const invoices = await NeonSQL<Invoice[]>`SELECT * FROM invoices`;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => SupabaseSQL`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedInvoices;
}

async function seedRevenue() {
  await SupabaseSQL`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const revenue = await NeonSQL<Revenue[]>`SELECT * FROM revenue`;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => SupabaseSQL`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    const result = await SupabaseSQL.begin((SupabaseSQL) => [
      prepareDatabase(),
      seedUsers(),
      seedCustomers(),
      seedInvoices(),
      seedRevenue(),
    ]);
    return Response.json({ message: 'Database seeded successfully' }, { status: 200 });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
