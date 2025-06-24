// 🎯 Static mapping of character images for Legionaires
const legionImages = {
  'Mason Erickson': { image: require('../../assets/Armor/MasonEPlaceHolder.jpg'), clickable: true },
  'Davis Clark': { image: require('../../assets/Armor/DavisPlaceHolder.jpg'), clickable: true },
  'Mckain Bailey': { image: require('../../assets/Armor/BaileyPlaceHolder.jpg'), clickable: true },


  'Mika': { image: require('../../assets/Armor/MikaPlaceHolder.jpg'), clickable: true },
  'Malia': { image: require('../../assets/Armor/MaliaPlaceHolder.jpg'), clickable: true },
  'Jami': { image: require('../../assets/Armor/JamiPlaceHolder.jpg'), clickable: true },
  'Cami': { image: require('../../assets/Armor/CamiPlaceHolder.jpg'), clickable: true },
  'Kanani': { image: require('../../assets/Armor/KananiPlaceHolder.jpg'), clickable: true },


  'Kenndedy Carman': { image: require('../../assets/Armor/KennedyPlaceHolder.jpg'), clickable: true },
  'Jack Clark': { image: require('../../assets/Armor/JackClarkPlaceHolder.jpg'), clickable: true },
  'Emma Bronson': { image: require('../../assets/Armor/EmmaBronPlaceHolder.jpg'), clickable: true },
  'Ella Duce': { image: require('../../assets/Armor/EllaDucePlaceHolder.jpg'), clickable: true },
  'Addison Morris': { image: require('../../assets/Armor/AddisonMorrisPlaceHolder.jpg'), clickable: true },
  'Alyssa': { image: require('../../assets/Armor/AlyssaPlaceHolder.jpg'), clickable: true },
  'Cody Cline': { image: require('../../assets/Armor/CodyPlaceHolder.jpg'), clickable: true },
  'Kinnley Cline': { image: require('../../assets/Armor/KinnleyPlaceHolder.jpg'), clickable: true },
  'Jack Smith': { image: require('../../assets/Armor/JackPlaceHolder.jpg'), clickable: true },
  'Dylan': { image: require('../../assets/Armor/DylanPlaceHolder.jpg'), clickable: true },
  'Jessica Fisher': { image: require('../../assets/Armor/JessicaFPlaceHolder.jpg'), clickable: true },
  'Dustin Edmonds': { image: require('../../assets/Armor/DustinEPlaceHolder.jpg'), clickable: true },
  'Justin Platt': { image: require('../../assets/Armor/JustinPlaceHolder2.jpg'), clickable: true },
  'Zack Dustin': { image: require('../../assets/Armor/ZackPlaceHolder2_cleanup.jpg'), clickable: true },
  'Josh Clark': { image: require('../../assets/Armor/JoshClarkPlaceHolder.jpg'), clickable: true },
  'Miles Robinson': { image: require('../../assets/Armor/MilesRobPlaceHolder.jpg'), clickable: true },
  'Lizzy': { image: require('../../assets/Armor/LizzyPlaceHolder.jpg'), clickable: true },
  'Sam': { image: require('../../assets/Armor/SamMalPlaceHolder.jpg'), clickable: true },
  'Spencer': { image: require('../../assets/Armor/SpencerHenPlaceHolder.jpg'), clickable: true },
  'Sanford Duncan': { image: require('../../assets/Armor/SanfordPlaceHolder.jpg'), clickable: true },
  'Magic Matt': { image: require('../../assets/Armor/MagicMattPlaceHolder.jpg'), clickable: true },
  // 'John': { image: require('../../assets/Armor/JohnPlaceHolder.jpg'), clickable: true },  
  // 'Emery': { image: require('../../assets/Armor/EmeryPlaceHolder.jpg'), clickable: true },
  // 'Mason': { image: require('../../assets/Armor/MasonPlaceHolder.jpg'), clickable: true },
  // 'Xavier': { image: require('../../assets/Armor/XavierPlaceHolder.jpg'), clickable: true },
  // 'Josh Davis': { image: require('../../assets/Armor/JoshDPlaceHolder.jpg'), clickable: true },
  
  
  'Will Knight': { image: require('../../assets/Armor/WillKPlaceHolder.jpg'), clickable: true },
  'Paxton': { image: require('../../assets/Armor/PaxtonPlaceHolder.jpg'), clickable: true },
  'Spencer Hill': { image: require('../../assets/Armor/SpencerHillPlaceHolder.jpg'), clickable: true },
  'Cassidy Cline': { image: require('../../assets/Armor/CassidyPlaceHolder.jpg'), clickable: true },
  // 'Adam Leger': { image: require('../../assets/Armor/AdamPlaceHolder.jpg'), clickable: true },
  // 'Sam Phillips': { image: require('../../assets/Armor/SamPhillipsPlaceHolder.jpg'), clickable: true },
  // 'Hayden Perks': { image: require('../../assets/Armor/HaydenPlaceHolder.jpg'), clickable: true },
  // 'Cienna': { image: require('../../assets/Armor/CiennaPlaceHolder.jpg'), clickable: true },
  // 'Clayton': { image: require('../../assets/Armor/ClaytonPlaceHolder.jpg'), clickable: true },
  // 'Bridget': { image: require('../../assets/Armor/BridgetPlaceHolder.jpg'), clickable: true },
  // 'Ryan': { image: require('../../assets/Armor/RyanPlaceHolder.jpg'), clickable: true },
  // 'Carson': { image: require('../../assets/Armor/CarsonPlaceHolder.jpg'), clickable: true },
  // 'Sydney': { image: require('../../assets/Armor/SydneyPlaceHolder.jpg'), clickable: true },
  // 'Natalia': { image: require('../../assets/Armor/NataliaPlaceHolder.jpg'), clickable: true }, 
  
  
  'Josh Noble': { image: require('../../assets/Armor/JoshNoblePlaceHolder.jpg'), clickable: true },
  // 'Matt Lihpia': { image: require('../../assets/Armor/MattLihPlaceHolder.jpg'), clickable: true },
  // 'Jose Rodriguez': { image: require('../../assets/Armor/JoseRodPlaceHolder.jpg'), clickable: true },
  // 'Jose Chavez': { image: require('../../assets/Armor/JoseChaPlaceHolder.jpg'), clickable: true },
  // 'Tayton Baker': { image: require('../../assets/Armor/TaytonPlaceHolder.jpg'), clickable: true },
  // 'Michael': { image: require('../../assets/Armor/MichaelPlaceHolder.jpg'), clickable: true },
  // 'Thomas': { image: require('../../assets/Armor/ThomasPlaceHolder.jpg'), clickable: true },
  // 'Nate Greene': { image: require('../../assets/Armor/NateGreePlaceHolder.jpg'), clickable: true },
  // 'Ivan Aparicio': { image: require('../../assets/Armor/IvanPlaceHolder.jpg'), clickable: true },
  'Abby': { image: require('../../assets/Armor/AbbyGhostPlaceHolder.jpg'), clickable: true },
  'Veronica Teaford': { image: require('../../assets/Armor/VeronicaPlaceHolder.jpg'), clickable: true },
  'Erica Teaford': { image: require('../../assets/Armor/EricaPlaceHolder.jpg'), clickable: true },


  'Sheryl': { image: require('../../assets/Armor/ShePlaceHolder.jpg'), clickable: true },
  'Krystel': { image: require('../../assets/Armor/KrystelPlaceHolder.jpg'), clickable: true },
  'Deb': { image: require('../../assets/Armor/DebPlaceHolder.jpg'), clickable: true },
  'Emma BYU': { image: require('../../assets/Armor/EmmaBYUPlaceHolder.jpg'), clickable: true },
  'Jessica BYU': { image: require('../../assets/Armor/JessicaBYUPlaceHolder.jpg'), clickable: true },
  'Victoria': { image: require('../../assets/Armor/VictoriaPlaceHolder.jpg'), clickable: true },
  };
  
  export default legionImages;
  