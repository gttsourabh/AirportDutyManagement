require('dotenv').config();
const mongoose = require('mongoose');
const Airport = require('./models/Airport');
const Terminal = require('./models/Terminal');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const count = await Airport.countDocuments();
  if (count > 0) {
    console.log('Airport data already exists, skipping seed');
    process.exit(0);
  }

  const airports = [
    {
      name: 'Chhatrapati Shivaji Maharaj International Airport',
      code: 'BOM',
      city: 'Mumbai',
      terminals: [
        { name: 'Terminal 1', code: 'T1' },
        { name: 'Terminal 2', code: 'T2' },
      ],
    },
    {
      name: 'ULVE Terminal',
      code: 'ULVE',
      city: 'Navi Mumbai',
      terminals: [
        { name: 'Main Terminal', code: 'MT' },
      ],
    },
    {
      name: 'Indira Gandhi International Airport',
      code: 'DEL',
      city: 'Delhi',
      terminals: [
        { name: 'Terminal 1', code: 'T1' },
        { name: 'Terminal 2', code: 'T2' },
        { name: 'Terminal 3', code: 'T3' },
      ],
    },
  ];

  for (const data of airports) {
    const airport = await Airport.create({
      name: data.name,
      code: data.code,
      city: data.city,
    });
    for (const t of data.terminals) {
      await Terminal.create({ airportId: airport._id, name: t.name, code: t.code });
    }
    console.log(`Created: ${data.name} with ${data.terminals.length} terminal(s)`);
  }

  console.log('\nAirport seed complete!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
