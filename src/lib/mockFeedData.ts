export type FeedCategory = 'security' | 'cultural' | 'transport' | 'health' | 'nearby'

export interface FeedAlert {
  id: string
  category: FeedCategory
  title: string
  body: string
  source: string
  time: string
}

type RegionAlerts = Record<string, FeedAlert[]>

const BASE_ALERTS: RegionAlerts = {
  // ── United States ──────────────────────────────────────────────────────────
  US: [
    { id: 'us-1', category: 'security',  title: 'Travel Advisory — Low Risk',    body: 'Standard travel precautions apply. Keep valuables secured and be aware of your surroundings in crowded areas like Times Square or the National Mall.', source: 'US State Dept', time: '2h ago' },
    { id: 'us-2', category: 'cultural',  title: 'Tipping Culture',               body: 'In the US, tipping 18–22% at restaurants is customary. Tip bartenders $1–2 per drink, taxi/rideshare 15%, and hotel housekeeping $3–5 per night.', source: 'Travel Pal', time: '4h ago' },
    { id: 'us-3', category: 'transport', title: 'Rideshare & Transit',            body: 'Uber and Lyft are widely available. In NYC, use the subway (MetroCard or contactless). LA requires a car or Lime/Bird scooters for many areas.', source: 'Travel Pal', time: '6h ago' },
    { id: 'us-4', category: 'health',    title: 'Emergency: Dial 911',           body: 'Emergency services: call 911 for police, fire, or medical. Urgent care clinics cost $100–200 without insurance. Travel insurance strongly recommended.', source: 'FEMA', time: '8h ago' },
    { id: 'us-5', category: 'cultural',  title: 'Sales Tax Not Shown',           body: 'Prices on US menus and shelves exclude sales tax (typically 5–10%). The total at checkout will be higher. NYC adds both state and city tax.', source: 'Travel Pal', time: '10h ago' },
  ],
  // ── United Kingdom ──────────────────────────────────────────────────────────
  GB: [
    { id: 'gb-1', category: 'cultural',  title: 'Queue Etiquette',               body: 'Queueing is a sacred institution in Britain. Always wait your turn — pushing in is considered extremely rude and will attract icy stares.', source: 'Travel Pal', time: '1h ago' },
    { id: 'gb-2', category: 'transport', title: 'Oyster & Contactless Savings',  body: 'Tap in/out on London\'s Tube and buses with Oyster or any contactless card. Daily and weekly fare caps make it far cheaper than buying paper tickets.', source: 'TfL', time: '3h ago' },
    { id: 'gb-3', category: 'cultural',  title: 'Pub Culture',                   body: 'Pubs close at 11pm in England. The "rounds" system means each person in a group buys a round of drinks for everyone — skipping your round is bad form.', source: 'Travel Pal', time: '5h ago' },
    { id: 'gb-4', category: 'health',    title: 'NHS & Emergency Services',      body: 'Emergency: dial 999. Non-urgent medical advice: call 111. A&E (ER) is free for visitors in an emergency. GP appointments may charge non-residents.', source: 'NHS', time: '7h ago' },
    { id: 'gb-5', category: 'security',  title: 'Petty Theft Hotspots',          body: 'Be alert on crowded Central London streets, Oxford Circus, and Borough Market. Keep bags zipped and phones in your pocket on public transport.', source: 'Met Police', time: '9h ago' },
  ],
  // ── Japan ───────────────────────────────────────────────────────────────────
  JP: [
    { id: 'jp-1', category: 'cultural',  title: 'No Tipping — Ever',             body: 'Tipping is considered rude in Japan. Exceptional service is expected as standard. If you leave money on the table, staff will run after you to return it.', source: 'JNTO', time: '30m ago' },
    { id: 'jp-2', category: 'transport', title: 'IC Card (Suica/Pasmo)',         body: 'Load a Suica or Pasmo card at any JR station. Use it on trains, subways, buses, and at convenience stores and vending machines across the country.', source: 'JR East', time: '2h ago' },
    { id: 'jp-3', category: 'security',  title: 'Extremely Safe Country',        body: 'Japan consistently ranks as one of the world\'s safest destinations. Lost wallets are regularly turned into police. Standard precautions still apply.', source: 'JNTO', time: '4h ago' },
    { id: 'jp-4', category: 'cultural',  title: 'Onsen & Tattoo Rules',          body: 'Wash thoroughly before entering an onsen (hot spring). Many public baths ban visible tattoos. Swimwear is not worn — check the establishment\'s rules.', source: 'Travel Pal', time: '6h ago' },
    { id: 'jp-5', category: 'health',    title: 'Emergency: 119 or 110',         body: 'Emergency: 119 for ambulance/fire, 110 for police. Hospitals have international divisions in major cities. Carry travel insurance and a list of medications.', source: 'Japan Tourism Agency', time: '8h ago' },
  ],
  // ── Thailand ─────────────────────────────────────────────────────────────────
  TH: [
    { id: 'th-1', category: 'cultural',  title: 'Temple Dress Code',             body: 'Cover shoulders and knees when visiting Buddhist temples. Remove shoes before entering. Sarongs are available for rent at most major sites including Wat Pho.', source: 'TAT', time: '1h ago' },
    { id: 'th-2', category: 'health',    title: 'Street Food Safety',            body: 'Stick to stalls with high turnover and visible cooking. Avoid pre-cut fruit at low-traffic stalls. Drink bottled or filtered water — tap water is not safe to drink.', source: 'Travel Pal', time: '3h ago' },
    { id: 'th-3', category: 'cultural',  title: 'Bargaining Culture',            body: 'Negotiating prices at markets is expected and normal. Start at 50–60% of the asking price. Keep it friendly — losing face is serious here. Fixed prices in malls.', source: 'Travel Pal', time: '5h ago' },
    { id: 'th-4', category: 'transport', title: 'Tuk-Tuk & Grab App',           body: 'Always agree the fare before boarding a tuk-tuk. For longer distances or air-con comfort, use the Grab app (SE Asia\'s Uber). Metered taxis must use the meter.', source: 'Travel Pal', time: '7h ago' },
    { id: 'th-5', category: 'security',  title: 'Gem Scam Alert',               body: 'Beware of friendly strangers offering to take you to a "special gem sale today only." This is one of Bangkok\'s most persistent tourist scams.', source: 'Thai Tourist Police', time: '9h ago' },
  ],
  // ── France ───────────────────────────────────────────────────────────────────
  FR: [
    { id: 'fr-1', category: 'cultural',  title: '"Bonjour" Is Non-Negotiable',   body: 'Always greet shopkeepers, waiters, and hotel staff with "Bonjour" on entry. Failing to do so is considered rude. "Au revoir" on leaving is equally important.', source: 'Travel Pal', time: '2h ago' },
    { id: 'fr-2', category: 'cultural',  title: 'Lunch Closure Hours',           body: 'Many small French businesses and shops close 12–2pm for lunch — especially outside Paris. Plan grocery runs and errands around this sacred break.', source: 'Travel Pal', time: '4h ago' },
    { id: 'fr-3', category: 'transport', title: 'Paris Navigo & Metro',          body: 'A weekly Navigo pass (Monday–Sunday) covers unlimited travel on all Paris metro, RER, bus, and tram lines. Buy at any metro station with a passport photo.', source: 'RATP', time: '6h ago' },
    { id: 'fr-4', category: 'security',  title: 'Pickpocket Hotspots',           body: 'Be very alert at the Eiffel Tower, Sacré-Coeur steps, Louvre queues, and Metro lines 1 and 6. Keep bags in front and phones out of back pockets.', source: 'Travel Pal', time: '8h ago' },
    { id: 'fr-5', category: 'health',    title: 'SAMU Emergency: 15',            body: 'Medical emergency: call 15 (SAMU). Fire: 18. Police: 17. EU universal: 112. French pharmacies (green cross) can advise on minor ailments without an appointment.', source: 'Santé Publique France', time: '10h ago' },
  ],
  // ── Germany ──────────────────────────────────────────────────────────────────
  DE: [
    { id: 'de-1', category: 'cultural',  title: 'Rules Are Serious Here',        body: 'Germans take rules seriously — don\'t jaywalk, don\'t cycle on pavements, and never put your feet on public transport seats. Quiet hours (Ruhezeit) apply 10pm–6am.', source: 'Travel Pal', time: '2h ago' },
    { id: 'de-2', category: 'transport', title: 'DB & Public Transit',           body: 'Deutsche Bahn is excellent for intercity travel. In cities, buy day passes (Tageskarte) — ticket inspectors are common and fines for fare evasion are steep.', source: 'DB', time: '4h ago' },
    { id: 'de-3', category: 'cultural',  title: 'Cash Still King',               body: 'Germany remains surprisingly cash-heavy. Many restaurants, smaller shops, and markets are cash-only. Always carry some euros — ATMs (Geldautomat) are widely available.', source: 'Travel Pal', time: '6h ago' },
    { id: 'de-4', category: 'health',    title: 'Emergency: 112 / 110',         body: 'Emergency: 112 for medical and fire, 110 for police. German pharmacies (Apotheke) can advise on prescriptions — look for the red "A" sign.', source: 'BMG', time: '8h ago' },
    { id: 'de-5', category: 'cultural',  title: 'Sunday Trading Laws',          body: 'Almost all shops are closed on Sundays in Germany. Stock up on Saturday. Petrol stations and bakeries in train stations are usually the only exceptions.', source: 'Travel Pal', time: '10h ago' },
  ],
  // ── Italy ─────────────────────────────────────────────────────────────────────
  IT: [
    { id: 'it-1', category: 'cultural',  title: 'Coperto & Coffee Culture',      body: 'Expect a "coperto" (cover charge, €1–3) at sit-down restaurants. Espresso at the bar is far cheaper than a table. Never order a cappuccino after 11am — locals will notice.', source: 'Travel Pal', time: '2h ago' },
    { id: 'it-2', category: 'security',  title: 'Pickpockets in Tourist Zones',  body: 'Stay alert at Rome\'s Colosseum, Vatican queues, and Florence\'s Ponte Vecchio. Bags worn on one shoulder are prime targets — use a crossbody and keep phones in pockets.', source: 'Carabinieri', time: '4h ago' },
    { id: 'it-3', category: 'transport', title: 'Validate Your Train Ticket',    body: 'You MUST stamp (validate) paper train tickets before boarding or face a fine. Look for the yellow or green machines on the platform. This does not apply to digital tickets.', source: 'Trenitalia', time: '6h ago' },
    { id: 'it-4', category: 'cultural',  title: 'Dress for Churches',           body: 'Covered shoulders and knees are required to enter churches including the Vatican and Duomo. Authorities may turn you away or charge for a paper wrap if you\'re underdressed.', source: 'Travel Pal', time: '8h ago' },
    { id: 'it-5', category: 'health',    title: 'Emergency: 118 / 112',         body: 'Medical emergency: 118. Pan-European: 112. Pharmacies (farmacia, green cross) are common and pharmacists can prescribe some medications directly.', source: 'Ministero della Salute', time: '10h ago' },
  ],
  // ── Spain ─────────────────────────────────────────────────────────────────────
  ES: [
    { id: 'es-1', category: 'cultural',  title: 'Late Dining Hours',             body: 'Lunch (the main meal) is 2–4pm; dinner rarely before 9pm. Restaurants serving before 8pm are usually tourist traps with lower quality food. Embrace the Spanish schedule.', source: 'Travel Pal', time: '2h ago' },
    { id: 'es-2', category: 'cultural',  title: 'Siesta Culture',                body: 'Some smaller shops and businesses still close 2–5pm. Major cities like Madrid and Barcelona have largely moved past siesta, but rural towns still observe it strictly.', source: 'Travel Pal', time: '4h ago' },
    { id: 'es-3', category: 'transport', title: 'Madrid & Barcelona Metro',      body: 'Both cities have excellent metro systems with 10-trip tickets (T-Casual) offering the best per-ride price. Airport connections on metro are cheap and reliable.', source: 'EMT', time: '6h ago' },
    { id: 'es-4', category: 'security',  title: 'La Rambla & Beach Watch',       body: 'Barcelona\'s La Rambla is a pickpocket hotspot. Barceloneta beach: never leave bags unattended. "Friendly" games of Find the Lady are always rigged.', source: 'Mossos d\'Esquadra', time: '8h ago' },
    { id: 'es-5', category: 'health',    title: 'Emergency: 112',               body: 'Spain uses 112 for all emergencies. Centros de salud (health centres) handle non-emergencies. Pharmacies (green cross) rotate 24-hour duty and are listed on doors.', source: 'MSCBS', time: '10h ago' },
  ],
  // ── Australia ────────────────────────────────────────────────────────────────
  AU: [
    { id: 'au-1', category: 'security',  title: 'Sun & Wildlife Safety',         body: 'Australian UV is extreme — apply SPF 50+ and wear a hat. In the outback and coastal areas, be aware of snakes, box jellyfish (Oct–May), and always swim between the flags at beaches.', source: 'Tourism Australia', time: '2h ago' },
    { id: 'au-2', category: 'transport', title: 'Opal/Myki/Go Cards',           body: 'Each state has its own transit card: Opal (NSW), Myki (VIC), Go (QLD). Load before travel — inspectors operate on all systems and cash is not accepted on most services.', source: 'Transport for NSW', time: '4h ago' },
    { id: 'au-3', category: 'cultural',  title: 'BYO Restaurants',              body: 'Many Australian restaurants are "BYO" (bring your own wine). A small corkage fee applies (usually $5–15). This dramatically reduces the cost of a meal out.', source: 'Travel Pal', time: '6h ago' },
    { id: 'au-4', category: 'health',    title: 'Emergency: 000',               body: 'Emergency services: call 000 for ambulance, police, or fire. For non-urgent medical care, bulk-billed GP clinics are available (Medicare card required — not for visitors).', source: 'Health Direct', time: '8h ago' },
    { id: 'au-5', category: 'cultural',  title: 'Tipping: Optional',            body: 'Tipping is not expected in Australia — minimum wage is high. A tip is a genuine compliment for outstanding service, not an obligation. Round up for great service if you like.', source: 'Travel Pal', time: '10h ago' },
  ],
  // ── Canada ───────────────────────────────────────────────────────────────────
  CA: [
    { id: 'ca-1', category: 'cultural',  title: 'Tipping Expected',              body: 'Canada has a strong tipping culture similar to the US: 15–20% at restaurants, 10–15% for taxis, $1–2 per drink at bars. Many POS terminals now suggest 18–25%.', source: 'Travel Pal', time: '2h ago' },
    { id: 'ca-2', category: 'transport', title: 'Transit & PRESTO Card',        body: 'Toronto uses the PRESTO card across TTC, GO, and regional transit. Vancouver has the Compass Card for SkyTrain and buses. Monthly passes offer significant savings.', source: 'TTC', time: '4h ago' },
    { id: 'ca-3', category: 'security',  title: 'Wildlife in National Parks',   body: 'In Banff, Jasper, and BC parks: keep 100m from bears, 30m from other wildlife. Store food in bear-proof containers. Do not approach or feed any animal.', source: 'Parks Canada', time: '6h ago' },
    { id: 'ca-4', category: 'health',    title: 'Emergency: 911',               body: 'Emergency services: call 911. Walk-in clinics are available across cities but lines can be long. Visitor medical costs are high — comprehensive travel insurance is essential.', source: 'Health Canada', time: '8h ago' },
    { id: 'ca-5', category: 'cultural',  title: 'Bilingual Signage',            body: 'Quebec is officially French-speaking — most signage and government services are in French first. English is widely spoken in Montreal and Quebec City tourist areas.', source: 'Travel Pal', time: '10h ago' },
  ],
  // ── Mexico ────────────────────────────────────────────────────────────────────
  MX: [
    { id: 'mx-1', category: 'security',  title: 'Stick to Tourist Zones',       body: 'Mexico City\'s Roma, Polanco, Condesa, and Coyoacán are very safe for visitors. Avoid travelling at night to unfamiliar neighbourhoods. Use Uber over street taxis after dark.', source: 'US Embassy Mexico', time: '2h ago' },
    { id: 'mx-2', category: 'health',    title: 'Water Safety',                 body: 'Do not drink tap water in Mexico. Use bottled or filtered water for drinking and brushing teeth. Ice is usually fine in restaurants but ask if unsure. "Montezuma\'s Revenge" is real.', source: 'Travel Pal', time: '4h ago' },
    { id: 'mx-3', category: 'cultural',  title: 'Tipping (Propina)',            body: 'Tip 10–15% at restaurants — waitstaff earn low base wages. Tip hotel porters 20–50 pesos, and give a small tip to OXXO store staff who pack your bags.', source: 'Travel Pal', time: '6h ago' },
    { id: 'mx-4', category: 'transport', title: 'Mexico City Metro (CDMX)',     body: 'The Metro is cheap and fast in CDMX. Avoid rush hour (7–9am, 5–7pm) as it gets extremely crowded. Use Metrobús for above-ground corridors and Uber for night travel.', source: 'Metro CDMX', time: '8h ago' },
    { id: 'mx-5', category: 'cultural',  title: 'Mealtimes',                    body: 'Mexicans eat late: comida (main meal) is 2–4pm, cena (dinner) around 8–10pm. Breakfast spots are open early. Lunch menus (menús del día) offer the best value.', source: 'Travel Pal', time: '10h ago' },
  ],
  // ── Brazil ────────────────────────────────────────────────────────────────────
  BR: [
    { id: 'br-1', category: 'security',  title: 'Personal Security Awareness',  body: 'Keep phones off the street in Rio, São Paulo, and Salvador. Use Uber from airports. Avoid displaying expensive jewellery or watches. Pickpocketing on crowded beaches is common.', source: 'Brazil Tourism', time: '2h ago' },
    { id: 'br-2', category: 'health',    title: 'Yellow Fever Vaccination',     body: 'Yellow fever vaccination is recommended if visiting the Amazon, Pantanal, or inland states. Mosquito repellent is essential. Zika, dengue, and malaria precautions apply in rural areas.', source: 'ANVISA', time: '4h ago' },
    { id: 'br-3', category: 'cultural',  title: 'Brazilians Are Warm & Late',   body: 'Brazilian hospitality is genuine and effusive. Meetings and social events run 30–60 minutes late as standard. Greetings involve cheek kisses (one in São Paulo, two in Rio).', source: 'Travel Pal', time: '6h ago' },
    { id: 'br-4', category: 'transport', title: 'Rideshare & 99/Uber',          body: '99 and Uber are safe and widely used in Brazilian cities. Avoid unmarked taxis. InterCity buses (ônibus) are excellent value — book leito (sleeper) class for overnight journeys.', source: 'Travel Pal', time: '8h ago' },
    { id: 'br-5', category: 'cultural',  title: 'Carnival & Festas Timing',     body: 'Book accommodation 6–12 months ahead for Carnival (February/March). During Festas Juninas (June), expect cities to be packed with cultural events, forró music, and street food.', source: 'Embratur', time: '10h ago' },
  ],
  // ── India ────────────────────────────────────────────────────────────────────
  IN: [
    { id: 'in-1', category: 'cultural',  title: 'Remove Shoes at Sacred Sites', body: 'Remove shoes before entering temples, mosques, and many homes. Dress modestly — cover shoulders and legs. Photography inside temples may be restricted — look for signs.', source: 'India Tourism', time: '2h ago' },
    { id: 'in-2', category: 'health',    title: 'Water & Food Safety',          body: 'Drink only bottled or purified water — including for brushing teeth. Wash hands before eating. Street food from busy, high-turnover stalls is generally fine; avoid anything washed in tap water.', source: 'MoHFW', time: '4h ago' },
    { id: 'in-3', category: 'transport', title: 'Auto-Rickshaws & Apps',        body: 'Insist on using the meter in auto-rickshaws or agree a price before boarding. Ola and Uber are reliable in major cities. Book train tickets via the IRCTC app well in advance.', source: 'Travel Pal', time: '6h ago' },
    { id: 'in-4', category: 'cultural',  title: 'Bargaining Is Normal',         body: 'Negotiate at markets, street stalls, and with auto-rickshaw drivers (where meters aren\'t used). Fixed prices apply in shops with price tags. A friendly approach goes far.', source: 'Travel Pal', time: '8h ago' },
    { id: 'in-5', category: 'health',    title: 'Emergency: 112',               body: 'India\'s unified emergency number is 112. For medical emergencies, 108 is the ambulance service in most states. Private hospitals in major cities offer international-standard care.', source: 'MoHFW', time: '10h ago' },
  ],
  // ── Singapore ────────────────────────────────────────────────────────────────
  SG: [
    { id: 'sg-1', category: 'security',  title: 'Very Safe, Strict Laws',       body: 'Singapore is one of the world\'s safest cities. Note that chewing gum, jay-walking, and littering can result in fines. Drug trafficking carries the death penalty.', source: 'STB', time: '2h ago' },
    { id: 'sg-2', category: 'transport', title: 'EZ-Link Card & MRT',          body: 'Singapore\'s MRT is world-class. Load an EZ-Link card (at any 7-Eleven or station) for buses and MRT. The Airport Express connects Changi to the city in 30 minutes.', source: 'LTA', time: '4h ago' },
    { id: 'sg-3', category: 'cultural',  title: 'Hawker Centres Are the Key',   body: 'Skip expensive restaurants and eat at hawker centres for Singapore\'s best food: chicken rice, laksa, char kway teow. A full meal costs SGD 4–7. Lau Pa Sat and Maxwell are icons.', source: 'Travel Pal', time: '6h ago' },
    { id: 'sg-4', category: 'health',    title: 'Emergency: 995 / 999',        body: 'Ambulance/fire: 995. Police: 999. Singapore General Hospital and Raffles Hospital both handle international patients. Medical care is expensive — travel insurance is essential.', source: 'MOH Singapore', time: '8h ago' },
    { id: 'sg-5', category: 'cultural',  title: 'No Tipping Required',         body: 'Tipping is not customary in Singapore. A 10% service charge is already included in most restaurant bills. Tipping a taxi driver or hawker stall is unusual but not offensive.', source: 'Travel Pal', time: '10h ago' },
  ],
  // ── United Arab Emirates ──────────────────────────────────────────────────────
  AE: [
    { id: 'ae-1', category: 'cultural',  title: 'Dress Code & Public Conduct', body: 'Dress modestly in malls, public spaces, and markets — shoulders and knees covered for women. Public displays of affection can result in fines. During Ramadan, avoid eating in public.', source: 'DTCM Dubai', time: '2h ago' },
    { id: 'ae-2', category: 'transport', title: 'Dubai Metro & RTA',            body: 'Dubai\'s Metro is modern and efficient. Women and children have dedicated Gold Class/women-only carriages. Nol cards work across metro, buses, and water taxis (Abra).', source: 'RTA Dubai', time: '4h ago' },
    { id: 'ae-3', category: 'cultural',  title: 'Ramadan Hours',               body: 'During Ramadan (dates vary), restaurants may not serve food in public during daylight hours. Many venues have Iftar (sunset) specials. Working hours are reduced across the country.', source: 'UAE Tourism', time: '6h ago' },
    { id: 'ae-4', category: 'health',    title: 'Emergency: 998 / 999',       body: 'Ambulance: 998. Police: 999. Dubai and Abu Dhabi have world-class private hospitals. Medical costs are very high — comprehensive travel insurance with medical evacuation is essential.', source: 'MOH UAE', time: '8h ago' },
    { id: 'ae-5', category: 'cultural',  title: 'No Alcohol Without Licence',  body: 'Alcohol is only served in licensed venues (hotels, select restaurants, and clubs). Drinking in public or being drunk in public is illegal. Tipping (10–15%) is appreciated but not mandatory.', source: 'DTCM Dubai', time: '10h ago' },
  ],
  // ── South Africa ─────────────────────────────────────────────────────────────
  ZA: [
    { id: 'za-1', category: 'security',  title: 'Urban Safety Precautions',    body: 'In Johannesburg and Cape Town CBD, be alert to your surroundings — especially at night. Do not display phones or wallets in public. Use Uber rather than street taxis and avoid driving in unfamiliar areas after dark.', source: 'SA Tourism', time: '2h ago' },
    { id: 'za-2', category: 'transport', title: 'Uber & Driving Culture',      body: 'Uber is the safest city transport option. If renting a car, note that South Africa drives on the left. "Robots" are traffic lights. Minibus taxis are cheap but can be erratic.', source: 'Travel Pal', time: '4h ago' },
    { id: 'za-3', category: 'cultural',  title: '11 Official Languages',       body: 'South Africa has 11 official languages. English is widely spoken in cities and tourist areas. "Howzit" means hello, "just now" means sometime soon, "now now" means immediately.', source: 'Travel Pal', time: '6h ago' },
    { id: 'za-4', category: 'health',    title: 'Malaria & Vaccinations',      body: 'Malaria prophylaxis is strongly recommended for Kruger National Park and Limpopo. Yellow fever vaccination required if entering from endemic countries. Emergency: 112.', source: 'NICD', time: '8h ago' },
    { id: 'za-5', category: 'cultural',  title: 'Braai Culture',               body: 'A braai (barbecue) is a South African institution and a social ritual. If invited to one, it\'s a significant honour. Bring a contribution — cold drinks or a side dish are standard.', source: 'Travel Pal', time: '10h ago' },
  ],
  // ── South Korea ──────────────────────────────────────────────────────────────
  KR: [
    { id: 'kr-1', category: 'transport', title: 'T-Money Card',                 body: 'Load a T-Money card for use on Seoul\'s metro, buses, and taxis. The Arex Express Line links Incheon Airport to Seoul Station in 43 minutes. Korail is excellent for intercity travel.', source: 'KTO', time: '2h ago' },
    { id: 'kr-2', category: 'cultural',  title: 'Shoes Off Indoors',           body: 'Remove shoes when entering traditional Korean homes and many restaurants with floor seating. A shoe rack at the entrance is the cue. Socks are expected inside.', source: 'Travel Pal', time: '4h ago' },
    { id: 'kr-3', category: 'cultural',  title: 'Respect Elders',              body: 'Korean culture places high importance on age-based hierarchy. Use two hands when giving or receiving items from elders. Pouring drinks for others before yourself is polite.', source: 'Travel Pal', time: '6h ago' },
    { id: 'kr-4', category: 'health',    title: 'Emergency: 119 / 112',       body: 'Ambulance/fire: 119. Police: 112. South Korea has excellent universal healthcare. Incheon and Seoul have 24-hour international clinics accustomed to foreign visitors.', source: 'MOHW Korea', time: '8h ago' },
    { id: 'kr-5', category: 'security',  title: 'Very Safe Country',           body: 'South Korea is very safe for tourists. Violent crime is rare. Cybercrime exists — use a VPN on public Wi-Fi. The country has some of the fastest and cheapest internet in the world.', source: 'KTO', time: '10h ago' },
  ],
  // ── Netherlands ──────────────────────────────────────────────────────────────
  NL: [
    { id: 'nl-1', category: 'transport', title: 'Cycling Rules',                body: 'Amsterdam has more bikes than residents. Bike lanes (fietspad) have absolute priority over pedestrians — do NOT walk in them. Look both ways and listen for bells before crossing.', source: 'Travel Pal', time: '2h ago' },
    { id: 'nl-2', category: 'transport', title: 'OV-chipkaart & NS Trains',    body: 'Use an OV-chipkaart for all public transport. Check in AND out with your card — failure to check out results in a charge. NS intercity trains connect all major Dutch cities hourly.', source: 'NS', time: '4h ago' },
    { id: 'nl-3', category: 'cultural',  title: 'Dutch Directness',            body: 'Dutch people are famously direct and honest — it is not considered rude. If someone says you are wrong, they mean it kindly. Queuing and punctuality are both important.', source: 'Travel Pal', time: '6h ago' },
    { id: 'nl-4', category: 'health',    title: 'Emergency: 112',              body: '112 for all emergencies. Huisarts (GP) system means seeing a GP first for non-emergencies. Dutch pharmacies (apotheek) operate a duty rota for after-hours needs.', source: 'RIVM', time: '8h ago' },
    { id: 'nl-5', category: 'cultural',  title: 'Coffee Shops ≠ Cafés',        body: 'A "coffee shop" in the Netherlands sells cannabis — legally tolerated, not fully legal. A "café" or "bruin café" is a pub. The distinction is important when asking for directions.', source: 'Travel Pal', time: '10h ago' },
  ],
  // ── Portugal ─────────────────────────────────────────────────────────────────
  PT: [
    { id: 'pt-1', category: 'cultural',  title: 'Saudade & Fado',              body: 'Fado is Portugal\'s soul music — a UNESCO heritage genre expressing longing (saudade). Catch a live fado performance in Lisbon\'s Alfama district for an authentic cultural experience.', source: 'Turismo de Portugal', time: '2h ago' },
    { id: 'pt-2', category: 'transport', title: 'Viva Viagem Card',            body: 'Load a Viva Viagem card (€0.50 deposit, reusable) for Lisbon\'s metro, bus, and tram network. The iconic Tram 28 is beautiful but heavily pickpocketed — hold your belongings tightly.', source: 'Carris', time: '4h ago' },
    { id: 'pt-3', category: 'cultural',  title: 'Meal Timing',                 body: 'Lunch is 12:30–2:30pm, dinner from 7:30pm. The prato do dia (dish of the day) offers a full meal with wine for €8–12. Petiscos (Portuguese tapas) are best shared late afternoon.', source: 'Travel Pal', time: '6h ago' },
    { id: 'pt-4', category: 'health',    title: 'Emergency: 112',              body: 'Emergency: 112 for all services. Public health centres (centros de saúde) provide free emergency care to EU visitors with EHIC. Farmácias are identified by a green cross sign.', source: 'DGS Portugal', time: '8h ago' },
    { id: 'pt-5', category: 'security',  title: 'Tram & Crowd Pickpockets',   body: 'Lisbon\'s Tram 28, Alfama steps, and the Baixa district are popular with pickpockets. Keep bags in front, avoid back pockets, and be especially alert in crowded tourist spots.', source: 'PSP Portugal', time: '10h ago' },
  ],
  // ── Turkey ────────────────────────────────────────────────────────────────────
  TR: [
    { id: 'tr-1', category: 'cultural',  title: 'Hammam & Mosque Etiquette',   body: 'Remove shoes before entering mosques. Women should cover their head with a scarf (usually provided at the door). Hammam (Turkish bath) visits are a must — check if it is a shared or private session.', source: 'Turkey Tourism', time: '2h ago' },
    { id: 'tr-2', category: 'transport', title: 'Istanbul Istanbulkart',       body: 'The Istanbulkart (reloadable transit card) works on metro, tram, ferry, and funicular. Jeton (single-use tokens) are available but more expensive per trip. Avoid taxis without meters.', source: 'İBB', time: '4h ago' },
    { id: 'tr-3', category: 'cultural',  title: 'Haggling in the Grand Bazaar',body: 'Bargaining is expected in the Grand Bazaar and Egyptian Spice Market. Start at half the asking price and work from there. Accepting tea from a shopkeeper creates no obligation to buy.', source: 'Travel Pal', time: '6h ago' },
    { id: 'tr-4', category: 'health',    title: 'Emergency: 112',              body: '112 for all emergencies. Water in Istanbul is technically safe but taste issues lead most visitors to drink bottled. Travel insurance covering medical evacuation is advisable.', source: 'Turkey MoH', time: '8h ago' },
    { id: 'tr-5', category: 'security',  title: 'Carpet & Jewellery Scams',   body: 'Beware of overly friendly locals offering to take you to a "special family shop." Carpet and jewellery scams targeting tourists are common in Istanbul\'s tourist districts.', source: 'Travel Pal', time: '10h ago' },
  ],
  // ── Argentina ────────────────────────────────────────────────────────────────
  AR: [
    { id: 'ar-1', category: 'cultural',  title: 'Mate Culture',                body: 'Mate (a bitter herbal drink) is Argentina\'s national beverage and a social ritual. When offered mate, accept it — passing the gourd without drinking is rude. Rinse and return the bombilla (straw) properly.', source: 'Travel Pal', time: '2h ago' },
    { id: 'ar-2', category: 'cultural',  title: 'Dinner Starts at 10pm',       body: 'Argentines eat late — restaurants fill up from 9pm, peak at 11pm, and may serve until 2am. Asking for the bill (la cuenta) is never brought automatically — you must ask.', source: 'Travel Pal', time: '4h ago' },
    { id: 'ar-3', category: 'transport', title: 'SUBE Card for Buenos Aires',  body: 'Use the SUBE card on Buenos Aires\'s Subte (metro), buses, and trains. Load it at kiosks (kioscos) everywhere. Grab and Cabify are the safest rideshare options.', source: 'SUBE', time: '6h ago' },
    { id: 'ar-4', category: 'health',    title: 'Emergency: 107 / 911',       body: 'Medical emergency: 107. Police: 911. Dial 100 for fire. Buenos Aires has good private hospitals — CEMIC, Alemán, and Austral are recommended for visitors.', source: 'Argentina Tourism', time: '8h ago' },
    { id: 'ar-5', category: 'security',  title: 'Distraction Theft',          body: 'Common scam: a stranger "accidentally" spills something on you — accomplices steal your bag while you are distracted. If this happens, move to a safe place before attending to your clothing.', source: 'Travel Pal', time: '10h ago' },
  ],
  // ── Nigeria ───────────────────────────────────────────────────────────────────
  NG: [
    { id: 'ng-1', category: 'cultural',  title: 'Vibrant & Hospitable',        body: 'Nigerians are famously warm and hospitable. Lagos has a buzzing nightlife and food scene. Respect elders, use proper greetings, and dress conservatively when visiting religious or traditional areas.', source: 'NTA Nigeria', time: '2h ago' },
    { id: 'ng-2', category: 'transport', title: 'Use Ride Apps & Trusted Taxis',body: 'InDrive, Bolt, and Uber operate in Lagos and Abuja. Avoid unlicensed taxis flagged down on the street. Danfo (yellow buses) are cheap but chaotic. Traffic in Lagos is notoriously severe.', source: 'Travel Pal', time: '4h ago' },
    { id: 'ng-3', category: 'security',  title: 'Situational Awareness',       body: 'Remain alert in Lagos markets (Balogun, Oshodi) and crowded areas. Keep phone and wallet out of sight. Use ATMs inside banks or malls. Register with your embassy and share your itinerary.', source: 'FCT Abuja', time: '6h ago' },
    { id: 'ng-4', category: 'health',    title: 'Vaccinations Required',       body: 'Yellow fever vaccination certificate is mandatory on entry. Malaria prophylaxis strongly recommended. Drink only bottled water. Emergency: 112 (limited availability — have your hotel\'s number).', source: 'NCDC Nigeria', time: '8h ago' },
    { id: 'ng-5', category: 'cultural',  title: 'Afrobeats & Suya',            body: 'Lagos is the birthplace of Afrobeats — catch a live show at Freedom Park or Terra Kulture. Suya (spiced grilled meat skewers) from roadside vendors is a must-try Nigerian street food.', source: 'Travel Pal', time: '10h ago' },
  ],
  // ── Kenya ─────────────────────────────────────────────────────────────────────
  KE: [
    { id: 'ke-1', category: 'cultural',  title: '"Hakuna Matata" Is Real',     body: 'Swahili phrases go a long way: "Jambo" (hello), "Asante" (thank you), "Hakuna matata" (no problem). Kenyans are generally welcoming to visitors who show respect for local customs.', source: 'Kenya Tourism', time: '2h ago' },
    { id: 'ke-2', category: 'transport', title: 'Matatu & Safari Transport',   body: 'Matatus (minibuses) are the main public transport — they are crowded but cheap. For safaris, use reputable licensed operators. Uber and Bolt operate in Nairobi and are safer than street taxis.', source: 'NTSA Kenya', time: '4h ago' },
    { id: 'ke-3', category: 'health',    title: 'Vaccinations & Malaria',      body: 'Yellow fever certificate required from high-risk countries. Malaria prophylaxis essential for Nairobi outskirts, Masai Mara, and coastal areas. Emergency: 999 or 112.', source: 'Kenya MoH', time: '6h ago' },
    { id: 'ke-4', category: 'cultural',  title: 'Maasai Mara Season',          body: 'The Great Migration passes through the Masai Mara July–October — the best time to visit. Over 1.5 million wildebeest cross the Mara River. Book camps 6+ months ahead for peak crossings.', source: 'KWS', time: '8h ago' },
    { id: 'ke-5', category: 'security',  title: 'Nairobi City Safety',         body: 'Avoid walking after dark in central Nairobi. Use Uber or vetted taxis. Westlands, Karen, and Gigiri are safer residential areas. Pickpocketing targets tourist sites like the Giraffe Centre.', source: 'Travel Pal', time: '10h ago' },
  ],
  // ── Default (any unrecognised country) ───────────────────────────────────────
  DEFAULT: [
    { id: 'def-1', category: 'security',  title: 'Register with Your Embassy',  body: 'Register your travel with your home country\'s embassy or travel registration system. In an emergency, this allows your government to locate you and provide consular assistance.', source: 'Travel Pal', time: '2h ago' },
    { id: 'def-2', category: 'cultural',  title: 'Currency Exchange Tips',      body: 'Exchange currency at licensed bank ATMs or official bureaux de change. Avoid unlicensed street money changers — exchange rates are unfavourable and fraud is common.', source: 'Travel Pal', time: '4h ago' },
    { id: 'def-3', category: 'health',    title: 'Universal Emergency: 112',   body: 'The number 112 works as an emergency service line in most countries worldwide, even without a SIM card. Save local numbers too: police, ambulance, and your hotel number.', source: 'ICAO', time: '6h ago' },
    { id: 'def-4', category: 'transport', title: 'Offline Maps First',         body: 'Download offline maps before arriving — Google Maps and Maps.me both work offline with pre-downloaded regions. Never rely solely on mobile data in an unfamiliar city.', source: 'Travel Pal', time: '8h ago' },
    { id: 'def-5', category: 'cultural',  title: 'Cash Out USDC Locally',      body: 'Use Travel Pal\'s Cash Out feature to convert your USDC to local fiat currency. Your detected country is pre-filled in the offramp widget — rates update in real time.', source: 'Travel Pal', time: '10h ago' },
  ],
}

export function getAlertsForCountry(countryCode: string): FeedAlert[] {
  return BASE_ALERTS[countryCode] ?? BASE_ALERTS.DEFAULT
}
