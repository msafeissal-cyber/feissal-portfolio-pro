const playerInput = document.getElementById("playerInput");
const searchBtn = document.getElementById("searchBtn");
const playerCard = document.getElementById("playerCard");
const loading = document.getElementById("loading");

searchBtn.addEventListener("click", searchPlayer);
playerInput.addEventListener("keypress", e => { if(e.key==="Enter") searchPlayer(); });

async function quickSearch(playerName){
    playerInput.value = playerName;
    await searchPlayer();
}

async function searchPlayer(){
    const name = playerInput.value.trim();
    if(!name) return;

    playerCard.innerHTML="";
    loading.classList.remove("hidden");

    try{
        const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${name}`);
        const data = await res.json();
        loading.classList.add("hidden");

        if(!data.player) { playerCard.innerHTML="Player not found."; return; }

        const p = data.player[0];
        playerCard.innerHTML = `
        <div class="player-card">
            <img src="${p.strThumb}" alt="${p.strPlayer}">
            <h2>${p.strPlayer}</h2>
            <p>Team: ${p.strTeam}</p>
            <p>Position: ${p.strPosition}</p>
            <p>Nationality: ${p.strNationality}</p>
        </div>`;
    } catch(err){ console.error(err); loading.classList.add("hidden"); }
}

// Player comparison
async function comparePlayers(){
    const p1=document.getElementById("player1").value.trim();
    const p2=document.getElementById("player2").value.trim();
    if(!p1 || !p2) return alert("Enter both players");

    const result=document.getElementById("comparisonResult");
    result.innerHTML="Loading...";

    try{
        const r1 = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${p1}`);
        const d1 = await r1.json();
        const r2 = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${p2}`);
        const d2 = await r2.json();

        if(!d1.player || !d2.player) { result.innerHTML="Players not found."; return; }

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
        </div>`;
    } catch(err){ console.error(err); result.innerHTML="Error loading players"; }
}

// League tables
async function loadLeagueTables(){
    const container = document.getElementById("leagueTables");
    container.innerHTML="Loading league tables...";

    const leagues = [
        { code:"PL", name:"Premier League" },
        { code:"PD", name:"La Liga" },
        { code:"SA", name:"Serie A" },
        { code:"CL", name:"Champions League" }
    ];

    container.innerHTML="";

    for(const l of leagues){
        try{
            const res = await fetch(`https://api.football-data.org/v4/competitions/${l.code}/standings`, {
                headers:{ 'X-Auth-Token':'YOUR_API_KEY_HERE' } // <-- Paste your API key here
            });
            const data = await res.json();
            const standings = data.standings[0].table.slice(0,10);

            let html = `<div class="table-card"><h3>${l.name}</h3><table><tr>
            <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr>`;

            standings.forEach(t=>{
                html+=`<tr>
                <td>${t.position}</td>
                <td><img src="${t.team.crest}" style="width:20px;margin-right:5px;vertical-align:middle;">${t.team.name}</td>
                <td>${t.playedGames}</td><td>${t.won}</td><td>${t.draw}</td><td>${t.lost}</td><td>${t.points}</td>
                </tr>`;
            });

            html+="</table></div>";
            container.innerHTML += html;

        }catch(err){
            console.error(err);
            container.innerHTML += `<p>Could not load ${l.name}</p>`;
        }
    }
}

loadLeagueTables();

// Live Scores
async function loadLiveScores(){
    const container = document.getElementById("liveScores");
    container.innerHTML="Loading live scores...";
    try{
        const res = await fetch("https://www.scorebat.com/video-api/v3/");
        const data = await res.json();
        container.innerHTML="";
        data.response.slice(0,6).forEach(m=>{
            container.innerHTML+=`
            <div class="score-card">
                <h3>${m.title}</h3>
                <p>${m.competition}</p>
                <a href="${m.matchviewUrl}" target="_blank">Watch Highlight</a>
            </div>`;
        });
    } catch(err){ console.error(err); container.innerHTML="Could not load matches"; }
}
loadLiveScores();

// Team search
async function searchTeam(){
    const t=document.getElementById("teamInput").value.trim();
    const res = document.getElementById("teamResult");
    if(!t) return;
    res.innerHTML="Loading...";
    try{
        const r = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${t}`);
        const d = await r.json();
        const team=d.teams[0];
        res.innerHTML=`
        <div class="team-card">
            <img src="${team.strTeamBadge}" width="120">
            <h3>${team.strTeam}</h3>
            <p><b>League:</b> ${team.strLeague}</p>
            <p><b>Country:</b> ${team.strCountry}</p>
            <p><b>Stadium:</b> ${team.strStadium}</p>
        </div>`;
    } catch(err){ console.error(err); res.innerHTML="Team not found"; }
}
