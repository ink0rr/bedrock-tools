import { Command } from "cliffy";
import { block } from "./block.ts";
import { entity } from "./entity.ts";
import { item } from "./item.ts";

export const create = new Command()
  .name("create")
  .arguments("<option:string>")
  .command("block", block)
  .command("entity", entity)
  .command("item", item);
