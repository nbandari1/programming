/* ********* 

  songs.js

  The app's list of Songs.  Each song will be represented as an object, for example:

  { 
    id: "A1S1",
    artistId: "A1",
    title: "Burn",
    album: {name: "The Crow: Original Motion Picture Soundtrack", imageURL: "https://upload.wikimedia.org/wikipedia/en/7/72/The_Crow_soundtrack_album_cover.jpg"},
    year: "1994",
    duration: 398
  }
  songs:
  1.BFG Division: MG, 2.Rip & Tear: MG, 3.Bury The Light: CE, 4.Devil Trigger: CE,
  5.Wake Up Get Up Get Out There: SM, 6.Burn My Dread: SM, 8.Last Surprise: SM,15.I believe: SM 
  9.Rivers in The Desert: SM, 7.The Stains Of Time : JC, 10.Red Sun: JCM, 11.Rules of Nature: JCM, 
  12.It Has To Be This Way: JC, 13.The Only Thing I Know For Real: JC, 
  
  14.Deep Down: A, 16. Hadaka no Yuusha(Naked Hero): V, 17. Chainsaw Blood: V, 18.Falling Alone: A, 
  19.Stardust Crusaders: YK, 20.il vento d'oro: YK. 

 ********* */

window.songs = [
  /* TODO */
  //1
  {
    id: "A1S1",
    artistID: "A1",
    title: "BFG Division",
    album: {name:"DOOM Eternal Original Soundtrack", imageURL: "https://i1.sndcdn.com/artworks-KmfuQD9xRBA32fyy-5MMu0Q-t500x500.jpg"},
    year:"2020",
    duration: 826
  },
  //2
  {
    id: "A1S2",
    artistID: "A1",
    title: "Rip & Tear",
    album: {name:"DOOM Eternal Original Soundtrack", imageURL: "https://e.snmc.io/i/1200/s/944920377a46d00c647efa0c12c42798/7084979"},
    year:"2020",
    duration: 417
  },
  //3
  {
    id: "A2S1",
    artistID: "A2",
    title: "Bury The Light",
    album: {name:"Devil May Cry 5 Original Soundtrack", imageURL: "https://i1.sndcdn.com/artworks-6jzjhn9JjT1ZaaTL-1y34zg-t500x500.jpg"},
    year:"2019",
    duration: 942
  },
  //4
  {
    id: "A2S2",
    artistID: "A2",
    title: "Devil Trigger",
    album: {name:"Devil May Cry 5 Original Soundtrack", imageURL: "https://i.scdn.co/image/ab67616d0000b2738ff64fe4faca2b8f2c79a978"},
    year:"2019",
    duration: 645
  },
  //5
  {
    id: "A3S1",
    artistID: "A3",
    title: "Stains of Time",
    album: {name:"Metal Gear Rising: Revengeance Original Soundtrack", imageURL: "https://i.scdn.co/image/ab67616d0000b273e65ad5e9fc72cba8ddee14a5"},
    year:"2013",
    duration: 210
  },
  //6
  {
    id: "A3S2",
    artistID: "A3",
    title: "It Has Be This Way",
    album: {name:"Metal Gear Rising: Revengeance Original Soundtrack", imageURL: "https://i1.sndcdn.com/artworks-000094386711-grrh3m-t500x500.jpg"},
    year:"2013",
    duration: 502
  },
  //7
  {
    id: "A4S1",
    artistID: "A4",
    title: "Rules Of Nature",
    album: {name:"Metal Gear Rising: Revengeance Original Soundtrack", imageURL: "https://i1.sndcdn.com/artworks-000099808114-m8l7l5-t500x500.jpg"},
    year:"2013",
    duration: 425
  },
  //8
  {
    id: "A4S2",
    artistID: "A4",
    title: "Red Sun",
    album: {name:"Metal Gear Rising: Revengeance Original Soundtrack", imageURL: "https://i.scdn.co/image/ab67616d0000b273e65ad5e9fc72cba8ddee14a5"},
    year:"2013",
    duration: 356
  },
  //9
  {
    id: "A5S1",
    artistID: "A5",
    title: "Wake Up Get Up Get Out There",
    album: {name:"Persona 5 Original Soundtrack", imageURL: "https://images.genius.com/29fe123938b00fe1522ca7a8c04ff9b5.1000x1000x1.png"},
    year:"2017",
    duration: 439
  },
  //10
  {
    id: "A5S2",
    artistID: "A5",
    title: "Last Surprise",
    album: {name:"Persona 5 Original Soundtrack", imageURL: "https://i.scdn.co/image/ab67616d0000b273e6c2af96135cbba2d0d0dba4"},
    year:"2017",
    duration: 357
  },
  //11
  {
    id: "A5S3",
    artistID: "A5",
    title: "Rivers in the Desert",
    album: {name:"Persona 5 Original Soundtrack", imageURL: "https://i1.sndcdn.com/artworks-000478169649-i4tsi2-t500x500.jpg"},
    year:"2017",
    duration: 515
  },
  //12
  {
    id: "A5S4",
    artistID: "A5",
    title: "Burn My Dread",
    album: {name:"Persona 3 Original Soundtrack", imageURL: "https://i1.sndcdn.com/artworks-000138299327-pfq1qd-t500x500.jpg"},
    year:"2006",
    duration: 323
  },
  //13
  {
    id: "A6S1",
    artistID: "A6",
    title: "Deep Down",
    album: {name:"Aimer's Third Mini Album", imageURL: "https://i.scdn.co/image/ab67616d0000b273c6028f0b12c4f9567035af35"},
    year:"2022",
    duration: 356
  },
  //14
  {
    id: "A6S2",
    artistID: "A6",
    title: "Brave Shine",
    album: {name:"Aimer's Eigth Single", imageURL: "https://c-cl.cdn.smule.com/rs-s82/arr/97/e9/c0c7f142-eb03-443a-9cbe-b6fd83d2eb89_1024.jpg"},
    year:"2015",
    duration: 412
  },
  //15
  {
    id: "A7S1",
    artistID: "A7",
    title: "Chainsaw Blood",
    album: {name:"Single by Vaundy", imageURL: "https://cdn2.albumoftheyear.org/375x/album/558128-chainsaw-blood.jpg"},
    year:"2022",
    duration: 320
  },
  //16
  {
    id: "A7S2",
    artistID: "A7",
    title: "Hadaka No Yuusha",
    album: {name:"Single by Vaundy", imageURL: "https://m.media-amazon.com/images/I/41YiCNQVKUL._UXNaN_FMjpg_QL85_.jpg"},
    year:"2022",
    duration: 320
  },
  //17
  {
    id: "A8S1",
    artistID: "A8",
    title: "Stardust Crusaders",
    album: {name:"JOJO'S BIZARRE ADVENTURE -Stardust Crusaders O.S.T [Departure]", imageURL: "https://i.scdn.co/image/ab67616d0000b273c0df0130614b21cd9f39afc0"},
    year:"2014",
    duration: 507
  },
  //18
  {
    id: "A8S2",
    artistID: "A8",
    title: "il vento d’oro",
    album: {name:"JOJO'S BIZARRE ADVENTURE -Golden Wind O.S.T", imageURL: "https://i.scdn.co/image/ab67616d0000b273ee07b239264db04dcf5148cd"},
    year:"2018",
    duration: 527
  }
  //19
  // {
  //   id: "",
  //   artistID: "",
  //   title: "",
  //   album: {name:"", imageURL: ""},
  //   year: "",
  //   duration:
  // },
  // //20
  // {
  //   id: "",
  //   artistID: "",
  //   title: "",
  //   album: {name:"", imageURL: ""},
  //   year: "",
  //   duration:
  // }
];
