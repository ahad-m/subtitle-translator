export class SubtitleRenderer {
  private container: HTMLDivElement;
  private textNode: HTMLDivElement;

  private rawBuffer: string;
  private history: string[];
  private autoFollow: boolean;

  constructor() {
    this.container = document.createElement("div");
    this.container.id = "subtitle-translator-overlay";

    this.textNode = document.createElement("div");
    this.textNode.id = "subtitle-translator-text";

    this.rawBuffer = "";
    this.history = [];
    this.autoFollow = true;

    this.container.appendChild(this.textNode);
    document.documentElement.appendChild(this.container);

    this.textNode.addEventListener("scroll", () => {
      const distanceFromBottom =
        this.textNode.scrollHeight - this.textNode.scrollTop - this.textNode.clientHeight;

      this.autoFollow = distanceFromBottom < 20;
    });
  }

  append(delta: string) {
    this.rawBuffer += delta;
    this.rawBuffer = this.normalize(this.rawBuffer);

    const parts = this.splitCompleted(this.rawBuffer);

    if (parts.length > 1) {
      const completed = parts.slice(0, -1);
      const tail = parts[parts.length - 1];

      for (const part of completed) {
        const line = part.trim();
        if (line) {
          this.history.push(line);
        }
      }

      this.rawBuffer = tail.trim();
    }

    this.render();
  }

  clear() {
    this.rawBuffer = "";
    this.history = [];
    this.textNode.textContent = "";
    this.textNode.scrollTop = 0;
    this.autoFollow = true;
  }

  private normalize(text: string) {
    return text
      .replace(/\s+/g, " ")
      .replace(/\s+([،.؟!])/g, "$1")
      .replace(/([،.؟!])([^\s])/g, "$1 $2")
      .trim();
  }

  private splitCompleted(text: string) {
    return text
      .split(/(?<=[.؟!])/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  private render() {
    const output = [...this.history];

    if (this.rawBuffer) {
      output.push(this.rawBuffer);
    }

    this.textNode.textContent = output.join("\n");

    if (this.autoFollow) {
      requestAnimationFrame(() => {
        this.textNode.scrollTop = this.textNode.scrollHeight;
      });
    }
  }
}
