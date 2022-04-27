import { Listener } from "@sapphire/framework";
import { Message } from "discord.js";
import Character from "../../schemas/Character";
import { add, remove, is } from "../../utils/Cooldown";
import { NeedExpFormula } from "../../utils/Utils";

export class MessageListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
    });  // Pass the options to the parent class.
  }

  public async run(message: Message): Promise<void> {
    const user = message.author;
    if (user.bot) return;
    
    const char: ICharacter = await Character.findOne({ userId: user.id });

    if (!is(user.id)) {
      if (!char) return;  // If the user doesn't have a character, don't do anything.

      add(user.id);
      const expToAdd = Math.floor(Math.random() * 15) + 10;
      this.addExp(user.id, expToAdd);
      setTimeout(() => {
        remove(user.id);
      }, 1000 * 60);  // Remove the user from the cooldown after 1 minute.
    }

    const exp = char.exp;
    const level = char.level;

    const need = NeedExpFormula(level+1);  // Get the amount of exp needed to level up.

    if (exp >= need) {  // If the user has enough exp to level up
      this.levelUp(user.id, need);
      message.channel.send(`${user.username} has leveled up to level \`${level+1}\`!`);
    }
  }  // The run method is called when the listener is executed.

  private async addExp(userId: string, expToAdd: number): Promise<void> {
    await Character.updateOne({ userId: userId }, { 
      $inc: { 
        exp: expToAdd 
      } 
    });
  }

  private async levelUp(userId: string, need: number): Promise<void> {
    await Character.updateOne({ userId: userId }, { 
      $inc: {
        level: 1,
        exp: -need
      },
    });
  }
}