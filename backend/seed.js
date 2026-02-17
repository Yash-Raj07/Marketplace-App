import bcrypt from 'bcryptjs';
import { initializeDatabase, runAsync, getAsync } from './database.js';

const SAMPLE_PRODUCTS = [
  {
    title: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  },
  {
    title: 'Smart Watch',
    description: 'Advanced fitness tracking smartwatch with heart rate monitor and GPS',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  },
  {
    title: 'USB-C Cable',
    description: 'Durable 10ft USB-C charging cable with fast charge support',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop',
  },
  {
    title: 'Portable Power Bank',
    description: '20000mAh portable battery with dual USB output ports',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
  },
  {
    title: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829191301-4b12019f3a51?w=400&h=400&fit=crop',
  },
  {
    title: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking and long battery',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
  },
  {
    title: 'Webcam 4K',
    description: '4K ultra HD webcam with auto-focus and built-in microphone',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
  },
  {
    title: 'Monitor Stand',
    description: 'Adjustable aluminum monitor stand with storage drawer',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
  },
  {
    title: 'Phone Case',
    description: 'Protective TPU phone case with drop protection for most phones',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop',
  },
  {
    title: 'Screen Protector',
    description: 'Tempered glass screen protector with easy installation kit',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1609034227505-5876f6aa4e90?w=400&h=400&fit=crop',
  },
];

const SAMPLE_USERS = [
  {
    email: 'user1@example.com',
    password: 'password123',
    name: 'John Doe',
  },
  {
    email: 'user2@example.com',
    password: 'password123',
    name: 'Jane Smith',
  },
];

async function seedDatabase() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();

    console.log('Seeding users...');
    for (const user of SAMPLE_USERS) {
      const existingUser = await getAsync('SELECT id FROM users WHERE email = ?', [user.email]);
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await runAsync(
          'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
          [user.email, hashedPassword, user.name]
        );
        console.log(`✓ Created user: ${user.email}`);
      }
    }

    console.log('Seeding products...');
    for (const product of SAMPLE_PRODUCTS) {
      const existingProduct = await getAsync('SELECT id FROM products WHERE title = ?', [
        product.title,
      ]);
      if (!existingProduct) {
        await runAsync(
          'INSERT INTO products (title, description, price, image) VALUES (?, ?, ?, ?)',
          [product.title, product.description, product.price, product.image]
        );
        console.log(`✓ Created product: ${product.title}`);
      }
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Email: user1@example.com');
    console.log('Password: password123');
    console.log('\nEmail: user2@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
