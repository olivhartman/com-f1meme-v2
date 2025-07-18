// Paste your Airtable credentials here:
const AIRTABLE_PAT = 'pat95AMuPcRFIx18w.d05e484612940e3d4296f4c13bb92d1e3d7d4c1dde24100fd20ba3933274e00c';
const AIRTABLE_BASE_ID = 'appYvwPNyWa7A1Aez';
const AIRTABLE_TABLE_NAME = 'F1 Schedule';

interface Session {
  date?: string;
  time?: string;
}

interface Race {
  raceName: string;
  Circuit: {
    circuitName: string;
    Location: {
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  FirstPractice?: Session;
  SecondPractice?: Session;
  ThirdPractice?: Session;
  Qualifying?: Session;
  Sprint?: Session;
  SprintQualifying?: Session;
}

const API_URL = 'https://api.jolpi.ca/ergast/f1/races/';
const PAGE_LIMIT = 30;
const START_OFFSET = 1137;

function formatDateText(date: string) {
  const dt = new Date(date);
  return dt.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function fetchRaces(offset: number, limit: number): Promise<Race[]> {
  const url = `${API_URL}?offset=${offset}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data.MRData.RaceTable.Races;
}

async function saveF1ScheduleEntry(race: Race) {
  const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
  const fields = {
    'Race Name': race.raceName,
    'Circuit': race.Circuit.circuitName,
    'Location': `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
    'Race Day': race.date,
    'Race Day (Text)': formatDateText(race.date),
    'FP1 Date': race.FirstPractice?.date || '',
    'FP1 Time': race.FirstPractice?.time ? formatTime(race.FirstPractice.time) : '',
    'Qualifying Date': race.Qualifying?.date || '',
    'Qualifying Time': race.Qualifying?.time ? formatTime(race.Qualifying.time) : '',
    'Sprint Quali Date': race.SprintQualifying?.date || '',
    'Sprint Quali Time': race.SprintQualifying?.time ? formatTime(race.SprintQualifying.time) : '',
    'Sprint Date': race.Sprint?.date || '',
    'Sprint Time': race.Sprint?.time ? formatTime(race.Sprint?.time) : '',
    'Created At': new Date().toISOString(),
  };
  const res = await fetch(AIRTABLE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ records: [{ fields }] }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Airtable save failed: ${res.status} ${res.statusText} - ${errorText}`);
  }
}

function formatTime(time: string) {
  // Ergast API returns time as 'HH:MM:SSZ' or 'HH:MM:SS+00:00'
  // We'll format as 'HH:MM AM/PM' in local time
  if (!time) return '';
  const t = time.replace('Z', '');
  const dt = new Date(`1970-01-01T${t}Z`);
  return dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

async function importAllRaces() {
  let offset = START_OFFSET;
  let totalImported = 0;
  let page = 1;
  while (true) {
    console.log(`Fetching races (page ${page}, offset ${offset})...`);
    const races = await fetchRaces(offset, PAGE_LIMIT);
    if (!races.length) {
      console.log('No more races to import.');
      break;
    }
    for (const race of races) {
      try {
        await saveF1ScheduleEntry(race);
        totalImported++;
        console.log(`Imported: ${race.raceName} (${race.date})`);
      } catch (err) {
        console.error(`Failed to import ${race.raceName}:`, err);
      }
    }
    offset += PAGE_LIMIT;
    page++;
  }
  console.log(`Done! Imported ${totalImported} races.`);
}

// Run the script
importAllRaces().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
