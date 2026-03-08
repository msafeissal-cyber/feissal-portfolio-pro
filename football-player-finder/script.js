const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("playerInput");
const playerCard = document.getElementById("playerCard");
const loading = document.getElementById("loading");

searchBtn.addEventListener("click", searchPlayer);

// search when pressing ENTER
input.addEventListener("keypress", function(e){
if(e.key === "Enter"){
searchPlayer();
}
});

async function searchPlayer(){

const name = input.value.trim();

if(name === ""){
playerCard.innerHTML = "<p>Please enter a player name</p>";
return;
}

loading.classList.remove("hidden");
playerCard.innerHTML="";

try{

const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${name}`);
const data = await response.json();

loading.classList.add("hidden");

if(!data.player){
playerCard.innerHTML="<p>Player not found</p>";
return;
}

const player=data.player[0];

playerCard.innerHTML=`
<div class="player-card">

<img src="${player.strThumb}" alt="">

<h2>${player.strPlayer}</h2>

<p><b>Team:</b> ${player.strTeam}</p>

<p><b>Position:</b> ${player.strPosition}</p>

<p><b>Nationality:</b> ${player.strNationality}</p>

<p>${player.strDescriptionEN ? player.strDescriptionEN.slice(0,120)+"..." : ""}</p>

</div>
`;

}

catch(error){

loading.classList.add("hidden");

playerCard.innerHTML="<p>Error loading data</p>";

}

} 
function quickSearch(name){

document.getElementById("playerInput").value=name;

searchPlayer();

}
async function loadMatches(){

const container=document.getElementById("matches");

try{

const response=await fetch("https://www.scorebat.com/video-api/v3/");
const data=await response.json();

container.innerHTML="";

data.response.slice(0,6).forEach(match=>{

container.innerHTML+=`

<div class="match-card">

<h3>${match.title}</h3>

<iframe src="${match.matchviewUrl}" allowfullscreen></iframe>

<p>${match.competition}</p>

</div>

`;

});

}

catch(error){

container.innerHTML="Could not load matches";

}

}

loadMatches();
