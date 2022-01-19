import { config } from "../src/vendure-config";

import { createConnection, Connection } from "typeorm";
import { Block } from "../src/NestPress/Block/entity";
import fs from "fs";

async function run() {
  const connection = await createConnection({
    ...config.dbConnectionOptions,
    entities: [Block]
  } as any);

  const blocksRepo = connection.getRepository<Block>(Block);

  const blocks = await blocksRepo.find({});

  const classNames: string[] = [];

  console.log(blocks.length);

  for (let i = 0; i < blocks.length; i++) {
    console.log(blocks[i].attrs);

    if (blocks[i].attrs && blocks[i].attrs.classes) {
        blocks[i].attrs.classes.split(' ').forEach((item: string) => {
            classNames.push(item);
            console.log('Add class name ' + item);
        });
    }
  }

  const uniqueClassNames = [...new Set(classNames)];;

  await fs.writeFileSync(
    "./tailwind.ts",
    uniqueClassNames
      .map((item) => {
        console.log('Generated comment for ' + item)
        return `// ${item}`;
      })
      .join("\n"),
    "utf-8"
  );

  console.log('Done');
}

console.log('Running...');
run();

