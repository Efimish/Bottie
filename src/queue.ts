type Track = {
  title: string;
  url: string;
};

class Queue {
  items: Record<string, Track[]>;

  constructor() {
    this.items = {};
  }

  addItem(serverId: string, track: Track) {
    if (!this.items[serverId]) {
      this.items[serverId] = [];
    }
    this.items[serverId].push(track);
  }

  skipItem(serverId: string): Track | undefined {
    if (!this.items[serverId] || this.items[serverId].length === 0) {
      return undefined;
    }
    return this.items[serverId].shift();
  }

  getQueue(serverId: string): Track[] {
    return this.items[serverId] || [];
  }

  clearQueue(serverId: string) {
    delete this.items[serverId];
  }
}

export default new Queue();
