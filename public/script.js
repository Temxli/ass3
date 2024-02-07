async function fetchRecentMatches() {
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: {
            league: '39', // Premier League ID
            last: '10' // Number of matches
        },
        headers: {
            'X-RapidAPI-Key': 'b9f5e56577msh741fd069f34a2ffp1ca5efjsn0ec3bf1ad2dc',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const recentMatches = response.data.response.slice(0, 10); // Get the first 10 matches
        const recentMatchesContainer = document.getElementById('recentMatches');
        recentMatches.forEach(match => {
            const matchItem = document.createElement('div');
            matchItem.classList.add('match-item');

            const teamContainer = document.createElement('div');
            teamContainer.classList.add('team-container');

            const teamLeft = document.createElement('div');
            teamLeft.classList.add('team-left');

            const homeLogo = document.createElement('img');
            homeLogo.classList.add('team-logo');
            homeLogo.src = match.teams.home.logo;

            const homeTeam = document.createElement('span');
            homeTeam.classList.add('team-name');
            homeTeam.textContent = match.teams.home.name;

            teamLeft.appendChild(homeLogo);
            teamLeft.appendChild(homeTeam);

            const divider = document.createElement('div');
            divider.classList.add('divider');

            const teamRight = document.createElement('div');
            teamRight.classList.add('team-right');

            const awayLogo = document.createElement('img');
            awayLogo.classList.add('team-logo');
            awayLogo.src = match.teams.away.logo;

            const awayTeam = document.createElement('span');
            awayTeam.classList.add('team-name');
            awayTeam.textContent = match.teams.away.name;

            teamRight.appendChild(awayTeam);
            teamRight.appendChild(awayLogo);

            const teamScore = document.createElement('div');
            teamScore.classList.add('team-score');
            const score = document.createElement('span');
            score.classList.add('score');
            score.textContent = `${match.goals.home} - ${match.goals.away}`;
            teamScore.appendChild(score);

            teamContainer.appendChild(teamLeft);
            teamContainer.appendChild(divider);
            teamContainer.appendChild(teamRight);

            matchItem.appendChild(teamContainer);
            matchItem.appendChild(teamScore);

            recentMatchesContainer.appendChild(matchItem);
        });
    } catch (error) {
        console.error(error);
    }
}

fetchRecentMatches();
