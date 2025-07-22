import type { ClientEvents } from "discord.js";

interface EventOptions<T extends keyof ClientEvents = keyof ClientEvents> {
  name: T;
  execute(...args: ClientEvents[T]): Promise<void>;
  once?: boolean;
}

export class Event<T extends keyof ClientEvents = keyof ClientEvents> {
  readonly name: T;
  readonly execute: (...args: ClientEvents[T]) => Promise<void>;
  readonly once: boolean;

  constructor({ name, execute, once }: EventOptions<T>) {
    this.name = name;
    this.execute = execute;
    this.once = once ?? false;
  }
}
