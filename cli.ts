import { Command } from "cliffy";
import { create } from "./commands/create/create.ts";
import { merge } from "./commands/merge.ts";

if (import.meta.main) {
  await new Command()
    .name("bedrock")
    .description("A CLI utils for Bedrock")
    .arguments("<command>")
    .command("create", create)
    .command("merge", merge)
    .parse(Deno.args);
}
