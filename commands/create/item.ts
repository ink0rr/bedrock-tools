import { Command } from "cliffy/command";
import { createItem, lazuli } from "lazuli";
import { promptIdentifier } from "../../utils/promptIdentifier.ts";

export const item = new Command()
  .name("item")
  .description("Creates a new item")
  .arguments("[identifier:string] [dir:string]")
  .action(async (_, identifier, dir) => {
    if (!identifier) {
      const prompt = await promptIdentifier();
      identifier = prompt.identifier;
      dir = prompt.dir;
    }

    const item = createItem({
      dir,
      identifier,
      behavior: (data) => data,
      resource: (data) => data,
    });
    await lazuli([item]);
  });
