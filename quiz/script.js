/* =========================================================
   ELEMENT DATA
   ========================================================= */
const CATEGORY_COLORS = {
  alkali: 'var(--cat-alkali)',
  alkaline: 'var(--cat-alkaline)',
  transition: 'var(--cat-transition)',
  posttrans: 'var(--cat-posttrans)',
  metalloid: 'var(--cat-metalloid)',
  nonmetal: 'var(--cat-nonmetal)',
  halogen: 'var(--cat-halogen)',
  noble: 'var(--cat-noble)',
  fblock: 'var(--cat-fblock)',
};
const CATEGORY_LABELS = {
  alkali: 'Alkali Metal',
  alkaline: 'Alkaline Earth Metal',
  transition: 'Transition Metal',
  posttrans: 'Post-Transition Metal',
  metalloid: 'Metalloid',
  nonmetal: 'Nonmetal',
  halogen: 'Halogen',
  noble: 'Noble Gas',
  fblock: 'Lanthanide / Actinide',
};

const POSITIONS = {
  1:[1,1], 2:[1,18],
  3:[2,1], 4:[2,2], 5:[2,13], 6:[2,14], 7:[2,15], 8:[2,16], 9:[2,17], 10:[2,18],
  11:[3,1], 12:[3,2], 13:[3,13], 14:[3,14], 15:[3,15], 16:[3,16], 17:[3,17], 18:[3,18],
  19:[4,1], 20:[4,2], 21:[4,3], 22:[4,4], 23:[4,5], 24:[4,6], 25:[4,7], 26:[4,8], 27:[4,9], 28:[4,10], 29:[4,11], 30:[4,12], 31:[4,13], 32:[4,14], 33:[4,15], 34:[4,16], 35:[4,17], 36:[4,18],
  37:[5,1], 38:[5,2], 39:[5,3], 40:[5,4], 42:[5,6], 46:[5,10], 47:[5,11], 48:[5,12], 50:[5,14], 51:[5,15], 52:[5,16], 53:[5,17], 54:[5,18],
  55:[6,1], 56:[6,2], 57:[6,3], 74:[6,6], 78:[6,10], 79:[6,11], 80:[6,12], 81:[6,13], 82:[6,14], 83:[6,15], 84:[6,16], 85:[6,17], 86:[6,18],
  87:[7,1], 88:[7,2], 89:[7,3],
  92:[9,6], 94:[9,8]
};

const ELEMENTS = [
{z:1, symbol:'H', name:'Hydrogen', category:'nonmetal', hints:[
  {text:"Makes up about 75% of all the matter in the universe, and it's the fuel that powers stars, including our Sun.", img:"sun nuclear fusion stars"},
  {text:'Its name comes from Greek words meaning "water-former," since burning it in air produces water as the only byproduct.', img:"water droplet close up"}
]},
{z:2, symbol:'He', name:'Helium', category:'noble', hints:[
  {text:"Discovered in 1868 by studying sunlight during a solar eclipse — the first element ever found in space before it was found on Earth. It's what makes party balloons float and your voice go squeaky.", img:"solar eclipse sun"},
  {text:"Named after Helios, the Greek sun god, since it was spotted in the Sun's light years before anyone found it on Earth.", img:"ancient greek sun god statue"}
]},
{z:3, symbol:'Li', name:'Lithium', category:'alkali', hints:[
  {text:"Powers the rechargeable batteries in phones and laptops; it's also the lightest metal there is — light enough to float on water (though it reacts violently if you try).", img:"rechargeable battery phone"},
  {text:'Its name comes from the Greek word "lithos," meaning "stone," since it was first found in a mineral rather than in plant ashes like similar elements.', img:"mineral rock crystal"}
]},
{z:4, symbol:'Be', name:'Beryllium', category:'alkaline', hints:[
  {text:"Used in the mirrors of the James Webb Space Telescope because it's stiff, light, and stays stable at very cold temperatures.", img:"James Webb telescope mirror"},
  {text:'Named after "beryl," the mineral family that includes emeralds and aquamarines, from which it was first isolated.', img:"emerald aquamarine gemstone"}
]},
{z:5, symbol:'B', name:'Boron', category:'metalloid', hints:[
  {text:"A key ingredient in heat-resistant glass (like oven-safe bakeware and lab equipment), which resists cracking when heated or cooled suddenly.", img:"oven safe glass bakeware"},
  {text:'Its name comes from "borax," a cleaning-product mineral people have used for centuries.', img:"borax powder mineral"}
]},
{z:6, symbol:'C', name:'Carbon', category:'nonmetal', hints:[
  {text:'The basis of all known life, and also forms two of the hardest and softest materials on Earth: diamond and graphite (pencil "lead").', img:"diamond graphite pencil"},
  {text:'Its name comes from the Latin "carbo," meaning charcoal, one of the earliest pure forms of it people had discovered.', img:"charcoal briquettes"}
]},
{z:7, symbol:'N', name:'Nitrogen', category:'nonmetal', hints:[
  {text:'Makes up about 78% of the air you\'re breathing right now, though your body can\'t use it directly — plants need bacteria to "fix" it first.', img:"sky clouds atmosphere"},
  {text:"Its name means \"niter-forming,\" since it was first identified through niter (saltpeter), a key ingredient in gunpowder.", img:"gunpowder historical illustration"}
]},
{z:8, symbol:'O', name:'Oxygen', category:'nonmetal', hints:[
  {text:"The gas your body needs to release energy from food; also makes up most of the water molecule and about 21% of the air.", img:"person breathing deep breath"},
  {text:'Its name comes from Greek words meaning "acid-former," because early chemists mistakenly believed it was present in every acid.', img:"chemistry laboratory flask"}
]},
{z:9, symbol:'F', name:'Fluorine', category:'halogen', hints:[
  {text:"Added to toothpaste and drinking water to help prevent tooth decay; it's also the most reactive of all elements — reactive enough to corrode glass.", img:"toothpaste tube brush"},
  {text:'Its name comes from "fluorite," a mineral used since the 1500s to help metal flow more easily during smelting.', img:"fluorite mineral crystal"}
]},
{z:10, symbol:'Ne', name:'Neon', category:'noble', hints:[
  {text:"Glows reddish-orange when electricity passes through it, making it a favorite for glowing shop signs — though many differently colored glowing signs actually use other gases entirely.", img:"glowing gas discharge tube"},
  {text:'Its name comes from the Greek word "neos," meaning "new," reflecting how recently it had been discovered when it was named in 1898.', img:"vintage neon sign"}
]},
{z:11, symbol:'Na', name:'Sodium', category:'alkali', hints:[
  {text:"Combines with chlorine to form table salt; on its own, as a pure metal, it's so reactive it explodes on contact with water.", img:"table salt crystals"},
  {text:'Its symbol, Na, comes from "natrium," related to a natural mineral salt ancient Egyptians used for cleaning and mummification.', img:"ancient egyptian artifact"}
]},
{z:12, symbol:'Mg', name:'Magnesium', category:'alkaline', hints:[
  {text:"Burns with an intensely bright white light, which is why it's used in fireworks, flares, and old-fashioned camera flashes.", img:"bright white fireworks flare"},
  {text:"Named after Magnesia, a region in Greece where minerals containing it were first mined.", img:"greek mountain landscape"}
]},
{z:13, symbol:'Al', name:'Aluminum', altName:'Aluminium', category:'posttrans', hints:[
  {text:"Once considered more valuable than gold (it was even used for royalty's cutlery) until an efficient way to extract it from ore was invented in the 1880s.", img:"aluminum foil roll"},
  {text:'Its name comes from "alum," a mineral compound people have used since ancient times for dyeing cloth and treating wounds.', img:"alum crystal mineral"}
]},
{z:14, symbol:'Si', name:'Silicon', category:'metalloid', hints:[
  {text:"The main ingredient in computer chips and one of the most abundant elements in Earth's crust — it's also the main component of ordinary beach sand.", img:"computer chip circuit board"},
  {text:'Its name comes from the Latin "silex," meaning flint, a hard stone people have used to make tools for thousands of years.', img:"flint stone tool"}
]},
{z:15, symbol:'P', name:'Phosphorus', category:'nonmetal', hints:[
  {text:"Glows faintly in the dark after exposure to air — early matches were made using a form of it that could ignite just from friction.", img:"old matches striking flame"},
  {text:'Its name literally means "light-bearer" in Greek, describing its faint natural glow.', img:"glow in the dark"}
]},
{z:16, symbol:'S', name:'Sulfur', altName:'Sulphur', category:'nonmetal', hints:[
  {text:'Known for its rotten-egg smell in certain compounds; ancient people called it "brimstone" and associated it with volcanoes.', img:"yellow sulfur crystal volcano"},
  {text:"One of the few elements known since ancient times without any modern chemistry needed — pure yellow crystals of it occur naturally around volcanic vents.", img:"volcanic sulfur deposit"}
]},
{z:17, symbol:'Cl', name:'Chlorine', category:'halogen', hints:[
  {text:"Used to disinfect swimming pools and drinking water by killing bacteria; the sharp smell at a pool is actually a byproduct of it reacting with sweat, not the pure gas itself.", img:"swimming pool water"},
  {text:'Its name comes from the Greek word "chloros," meaning pale green, describing the color of the gas itself.', img:"pale green gas cylinder"}
]},
{z:18, symbol:'Ar', name:'Argon', category:'noble', hints:[
  {text:"Fills incandescent light bulbs because it's an unreactive gas that keeps the hot filament from burning up.", img:"incandescent light bulb filament"},
  {text:'Its name comes from the Greek word for "lazy" or "inactive," since it almost never reacts with anything else.', img:"laboratory glass tube"}
]},
{z:19, symbol:'K', name:'Potassium', category:'alkali', hints:[
  {text:"Essential for muscle and nerve function — bananas are a well-known source, though you'd need to eat dozens in one sitting to get a harmful dose.", img:"bananas fruit"},
  {text:'Its symbol, K, comes from "kalium," related to potash, the ashes of burnt wood once used to make soap and glass.', img:"wood ash fire"}
]},
{z:20, symbol:'Ca', name:'Calcium', category:'alkaline', hints:[
  {text:"Builds strong bones and teeth, and also makes chalk and limestone, since it's the main ingredient in both.", img:"human bones skeleton xray"},
  {text:'Its name comes from the Latin "calx," meaning lime, since it was first isolated from limestone.', img:"limestone rock quarry"}
]},
{z:21, symbol:'Sc', name:'Scandium', category:'transition', hints:[
  {text:"Used in some high-performance bicycle frames and baseball bats to make them lighter and stronger without sacrificing strength.", img:"lightweight bicycle frame"},
  {text:"Named after Scandinavia, the region where the mineral it was first extracted from was discovered.", img:"scandinavian fjord mountains"}
]},
{z:22, symbol:'Ti', name:'Titanium', category:'transition', hints:[
  {text:"As strong as steel but much lighter, so it's used in jet engines, spacecraft, and hip replacements — it's also completely safe inside the human body, unlike many metals.", img:"jet engine turbine"},
  {text:"Named after the Titans of Greek mythology, fitting for a metal famous for its strength.", img:"greek mythology statue"}
]},
{z:23, symbol:'V', name:'Vanadium', category:'transition', hints:[
  {text:"Added to steel to make it tougher for tools and car parts; a wrench or gear made with it can handle far more stress before bending.", img:"steel wrench tools"},
  {text:"Named after Vanadis, another name for the Norse goddess Freyja, because of the striking range of colors its compounds display.", img:"norse mythology art"}
]},
{z:24, symbol:'Cr', name:'Chromium', category:'transition', hints:[
  {text:"Gives stainless steel its shine and rust resistance — the shiny trim on some cars and motorcycles gets its finish from a thin coating of it.", img:"chrome shiny car trim"},
  {text:'Its name comes from the Greek word "chroma," meaning color, since its compounds come in such a vivid range of colors.', img:"colorful mineral crystals"}
]},
{z:25, symbol:'Mn', name:'Manganese', category:'transition', hints:[
  {text:"Essential for making steel — almost all steel production relies on it to remove impurities and add strength.", img:"steel factory production"},
  {text:"Its name comes from a Latin word related to magnets, since an early mineral form of it was mistaken for magnetic iron ore.", img:"magnet horseshoe"}
]},
{z:26, symbol:'Fe', name:'Iron', category:'transition', hints:[
  {text:"The metal at the core of your red blood cells that carries oxygen throughout your body, and the main ingredient in steel.", img:"red blood cells illustration"},
  {text:'Its symbol, Fe, comes from "ferrum," its old Latin name — the root behind words like "ferrous" still used in chemistry today.', img:"iron ore rock"}
]},
{z:27, symbol:'Co', name:'Cobalt', category:'transition', hints:[
  {text:"Used to make vivid blue pigments in glass and pottery for thousands of years, and today it's a key part of many rechargeable batteries.", img:"blue glass pottery"},
  {text:"Named from a German word for a mischievous mine spirit, since miners blamed it for ruining their copper ore and making them sick.", img:"old mine shaft tunnel"}
]},
{z:28, symbol:'Ni', name:'Nickel', category:'transition', hints:[
  {text:"Makes stainless steel resistant to corrosion, and many countries use it in coins because it's durable and doesn't tarnish easily.", img:"stainless steel coins"},
  {text:"Named from a German phrase roughly meaning \"Old Nick's copper,\" since miners thought a mischievous spirit had tricked them out of real copper ore.", img:"old european mine folklore"}
]},
{z:29, symbol:'Cu', name:'Copper', category:'transition', hints:[
  {text:"One of the few metals with a natural color other than gray or silver; it conducts electricity so well that it's used in most electrical wiring.", img:"copper wire coil"},
  {text:"Its symbol, Cu, and its name both trace back to Cyprus, the Mediterranean island the Romans mined it from extensively.", img:"cyprus mediterranean coast"}
]},
{z:30, symbol:'Zn', name:'Zinc', category:'transition', hints:[
  {text:"Coats steel to prevent rust in a process called galvanizing, and it's also an essential nutrient your immune system needs to fight off colds.", img:"galvanized steel sheet"},
  {text:"Its name likely comes from a German word describing the jagged, pointed shape of its crystals when refined.", img:"metal crystal structure"}
]},
{z:31, symbol:'Ga', name:'Gallium', category:'posttrans', hints:[
  {text:"Has such a low melting point (about 30°C, near body temperature) that novelty metal spoons made from it will melt right in a cup of hot tea — a classic science prank.", img:"spoon melting hot tea"},
  {text:'Named after "Gallia," the Latin name for France, by the French chemist who discovered it.', img:"france countryside landscape"}
]},
{z:32, symbol:'Ge', name:'Germanium', category:'metalloid', hints:[
  {text:"Used in the very first transistors, a breakthrough that helped launch the entire modern electronics industry.", img:"vintage transistor radio"},
  {text:"Named after Germany, in honor of the home country of the chemist who discovered it.", img:"germany countryside landscape"}
]},
{z:33, symbol:'As', name:'Arsenic', category:'metalloid', hints:[
  {text:"Famous as a historical poison, but in tiny controlled amounts it's also used in semiconductors for LEDs and solar cells.", img:"LED lights colorful"},
  {text:'Its name likely comes from an old word meaning "yellow pigment," referring to a naturally occurring yellow mineral form used since antiquity.', img:"yellow mineral pigment"}
]},
{z:34, symbol:'Se', name:'Selenium', category:'nonmetal', hints:[
  {text:"Used in solar cells and photocopiers because its electrical conductivity changes when light hits it; it's also an essential trace nutrient in small amounts.", img:"solar panel cells"},
  {text:"Named after Selene, the Greek goddess of the Moon, to pair with a nearby element already named after the Earth.", img:"full moon night sky"}
]},
{z:35, symbol:'Br', name:'Bromine', category:'halogen', hints:[
  {text:"One of only two elements that are liquid at room temperature, with a strong, unpleasant odor even in tiny amounts.", img:"orange liquid chemistry vial"},
  {text:'Its name comes from the Greek word "bromos," meaning stench, describing its famously unpleasant odor.', img:"ancient greek scroll text"}
]},
{z:36, symbol:'Kr', name:'Krypton', category:'noble', hints:[
  {text:"A rare gas used in some energy-efficient light bulbs and certain camera flash lamps; it makes up only a tiny trace of the air we breathe.", img:"energy efficient light bulb"},
  {text:'Its name comes from the Greek word "kryptos," meaning "hidden," since it\'s such a rare trace gas that it was very hard to detect.', img:"hidden treasure chest"}
]},
{z:37, symbol:'Rb', name:'Rubidium', category:'alkali', hints:[
  {text:"Used in extremely precise atomic clocks, some of which are accurate to within a second over millions of years.", img:"atomic clock precision instrument"},
  {text:'Its name comes from the Latin "rubidus," meaning deep red, describing the striking red lines it produces when studied through a spectroscope.', img:"red spectral lines light"}
]},
{z:38, symbol:'Sr', name:'Strontium', category:'alkaline', hints:[
  {text:"Produces brilliant red colors in fireworks; a radioactive form was also famously found in fallout from nuclear tests.", img:"red fireworks display night"},
  {text:"Named after Strontian, a small village in Scotland near the mine where it was first discovered.", img:"scottish highlands village"}
]},
{z:39, symbol:'Y', name:'Yttrium', category:'transition', hints:[
  {text:"Used in LED lights and in the lenses of some cameras and telescopes to improve image quality.", img:"camera lens telescope"},
  {text:"Named after Ytterby, a Swedish village near a quarry where four different elements were first discovered.", img:"swedish village quarry"}
]},
{z:40, symbol:'Zr', name:'Zirconium', category:'transition', hints:[
  {text:"Used to make a popular diamond look-alike gemstone in inexpensive jewelry, and also in nuclear reactor components because it barely absorbs neutrons.", img:"diamond ring jewelry sparkle"},
  {text:'Its name comes from "zircon," a gemstone that has been used in jewelry for thousands of years.', img:"gemstone crystal jewelry"}
]},
{z:42, symbol:'Mo', name:'Molybdenum', category:'transition', hints:[
  {text:"Strengthens steel for use in high-heat environments like engine parts and drill bits, letting them stay sharp even under intense friction.", img:"drill bit steel tool"},
  {text:"Its name comes from a Greek word for lead, since early chemists confused its ore with lead ore.", img:"ancient greek mineral ore"}
]},
{z:46, symbol:'Pd', name:'Palladium', category:'transition', hints:[
  {text:"Used in catalytic converters in cars to reduce harmful exhaust emissions, making it one of the most valuable precious metals by weight.", img:"car catalytic converter exhaust"},
  {text:"Named after Pallas, an asteroid that had just been discovered around the same time as this element.", img:"asteroid space rock"}
]},
{z:47, symbol:'Ag', name:'Silver', category:'transition', hints:[
  {text:"The best electrical and thermal conductor of any metal; historically used for coins, jewelry, and mirrors because of its brilliant shine.", img:"silver jewelry shine"},
  {text:'Its symbol, Ag, comes from "argentum," its old Latin name — also the origin of the country name Argentina.', img:"argentina flag landscape"}
]},
{z:48, symbol:'Cd', name:'Cadmium', category:'transition', hints:[
  {text:"Once widely used in rechargeable batteries and bright yellow/orange paint pigments, though its use has declined due to toxicity concerns.", img:"yellow orange paint pigment"},
  {text:'Named after "cadmia," an old term for a zinc-ore mineral it\'s often found alongside.', img:"zinc ore mineral rock"}
]},
{z:50, symbol:'Sn', name:'Tin', category:'posttrans', hints:[
  {text:'Combined with copper thousands of years ago to make bronze, kicking off the "Bronze Age"; today it\'s used to coat steel cans for food storage.', img:"bronze age artifact museum"},
  {text:'Its symbol, Sn, comes from "stannum," its old Latin name.', img:"ancient roman coin"}
]},
{z:51, symbol:'Sb', name:'Antimony', category:'metalloid', hints:[
  {text:"Ancient Egyptians used a compound of it (kohl) as eye makeup thousands of years ago, and it's still used today to make certain metal alloys harder.", img:"ancient egyptian eye makeup"},
  {text:'Its symbol, Sb, comes from "stibium," an old Latin name for a mineral used in early cosmetics.', img:"ancient cosmetics jar"}
]},
{z:52, symbol:'Te', name:'Tellurium', category:'metalloid', hints:[
  {text:"Added to some metal alloys to make them easier to machine, and can give ordinary bread mold a strong garlic-like smell if contaminated with it.", img:"metal alloy machining workshop"},
  {text:'Its name comes from the Latin word "tellus," meaning Earth.', img:"planet earth from space"}
]},
{z:53, symbol:'I', name:'Iodine', category:'halogen', hints:[
  {text:"Essential for making thyroid hormones, which is why it's added to table salt in many countries to prevent deficiency.", img:"table salt shaker"},
  {text:'Its name comes from the Greek word for "violet," describing the striking purple vapor it produces when heated.', img:"purple violet smoke vapor"}
]},
{z:54, symbol:'Xe', name:'Xenon', category:'noble', hints:[
  {text:"Used in powerful headlights and camera flashes because it produces a very bright, white light when electrified.", img:"bright car headlight night"},
  {text:'Its name comes from the Greek word "xenos," meaning "stranger," since it\'s such a rare trace gas in the air.', img:"glass tube glowing light"}
]},
{z:55, symbol:'Cs', name:'Cesium', altName:'Caesium', category:'alkali', hints:[
  {text:"The official definition of a second is based on vibrations of one of its atoms, making clocks built from it the world's most accurate timekeepers.", img:"atomic clock laboratory"},
  {text:'Its name comes from the Latin "caesius," meaning sky blue, describing the bright blue lines it produces in a spectroscope.', img:"blue sky spectrum light"}
]},
{z:56, symbol:'Ba', name:'Barium', category:'alkaline', hints:[
  {text:"Doctors give patients a special drink containing it before certain X-rays because it shows up clearly and highlights the digestive system.", img:"x-ray scan hospital"},
  {text:'Its name comes from the Greek word "barys," meaning heavy, since its compounds are unusually dense.', img:"heavy dense mineral rock"}
]},
{z:57, symbol:'La', name:'Lanthanum', category:'fblock', hints:[
  {text:"Used in high-quality camera and telescope lenses because it bends light well without distorting colors.", img:"camera lens glass closeup"},
  {text:'Its name comes from a Greek word meaning "to lie hidden," since it was very difficult to separate from the mineral it was found in.', img:"mineral ore rock sample"}
]},
{z:74, symbol:'W', name:'Tungsten', category:'transition', hints:[
  {text:"Has the highest melting point of any metal (about 3,400°C), which is why it was used for decades in the glowing filaments of light bulbs.", img:"glowing light bulb filament closeup"},
  {text:'Its symbol, W, comes from "wolfram," an old name describing how the mineral seemed to "eat" tin like a wolf during ore processing.', img:"medieval wolf folklore art"}
]},
{z:78, symbol:'Pt', name:'Platinum', category:'transition', hints:[
  {text:"So resistant to corrosion and heat that it's used in jewelry, lab equipment, and catalytic converters; it's also rarer and often pricier than gold.", img:"platinum ring jewelry"},
  {text:'Its name comes from the Spanish word "platina," meaning "little silver" — a dismissive nickname from Spanish colonizers who initially thought it was a lesser metal.', img:"south american colonial mine"}
]},
{z:79, symbol:'Au', name:'Gold', category:'transition', hints:[
  {text:"So unreactive that jewelry made from it thousands of years ago can still be found gleaming today, unlike most other metals which corrode over time.", img:"ancient gold jewelry artifact"},
  {text:'Its symbol, Au, comes from "aurum," its old Latin name, related to the word for "shining dawn."', img:"golden sunrise sky"}
]},
{z:80, symbol:'Hg', name:'Mercury', category:'transition', hints:[
  {text:"The only metal that's liquid at room temperature; old thermometers used it, though it's now avoided due to toxicity.", img:"liquid metal droplet mercury"},
  {text:'Its symbol, Hg, comes from "hydrargyrum," Greek for "liquid silver."', img:"roman god statue"}
]},
{z:81, symbol:'Tl', name:'Thallium', category:'posttrans', hints:[
  {text:'Historically nicknamed the "poisoner\'s poison" because it\'s tasteless, odorless, and was hard to detect in poisoning cases before modern forensics.', img:"forensic science laboratory"},
  {text:'Its name comes from the Greek word for "green shoot," describing a bright green line it produces when studied through a spectroscope.', img:"green plant sprout"}
]},
{z:82, symbol:'Pb', name:'Lead', category:'posttrans', hints:[
  {text:'Ancient Romans used pipes made from it for plumbing — in fact, the word "plumbing" comes from this metal\'s old Latin name. It was also common in paint and gasoline before its health risks were understood.', img:"ancient roman aqueduct pipes"},
  {text:'Its symbol, Pb, comes from "plumbum," its old Latin name.', img:"old metal pipe"}
]},
{z:83, symbol:'Bi', name:'Bismuth', category:'posttrans', hints:[
  {text:"Famous for forming stunning rainbow-colored, staircase-shaped crystals when it cools slowly — a favorite among element collectors.", img:"rainbow crystal geometric"},
  {text:'Its name\'s exact origin is debated, but may come from old German words describing a pale, silvery "white mass."', img:"silvery white metal ingot"}
]},
{z:84, symbol:'Po', name:'Polonium', category:'posttrans', hints:[
  {text:"Discovered by Marie Curie and is intensely radioactive; a tiny amount was famously used in a notorious 2006 poisoning case in London.", img:"marie curie portrait laboratory"},
  {text:"Named by Marie Curie after Poland, her home country, partly to draw attention to Poland's lack of independence at the time.", img:"poland historical map"}
]},
{z:85, symbol:'At', name:'Astatine', category:'halogen', hints:[
  {text:"One of the rarest naturally occurring elements on Earth — scientists estimate less than a gram exists in the planet's entire crust at any given time.", img:"periodic table chart"},
  {text:'Its name comes from the Greek word "astatos," meaning "unstable," since every form of it is radioactive.', img:"radioactive warning symbol"}
]},
{z:86, symbol:'Rn', name:'Radon', category:'noble', hints:[
  {text:"A radioactive gas that can seep into homes from the ground through cracks in foundations, which is why some homeowners have a special detector installed.", img:"home basement foundation"},
  {text:"Its name comes from radium, since it's produced when radium breaks down.", img:"radioactive decay diagram"}
]},
{z:87, symbol:'Fr', name:'Francium', category:'alkali', hints:[
  {text:"So rare and unstable that scientists estimate only about a teaspoon's worth exists on Earth at any given moment; it was discovered in 1939 by physicist Marguerite Perey.", img:"periodic table rare element"},
  {text:"Named after France, the home country of the physicist who discovered it.", img:"female scientist portrait historical"}
]},
{z:88, symbol:'Ra', name:'Radium', category:'alkaline', hints:[
  {text:"Discovered by Marie and Pierre Curie, it glows faintly in the dark and was once used to paint glow-in-the-dark watch dials — a practice stopped after the factory workers who painted them got seriously ill.", img:"glow in the dark watch dial"},
  {text:'Its name comes from the Latin word "radius," meaning ray, because of the powerful rays of energy it constantly gives off.', img:"curie laboratory historical"}
]},
{z:89, symbol:'Ac', name:'Actinium', category:'fblock', hints:[
  {text:"Glows with a faint blue light in the dark due to its intense radioactivity; it's so rare that it's mostly used only in scientific research.", img:"glowing blue light dark"},
  {text:'Its name comes from the Greek word "aktis," meaning ray or beam, referencing its radioactivity.', img:"light beam rays abstract"}
]},
{z:92, symbol:'U', name:'Uranium', category:'fblock', hints:[
  {text:"Powers nuclear reactors that generate electricity for millions of homes; a compound of it was the material Henri Becquerel was studying in 1896 when he accidentally discovered radioactivity.", img:"nuclear power plant reactor"},
  {text:"Named after the planet Uranus, which had been discovered just a few years earlier.", img:"planet uranus space telescope"}
]},
{z:94, symbol:'Pu', name:'Plutonium', category:'fblock', hints:[
  {text:"Powers the electrical generators aboard deep-space probes like Voyager and the Mars rovers, since sunlight is too weak to rely on that far from Earth.", img:"voyager space probe mars rover"},
  {text:"Named after Pluto, continuing a naming pattern that started with the two elements just before it, named after Neptune and Uranus.", img:"planet pluto space dwarf"}
]},
];

const ELEMENT_BY_Z = {};
ELEMENTS.forEach(e => ELEMENT_BY_Z[e.z] = e);

/* =========================================================
   STATE / STORAGE
   ========================================================= */
const STORAGE_KEY = 'elementQuizProgress_v1';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultProgress(), parsed);
  } catch (e) {
    return defaultProgress();
  }
}
function defaultProgress() {
  const mastery = {};
  ELEMENTS.forEach(e => mastery[e.z] = { streak: 0, mastered: false });
  return { mastery, badges: [] };
}
function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
  catch (e) { /* storage unavailable, fail silently */ }
}

let progress = loadProgress();

// image cache lives for the app session only (in-memory, not persisted)
const imageCache = {}; // key: "z-hintIndex" -> url or null

const BADGE_DEFS = [
  { id: 'mastered_10', label: '10 Mastered', icon: '🔟', check: p => countMastered(p) >= 10 },
  { id: 'mastered_25', label: '25 Mastered', icon: '🎖️', check: p => countMastered(p) >= 25 },
  { id: 'mastered_all', label: 'All 67 Mastered', icon: '👑', check: p => countMastered(p) >= ELEMENTS.length },
  { id: 'perfect_round', label: 'Perfect Round', icon: '⭐', check: (p, roundStats) => roundStats && roundStats.perfect },
  { id: 'streak_10', label: '10-Streak', icon: '🔥', check: (p, roundStats) => roundStats && roundStats.longestStreak >= 10 },
];

function countMastered(p) {
  return Object.values(p.mastery).filter(m => m.mastered).length;
}

/* =========================================================
   NAVIGATION
   ========================================================= */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'screen-start') renderStartStats();
  if (id === 'screen-board') renderBoard();
  if (id === 'screen-achievements') renderAchievements();
}

document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => showScreen(btn.dataset.goto));
});
document.getElementById('btn-goto-board').addEventListener('click', () => showScreen('screen-board'));
document.getElementById('btn-goto-achievements').addEventListener('click', () => showScreen('screen-achievements'));

function renderStartStats() {
  const mastered = countMastered(progress);
  document.getElementById('start-stats').textContent = `${mastered} / ${ELEMENTS.length} elements mastered`;
}

/* =========================================================
   IMAGE FETCHING (Wikipedia, session-cached)
   ========================================================= */
async function fetchHintImage(z, hintIndex, query) {
  const cacheKey = z + '-' + hintIndex;
  if (cacheKey in imageCache) return imageCache[cacheKey];

  const url = await fetchWikiImage(query) || await fetchWikiImage(ELEMENT_BY_Z[z].name);
  imageCache[cacheKey] = url;
  return url;
}

async function fetchWikiImage(query) {
  try {
    const api = 'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=' +
      encodeURIComponent(query) + '&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=300&format=json&origin=*';
    const res = await fetch(api);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data && data.query && data.query.pages;
    if (!pages) return null;
    const first = Object.values(pages)[0];
    if (first && first.thumbnail && first.thumbnail.source) return first.thumbnail.source;
    return null;
  } catch (e) {
    return null;
  }
}

/* =========================================================
   QUIZ LOGIC
   ========================================================= */
let quizState = null;

function startRound() {
  const pool = shuffle(ELEMENTS.slice());
  const questions = pool.slice(0, 20).map(el => ({
    el,
    direction: Math.random() < 0.5 ? 'sym2name' : 'name2sym',
    hintIndex: Math.floor(Math.random() * el.hints.length),
    resolved: false,
    creditType: null, // 'full' | 'partial' | 'miss'
  }));

  const masteredBefore = new Set(
    Object.keys(progress.mastery).filter(z => progress.mastery[z].mastered)
  );

  quizState = {
    questions,
    index: 0,
    score: 0,
    streak: 0,
    longestStreak: 0,
    masteredBefore,
  };

  showScreen('screen-quiz');
  renderQuestion();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function currentQuestion() {
  return quizState.questions[quizState.index];
}

function renderQuestion() {
  const q = currentQuestion();
  const el = q.el;

  document.getElementById('quiz-progress').textContent = `Question ${quizState.index + 1} / ${quizState.questions.length}`;
  document.getElementById('quiz-score').textContent = quizState.score;
  document.getElementById('quiz-streak').textContent = quizState.streak;
  document.getElementById('quiz-flame').classList.toggle('lit', quizState.streak > 0);

  document.getElementById('quiz-atomic-num').textContent = 'Z = ' + el.z;

  const promptEl = document.getElementById('quiz-prompt');
  if (q.direction === 'sym2name') {
    document.getElementById('quiz-direction-label').textContent = 'Type the element name';
    promptEl.textContent = el.symbol;
    promptEl.className = 'quiz-prompt is-symbol';
  } else {
    document.getElementById('quiz-direction-label').textContent = 'Type the element symbol';
    promptEl.textContent = el.name;
    promptEl.className = 'quiz-prompt is-name';
  }

  const hint = el.hints[q.hintIndex];
  document.getElementById('hint-text').textContent = hint.text;

  const img = document.getElementById('hint-img');
  const placeholder = document.getElementById('hint-placeholder');
  img.style.display = 'none';
  placeholder.style.display = 'flex';
  fetchHintImage(el.z, q.hintIndex, hint.img).then(url => {
    // guard: only apply if still on the same question
    if (currentQuestion() !== q) return;
    if (url) {
      img.src = url;
      img.style.display = 'block';
      placeholder.style.display = 'none';
    }
  });

  const input = document.getElementById('answer-input');
  input.value = '';
  input.className = '';
  input.disabled = false;
  document.getElementById('feedback-message').textContent = '';
  document.getElementById('feedback-message').className = 'feedback-message';
  document.getElementById('altname-note').textContent = '';
  document.getElementById('btn-submit').style.display = 'block';
  document.getElementById('btn-next').style.display = 'none';
  input.focus();
}

function expectedAnswer(q) {
  return q.direction === 'sym2name' ? q.el.name : q.el.symbol;
}

function resolveQuestion(q, creditType) {
  q.resolved = true;
  q.creditType = creditType;
  const el = q.el;
  const input = document.getElementById('answer-input');
  const msg = document.getElementById('feedback-message');
  input.disabled = true;

  if (creditType === 'full') {
    quizState.score += 1;
    quizState.streak += 1;
    input.className = 'feedback-good';
    msg.textContent = 'Correct!';
    msg.className = 'feedback-message good';
    bumpMastery(el.z, true);
  } else if (creditType === 'partial') {
    quizState.score += 0.5;
    quizState.streak += 1;
    input.className = 'feedback-warn';
    msg.textContent = 'Correct (capitalization fixed) — 0.5 point.';
    msg.className = 'feedback-message warn';
    bumpMastery(el.z, true);
  } else {
    quizState.streak = 0;
    input.className = 'feedback-bad';
    msg.textContent = 'Not quite — the answer was ' + expectedAnswer(q) + '.';
    msg.className = 'feedback-message bad';
    bumpMastery(el.z, false);
  }

  quizState.longestStreak = Math.max(quizState.longestStreak, quizState.streak);

  if (q.direction === 'sym2name' && el.altName && (creditType === 'full' || creditType === 'partial')) {
    document.getElementById('altname-note').textContent = `Also acceptable: ${el.altName}`;
  }

  document.getElementById('quiz-score').textContent = quizState.score;
  document.getElementById('quiz-streak').textContent = quizState.streak;
  document.getElementById('quiz-flame').classList.toggle('lit', quizState.streak > 0);

  document.getElementById('btn-submit').style.display = 'none';
  document.getElementById('btn-next').style.display = 'block';
  saveProgress();
}

function bumpMastery(z, wasCorrectFirstTry) {
  const m = progress.mastery[z];
  if (wasCorrectFirstTry) {
    m.streak += 1;
    if (m.streak >= 3) m.mastered = true;
  } else {
    m.streak = 0;
    m.mastered = false;
  }
}

// handle wrong-case retry -> becomes 'partial' credit if corrected
function handleRetrySubmit() {
  const q = currentQuestion();
  if (q.resolved) return;
  const input = document.getElementById('answer-input');
  const raw = input.value.trim();
  if (!raw) return;
  const expected = expectedAnswer(q);
  const altExpected = q.direction === 'sym2name' && q.el.altName ? q.el.altName : null;
  const exactMatch = raw === expected || (altExpected && raw === altExpected);
  const matchesContentOnly = !exactMatch && (raw.toLowerCase() === expected.toLowerCase() ||
    (altExpected && raw.toLowerCase() === altExpected.toLowerCase()));

  if (exactMatch) {
    // if this is a retry after a warn state, mark as partial credit
    resolveQuestion(q, input.className.includes('feedback-warn') || wasWarned ? 'partial' : 'full');
  } else if (matchesContentOnly) {
    input.className = 'feedback-warn';
    wasWarned = true;
    const msg = document.getElementById('feedback-message');
    msg.textContent = 'Right answer — check your capitalization and try again.';
    msg.className = 'feedback-message warn';
  } else {
    resolveQuestion(q, 'miss');
  }
}
let wasWarned = false;

document.getElementById('btn-submit').addEventListener('click', () => {
  handleRetrySubmit();
});
document.getElementById('answer-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleRetrySubmit();
  }
});

document.getElementById('btn-next').addEventListener('click', () => {
  wasWarned = false;
  quizState.index += 1;
  if (quizState.index >= quizState.questions.length) {
    finishRound();
  } else {
    renderQuestion();
  }
});

function finishRound() {
  const stats = {
    score: quizState.score,
    longestStreak: quizState.longestStreak,
    total: quizState.questions.length,
    correctFull: quizState.questions.filter(q => q.creditType === 'full').length,
    correctPartial: quizState.questions.filter(q => q.creditType === 'partial').length,
    missed: quizState.questions.filter(q => q.creditType === 'miss'),
    corrected: quizState.questions.filter(q => q.creditType === 'partial'),
    perfect: quizState.questions.every(q => q.creditType === 'full'),
  };
  const newlyMasteredCount = Object.keys(progress.mastery).filter(z =>
    progress.mastery[z].mastered && !quizState.masteredBefore.has(z)
  ).length;

  const newBadges = [];
  BADGE_DEFS.forEach(b => {
    if (!progress.badges.includes(b.id) && b.check(progress, stats)) {
      progress.badges.push(b.id);
      newBadges.push(b);
    }
  });
  saveProgress();

  renderSummary(stats, newBadges, newlyMasteredCount);
  showScreen('screen-summary');
}

function renderSummary(stats, newBadges, newlyMasteredCount) {
  document.getElementById('summary-score').textContent = stats.score;
  const accuracy = Math.round(((stats.correctFull + stats.correctPartial) / stats.total) * 100);
  document.getElementById('summary-accuracy').textContent = accuracy + '%';
  document.getElementById('summary-streak').textContent = stats.longestStreak;
  document.getElementById('summary-mastered').textContent = newlyMasteredCount;

  const badgesWrap = document.getElementById('summary-badges-wrap');
  const badgesEl = document.getElementById('summary-badges');
  badgesEl.innerHTML = '';
  if (newBadges.length) {
    badgesWrap.style.display = 'block';
    newBadges.forEach(b => {
      const pill = document.createElement('div');
      pill.className = 'badge-pill';
      pill.innerHTML = `<span>${b.icon}</span><span>${b.label}</span>`;
      badgesEl.appendChild(pill);
    });
  } else {
    badgesWrap.style.display = 'none';
  }

  const list = document.getElementById('summary-miss-list');
  list.innerHTML = '';
  const reviewItems = [...stats.missed, ...stats.corrected];
  if (reviewItems.length === 0) {
    list.innerHTML = '<div style="color:var(--text-dim); font-size:15px;">Nothing missed — great round!</div>';
  } else {
    reviewItems.forEach(q => {
      const el = q.el;
      const item = document.createElement('div');
      item.className = 'miss-item';
      item.style.borderLeftColor = CATEGORY_COLORS[el.category];
      const tagClass = q.creditType === 'miss' ? 'wrong' : 'case';
      const tagLabel = q.creditType === 'miss' ? 'Missed' : 'Case fixed';
      item.innerHTML = `
        <div class="miss-sym">${el.symbol}</div>
        <div class="miss-body"><b>${el.name}</b><br>${el.hints[q.hintIndex].text}</div>
        <div class="miss-tag ${tagClass}">${tagLabel}</div>
      `;
      list.appendChild(item);
    });
  }
}

document.getElementById('btn-start-round').addEventListener('click', startRound);
document.getElementById('btn-new-round').addEventListener('click', startRound);

/* =========================================================
   MASTERY BOARD
   ========================================================= */
function renderBoard() {
  const table = document.getElementById('ptable');
  table.innerHTML = '';
  ELEMENTS.forEach(el => {
    const pos = POSITIONS[el.z];
    if (!pos) return;
    const cell = document.createElement('div');
    const m = progress.mastery[el.z];
    cell.className = 'cell' + (m.mastered ? ' mastered' : '');
    cell.style.gridRow = pos[0];
    cell.style.gridColumn = pos[1];
    const baseColor = CATEGORY_COLORS[el.category];
    cell.style.background = m.mastered ? baseColor : `color-mix(in srgb, ${baseColor} 35%, var(--surface))`;
    cell.style.color = '#0A1620';
    cell.innerHTML = `<span class="cell-z">${el.z}</span><span class="cell-sym">${el.symbol}</span>`;
    cell.addEventListener('click', () => openCellPopup(el));
    table.appendChild(cell);
  });

  const legend = document.getElementById('legend');
  legend.innerHTML = '';
  Object.keys(CATEGORY_LABELS).forEach(cat => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `<span class="legend-swatch" style="background:${CATEGORY_COLORS[cat]}"></span><span>${CATEGORY_LABELS[cat]}</span>`;
    legend.appendChild(item);
  });
}

function openCellPopup(el) {
  const m = progress.mastery[el.z];
  document.getElementById('popup-sym').textContent = el.symbol;
  document.getElementById('popup-sym').style.color = CATEGORY_COLORS[el.category];
  document.getElementById('popup-name').textContent = el.name + (el.altName ? ` (${el.altName})` : '');
  document.getElementById('popup-cat').textContent = CATEGORY_LABELS[el.category] + ' · Z = ' + el.z;
  document.getElementById('popup-progress').textContent = m.mastered
    ? 'Mastered ✓'
    : `${m.streak} / 3 toward mastery`;
  document.getElementById('cell-popup').classList.add('active');
}
document.getElementById('popup-close').addEventListener('click', () => {
  document.getElementById('cell-popup').classList.remove('active');
});
document.getElementById('cell-popup').addEventListener('click', (e) => {
  if (e.target.id === 'cell-popup') e.target.classList.remove('active');
});

/* =========================================================
   ACHIEVEMENTS
   ========================================================= */
function renderAchievements() {
  const grid = document.getElementById('achv-grid');
  grid.innerHTML = '';
  BADGE_DEFS.forEach(b => {
    const earned = progress.badges.includes(b.id);
    const card = document.createElement('div');
    card.className = 'achv-card' + (earned ? '' : ' locked');
    card.innerHTML = `<div class="achv-icon">${b.icon}</div><div class="achv-label">${b.label}</div>`;
    grid.appendChild(card);
  });
}

/* init */
renderStartStats();
