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
async function comparePlayers(){

const p1=document.getElementById("player1").value;
const p2=document.getElementById("player2").value;

const result=document.getElementById("comparisonResult");

result.innerHTML="Loading...";

try{

const r1=await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${p1}`);
const d1=await r1.json();

const r2=await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${p2}`);
const d2=await r2.json();

const player1=d1.player[0];
const player2=d2.player[0];

result.innerHTML=`

<div class="compare-card">

<img src="${player1.strThumb}" width="100">

<h3>${player1.strPlayer}</h3>

<p>Team: ${player1.strTeam}</p>

<p>Position: ${player1.strPosition}</p>

<p>Nationality: ${player1.strNationality}</p>

</div>

<div class="compare-card">

<img src="${player2.strThumb}" width="100">

<h3>${player2.strPlayer}</h3>

<p>Team: ${player2.strTeam}</p>

<p>Position: ${player2.strPosition}</p>

<p>Nationality: ${player2.strNationality}</p>

</div>

`;

}

catch(error){

result.innerHTML="Players not found.";

}

           }
async function loadLiveScores(){

const container=document.getElementById("liveScores");

try{

const response=await fetch("https://www.scorebat.com/video-api/v3/");
const data=await response.json();

container.innerHTML="";

data.response.slice(0,6).forEach(match=>{

container.innerHTML+=`

<div class="score-card">

<h3>${match.title}</h3>

<p>${match.competition}</p>

<a href="${match.matchviewUrl}" target="_blank">Watch Highlight</a>

</div>

`;

});

}

catch(error){

container.innerHTML="Could not load matches";

}

}

loadLiveScores();
async function searchTeam(){

const team=document.getElementById("teamInput").value;

const result=document.getElementById("teamResult");

result.innerHTML="Loading...";

try{

const response=await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${team}`);

const data=await response.json();

const teamData=data.teams[0];

result.innerHTML=`

<div class="team-card">

<img src="${teamData.strTeamBadge}" width="120">

<h3>${teamData.strTeam}</h3>

<p><b>League:</b> ${teamData.strLeague}</p>

<p><b>Country:</b> ${teamData.strCountry}</p>

<p><b>Stadium:</b> ${teamData.strStadium}</p>

</div>

`;

}

catch(error){

result.innerHTML="Team not found.";

}

}
