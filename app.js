/* ********* 

  BTI225 – Assignment 05

  I declare that this assignment is my own work in accordance with
  Seneca Academic Policy. No part of this assignment has been
  copied manually or electronically from any other source
  (including web sites) or distributed to other students.

  Please update the following with your information:

  Name:       Nishnath Bandari
  Student ID: 105202220
  Date:       2023-07-29

  URL of my website: https://myfavmusic-fyd0lcn2q-nbandari1.vercel.app/
 
********* */


// All of our data is available on the global `window` object.
// Create local variables to work with it in this file.
const { artists, songs } = window;

// For debugging, display all of our data in the console. You can remove this later.
console.log({ artists, songs }, "App Data");

function buildMenu() {
  let menu = document.getElementById("menu");
  menu.innerHTML = "";
  for (let i = 0; i < artists.length; i++) {
    menu.innerHTML += `<span onclick='showSelectedArtist("${artists[i].id}")'>
    ${artists[i].name}</span>&nbsp;`;
  }
}
function showSelectedArtist(artistID) {
  console.log("TODO: Show Artist with ID: " + artistID);

  let selectedArtistContainer = document.getElementById("selected-artist");

  let selectedArtist = artists.find((artist) => artist.id == artistID);

  selectedArtistContainer.innerHTML = `<span>${selectedArtist.name}</span>`;

  showArtistLinks(selectedArtist.links);
  showCardsByArtist(artistID);
}

function showArtistLinks(links) {
  let selectedArtistContainer = document.getElementById("selected-artist");
  let linksHTML = links.map(
    (link) => `<a href="${link.url}" target="_blank">${link.name}</a>`
  );
  selectedArtistContainer.innerHTML += linksHTML.join(", ");
}

async function showCardsByArtist(artistId) {
  let artistsSongs = songs.filter((song) => song.artistID === artistId);
  let cardContainer = document.getElementById("card-container");

  cardContainer.innerHTML = ""; // clear out the card container

  for (let i = 0; i < artistsSongs.length; i++) {
    let { title, year, duration, album } = artistsSongs[i];
    let formattedDuration = formatDuration(duration);
  
    let quote = await fetchRandomQuote();
    cardContainer.innerHTML += `
      <div class="card" onclick='showSongForm("${artistsSongs[i].id}")'>
        <img src="${album.imageURL}" alt="${title} Artwork" class="album-image">
        <div class="card-details">
          <p>${title}</p>
          <p>Year: ${year}</p>
          <p>Duration: ${formattedDuration}</p>
          <p>Album: ${album.name}</p>
          <p>Quote: ${quote}</p>
        </div>
      </div>
    `;
  }
}

async function fetchRandomQuote() {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    const data = await response.json();

    if (Array.isArray(data)) {
      return data[0];
    } else if ("quote" in data) {
      return data.quote;
    } else {
      return "No quote available";
    }
  } catch (error) {
    console.error("Error fetching random quote:", error);
    return "No quote available"; 
  }
}


function formatDuration(duration) {
  let minutes = Math.floor(duration / 60);
  let seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

document.addEventListener("DOMContentLoaded", function () {
  buildMenu();
  showSelectedArtist(artists[0].id);
});

function showSongForm(songId) {
  let form = document.getElementById("songForm");
  let song = songs.find((song) => song.id === songId);
  document.getElementById("songId").value = song.id;
  document.getElementById("artistId").value = song.artistID;
  document.getElementById("title").value = song.title;
  document.getElementById("year").value = song.year;
  document.getElementById("duration").value = song.duration;

  songForm.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", function () {

  let songForm = document.getElementById("songForm");
  songForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let songId = document.getElementById("songId").value;
    let artistId = document.getElementById("artistId").value;
    let title = document.getElementById("title").value;
    let year = document.getElementById("year").value;
    let duration = document.getElementById("duration").value;

    let update = songs.find((song) => song.id === songId);
    update.title = title;
    update.year = year;
    update.duration = duration;

    showCardsByArtist(artistId);

    songForm.classList.add("hidden");
  });
});
