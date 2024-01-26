import { Command } from "cliffy/command";
import { Image } from "imagescript";

export const merge = new Command()
  .name("merge")
  .description("Merges multiple images into one")
  .arguments("[inputDir:string] [outFile:string]")
  .action(async (_, inputDir = ".", outFile = "./output.png") => {
    const images = [];
    for await (const file of Deno.readDir(inputDir)) {
      if (file.isFile && file.name.endsWith(".png")) {
        const image = await Image.decode(await Deno.readFile(file.name));
        if (images[0] && (image.width !== images[0].width || image.height !== images[0].height)) {
          throw new Error("All images must be the same size");
        }
        images.push(image);
      }
    }
    const result = new Image(images[0].width, images[0].height * images.length);
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      result.composite(image, 0, i * image.height);
    }
    await Deno.writeFile(outFile, await result.encode());
  });
