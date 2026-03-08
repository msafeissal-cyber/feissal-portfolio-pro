const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("playerInput");
const playerCard = document.getElementById("playerCard");
const loading = document.getElementById("loading");

searchBtn.addEventListener("click", searchPlayer);
input.addEventListener("keypress", e => { if(e.key==="Enter") searchPlayer(); });

async function searchPlayer(){
  const playerName = input.value;
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
          <img src="${p.strThumb}" width="120">
          <h2>${p.strPlayer}</h2>
          <p>Team: ${p.strTeam}</p>
          <p>Position: ${p.strPosition}</p>
          <p>Nationality: ${p.strNationality}</p>
        </div>
      `;
    } else {
      playerCard.innerHTML = "<p>Player not found.</p>";
    }
  }catch(err){
    loading.classList.add("hidden");
    playerCard.innerHTML = "<p>Error loading player.</p>";
    console.error(err);
  }
}

// Quick search for top players
function quickSearch(name){
  input.value = name;
  searchPlayer();
}

// League tables
async function loadLeagueTables(){
  const container = document.getElementById("leagueTables");
  container.innerHTML = "Loading league tables...";
  try{
    const leagues = [
      {code:"PL", name:"Premier League"},
      {code:"PD", name:"La Liga"},
      {code:"SA", name:"Serie A"},
      {code:"CL", name:"Champions League"}
    ];

    container.innerHTML = "";

    for(const l of leagues){
      const res = await fetch(`https://api.football-data.org/v4/competitions/${l.code}/standings`, {
        headers: {'X-Auth-Token'd1a331f14d2429d8108cec9dcdfbb87'}
      });
      const data = await res.json();
      const standings = data.standings[0].table.slice(0,10);

      let tableHTML = `<div class="table-card"><h3>${l.name}</h3><table><tr>
        <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr>`;

      standings.forEach(t=>{
        tableHTML += `<tr>
          <td>${t.position}</td>
          <td><img src="${t.team.crest}" style="width:20px;margin-right:5px;vertical-align:middle;">${t.team.name}</td>
          <td>${t.playedGames}</td>
          <td>${t.won}</td>
          <td>${t.draw}</td>
          <td>${t.lost}</td>
          <td>${t.points}</td>
        </tr>`;
      });

      tableHTML += "</table></div>";
      container.innerHTML += tableHTML;
    }
  }catch(err){
    container.innerHTML = "<p>Could not load league tables (API key required)</p>";
    console.error(err);
  }
}

loadLeagueTables();

// Player comparison
async function comparePlayers(){
  const p1 = document.getElementById("player1").value;
  const p2 = document.getElementById("player2").value;
  const result = document.getElementById("comparisonResult");
  result.innerHTML = "Loading...";
  try{
    const d1 = await (await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${p1}`)).json();
    const d2 = await (await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${p2}`)).json();
    const player1 = d1.player[0];
    const player2 = d2.player[0];

    result.innerHTML = `
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
  }catch(err){
    result.innerHTML = "Players not found.";
    console.error(err);
  }
}

// Live Scores
async function loadLiveScores(){
  const container = document.getElementById("liveScores");
  container.innerHTML = "Loading live matches...";
  try{
    const data = await (await fetch("https://www.scorebat.com/video-api/v3/")).json();
    container.innerHTML = "";
    data.response.slice(0,6).forEach(match=>{
      container.innerHTML += `
        <div class="score-card">
          <h3>${match.title}</h3>
          <p>${match.competition}</p>
          <a href="${match.matchviewUrl}" target="_blank">Watch Highlight</a>
        </div>
      `;
    });
  }catch(err){
    container.innerHTML = "Could not load matches.";
    console.error(err);
  }
}

loadLiveScores();

// Team Search
async function searchTeam(){
  const team = document.getElementById("teamInput").value;
  const result = document.getElementById("teamResult");
  result.innerHTML = "Loading...";
  try{
    const data = await (await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${team}`)).json();
    const t = data.teams[0];
    result.innerHTML = `
      <div class="team-card">
        <img src="${t.strTeamBadge}" width="120">
        <h3>${t.strTeam}</h3>
        <p><b>League:</b> ${t.strLeague}</p>
        <p><b>Country:</b> ${t.strCountry}</p>
        <p><b>Stadium:</b> ${t.strStadium}</p>
      </div>
    `;
  }catch(err){
    result.innerHTML = "Team not found.";
    console.error(err);
  }
}
