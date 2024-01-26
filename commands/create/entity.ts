import { Command } from "cliffy/command";
import { createEntity, lazuli } from "lazuli";
import { promptIdentifier } from "../../utils/promptIdentifier.ts";

export const entity = new Command()
  .name("entity")
  .description("Creates a new entity")
  .arguments("[identifier:string] [dir:string]")
  .action(async (_, identifier, dir) => {
    if (!identifier) {
      const prompt = await promptIdentifier();
      identifier = prompt.identifier;
      dir = prompt.dir;
    }

    const entity = createEntity({
      dir,
      identifier,
      behavior: (data) => data,
      resource: (data) => data,
    });
    await lazuli([entity]);
  });
