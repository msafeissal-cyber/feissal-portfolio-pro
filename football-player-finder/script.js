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
