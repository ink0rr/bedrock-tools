import { Input, prompt } from "cliffy/prompt";

interface PromptResult {
  identifier: string;
  dir?: string;
}

export async function promptIdentifier(): Promise<PromptResult> {
  return await prompt([
    {
      name: "identifier",
      message: "Identifier",
      type: Input,
      transform: (id) => id.trim(),
      validate(id) {
        return id.split(":").length === 2 ? true : "Invalid identifier";
      },
    },
    {
      name: "dir",
      message: "Directory (optional)",
      type: Input,
    },
  ]);
}
