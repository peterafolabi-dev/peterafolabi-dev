/* All figures are Earth's, rounded. Sources vary; values are approximate. */

/* name, continent, capital, area km², population (approx. 2023–24) */
import { MORE_COUNTRIES, MORE_GLOSSARY, MORE_RECORDS } from './data2.js';
const _COUNTRIES = [
  ['Nigeria', 'Africa', 'Abuja', 923768, 224e6], ['Egypt', 'Africa', 'Cairo', 1002450, 114e6], ['Ethiopia', 'Africa', 'Addis Ababa', 1104300, 126e6],
  ['DR Congo', 'Africa', 'Kinshasa', 2344858, 102e6], ['South Africa', 'Africa', 'Pretoria', 1221037, 60e6], ['Kenya', 'Africa', 'Nairobi', 580367, 55e6],
  ['Ghana', 'Africa', 'Accra', 238533, 34e6], ['Algeria', 'Africa', 'Algiers', 2381741, 46e6], ['Morocco', 'Africa', 'Rabat', 446550, 37e6],
  ['Tanzania', 'Africa', 'Dodoma', 947303, 67e6], ['Uganda', 'Africa', 'Kampala', 241550, 49e6], ['Senegal', 'Africa', 'Dakar', 196712, 18e6], ['Namibia', 'Africa', 'Windhoek', 825615, 2.6e6],
  ['China', 'Asia', 'Beijing', 9596961, 1410e6], ['India', 'Asia', 'New Delhi', 3287263, 1430e6], ['Indonesia', 'Asia', 'Jakarta', 1904569, 277e6],
  ['Pakistan', 'Asia', 'Islamabad', 881913, 240e6], ['Bangladesh', 'Asia', 'Dhaka', 147570, 173e6], ['Japan', 'Asia', 'Tokyo', 377975, 124e6],
  ['Philippines', 'Asia', 'Manila', 300000, 117e6], ['Vietnam', 'Asia', 'Hanoi', 331212, 100e6], ['Turkey', 'Asia', 'Ankara', 783562, 85e6],
  ['Iran', 'Asia', 'Tehran', 1648195, 89e6], ['Thailand', 'Asia', 'Bangkok', 513120, 72e6], ['South Korea', 'Asia', 'Seoul', 100210, 51.7e6],
  ['Saudi Arabia', 'Asia', 'Riyadh', 2149690, 36e6], ['Kazakhstan', 'Asia', 'Astana', 2724900, 20e6], ['Mongolia', 'Asia', 'Ulaanbaatar', 1564116, 3.4e6],
  ['Nepal', 'Asia', 'Kathmandu', 147181, 30e6], ['Singapore', 'Asia', 'Singapore', 734, 5.9e6], ['United Arab Emirates', 'Asia', 'Abu Dhabi', 83600, 10e6],
  ['Russia', 'Europe', 'Moscow', 17098246, 144e6], ['Germany', 'Europe', 'Berlin', 357022, 84e6], ['United Kingdom', 'Europe', 'London', 243610, 68e6],
  ['France', 'Europe', 'Paris', 551695, 68e6], ['Italy', 'Europe', 'Rome', 301340, 59e6], ['Spain', 'Europe', 'Madrid', 505990, 48e6],
  ['Ukraine', 'Europe', 'Kyiv', 603550, 37e6], ['Poland', 'Europe', 'Warsaw', 312696, 37.7e6], ['Norway', 'Europe', 'Oslo', 385207, 5.5e6],
  ['Iceland', 'Europe', 'Reykjavik', 103000, 0.38e6], ['Switzerland', 'Europe', 'Bern', 41285, 8.8e6], ['Netherlands', 'Europe', 'Amsterdam', 41543, 17.9e6], ['Vatican City', 'Europe', 'Vatican City', 0.49, 800],
  ['United States', 'North America', 'Washington, D.C.', 9833517, 335e6], ['Canada', 'North America', 'Ottawa', 9984670, 40e6], ['Mexico', 'North America', 'Mexico City', 1964375, 128e6],
  ['Cuba', 'North America', 'Havana', 109884, 11e6], ['Jamaica', 'North America', 'Kingston', 10991, 2.8e6],
  ['Brazil', 'South America', 'Brasília', 8515767, 216e6], ['Argentina', 'South America', 'Buenos Aires', 2780400, 46e6], ['Colombia', 'South America', 'Bogotá', 1141748, 52e6],
  ['Peru', 'South America', 'Lima', 1285216, 34e6], ['Chile', 'South America', 'Santiago', 756102, 19.6e6], ['Venezuela', 'South America', 'Caracas', 916445, 28e6],
  ['Bolivia', 'South America', 'Sucre', 1098581, 12e6], ['Ecuador', 'South America', 'Quito', 283561, 18e6],
  ['Australia', 'Oceania', 'Canberra', 7692024, 26.5e6], ['New Zealand', 'Oceania', 'Wellington', 268021, 5.2e6], ['Papua New Guinea', 'Oceania', 'Port Moresby', 462840, 10e6], ['Fiji', 'Oceania', 'Suva', 18272, 0.93e6],
];

/* radius km, surface gravity m/s², rotation, orbit, mean temperature °C, distance AU */
export const PLANETS = [
  ['Mercury', 2440, 3.70, '58.6 days', '88 days', 167, 0.39, '#9b9488'],
  ['Venus', 6052, 8.87, '243 days (retrograde)', '225 days', 464, 0.72, '#d9b36a'],
  ['Earth', 6371, 9.81, '23 h 56 min', '365.25 days', 15, 1.0, '#3d86d6'],
  ['Mars', 3390, 3.71, '24 h 37 min', '687 days', -65, 1.52, '#c9603b'],
  ['Jupiter', 69911, 24.79, '9 h 56 min', '11.9 years', -110, 5.2, '#d8b48a'],
  ['Saturn', 58232, 10.44, '10 h 33 min', '29.4 years', -140, 9.58, '#e3d3a0'],
  ['Uranus', 25362, 8.87, '17 h 14 min (retrograde)', '84 years', -195, 19.2, '#8fd8dc'],
  ['Neptune', 24622, 11.15, '16 h 6 min', '165 years', -200, 30.05, '#4a6fe0'],
];
export const GRAVITY_BODIES = [['Moon', 1.62], ['Mercury', 3.70], ['Venus', 8.87], ['Mars', 3.71], ['Earth', 9.81], ['Jupiter', 24.79], ['Saturn', 10.44], ['Neptune', 11.15], ['Sun (surface)', 274]];

/* [name, value, note] */
const _RECORDS = {
  Peaks: { unit: 'm', blurb: 'The ten highest mountains above sea level are all in the Himalaya and Karakoram. Heights from recent surveys, rounded.', rows: [
    ['Mount Everest', 8849, 'Nepal / China'], ['K2', 8611, 'Pakistan / China'], ['Kangchenjunga', 8586, 'Nepal / India'], ['Lhotse', 8516, 'Nepal / China'], ['Makalu', 8485, 'Nepal / China'],
    ['Cho Oyu', 8188, 'Nepal / China'], ['Dhaulagiri I', 8167, 'Nepal'], ['Manaslu', 8163, 'Nepal'], ['Nanga Parbat', 8126, 'Pakistan'], ['Annapurna I', 8091, 'Nepal']] },
  'By continent': { unit: 'm', blurb: 'The highest point on each continent (the "Seven Summits"). Oceania is listed as Puncak Jaya on the New Guinea plate; Kosciuszko (2,228 m) is the highest in mainland Australia.', rows: [
    ['Everest · Asia', 8849, 'Nepal / China'], ['Aconcagua · South America', 6961, 'Argentina'], ['Denali · North America', 6190, 'United States'], ['Kilimanjaro · Africa', 5895, 'Tanzania'],
    ['Elbrus · Europe', 5642, 'Russia'], ['Vinson Massif · Antarctica', 4892, 'Antarctica'], ['Puncak Jaya · Oceania', 4884, 'Indonesia']] },
  Rivers: { unit: 'km', blurb: 'River lengths depend on where you decide the source and mouth are, so sources disagree. These are commonly cited approximations.', rows: [
    ['Nile', 6650, 'Africa'], ['Amazon', 6400, 'South America'], ['Yangtze', 6300, 'Asia'], ['Mississippi–Missouri', 6275, 'North America'], ['Yenisei–Angara', 5539, 'Asia'],
    ['Yellow River', 5464, 'Asia'], ['Ob–Irtysh', 5410, 'Asia'], ['Paraná', 4880, 'South America'], ['Congo', 4700, 'Africa'], ['Amur', 4444, 'Asia']] },
  Lakes: { unit: 'km²', blurb: 'The largest lakes by surface area. The Caspian Sea is salty and is classed as a lake because it is landlocked.', rows: [
    ['Caspian Sea', 371000, 'Europe / Asia'], ['Lake Superior', 82100, 'North America'], ['Lake Victoria', 59900, 'Africa'], ['Lake Huron', 59600, 'North America'],
    ['Lake Michigan', 58000, 'North America'], ['Lake Tanganyika', 32600, 'Africa'], ['Lake Baikal', 31700, 'Asia · deepest lake, about 1,640 m'], ['Great Bear Lake', 31000, 'North America']] },
  Deserts: { unit: 'M km²', blurb: 'A desert is defined by low precipitation, not heat. The two largest deserts on Earth are polar.', rows: [
    ['Antarctic', 14.2, 'Cold desert'], ['Arctic', 13.9, 'Cold desert'], ['Sahara', 9.2, 'Largest hot desert'], ['Arabian', 2.3, 'Hot desert'], ['Gobi', 1.3, 'Cold desert'],
    ['Kalahari', 0.9, 'Semi-arid'], ['Patagonian', 0.67, 'Cold desert'], ['Syrian', 0.5, 'Hot desert']] },
  Islands: { unit: 'M km²', blurb: 'The largest islands, excluding continents such as Australia.', rows: [
    ['Greenland', 2.17, 'Denmark'], ['New Guinea', 0.79, 'Indonesia / Papua New Guinea'], ['Borneo', 0.74, 'Indonesia / Malaysia / Brunei'], ['Madagascar', 0.59, 'Madagascar'],
    ['Baffin Island', 0.51, 'Canada'], ['Sumatra', 0.47, 'Indonesia'], ['Honshu', 0.23, 'Japan'], ['Great Britain', 0.21, 'United Kingdom']] },
  Waterfalls: { unit: 'm', blurb: 'Tallest single-drop and tallest overall waterfalls are measured differently; these are commonly cited heights.', rows: [
    ['Angel Falls', 979, 'Venezuela · tallest uninterrupted'], ['Tugela Falls', 948, 'South Africa'], ['Tres Hermanas Falls', 914, 'Peru'], ['Olo’upena Falls', 900, 'United States (Hawaii)'],
    ['Yumbilla Falls', 896, 'Peru'], ['Vinnufossen', 860, 'Norway']] },
  Eruptions: { unit: '', blurb: 'Famous volcanic events and why they matter.', list: [
    ['Vesuvius', 'AD 79', 'Buried the Roman towns of Pompeii and Herculaneum in ash and pumice.'],
    ['Tambora', '1815', 'The largest eruption in recorded history; the following year became known as the "year without a summer".'],
    ['Krakatoa', '1883', 'The explosion was heard about 4,800 km away and triggered deadly tsunamis.'],
    ['Mount St. Helens', '1980', 'The deadliest and most economically destructive volcanic event in US history.'],
    ['Pinatubo', '1991', 'Injected so much sulphur into the stratosphere that global temperatures dipped for about two years.'],
    ['Eyjafjallajökull', '2010', 'Its ash cloud closed much of European airspace for days.'],
    ['Hunga Tonga–Hunga Haʻapai', '2022', 'An underwater eruption that sent a plume tens of kilometres high into the mesosphere.'],
    ['Mauna Loa', 'ongoing', 'The largest active volcano by volume; it last erupted in 2022.']] },
};

export const PLATES = [
  ['Pacific', 103.3, 'about 7–10', 'The largest plate, almost entirely oceanic. Surrounded by the Ring of Fire.'],
  ['North American', 75.9, 'about 1–2', 'Carries North America and half of the North Atlantic floor.'],
  ['Eurasian', 67.8, 'about 1–2', 'Carries Europe and most of Asia.'],
  ['African', 61.3, 'about 2', 'Splitting along the East African Rift.'],
  ['Antarctic', 60.9, 'about 1', 'Nearly encircled by spreading ridges.'],
  ['Indo-Australian', 58.9, 'about 6–7', 'Colliding with Eurasia and raising the Himalaya.'],
  ['South American', 43.6, 'about 1–3', 'Overridden at its western edge by the Nazca plate, building the Andes.'],
];
export const BOUNDARIES = [
  ['Divergent', 'Plates move apart and new crust forms.', 'Mid-Atlantic Ridge, East African Rift'],
  ['Convergent', 'Plates collide; one may sink (subduct) under the other, or both crumple upward.', 'Himalaya (continent–continent), Andes (ocean–continent), Mariana Trench (ocean–ocean)'],
  ['Transform', 'Plates slide past each other, grinding and locking until the stress releases as an earthquake.', 'San Andreas Fault, North Anatolian Fault'],
];

export const BIOMES = [
  ['Tropical rainforest', '20–30 °C all year', 'over 2,000 mm', '#1b8a3a', 'Layered canopy, the highest biodiversity on land.'],
  ['Savanna', '20–30 °C', '500–1,500 mm, with a dry season', '#c8b53c', 'Grassland with scattered trees; seasonal fires and big herds.'],
  ['Hot desert', '20–35 °C by day, cold nights', 'under 250 mm', '#e0b25a', 'Sparse, drought-adapted plants and nocturnal animals.'],
  ['Mediterranean', 'Hot dry summers, mild wet winters', '300–900 mm', '#b98a3a', 'Evergreen shrubland; found on five continents.'],
  ['Temperate grassland', 'Hot summers, cold winters', '250–750 mm', '#a6c04a', 'Prairies, steppes and pampas; deep fertile soils.'],
  ['Temperate forest', 'Four distinct seasons', '750–1,500 mm', '#2f8f4a', 'Broadleaf trees that shed their leaves in autumn.'],
  ['Boreal forest (taiga)', 'Long cold winters, short summers', '300–900 mm', '#1f5a47', 'The largest land biome, mostly conifers.'],
  ['Tundra', 'Average below 0 °C', '150–250 mm', '#9fb8b0', 'Permafrost beneath mosses, lichens and low shrubs.'],
  ['Alpine', 'Cools about 6.5 °C per 1,000 m', 'varies', '#8c7e68', 'Treeless high slopes above the tree line.'],
  ['Polar ice', 'Below −10 °C most of the year', 'very little', '#e6f0ff', 'Ice sheets; the largest freshwater store on land.'],
];

export const TIMELINE = [
  [4540, 'Earth forms from the cloud of gas and dust around the young Sun.'],
  [4400, 'The oldest known mineral grains (zircons) hint that liquid water already existed.'],
  [3500, 'Earliest widely accepted fossils: microbial mats called stromatolites.'],
  [2400, 'Great Oxidation Event: photosynthesis fills the air with free oxygen.'],
  [539, 'Cambrian explosion: most major animal groups appear in the fossil record.'],
  [470, 'First land plants spread across the continents.'],
  [375, 'Early four-legged animals (such as Tiktaalik) leave the water.'],
  [300, 'The supercontinent Pangaea assembles.'],
  [230, 'First dinosaurs.'],
  [200, 'Pangaea begins to break apart.'],
  [66, 'An asteroid impact ends the age of the non-avian dinosaurs.'],
  [0.3, 'Modern humans (Homo sapiens) appear in Africa.'],
  [0.02, 'Last Glacial Maximum: ice sheets cover much of North America and Europe.'],
];

const _GLOSSARY = [
  ['Archipelago', 'A chain or cluster of islands.'], ['Atoll', 'A ring-shaped coral reef enclosing a lagoon.'], ['Basin', 'A low area where water collects, or a large bowl-shaped region drained by a river system.'],
  ['Biome', 'A large ecological region defined by its climate and the plants and animals that live there.'], ['Canyon', 'A deep valley cut by a river, with steep sides.'], ['Cape', 'A headland that juts into the sea.'],
  ['Continental shelf', 'The shallow, gently sloping seabed fringing a continent.'], ['Delta', 'A fan of sediment deposited where a river meets a sea or lake.'], ['Equinox', 'A day when day and night are about equal everywhere. It happens in March and September.'],
  ['Erosion', 'The wearing away of rock and soil by water, wind, ice or gravity.'], ['Estuary', 'The wide mouth of a river where fresh water mixes with the sea.'], ['Fault', 'A fracture in rock along which blocks have moved.'],
  ['Fjord', 'A long, deep sea inlet carved by a glacier.'], ['Glacier', 'A large, slowly flowing mass of ice formed from compacted snow.'], ['Gulf', 'A large sea inlet, bigger than a bay.'],
  ['Hotspot', 'A plume of hot mantle that melts through the crust, building volcanic island chains such as Hawaii.'], ['Isthmus', 'A narrow strip of land linking two larger land areas.'], ['Lagoon', 'A shallow body of water separated from the sea by a reef or sandbar.'],
  ['Latitude', 'Angular distance north or south of the Equator, from 0° to 90°.'], ['Longitude', 'Angular distance east or west of the Prime Meridian, from 0° to 180°.'], ['Meridian', 'A line of longitude running from pole to pole.'],
  ['Mesa', 'A flat-topped hill with steep sides.'], ['Monsoon', 'A seasonal reversal of winds that brings a wet and a dry season.'], ['Moraine', 'A ridge of rock and debris left behind by a glacier.'],
  ['Oasis', 'A fertile spot in a desert where water reaches the surface.'], ['Peninsula', 'Land surrounded by water on three sides.'], ['Plateau', 'A high, relatively flat area of land.'],
  ['Prime Meridian', 'The line of 0° longitude, which passes through Greenwich, London.'], ['Rift valley', 'A long valley formed where the crust pulls apart.'], ['Savanna', 'Tropical grassland with scattered trees.'],
  ['Solstice', 'The day with the longest or shortest daylight of the year, in June and December.'], ['Steppe', 'A vast, dry, treeless grassland.'], ['Strait', 'A narrow waterway connecting two larger bodies of water.'],
  ['Taiga', 'The cold coniferous forest south of the tundra; also called boreal forest.'], ['Tributary', 'A stream or river that flows into a larger one.'], ['Tropic', 'One of two parallels at 23.44° N and S marking the Sun’s farthest overhead position.'],
  ['Tsunami', 'A series of ocean waves caused by an earthquake, landslide or eruption on the seafloor.'], ['Tundra', 'A cold, treeless region with permanently frozen subsoil.'], ['Watershed', 'The area of land that drains into a particular river or sea.'],
];

export const CLOCKS = [
  ['Honolulu', 'Pacific/Honolulu'], ['Los Angeles', 'America/Los_Angeles'], ['Mexico City', 'America/Mexico_City'], ['New York', 'America/New_York'], ['São Paulo', 'America/Sao_Paulo'],
  ['Reykjavik', 'Atlantic/Reykjavik'], ['Lagos', 'Africa/Lagos'], ['London', 'Europe/London'], ['Cairo', 'Africa/Cairo'], ['Johannesburg', 'Africa/Johannesburg'], ['Moscow', 'Europe/Moscow'],
  ['Dubai', 'Asia/Dubai'], ['Delhi', 'Asia/Kolkata'], ['Singapore', 'Asia/Singapore'], ['Shanghai', 'Asia/Shanghai'], ['Tokyo', 'Asia/Tokyo'], ['Sydney', 'Australia/Sydney'], ['Auckland', 'Pacific/Auckland'],
];

export const MEASURE_PRESETS = [
  ['Lagos → London', 6.52, 3.38, 51.51, -0.13], ['Lagos → Nairobi', 6.52, 3.38, -1.29, 36.82], ['New York → Tokyo', 40.71, -74.0, 35.68, 139.69],
  ['Sydney → Santiago', -33.87, 151.21, -33.45, -70.67], ['Equator → North Pole', 0, 0, 90, 0], ['Quito → Singapore', -0.18, -78.47, 1.35, 103.82],
];

/* altitude (km), [label, note] */
export const ALT_LANDMARKS = [
  [0, 'Sea level'], [8.85, 'Summit of Mount Everest'], [11, 'Typical airliner cruise'], [20, 'Ozone layer begins to thicken'], [25, 'Peak of the ozone layer'], [35, 'Weather balloons burst'],
  [39, 'Highest parachute jump from a balloon'], [50, 'Top of the stratosphere'], [85, 'Top of the mesosphere'], [100, 'Kármán line, the conventional edge of space'], [110, 'Aurora curtains, lower edge'],
  [408, 'International Space Station orbit'], [540, 'Hubble Space Telescope orbit'], [20200, 'GPS satellite orbit'], [35786, 'Geostationary orbit'],
];
export const ATM_LAYERS = [
  ['Troposphere', 0, 12, '#2f7fd6', 'Where weather happens and almost all water vapour lives. About 75% of the air’s mass. The top is about 8 km at the poles and 18 km at the equator.'],
  ['Stratosphere', 12, 50, '#4fb3a6', 'Contains the ozone layer, which absorbs harmful ultraviolet light. It warms with height, so it is stable and layered.'],
  ['Mesosphere', 50, 85, '#8a7fd6', 'The coldest layer. Most meteors burn up here.'],
  ['Thermosphere', 85, 600, '#e0764a', 'Very thin air heated by the Sun’s X-rays. Auroras and the International Space Station are here.'],
  ['Exosphere', 600, 10000, '#e8c76a', 'The outer fringe, merging with space. Atoms rarely collide.'],
];
/* US Standard Atmosphere (approximate): altitude km, temperature °C, pressure hPa */
export const ATM_TABLE = [
  [0, 15, 1013.25], [5, -17.5, 540.5], [10, -49.9, 264.4], [11, -56.5, 226.3], [15, -56.5, 121.1], [20, -56.5, 55.3], [25, -51.6, 25.5], [30, -46.6, 12.0], [32, -44.5, 8.89],
  [40, -22.8, 2.87], [47, -2.5, 1.11], [50, -2.5, 0.798], [60, -26, 0.2196], [71, -58.5, 0.0396], [80, -74.5, 0.0105], [86, -86.3, 0.00373], [90, -86.3, 0.00184], [100, -78, 0.00032],
];

/* [question, correct answer, [three wrong answers], explanation] */
const _QUIZ = [
  ['Which line of latitude is 0°?', 'The Equator', ['The Tropic of Cancer', 'The Prime Meridian', 'The Arctic Circle'], 'The Equator is 0° latitude. The Prime Meridian is 0° longitude.'],
  ['How many degrees of longitude does the Sun appear to cross each hour?', '15°', ['5°', '10°', '30°'], '360° divided by 24 hours is 15° per hour, or 4 minutes per degree.'],
  ['Which is the largest ocean?', 'Pacific', ['Atlantic', 'Indian', 'Arctic'], 'The Pacific covers about 165 million km², more than all land combined.'],
  ['Which layer of the Earth is liquid?', 'Outer core', ['Crust', 'Mantle', 'Inner core'], 'The outer core is liquid iron and nickel. The inner core is solid under immense pressure.'],
  ['Where is the Sun directly overhead at noon around 21 June?', 'The Tropic of Cancer', ['The Equator', 'The Tropic of Capricorn', 'The North Pole'], 'About 23.4° N, the Tropic of Cancer, the northern limit of the Sun’s overhead path.'],
  ['What is the highest point above sea level on Earth?', 'Mount Everest', ['K2', 'Kilimanjaro', 'Denali'], 'Mount Everest, 8,849 m by the 2020 China–Nepal survey.'],
  ['Which river is most commonly cited as the longest?', 'The Nile', ['The Congo', 'The Mississippi', 'The Danube'], 'The Nile, at about 6,650 km. The Amazon is very close, depending on how you measure.'],
  ['What is the largest hot desert?', 'The Sahara', ['The Gobi', 'The Arabian Desert', 'The Kalahari'], 'The Sahara covers about 9.2 million km². Antarctica is the largest desert of all.'],
  ['Which country has the largest area?', 'Russia', ['Canada', 'China', 'United States'], 'Russia covers about 17.1 million km², roughly 11% of Earth’s land.'],
  ['Which country has the largest population (2024)?', 'India', ['China', 'United States', 'Indonesia'], 'India passed China in 2023, with about 1.43 billion people.'],
  ['What is the smallest country in the world?', 'Vatican City', ['Monaco', 'San Marino', 'Liechtenstein'], 'Vatican City covers about 0.49 km².'],
  ['What is the capital of Nigeria?', 'Abuja', ['Lagos', 'Kano', 'Port Harcourt'], 'Abuja became the capital in 1991. Lagos is the largest city.'],
  ['What is the capital of Australia?', 'Canberra', ['Sydney', 'Melbourne', 'Perth'], 'Canberra was purpose-built as a compromise between Sydney and Melbourne.'],
  ['What is the capital of Brazil?', 'Brasília', ['Rio de Janeiro', 'São Paulo', 'Salvador'], 'Brasília was inaugurated in 1960 as a planned capital.'],
  ['What is the capital of Canada?', 'Ottawa', ['Toronto', 'Vancouver', 'Montreal'], 'Ottawa sits on the Ontario–Quebec border.'],
  ['Which continent has no permanent population?', 'Antarctica', ['Australia', 'Europe', 'South America'], 'Only research staff live there, and only for part of the year.'],
  ['Which is the deepest known part of the ocean?', 'Challenger Deep', ['Puerto Rico Trench', 'Java Trench', 'Tonga Trench'], 'Challenger Deep in the Mariana Trench is roughly 10,935 m deep.'],
  ['Which is the largest island in the world?', 'Greenland', ['Madagascar', 'Borneo', 'Australia'], 'Greenland is about 2.17 million km². Australia is classed as a continent.'],
  ['Which planet has the shortest day?', 'Jupiter', ['Earth', 'Mars', 'Mercury'], 'Jupiter spins once in under 10 hours.'],
  ['Which planet is the hottest?', 'Venus', ['Mercury', 'Mars', 'Jupiter'], 'Venus’s thick carbon-dioxide atmosphere traps heat, giving about 464 °C at the surface.'],
  ['Which waterfall is the tallest uninterrupted drop?', 'Angel Falls', ['Victoria Falls', 'Niagara Falls', 'Iguazú Falls'], 'Angel Falls in Venezuela drops about 979 m.'],
  ['Which observatory does the Prime Meridian pass through?', 'Royal Observatory, Greenwich', ['Paris Observatory', 'Mauna Kea', 'Griffith Observatory'], 'Longitude 0° was set at Greenwich in 1884.'],
  ['Which country has the most time zones, counting its overseas territories?', 'France', ['Russia', 'United States', 'China'], 'France’s overseas territories give it about twelve time zones. Russia has eleven on its mainland.'],
  ['The shore of which body of water is the lowest dry land?', 'The Dead Sea', ['Lake Baikal', 'The Caspian Sea', 'Lake Victoria'], 'The Dead Sea shore is about 430 m below sea level.'],
  ['The Ring of Fire surrounds which ocean?', 'Pacific', ['Atlantic', 'Indian', 'Arctic'], 'About three-quarters of the world’s active volcanoes lie in this horseshoe around the Pacific.'],
  ['Which mountain range is the conventional boundary between Europe and Asia?', 'The Urals', ['The Alps', 'The Carpathians', 'The Pyrenees'], 'The Ural Mountains run north–south through Russia.'],
  ['Which is the largest lake by area?', 'The Caspian Sea', ['Lake Superior', 'Lake Victoria', 'Lake Baikal'], 'About 371,000 km².'],
  ['Which is the deepest lake in the world?', 'Lake Baikal', ['Lake Tanganyika', 'Lake Superior', 'Crater Lake'], 'Baikal is about 1,640 m deep and holds roughly a fifth of the world’s unfrozen fresh water.'],
  ['Where does the Tropic of Capricorn lie?', 'About 23.4° S', ['About 23.4° N', 'About 66.6° S', 'On the Equator'], 'It marks the southern limit of the Sun’s overhead path, around 21 December.'],
  ['What causes the seasons?', 'The tilt of Earth’s axis', ['Distance from the Sun', 'The Moon’s pull', 'Ocean currents'], 'The 23.44° tilt changes how directly sunlight hits each hemisphere. Earth is actually closest to the Sun in early January.'],
  ['What is an equinox?', 'A day with about equal day and night', ['The longest day', 'The shortest day', 'A day with no Sun at the poles'], 'The Sun is directly over the Equator at the March and September equinoxes.'],
  ['In which layer of the atmosphere does weather happen?', 'Troposphere', ['Stratosphere', 'Mesosphere', 'Thermosphere'], 'The troposphere holds most of the air and almost all of the water vapour.'],
  ['The ozone layer is found in which layer?', 'Stratosphere', ['Troposphere', 'Mesosphere', 'Exosphere'], 'Peak ozone concentrations are about 20–30 km up.'],
  ['Which strait separates Europe from Africa at the western end of the Mediterranean?', 'Strait of Gibraltar', ['Bosphorus', 'Strait of Hormuz', 'Bering Strait'], 'It is only about 14 km wide at its narrowest.'],
  ['Which is the most populous country in Africa?', 'Nigeria', ['Ethiopia', 'Egypt', 'South Africa'], 'Nigeria has an estimated 220+ million people.'],
  ['Which is the longest mountain range on land?', 'The Andes', ['The Himalaya', 'The Rockies', 'The Alps'], 'The Andes stretch about 7,000 km along South America’s west coast.'],
  ['About what percentage of Earth’s surface is covered by ocean?', '71%', ['50%', '60%', '85%'], 'About 70.8% of the surface is water.'],
  ['During which Moon phase is the Moon between Earth and the Sun?', 'New Moon', ['Full Moon', 'First Quarter', 'Last Quarter'], 'At New Moon the side facing us is unlit.'],
  ['Which line roughly follows 180° longitude?', 'The International Date Line', ['The Prime Meridian', 'The Tropic of Cancer', 'The Arctic Circle'], 'It zigzags to avoid splitting countries.'],
  ['In which country is Mount Kilimanjaro?', 'Tanzania', ['Kenya', 'Uganda', 'Ethiopia'], 'Kilimanjaro, 5,895 m, is the highest mountain in Africa.'],
  ['Which continent is the driest?', 'Antarctica', ['Australia', 'Africa', 'Asia'], 'Antarctica gets very little precipitation, so it is technically a desert.'],
  ['Which desert on the west coast of South America is among the driest places on Earth?', 'Atacama', ['Gobi', 'Patagonian', 'Namib'], 'Some Atacama weather stations have never recorded rain.'],
  ['Which wind belt blows from the east near the equator?', 'The trade winds', ['The westerlies', 'The polar easterlies', 'The jet stream'], 'The trade winds blow toward the equator from the east in both hemispheres.'],
  ['Which current helps keep north-western Europe milder than other places at the same latitude?', 'The North Atlantic Drift (Gulf Stream)', ['The Humboldt Current', 'The Kuroshio Current', 'The Benguela Current'], 'It carries warm water from the tropics toward Europe.'],
  ['What is the approximate circumference of the Earth at the Equator?', '40,075 km', ['20,000 km', '28,000 km', '60,000 km'], '40,075 km. The metre was originally defined as one ten-millionth of the distance from the pole to the Equator.'],
];

export const COUNTRIES = [..._COUNTRIES, ...MORE_COUNTRIES.filter(c => !_COUNTRIES.some(x => x[0] === c[0]))];
const gl = new Set(_GLOSSARY.map(g => g[0].toLowerCase()));
export const GLOSSARY = [..._GLOSSARY, ...MORE_GLOSSARY.filter(g => !gl.has(g[0].toLowerCase()))].sort((a, b) => a[0].localeCompare(b[0]));
const _MR = Object.fromEntries(Object.entries(MORE_RECORDS).map(([k, v]) => [k, v.rows ? { ...v, rows: [...v.rows].sort((a, b) => b[1] - a[1]) } : v]));
export const RECORDS = { ..._RECORDS, ..._MR };

/* Generated questions from the country table (capitals, size, population), deterministic */
let _seed = 7; const rnd = () => (_seed = (_seed * 1664525 + 1013904223) >>> 0) / 4294967296;
const pick = (arr, n, not) => { const out = []; while (out.length < n) { const x = arr[(rnd() * arr.length) | 0]; if (x !== not && !out.includes(x)) out.push(x); } return out; };
const nf = n => n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + ' million' : Math.round(n).toLocaleString('en');
const GEN = [];
const bigC = COUNTRIES.filter(c => c[3] > 2000);
for (const c of COUNTRIES) {
  if (c[0] === 'Vatican City' || c[0] === 'Monaco') continue;
  GEN.push([`What is the capital of ${c[0]}?`, c[2], pick(COUNTRIES, 3, c).map(x => x[2]), `${c[2]} is the capital of ${c[0]} (${c[1]}).`]);
}
for (let i = 0; i < 120; i++) {
  const [a, b] = pick(bigC, 2); if (Math.abs(a[3] - b[3]) / Math.max(a[3], b[3]) < 0.25) continue;
  const w = a[3] > b[3] ? a : b, l = w === a ? b : a;
  GEN.push([`Which country is larger by area: ${a[0]} or ${b[0]}?`, w[0], [l[0], 'They are almost the same', 'Neither: both are tiny'], `${w[0]} covers about ${nf(w[3])} km² against ${nf(l[3])} km² for ${l[0]}.`]);
}
for (let i = 0; i < 120; i++) {
  const [a, b] = pick(COUNTRIES, 2); if (Math.abs(a[4] - b[4]) / Math.max(a[4], b[4]) < 0.3) continue;
  const w = a[4] > b[4] ? a : b, l = w === a ? b : a;
  GEN.push([`Which country has more people: ${a[0]} or ${b[0]}?`, w[0], [l[0], 'They are equal', 'Impossible to say'], `${w[0]} has about ${nf(w[4])} people, ${l[0]} about ${nf(l[4])}.`]);
}
for (let i = 0; i < 80; i++) {
  const c = COUNTRIES[(rnd() * COUNTRIES.length) | 0]; const cont = [...new Set(COUNTRIES.map(x => x[1]))];
  GEN.push([`On which continent is ${c[2]}, the capital of ${c[0]}?`, c[1], pick(cont.filter(x => x !== c[1]), 3), `${c[0]} is in ${c[1]}.`]);
}
const seenQ = new Set();
export const QUIZ = [..._QUIZ, ...GEN].filter(q => !seenQ.has(q[0]) && seenQ.add(q[0]));
