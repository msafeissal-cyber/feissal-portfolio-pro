const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("playerInput");
const playerCard = document.getElementById("playerCard");

searchBtn.addEventListener("click", searchPlayer);

async function searchPlayer(){

const name = input.value.trim();

if(name === ""){
playerCard.innerHTML = "<p>Please enter a player name</p>";
return;
}

playerCard.innerHTML = "<p>Loading...</p>";

try{

const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${name}`);
const data = await response.json();

if(!data.player){
playerCard.innerHTML = "<p>Player not found</p>";
return;
}

const player = data.player[0];

playerCard.innerHTML = `
<div class="player-card">
<img src="${player.strThumb}" alt="">
<h2>${player.strPlayer}</h2>
<p><b>Team:</b> ${player.strTeam}</p>
<p><b>Position:</b> ${player.strPosition}</p>
<p><b>Nationality:</b> ${player.strNationality}</p>
<p><b>Sport:</b> ${player.strSport}</p>
</div>
`;

}

catch(error){

playerCard.innerHTML = "<p>Error loading data</p>";

}

}
