const fs = require('fs');
let c = fs.readFileSync('client/src/pages/ManageEvent.tsx', 'utf8');

c = c.replace(
  "participants.map((p, i) => (\n                  <div key={p.id || i}",
  "participants.map((p, i) => {\n                  const customAnswers = (p.answers || []).map((a) => { let s = a.answer || ''; if(Array.isArray(s)) s = s.join(', '); return s.toString(); }).filter(x => x);\n                  const dn = p.name || customAnswers[0] || 'N/A';\n                  const de = p.email || (p.name ? '' : customAnswers[1]) || 'N/A';\n                  const dp = p.phone || (p.name ? '' : customAnswers[2]) || 'N/A';\n                  return (\n                  <div key={p.id || i}"
);
c = c.replace(
  "`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`",
  "`https://api.dicebear.com/7.x/avataaars/svg?seed=${dn}`"
);
c = c.replace(
  "<span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.name}</span>",
  "<span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{dn}</span>"
);
c = c.replace(
  "<div style={{ fontSize: '0.85rem', color: '#666', minWidth: '150px' }}>{p.email}</div>",
  "<div style={{ fontSize: '0.85rem', color: '#666', minWidth: '150px' }}>{de}</div>"
);
c = c.replace(
  "<div style={{ fontSize: '0.85rem', color: '#666' }}>{p.phone || 'N/A'}</div>",
  "<div style={{ fontSize: '0.85rem', color: '#666' }}>{dp}</div>"
);

// We need to find the specific closing tag for list view
const listEndSearch = "                      </button>\n                    </div>\n                  </div>\n                ))\n              ) : (";
const listEndReplace = "                      </button>\n                    </div>\n                  </div>\n                )})\n              ) : (";
c = c.replace(listEndSearch, listEndReplace);


// Detailed View
c = c.replace(
  "{participants.map((p, i) => (\n                    <div key={p.id || i} style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px'",
  "{participants.map((p, i) => {\n                    const customAnswers = (p.answers || []).map((a) => { let s = a.answer || ''; if(Array.isArray(s)) s = s.join(', '); return s.toString(); }).filter(x => x);\n                    const dn = p.name || customAnswers[0] || 'N/A';\n                    const de = p.email || (p.name ? '' : customAnswers[1]) || 'N/A';\n                    const dp = p.phone || (p.name ? '' : customAnswers[2]) || 'No phone';\n                    return (\n                    <div key={p.id || i} style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px'"
);
c = c.replace(
  "`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} alt=\"\" style={{ width: 48, height: 48",
  "`https://api.dicebear.com/7.x/avataaars/svg?seed=${dn}`} alt=\"\" style={{ width: 48, height: 48"
);
c = c.replace(
  ">{p.name} {p.isTeam &&",
  ">{dn} {p.isTeam &&"
);
c = c.replace(
  "<div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>{p.email}</div>",
  "<div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>{de}</div>"
);
c = c.replace(
  "<div style={{ fontSize: '0.8rem', color: '#666' }}>{p.phone || 'No phone'}</div>",
  "<div style={{ fontSize: '0.8rem', color: '#666' }}>{dp}</div>"
);


// Wait, the original has `))`
c = c.replace("                ))\n              </div>\n            )}\n          </div>\n        </div>\n      </div>\n    );\n}", "                )})\n              </div>\n            )}\n          </div>\n        </div>\n      </div>\n    );\n}");


fs.writeFileSync('client/src/pages/ManageEvent.tsx', c);
console.log('done');
