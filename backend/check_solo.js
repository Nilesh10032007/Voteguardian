const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Event = require('./models/Event');
  const EventSubmission = require('./models/EventSubmission');
  const ClubsEvent = require('./models/ClubsEvent');
  const Registration = require('./models/Registration');
  const PaidRegistration = require('./models/PaidRegistration');

  const events = [
    ...(await Event.find({ title: /solo/i })),
    ...(await EventSubmission.find({ title: /solo/i })),
    ...(await ClubsEvent.find({ title: /solo/i }))
  ];

  console.log('--- SOLO EVENTS ---');
  console.log(JSON.stringify(events.map(e => ({ id: e._id, title: e.title, customQuestions: e.customQuestions, tickets: e.tickets, capacity: e.capacity })), null, 2));

  const eventIds = events.map(e => e._id);
  const regs = await Registration.find({ event: { $in: eventIds } });
  const paidRegs = await PaidRegistration.find({ event: { $in: eventIds }, status: 'completed' });

  console.log('--- REGISTRATIONS ---');
  console.log('Free Regs count:', regs.length, 'Paid Regs count:', paidRegs.length);
  console.log('Sample custom answers:');
  const allRegs = [...regs, ...paidRegs];
  allRegs.forEach((r, idx) => {
    console.log(`Reg #${idx + 1}:`, JSON.stringify(r.customAnswers || r.teamMembers?.[0]?.customAnswers));
  });

  await mongoose.disconnect();
}

run().catch(console.error);
