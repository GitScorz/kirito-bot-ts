import { Listener } from "@sapphire/framework";
import { Client } from "discord.js";

export class ReadyListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: true
    });  // Once is true, the listener will be removed after the first execution.
  }

  public async run(client: Client): Promise<void> {
    const { tag, id } = client.user!;
    return this.container.logger.info(`Logged in as ${tag} (${id})`);
  }  // The run method is called when the listener is executed.
}