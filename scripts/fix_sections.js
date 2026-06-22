require('dotenv').config();
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ajaybezpuilzcfnisapm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYXliZXpwdWlsemNmbmlzYXBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTg0MDgyMSwiZXhwIjoyMDk3NDE2ODIxfQ.QPind71MXs4rLPvTzRSrQgsK4a2KK4y5aJ9XNJ4kdic';

const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

async function fixSections() {
    console.log("Starting DB sections mapping correction...");

    // 1. Get all classes
    const classRes = await fetch(`${supabaseUrl}/rest/v1/classes?select=*`, { headers });
    const classes = await classRes.json();
    console.log(`Loaded ${classes.length} classes.`);

    // 2. Ensure Playgroup class exists
    let playgroupClass = classes.find(c => c.name === 'Playgroup');
    if (!playgroupClass) {
        console.log("Playgroup class not found, creating it...");
        const newClassRes = await fetch(`${supabaseUrl}/rest/v1/classes`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                id: '10000000-0000-0000-0000-000000000000',
                name: 'Playgroup'
            })
        });
        if (newClassRes.ok) {
            const added = await newClassRes.json();
            playgroupClass = added[0];
            console.log("Created Playgroup class.");
        } else {
            console.error("Failed to create Playgroup class:", await newClassRes.text());
        }
    } else {
        console.log("Playgroup class already exists.");
    }

    // 3. Get all sections
    const sectionRes = await fetch(`${supabaseUrl}/rest/v1/sections?select=*,classes(name)`, { headers });
    const sections = await sectionRes.json();
    console.log(`Loaded ${sections.length} sections.`);

    // 4. Mappings for preschool classes
    const preschoolRenames = {
        'Nursery': { 'A': 'Rainbows', 'B': 'Stars' },
        'LKG': { 'A': 'Daisies', 'B': 'Tulips' },
        'UKG': { 'A': 'Roses', 'B': 'Lilies' }
    };

    // Rename existing A/B sections for Nursery, LKG, UKG
    for (const sec of sections) {
        const className = sec.classes?.name;
        if (preschoolRenames[className]) {
            const newName = preschoolRenames[className][sec.name];
            if (newName) {
                console.log(`Renaming section '${sec.name}' of class '${className}' (ID: ${sec.id}) to '${newName}'...`);
                const updateRes = await fetch(`${supabaseUrl}/rest/v1/sections?id=eq.${sec.id}`, {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({ name: newName })
                });
                if (updateRes.ok) {
                    console.log(`Successfully renamed to '${newName}'`);
                } else {
                    console.error(`Failed to rename section ${sec.id}:`, await updateRes.text());
                }
            }
        }
    }

    // 5. Ensure Playgroup sections exist
    if (playgroupClass) {
        const pgSections = ['Butterflies', 'Sunflowers'];
        for (const name of pgSections) {
            const existingSec = sections.find(s => s.class_id === playgroupClass.id && s.name === name);
            if (!existingSec) {
                console.log(`Creating section '${name}' for Playgroup...`);
                const createRes = await fetch(`${supabaseUrl}/rest/v1/sections`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        class_id: playgroupClass.id,
                        name
                    })
                });
                if (createRes.ok) {
                    console.log(`Successfully created Playgroup section '${name}'`);
                } else {
                    console.error(`Failed to create Playgroup section '${name}':`, await createRes.text());
                }
            } else {
                console.log(`Playgroup section '${name}' already exists.`);
            }
        }
    }

    console.log("DB correction complete!");
}

fixSections();
