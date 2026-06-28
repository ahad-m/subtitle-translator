export class SubtitleRenderer {
  private container: HTMLDivElement;
  private textNode: HTMLDivElement;

  constructor() {
    this.container = document.createElement("div");
    this.container.id = "subtitle-translator-overlay";

    this.textNode = document.createElement("div");
    this.textNode.id = "subtitle-translator-text";

    this.container.appendChild(this.textNode);
    document.documentElement.appendChild(this.container);
  }

  append(text: string) {
    this.textNode.textContent = (this.textNode.textContent ?? "") + text;
  }
}
