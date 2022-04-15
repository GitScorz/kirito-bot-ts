import { Command, Args } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { BOT_INVISIBLE_RGB_COLOR, BOT_PREFIX } from "../../config/Config";
import { ErrorEmbed } from "../../utils/Utils";

export class EvalCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: "Evaluates arbitrary code.",
      preconditions: ["OwnerOnly"],
      fullCategory: ["owner"]
    })
  }

  public async messageRun(message: Message, args: Args) {
    const user = message.author;

    const code: string = await args.rest("string").catch(() => null);
    if (!code) {
      return ErrorEmbed(message.channel, user, "please provide code to evaluate.");
    }

    try {
      const output: string = eval(code);

      const embed = new MessageEmbed()
        .setAuthor({ name: "Evaluate" })
        .setColor(BOT_INVISIBLE_RGB_COLOR)
        .setDescription(`<:confirm:964494033177157652> Eval by **${user.username}**:` 
          + `\n\`\`\`js\n${output}\`\`\`` + "\n<:download:964493752997654568> Message sent:" 
          + `\n\`\`\`js\n${code}\`\`\``)
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    } catch (error) {
      const embed = new MessageEmbed()
        .setColor(BOT_INVISIBLE_RGB_COLOR)
        .setAuthor({ name: "Error" })
        .setDescription(`${error}`)
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });
    }
  }
}