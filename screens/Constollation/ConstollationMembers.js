import constollationImages from './ConstollationImages';

// 🎯 Base Constollation Members
const baseConstollation = [
  { name: 'Leader Name', codename: 'Legion Alpha', screen: 'Leader', clickable: false, position: [0, 0] },
  { name: 'Member 1', codename: 'Legion Beta', screen: 'Member1', clickable: false, position: [0, 2] },
  { name: 'Member 2', codename: 'Legion Gamma', screen: 'Member2', clickable: false, position: [1, 0] },
  { name: 'Member 3', codename: 'Legion Delta', screen: 'Member3', clickable: false, position: [1, 1] },
  { name: 'Member 4', codename: 'Legion Epsilon', screen: 'Member4', clickable: false, position: [1, 2] },
];

// 🎯 Generate additional members up to 100
const moreMembers = Array.from({ length: 100 }, (_, i) => ({
  name: `Member ${i + 5}`,
  codename: `Legion ${[
      'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega',
      'Alpha Prime', 'Beta Prime', 'Gamma Prime', 'Delta Prime', 'Epsilon Prime', 'Zeta Prime', 'Eta Prime', 'Theta Prime', 'Iota Prime', 'Kappa Prime',
      'Lambda Prime', 'Mu Prime', 'Nu Prime', 'Xi Prime', 'Omicron Prime', 'Pi Prime', 'Rho Prime', 'Sigma Prime', 'Tau Prime', 'Upsilon Prime', 'Phi Prime',
      'Chi Prime', 'Psi Prime', 'Omega Prime', 'Alpha Ultra', 'Beta Ultra', 'Gamma Ultra', 'Delta Ultra', 'Epsilon Ultra', 'Zeta Ultra', 'Eta Ultra', 'Theta Ultra',
      'Iota Ultra', 'Kappa Ultra', 'Lambda Ultra', 'Mu Ultra', 'Nu Ultra', 'Xi Ultra', 'Omicron Ultra', 'Pi Ultra', 'Rho Ultra', 'Sigma Ultra', 'Tau Ultra',
      'Upsilon Ultra', 'Phi Ultra', 'Chi Ultra', 'Psi Ultra', 'Omega Ultra'
  ][i] || 'Unknown'}`,
  screen: `Member${i + 5}`,
  position: [Math.floor((i + 5) / 3), (i + 5) % 3],
}));

// 🎯 Combine both base and additional members and map images and clickable status
const fullConstollationList = [...baseConstollation, ...moreMembers].map(member => ({
  ...member,
  ...constollationImages[member.name] || { image: require('../../assets/Armor/PlaceHolder.jpg'), clickable: false },
}));

export default fullConstollationList;
