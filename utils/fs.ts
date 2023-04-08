import { dirname } from "path";

export async function outputFile(path: string, text: string) {
  try {
    await Deno.writeTextFile(path, text);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.mkdir(dirname(path), { recursive: true });
      await Deno.writeTextFile(path, text);
    } else {
      throw error;
    }
  }
}

export async function writeJson(path: string, data: unknown) {
  const text = JSON.stringify(data, null, 2) + "\n";
  await outputFile(path, text);
}
