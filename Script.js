document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const logOutput = document.getElementById('logOutput');
    
    let isRunning = false;
    let activeBots = 0;
    
    function log(message) {
        const timestamp = new Date().toLocaleTimeString();
        logOutput.innerHTML += `[${timestamp}] ${message}\n`;
        logOutput.scrollTop = logOutput.scrollHeight;
    }
    
    async function joinKahoot(pin, name) {
        try {
            // Step 1: Get game info
            const gameInfo = await fetch(`https://kahoot.it/reserve/session/${pin}`)
                .then(res => res.json());
            
            if (!gameInfo) {
                log(`${name}: Failed to get game info`);
                return;
            }
            
            // Step 2: Join the game
            const joinResponse = await fetch(`https://kahoot.it/reserve/session/${pin}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gameMode: "classic",
                    name: name,
                    teamMembers: []
                })
            });
            
            if (!joinResponse.ok) {
                log(`${name}: Failed to join game`);
                return;
            }
            
            const joinData = await joinResponse.json();
            log(`${name}: Successfully joined game`);
            
            // Step 3: Simulate WebSocket connection
            // Note: Actual WebSocket implementation would require more complex handling
            // This is just a simulation for demonstration purposes
            
            // Simulate answering questions
            const questionCount = Math.floor(Math.random() * 5) + 3;
            for (let i = 1; i <= questionCount; i++) {
                if (!isRunning) break;
                
                await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000));
                const answer = Math.floor(Math.random() * 4);
                log(`${name}: Answered question ${i} with choice ${answer}`);
            }
            
        } catch (error) {
            log(`${name}: Error - ${error.message}`);
        } finally {
            activeBots--;
            if (activeBots === 0) {
                stopBtn.disabled = true;
                startBtn.disabled = false;
            }
        }
    }
    
    startBtn.addEventListener('click', function() {
        const pin = document.getElementById('gamePin').value.trim();
        const botCount = parseInt(document.getElementById('botCount').value);
        const botPrefix = document.getElementById('botPrefix').value.trim();
        const delay = parseInt(document.getElementById('delay').value);
        
        if (!pin || isNaN(botCount) {
            alert('Please enter valid values');
            return;
        }
        
        isRunning = true;
        activeBots = botCount;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        logOutput.innerHTML = '';
        log(`Starting ${botCount} bots...`);
        
        for (let i = 1; i <= botCount; i++) {
            setTimeout(() => {
                if (isRunning) {
                    joinKahoot(pin, `${botPrefix}${i}`);
                }
            }, i * delay);
        }
    });
    
    stopBtn.addEventListener('click', function() {
        isRunning = false;
        log('Stopping all bots...');
        stopBtn.disabled = true;
    });
});
