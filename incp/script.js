document.addEventListener('DOMContentLoaded', function() {
    const adminPassword = 'admin123'; 
    let candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    
   
    let voterIds = JSON.parse(localStorage.getItem('voterIds')) || [];
    if (voterIds.length === 0) {
        for (let i = 1; i <= 100; i++) {
            voterIds.push(`Voter${i}`);
        }
        localStorage.setItem('voterIds', JSON.stringify(voterIds));
    }
    
    if (window.location.pathname.includes('admin.html')) {
        const adminLogin = document.getElementById('admin-login');
        const adminContent = document.getElementById('admin-content');
        const loginBtn = document.getElementById('login-btn');
        const candidateNameInput = document.getElementById('candidate-name');
        const registerBtn = document.getElementById('register-btn');
        const deleteOptionSelect = document.getElementById('delete-option');
        const deleteBtn = document.getElementById('delete-btn');
        const declareWinnerBtn = document.getElementById('declare-winner-btn');
        const resetBtn = document.getElementById('reset-btn');
        const resultsDiv = document.getElementById('results');
        
        loginBtn.addEventListener('click', function() {
            const enteredPassword = document.getElementById('admin-password').value;
            if (enteredPassword === adminPassword) {
                adminLogin.style.display = 'none';
                adminContent.style.display = 'block';
                displayCandidates();
                displayResults();
            } else {
                alert('Invalid admin password.');
            }
        });
        
        registerBtn.addEventListener('click', function() {
            const candidateName = candidateNameInput.value.trim();
            if (candidateName !== '') {
                candidates.push(candidateName);
                localStorage.setItem('candidates', JSON.stringify(candidates));
                candidateNameInput.value = '';
                displayCandidates();
                displayResults();
            }
        });
        
        deleteBtn.addEventListener('click', function() {
            const selectedCandidate = deleteOptionSelect.value;
            if (selectedCandidate) {
                candidates = candidates.filter(candidate => candidate !== selectedCandidate);
                localStorage.setItem('candidates', JSON.stringify(candidates));
                displayCandidates();
                displayResults();
            }
        });
        
        declareWinnerBtn.addEventListener('click', function() {
            const winner = getWinner();
            if (winner) {
                alert(`The winner is: ${winner}`);
            } else {
                alert('No votes cast yet.');
            }
        });

        resetBtn.addEventListener('click', function() {
            localStorage.removeItem('votes');
            alert('Voting data has been reset.');
            displayResults();
        });
        
        function displayCandidates() {
            deleteOptionSelect.innerHTML = '';
            for (const candidate of candidates) {
                const option = document.createElement('option');
                option.value = candidate;
                option.textContent = candidate;
                deleteOptionSelect.appendChild(option);
            }
        }
        
        function displayResults() {
            const votes = JSON.parse(localStorage.getItem('votes')) || {};
            console.log(votes); 
            resultsDiv.innerHTML = '';
            for (const candidate of candidates) {
                const resultElement = document.createElement('p');
                const voteCount = votes[candidate] || 0;
                resultElement.textContent = `${candidate}: ${voteCount} votes`;
                resultsDiv.appendChild(resultElement);
            }
        }
        
        function getWinner() {
            const votes = JSON.parse(localStorage.getItem('votes')) || {};
            let maxVotes = 0;
            let winner = '';
            for (const candidate in votes) {
                if (votes[candidate] > maxVotes) {
                    maxVotes = votes[candidate];
                    winner = candidate;
                }
            }
            return winner;
        }
    }
    
    if (window.location.pathname.includes('voter.html')) {
        const votingForm = document.getElementById('voting-form');
        const voteBtn = document.getElementById('vote-btn');
        const optionSelect = document.getElementById('option');
        const voterIdInput = document.getElementById('voter-id');
        
        voterIdInput.value = '';
        
        for (const candidate of candidates) {
            const option = document.createElement('option');
            option.value = candidate;
            option.textContent = candidate;
            optionSelect.appendChild(option);
        }
        
        voteBtn.addEventListener('click', function() {
            const selectedCandidate = optionSelect.value;
            const voterId = voterIdInput.value.trim();
            if (selectedCandidate && voterId) {
                if (voterIds.includes(voterId)) {
                    let votes = JSON.parse(localStorage.getItem('votes')) || {};
                    if (!votes[voterId]) {
                        votes[voterId] = selectedCandidate;
                        localStorage.setItem('votes', JSON.stringify(votes));
                        alert('Your vote has been recorded.');
                        displayResults(); 
                    } else {
                        alert('You have already voted.');
                    }
                } else {
                    alert('Invalid voter ID.');
                }
            } else {
                alert('Please enter a valid voter ID and select a candidate before voting.');
            }
        });
    }
});
