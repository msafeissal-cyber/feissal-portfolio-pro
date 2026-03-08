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

async function loadLeague(leagueCode, leagueName){

const container = document.getElementById("leagueTables");

try{

const response = await fetch(`https://api.football-data.org/v4/competitions/${leagueCode}/standings`,{

headers:{
'X-Auth-Token':'your_real_key_here' 
}

});

const data = await response.json();

const standings = data.standings[0].table.slice(0,10);

let tableHTML = `
<div class="table-card">

<h3>${leagueName}</h3>

<table>

<tr>
<th>#</th>
<th>Team</th>
<th>P</th>
<th>Pts</th>
</tr>
`;

standings.forEach(team=>{

tableHTML += `

<tr>

<td>${team.position}</td>

<td>
<img src="${team.team.crest}" width="20">
${team.team.name}
</td>

<td>${team.playedGames}</td>

<td>${team.points}</td>

</tr>

`;

});

tableHTML += "</table></div>";

container.innerHTML += tableHTML;

}

catch(error){

console.log("Error loading league", error);

}

} 

loadMatches();
async function loadLeagueTables(){
const container = document.getElementById("leagueTables");
container.innerHTML = "Loading league tables...";

try{
const response = await fetch("https://api.football-data.org/v4/competitions/PL/standings", {
  headers: { 'X-Auth-Token': '0d1a331f14d2429d8108cec9dcdfbb87' }
});
const data = await response.json();

container.innerHTML = "";

const standings = data.standings[0].table.slice(0, 10); // top 10 teams

let tableHTML = `
<div class="table-card">
<h3>Premier League</h3>
<table>
<tr>
<th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th>
</tr>
`;

standings.forEach(team=>{
tableHTML += `
<tr>
<td>${team.position}</td>
<td><img src="${team.team.crest}" style="width:20px;vertical-align:middle;margin-right:5px;">${team.team.name}</td>
<td>${team.playedGames}</td>
<td>${team.won}</td>
<td>${team.draw}</td>
<td>${team.lost}</td>
<td>${team.points}</td>
</tr>
`;
});

tableHTML += "</table></div>";

container.innerHTML = tableHTML;

}catch(error){
container.innerHTML = "<p>Could not load league tables (API key required)</p>";
console.error(error);
}
}

loadLeagueTables();
document.getElementById("leagueTables").innerHTML="";

loadLeague("PL","Premier League");

loadLeague("PD","La Liga");

loadLeague("SA","Serie A");

loadLeague("CL","Champions League");
