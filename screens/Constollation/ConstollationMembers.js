import constollationImages from './ConstollationImages';

// 🎯 Constollation Member List
const moreMembers = [
  // Elementary
  'Mrs. Gilbert (2nd Grade)',' Ms. Clawson (3rd Grade)','Mrs. MarryWeither(4th Grade)','Mrs. Brown(music)','Mrs. Anderson(6th Grade)','Ms. (6th Grade)', 
  // Jr. High 7th
  'Chad King (Band)','Jeff Wittik (Band)','Mr. Chandler','Mr. Allred','Mrs. Cox','Sally Smith','Mrs. Maughan','Coach Brooks','Mr. Hammerschmidt',
    // Jr. High 8th
  'Mrs. Anderson','Mrs. Spinney','Mrs. Thompson','Mrs. Davis',
    // Jr. High 9th
  'Mrs. Elysia Butler','Mr. Jackson',
  // Seminary
  'Bro. Valor','Bro. Perston',
    // High School 10th
  'Tood Campbell','Roxey Caternzaro','Zak Erickson','Tana Johnson','Mrs Perry','Coach Fresques','Mr. Lauscher','Coach Simon','Mrs. Morfin',
    // Seminary
  'Bro. Brodrick','Bro. Hedlund',
      // High School 11th
  'Marc Allen','Chad Lythgoe','Mrs. Short','Lisa McLaws','Sharee Paxton','Todd Ballif','Weston Kidder','Zachary Hansen',
    // Seminary
  'Bro. DeYoung','Bro. Jenks',
      // High School 12th
  'David Pilkington','Mr. Feller','Nate Hillyard','Kori Schriver','Jack Hattaway','Sennet Fraughton',
    // Seminary
  'Bro. Mason',
  // College
  'Carey Anson','Sean Fears','John Bitter','Nathan Meyer','Sarina Sinatra','George Ray','Brent','Claudine','Braiden',
  // Influencers
  'Chris Pratt','Robert Downey Jr','Chris Hemsworth','Chris Evens','Tom Holland','Benedict Cumberbatch','Elizabeth Olsen',
  'Jennifer Lawrence','Tom Hiddleston','Imagine Dragons','One Republic','Cold Play',
  'Pewdiepie','Grain','Mumbo','Geminitay','Scar','Bdubs','Impulsesv','Docm77','Rendog','Smallishbeans','Solidarity',
  'Comicstorian','Bombastic','Smii7y','PlayswithGray','Thor Skywalker','Muselk','Lazarbeam',

'Sheryl','Krystal','Deb',
];

// 🎯 Codename Mapping
const codenameList = [ 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 
  'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'Alpha Prime', 'Beta Prime', 'Gamma Prime', 'Delta Prime', 'Epsilon Prime', 'Zeta Prime', 'Eta Prime', 
  'Theta Prime', 'Iota Prime', 'Kappa Prime', 'Lambda Prime', 'Mu Prime', 'Nu Prime', 'Xi Prime', 'Omicron Prime', 'Pi Prime', 'Rho Prime', 'Sigma Prime', 'Tau Prime', 
  'Upsilon Prime', 'Phi Prime', 'Chi Prime', 'Psi Prime', 'Omega Prime', 'Alpha Ultra', 'Beta Ultra', 'Gamma Ultra', 'Delta Ultra', 'Epsilon Ultra', 'Zeta Ultra', 'Eta Ultra', 
  'Theta Ultra', 'Iota Ultra', 'Kappa Ultra', 'Lambda Ultra', 'Mu Ultra', 'Nu Ultra', 'Xi Ultra', 'Omicron Ultra', 'Pi Ultra', 'Rho Ultra', 'Sigma Ultra', 'Tau Ultra',
  'Upsilon Ultra', 'Phi Ultra', 'Chi Ultra', 'Psi Ultra', 'Omega Ultra',
];

// 🎯 Generate member list with image and clickable status from ConstollationImages
const fullConstollationList = moreMembers.map((name, i) => {
  const memberData = constollationImages[name] || { image: require('../../assets/Armor/PlaceHolder.jpg'), clickable: false };

  return {
      name,
      codename: `Legion ${codenameList[i] || 'Unknown'}`,  // 🔥 Added proper codename format
      screen: `Member${i + 1}`,
      position: [Math.floor(i / 3), i % 3],
      ...memberData,
  };
});

export default fullConstollationList;
