import { Command, Confirm, Input } from "cliffy";
import { crypto } from "crypto";
import { basename } from "path";
import { outputFile, writeJson } from "../utils/fs.ts";

export const init = new Command()
  .name("init")
  .description("Initializes a new project")
  .action(async () => {
    if ([...Deno.readDirSync(".")].filter((file) => !file.name.startsWith(".")).length) {
      console.error("The current directory is not empty");
      Deno.exit(1);
    }
    const BP = `./packs/BP`;
    const RP = `./packs/RP`;

    const name = await Input.prompt({
      message: "Project name",
      default: basename(Deno.cwd()),
    });

    const min_engine_version = await Input.prompt({
      message: "min_engine_version",
      default: "1.19.70",
      validate(version) {
        return (version.match(/^\d+.\d+.\d+$/) ? true : "Invalid version");
      },
    });

    const regolith = await Confirm.prompt({
      message: "Add regolith config?",
      default: true,
    });

    const bpHeader = crypto.randomUUID();
    const rpHeader = crypto.randomUUID();
    const bpManifest = createManifest(
      "data",
      [1, 0, 0],
      min_engine_version,
      bpHeader,
      rpHeader,
    );
    const rpManifest = createManifest(
      "resources",
      [1, 0, 0],
      min_engine_version,
      rpHeader,
      bpHeader,
    );

    await Promise.all([
      writeJson(`${BP}/manifest.json`, bpManifest),
      writeJson(`${RP}/manifest.json`, rpManifest),

      writeJson(`${BP}/texts/languages.json`, ["en_US"]),
      writeJson(`${RP}/texts/languages.json`, ["en_US"]),

      outputFile(`${BP}/texts/en_US.lang`, createLang("Behavior", name)),
      outputFile(`${RP}/texts/en_US.lang`, createLang("Resource", name)),
    ]);

    if (regolith) {
      writeJson("./config.json", {
        $schema: "https://raw.githubusercontent.com/Bedrock-OSS/regolith-schemas/main/config/v1.1.json",
        author: "Your Name",
        name,
        packs: {
          behaviorPack: `./packs/BP`,
          resourcePack: `./packs/RP`,
        },
        regolith: {
          dataPath: "./data",
          filterDefinitions: {},
          profiles: {
            default: {
              export: {
                readOnly: true,
                target: "development",
              },
              filters: [],
            },
            build: {
              export: {
                target: "local",
              },
              filters: [
                {
                  profile: "default",
                },
              ],
            },
          },
        },
      });
    }
  });

function createManifest(
  type: "data" | "resources",
  version: number[],
  min_engine_version: string,
  header: string,
  depsHeader: string,
) {
  return {
    format_version: 2,
    header: {
      name: "pack.name",
      description: "pack.description",
      uuid: header,
      version,
      min_engine_version: min_engine_version.split(".").map((v) => parseInt(v)),
    },
    modules: [
      {
        type,
        uuid: crypto.randomUUID(),
        version,
      },
    ],
    dependencies: [
      {
        uuid: depsHeader,
        version,
      },
    ],
  };
}

function createLang(type: "Behavior" | "Resource", name: string) {
  return [
    `pack.name=${name} ${type[0]}P`,
    `pack.description=${type} Pack for ${name}`,
  ].join("\n");
}
