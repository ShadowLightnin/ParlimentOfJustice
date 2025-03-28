import legionImages from './LegionairesImages';

// 🎯 Base Legionaires Members
const baseLegionaires = [];

// 🎯 Legionaires Member List
const moreMembers = [
    'Mason Erickson','Davis Clark','Josh Noble','Spencer Hill','Justin','Zack','Will Knight','Cody Cline','Kinnley Cline','Cassidy Cline',
    'Jessica Fisher','Dylan','Kennedy Carman','Jack','Allysa','Matt Lephi','Jack Smith','Dustin Edmonds','Jose Rodregos',
    'Anthony','Miles','Cieanna','Natalie','Kanyon','Emily','Jarom','Avery','Emily','Sydney','Hunter','Cami Webb',
    'Clayton','Spencer L','Malia Holley','Clayton','Spencer L','Sam','Malia Holley','Mika','Jason','Allysa','Josh','Abby','Tagun','Adam Ledger',
    'Kaden Hanson 1','Sam Philops','Carter Olsen','Issac Philops','Hayden','Hayden','Parker Gold','Gabe Parker','Christian','John',
    'Sanford Duncan ','Lizzy','Kyle','Ivan','Grace','Kaden Hansen 2','Kaia','Erica','Veronica','Elizabeth','Shanna','Lupa',
    'Kody','Nate Greene','Nick','Thomas','Kason','Bridger','Abby','Addie','Brigdon','Noah','Elsie','Mason','Emery Clark',
    'Xzavier','Quinton','Quinton C','Quincy','Sheryl','Krystal','Deb',
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
const generatedMembers = moreMembers.map((name, i) => {
    const memberData = legionImages[name] || { image: require('../../assets/Armor/PlaceHolder.jpg'), clickable: false };

    return {
        name,
        codename: `Legion ${codenameList[i] || 'Unknown'}`,  // 🔥 Added proper codename format
        screen: `Member${i + 1}`,
        position: [Math.floor(i / 3), i % 3],
        ...memberData,
    };
});

export default generatedMembers;
