import { Command } from "cliffy/command";
import { createBlock, lazuli } from "lazuli";
import { promptIdentifier } from "../../utils/promptIdentifier.ts";

export const block = new Command()
  .name("block")
  .description("Creates a new block")
  .arguments("[identifier:string] [dir:string]")
  .action(async (_, identifier, dir) => {
    if (!identifier) {
      const prompt = await promptIdentifier();
      identifier = prompt.identifier;
      dir = prompt.dir;
    }

    const block = createBlock({
      dir,
      identifier,
      behavior: (data) => data,
      resource: (data) => data,
    });
    await lazuli([block]);
  });
