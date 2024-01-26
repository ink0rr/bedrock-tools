import { Command } from "cliffy/command";
import { Select } from "cliffy/prompt";
import { block } from "./block.ts";
import { entity } from "./entity.ts";
import { item } from "./item.ts";

const commands = {
  block,
  entity,
  item,
};

export const create = new Command()
  .name("create")
  .description("Create a new addon file")
  .action(async () => {
    const select = await Select.prompt({
      message: "What do you want to create?",
      options: Object.keys(commands),
    }) as keyof typeof commands;
    await commands[select].parse([]);
  });

for (const [name, command] of Object.entries(commands)) {
  create.command(name, command);
}
