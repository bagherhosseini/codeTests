class Player {
  constructor({ x, y, score, id }) {
    this.x = x;
    this.y = y;
    this.score = score || 0;
    this.id = id;
  }

  movePlayer(dir, units) {
    switch(dir) {
      case 'up':
        this.y -= units;
        break;
      case 'down':
        this.y += units;
        break;
      case 'left':
        this.x -= units;
        break;
      case 'right':
        this.x += units;
        break;
    }
  }

  collision(item) {
    // Basic rectangle collision detection
    return this.x < item.x + 20 && // Assuming item width of 20
           this.x + 20 > item.x &&
           this.y < item.y + 20 &&
           this.y + 20 > item.y;
  }

  calculateRank(players) {
    const sortedPlayers = players.sort((a, b) => b.score - a.score);
    const rank = sortedPlayers.findIndex(player => player.id === this.id) + 1;
    return `Rank: ${rank}/${players.length}`;
  }
}

export default Player;
