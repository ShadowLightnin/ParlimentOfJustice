import constollationImages from './ConstollationImages';

// 🎯 Legionaires Member List
const moreMembers = [
  // Elementary
  'Mrs. Gilbert (2nd Grade)',' Ms. Clawson (3rd Grade)','Mrs. MarryWeither(4th Grade)','Mrs. Brown(music)','Mrs. Anderson(6th Grade)','Ms. (6th Grade)', 
  // Jr. High 7th
  'Chad King','Mr. Chandler','Mr. Allred','Mrs. Cox','','','','','','','','','','',
    // Jr. High 8th
  '','','','','','','','','','','','','','','','','','','',
    // Jr. High 9th
  '','','','','','','','','','','','','','','','','','','',
    // High School 10th
  'Tood Campbell','Roxey Caternzaro','Zak Erickson','Tana Johnson','Mrs Perry','','','','','','','','','','','','','','',
      // High School 11th
  'Marc Allen','Lisa McLaws','Sharee Paxton','','','','','','','','','','','','','','','','',
      // High School 12th
  'Weston Kidder','David Pilkington','Nate Hillyard','Kori Schriver','Jack Hattaway','','','','','',
  // College
  'Carey Anson','Sean Fears','John Bitter','Nathan Meyer','Sarina Sinatra','George Ray','Brent','Claudine','Braiden',
  // Influencers
  '','','','','','','','','','','','','','','','','','','',

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

// 🎯 Generate member list with image and clickable status from legionImages
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
