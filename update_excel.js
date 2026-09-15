const fs = require('fs');
let c = fs.readFileSync('client/src/pages/ManageEvent.tsx', 'utf8');

const oldFunc = `  const handleDownloadData = () => {
    if (!participants || participants.length === 0) {
      alert("No data to download!");
      return;
    }

    // Collect all unique questions from participants
    const questionSet = new Set<string>();
    participants.forEach(p => {
      (p.answers || []).forEach((a: any) => {
        if (a.question) questionSet.add(a.question);
      });
    });
    const allQuestions = Array.from(questionSet);

    let headers = ['Name', 'Email', 'Phone', 'Ticket Type', 'Status'];
    if (event?.generateQRCode) headers.push('Checked In');

    allQuestions.forEach(q => headers.push(\`"\${q.replace(/"/g, '""')}"\`));

    let csvContent = headers.join(",") + "\\n";

    participants.forEach(p => {
      let row = [];
      const customAnswers = (p.answers || []).map((a: any) => {
        let ansStr = a.answer || '';
        if (Array.isArray(ansStr)) ansStr = ansStr.join(', ');
        return ansStr.toString();
      }).filter(Boolean);
      
      const dn = p.name || customAnswers[0] || '';
      const de = p.email || (p.name ? '' : customAnswers[1]) || '';
      const dp = p.phone || (p.name ? '' : customAnswers[2]) || '';

      row.push(\`"\${dn.replace(/"/g, '""')}"\`);
      row.push(\`"\${de.replace(/"/g, '""')}"\`);
      
      if (dp) {
        if (/^\\+?\\d{7,}$/.test(dp)) row.push(\`="\${dp.replace(/"/g, '""')}"\`);
        else row.push(\`"\${dp.replace(/"/g, '""')}"\`);
      } else {
        row.push('""');
      }
      
      row.push(p.type ? \`"\${p.type}"\` : '""');
      row.push(p.status ? \`"\${p.status}"\` : '""');

      if (event?.generateQRCode) {
        row.push(p.checkedIn ? '"Yes"' : '"No"');
      }

      allQuestions.forEach(q => {
        const ansObj = (p.answers || []).find((a: any) => a.question === q);
        let ansStr = ansObj?.answer || '';
        if (Array.isArray(ansStr)) ansStr = ansStr.join(', ');
        
        const strVal = ansStr.toString();
        if (/^\\+?\\d{7,}$/.test(strVal)) {
           row.push(\`="\${strVal.replace(/"/g, '""')}"\`);
        } else {
           row.push(\`"\${strVal.replace(/"/g, '""')}"\`);
        }
      });

      csvContent += row.join(",") + "\\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);`;


const newFunc = `  const handleDownloadData = () => {
    if (!participants || participants.length === 0) {
      alert("No data to download!");
      return;
    }

    // Collect all unique questions and check if standard fields exist
    const questionSet = new Set<string>();
    let hasName = false;
    let hasEmail = false;
    let hasPhone = false;

    participants.forEach(p => {
      if (p.name) hasName = true;
      if (p.email) hasEmail = true;
      if (p.phone) hasPhone = true;

      (p.answers || []).forEach((a: any) => {
        if (a.question) questionSet.add(a.question);
      });
    });
    const allQuestions = Array.from(questionSet);

    let headers = [];
    if (hasName) headers.push('Name');
    if (hasEmail) headers.push('Email');
    if (hasPhone) headers.push('Phone');
    headers.push('Ticket Type', 'Status');

    if (event?.generateQRCode) headers.push('Checked In');

    allQuestions.forEach(q => headers.push(\`"\${q.replace(/"/g, '""')}"\`));

    let csvContent = headers.join(",") + "\\n";

    participants.forEach(p => {
      let row = [];
      
      if (hasName) row.push(\`"\${(p.name || '').replace(/"/g, '""')}"\`);
      if (hasEmail) row.push(\`"\${(p.email || '').replace(/"/g, '""')}"\`);
      if (hasPhone) {
        if (p.phone && /^\\+?\\d{7,}$/.test(p.phone)) row.push(\`="\${p.phone.replace(/"/g, '""')}"\`);
        else row.push(\`"\${(p.phone || '').replace(/"/g, '""')}"\`);
      }
      
      row.push(p.type ? \`"\${p.type}"\` : '""');
      row.push(p.status ? \`"\${p.status}"\` : '""');

      if (event?.generateQRCode) {
        row.push(p.checkedIn ? '"Yes"' : '"No"');
      }

      allQuestions.forEach(q => {
        const ansObj = (p.answers || []).find((a: any) => a.question === q);
        let ansStr = ansObj?.answer || '';
        if (Array.isArray(ansStr)) ansStr = ansStr.join(', ');
        
        const strVal = ansStr.toString();
        if (/^\\+?\\d{7,}$/.test(strVal)) {
           row.push(\`="\${strVal.replace(/"/g, '""')}"\`);
        } else {
           row.push(\`"\${strVal.replace(/"/g, '""')}"\`);
        }
      });

      csvContent += row.join(",") + "\\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);`;

if(c.includes(oldFunc)) {
  c = c.replace(oldFunc, newFunc);
  fs.writeFileSync('client/src/pages/ManageEvent.tsx', c);
  console.log("Success");
} else {
  console.log("oldFunc not found");
}

