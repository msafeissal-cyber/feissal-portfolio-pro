// PLAYER SEARCH
const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("playerInput");
const playerCard = document.getElementById("playerCard");
const loading = document.getElementById("loading");

searchBtn.addEventListener("click", searchPlayer);
input.addEventListener("keypress", e => { 
  if(e.key === "Enter") searchPlayer(); 
});

async function searchPlayer(){
  const playerName = input.value.trim();
  if(!playerName) return;

  loading.classList.remove("hidden");
  try{
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`);
    const data = await res.json();
    loading.classList.add("hidden");

    if(data.player){
      const p = data.player[0];
      playerCard.innerHTML = `
        <div class="player-card">
          <img src="${p.strThumb || 'https://via.placeholder.com/120'}">
          <h2>${p.strPlayer}</h2>
          <p>Team: ${p.strTeam || "Unknown"}</p>
          <p>Position: ${p.strPosition || "Unknown"}</p>
          <p>Nationality: ${p.strNationality || "Unknown"}</p>
        </div>`;
    }else{
      playerCard.innerHTML = "<p>Player not found.</p>";
    }
  }catch(err){
    loading.classList.add("hidden");
    playerCard.innerHTML = "<p>Error loading player.</p>";
    console.error(err);
  }
}

function quickSearch(name){
  input.value = name;
  searchPlayer();
}

// LIVE SCORES
async function loadLiveScores(){
  const container = document.getElementById("liveScores");
  container.innerHTML = "Loading live matches...";
  try{
    const res = await fetch("https://www.scorebat.com/video-api/v3/");
    const data = await res.json();
    container.innerHTML = "";
    data.response.slice(0,6).forEach(match => {
      container.innerHTML += `
        <div class="score-card">
          <h3>${match.title}</h3>
          <p>${match.competition}</p>
          <a href="${match.matchviewUrl}" target="_blank">Watch Highlight</a>
        </div>`;
    });
  }catch(err){
    container.innerHTML = "Could not load matches.";
    console.error(err);
  }
}
loadLiveScores();

// LEAGUE TABLES
async function loadLeagueTables(){
  const container = document.getElementById("leagueTables");
  container.innerHTML = "Loading league tables...";
  try{
    const res = await fetch("https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4328&s=2023-2024");
    const data = await res.json();
    container.innerHTML = "";

    let tableHTML = `<div class="table-card"><h3>Premier League</h3>
      <table>
        <tr>
          <th>#</th>
          <th>Team</th>
          <th>P</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th>Pts</th>
        </tr>`;

    data.table.slice(0,10).forEach(team=>{
      tableHTML += `
        <tr>
          <td>${team.intRank}</td>
          <td><img src="${team.strTeamBadge}" width="20"> ${team.strTeam}</td>
          <td>${team.intPlayed}</td>
          <td>${team.intWin}</td>
          <td>${team.intDraw}</td>
          <td>${team.intLoss}</td>
          <td>${team.intPoints}</td>
        </tr>`;
    });

    tableHTML += "</table></div>";
    container.innerHTML = tableHTML;

  }catch(err){
    container.innerHTML = "Could not load league tables.";
    console.error(err);
  }
}
loadLeagueTables();

// TEAM SEARCH
async function searchTeam(){
  const team = document.getElementById("teamInput").value.trim();
  const result = document.getElementById("teamResult");
  if(!team) return;

  result.innerHTML = "Loading...";
  try{
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${team}`);
    const data = await res.json();
    if(data.teams){
      const t = data.teams[0];
      result.innerHTML = `
        <div class="team-card">
          <img src="${t.strTeamBadge}" width="120">
          <h3>${t.strTeam}</h3>
          <p><b>League:</b> ${t.strLeague}</p>
          <p><b>Country:</b> ${t.strCountry}</p>
          <p><b>Stadium:</b> ${t.strStadium}</p>
        </div>`;
    }else{
      result.innerHTML = "Team not found.";
    }
  }catch(err){
    result.innerHTML = "Team not found.";
    console.error(err);
  }
}

// MATCH TRACKER
async function loadMatchTracker(){
  const container = document.getElementById("matchTracker");
  container.innerHTML = "Loading matches...";
  try{
    const res = await fetch("https://www.scorebat.com/video-api/v3/");
    const data = await res.json();
    container.innerHTML = "";
    data.response.slice(0,8).forEach(match=>{
      container.innerHTML += `
        <div class="match-card">
          <h3>${match.title}</h3>
          <p>${match.competition}</p>
          <p>${match.date}</p>
          <a href="${match.matchviewUrl}" target="_blank">
            <button>Watch Highlight</button>
          </a>
        </div>`;
    });
  }catch(err){
    container.innerHTML = "Could not load matches.";
    console.error(err);
  }
}
loadMatchTracker();
// Dynamic League Table
let dynamicTeams = {};

function updateMatch(team1, team2, goals1, goals2){
  // Initialize teams if they don't exist
  if(!dynamicTeams[team1]) dynamicTeams[team1] = {played:0, won:0, drawn:0, lost:0, goals_for:0, goals_against:0, points:0};
  if(!dynamicTeams[team2]) dynamicTeams[team2] = {played:0, won:0, drawn:0, lost:0, goals_for:0, goals_against:0, points:0};

  // Update stats
  dynamicTeams[team1].played++;
  dynamicTeams[team2].played++;

  dynamicTeams[team1].goals_for += goals1;
  dynamicTeams[team1].goals_against += goals2;
  dynamicTeams[team2].goals_for += goals2;
  dynamicTeams[team2].goals_against += goals1;

  if(goals1 > goals2){
    dynamicTeams[team1].won++;
    dynamicTeams[team1].points += 3;
    dynamicTeams[team2].lost++;
  } else if(goals2 > goals1){
    dynamicTeams[team2].won++;
    dynamicTeams[team2].points += 3;
    dynamicTeams[team1].lost++;
  } else {
    dynamicTeams[team1].drawn++;
    dynamicTeams[team2].drawn++;
    dynamicTeams[team1].points++;
    dynamicTeams[team2].points++;
  }
}

function displayDynamicLeague(){
  const container = document.getElementById("dynamicLeagueTable");
  container.innerHTML = "";

  const sortedTeams = Object.entries(dynamicTeams).sort((a,b)=>{
    let diff = b[1].points - a[1].points;
    if(diff === 0){
      diff = (b[1].goals_for - b[1].goals_against) - (a[1].goals_for - a[1].goals_against);
    }
    return diff;
  });

  let tableHTML = `<table>
    <tr>
      <th>Team</th>
      <th>P</th>
      <th>W</th>
      <th>D</th>
      <th>L</th>
      <th>GF</th>
      <th>GA</th>
      <th>Pts</th>
    </tr>`;

  sortedTeams.forEach(([team, stats])=>{
    tableHTML += `<tr>
      <td>${team}</td>
      <td>${stats.played}</td>
      <td>${stats.won}</td>
      <td>${stats.drawn}</td>
      <td>${stats.lost}</td>
      <td>${stats.goals_for}</td>
      <td>${stats.goals_against}</td>
      <td>${stats.points}</td>
    </tr>`;
  });

  tableHTML += `</table>`;
  container.innerHTML = tableHTML;
}

// Handle form submission
document.getElementById("matchForm").addEventListener("submit", e=>{
  e.preventDefault();
  const team1 = document.getElementById("team1").value.trim();
  const team2 = document.getElementById("team2").value.trim();
  const goals1 = parseInt(document.getElementById("goals1").value);
  const goals2 = parseInt(document.getElementById("goals2").value);

  if(team1 && team2 && !isNaN(goals1) && !isNaN(goals2)){
    updateMatch(team1, team2, goals1, goals2);
    displayDynamicLeague();
    e.target.reset();
  }
});
