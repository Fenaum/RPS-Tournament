let testPlayers = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8']
let testBrackets: any = [];

function initializeBracket(...players: any) {
    // 
    if (players.length % 4 === 0) {
        for (let i = 0; i < players.length; i += 2) {
            let player1 = players[i]
            let player2 = players[i+1]
            console.log (player1, player2)
            testBrackets.push({player1: player1, player2: player2})
            console.log(testBrackets)
        }
    } else {
        console.log('Not enough players')
    }
}

initializeBracket(...testPlayers)