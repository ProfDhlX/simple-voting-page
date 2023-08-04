document.addEventListener('DOMContentLoaded', function() {
    const adminPassword = 'admin123'; 
    
    let candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    
    if (window.location.pathname.includes('admin.html')) {
        const adminLogin = document.getElementById('admin-login');
        const adminContent = document.getElementById('admin-content');
        const loginBtn = document.getElementById('login-btn');
        const candidateNameInput = document.getElementById('candidate-name');
        const registerBtn = document.getElementById('register-btn');
        const deleteOptionSelect = document.getElementById('delete-option');
        const deleteBtn = document.getElementById('delete-btn');
        const declareWinnerBtn = document.getElementById('declare-winner-btn');
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
        
       
        for (const candidate of candidates) {
            const option = document.createElement('option');
            option.value = candidate;
            option.textContent = candidate;
            optionSelect.appendChild(option);
        }
        
        voteBtn.addEventListener('click', function() {
            const selectedCandidate = optionSelect.value;
            if (selectedCandidate) {
                let votes = JSON.parse(localStorage.getItem('votes')) || {};
                votes[selectedCandidate] = (votes[selectedCandidate] || 0) + 1;
                localStorage.setItem('votes', JSON.stringify(votes));
                alert('Your vote has been recorded.');
            } else {
                alert('Please select a candidate before voting.');
            }
        });
    }
});
