const fs = require('fs');
let c = fs.readFileSync('client/src/pages/ManageEvent.tsx', 'utf8');

c = c.replace(
  "onClick={() => window.location.hash = '#organizer-dashboard/my-events'}",
  "onClick={() => window.location.hash = user?.role === 'admin' ? '#admin' : '#organizer-dashboard/my-events'}"
);

fs.writeFileSync('client/src/pages/ManageEvent.tsx', c);
console.log('Fixed back routing for admin');
