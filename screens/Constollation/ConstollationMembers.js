const ConstollationMembers = [
    { name: 'Leader Name', codename: 'Legion Alpha', screen: 'Leader', clickable: false, position: [0, 0], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
    { name: 'Member 1', codename: 'Legion Beta', screen: 'Member1', clickable: false, position: [0, 2], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
    { name: 'Member 2', codename: 'Legion Gamma', screen: 'Member2', clickable: false, position: [1, 0], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
    { name: 'Member 3', codename: 'Legion Delta', screen: 'Member3', clickable: false, position: [1, 1], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
    { name: 'Member 4', codename: 'Legion Epsilon', screen: 'Member4', clickable: false, position: [1, 2], image: require('../../assets/Armor/DefaultPlaceholder.jpg') },
  ];
  
  // Automatically generate additional members up to 78
  const moreMembers = Array.from({ length: 73 }, (_, i) => ({
    name: `Member ${i + 5}`,
    codename: `Legion ${[
      'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega',
      'Alpha Prime', 'Beta Prime', 'Gamma Prime', 'Delta Prime', 'Epsilon Prime', 'Zeta Prime', 'Eta Prime', 'Theta Prime', 'Iota Prime', 'Kappa Prime',
      'Lambda Prime', 'Mu Prime', 'Nu Prime', 'Xi Prime', 'Omicron Prime', 'Pi Prime', 'Rho Prime', 'Sigma Prime', 'Tau Prime', 'Upsilon Prime', 'Phi Prime',
      'Chi Prime', 'Psi Prime', 'Omega Prime', 'Alpha Ultra', 'Beta Ultra', 'Gamma Ultra', 'Delta Ultra', 'Epsilon Ultra', 'Zeta Ultra', 'Eta Ultra', 'Theta Ultra',
      'Iota Ultra', 'Kappa Ultra', 'Lambda Ultra', 'Mu Ultra', 'Nu Ultra', 'Xi Ultra', 'Omicron Ultra', 'Pi Ultra', 'Rho Ultra', 'Sigma Ultra', 'Tau Ultra',
      'Upsilon Ultra', 'Phi Ultra', 'Chi Ultra', 'Psi Ultra', 'Omega Ultra'
    ][i]}`,
    screen: `Member${i + 5}`,
    clickable: false,
    position: [Math.floor((i + 5) / 3), (i + 5) % 3],
    image: require('../../assets/Armor/DefaultPlaceholder.jpg'),
  }));
  
  // Merge initial members with generated ones
  const fullConstollationList = [...ConstollationMembers, ...moreMembers];
  
  export default fullConstollationList;
  