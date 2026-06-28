export class DeltaAggregator {
  private buffer = "";

  push(delta: string) {
    this.buffer += delta;
    return this.buffer;
  }

  flush() {
    const value = this.buffer;
    this.buffer = "";
    return value;
  }
}
