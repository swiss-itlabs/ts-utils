# @itlabs/ts-import-move

If you have moved a class, function, component or whatever in your monorepo, from one library to another, it can be a lot of work to update all imports if you are using typescript paths aliases e.g.

```json
"paths": {
    "@itlabs/my-package": ["packages/my-package/src/index.ts"],
    "@itlabs/my-new-package": ["packages/my-new-package/src/index.ts"]
}
```

If you are using relative paths for the imports, tools like visual studio code would ask you to perform these import updates for you.

If the former is the case, you just found the tool that would helps you :)

## CLI

*An CLI is coming soon.*

## Library

Just install those two packages `npm i -D @itlabs/ts-import-move ts-morph`. And copy and adapt this snippet somewhere to your tooling scripts.

```ts
import { Project } from 'ts-morph';
import { tsImportMove } from '@itlabs/ts-import-move';

async function move(): Promise<void> {
  const project = new Project({ tsConfigFilePath: 'path/to/tsconfig.json' });

  tsImportMove(project, {
    imports: ['ObjectToMove'],
    sourcePackage: '@itlabs/my-package',
    targetPackage: '@itlabs/my-new-package',
  });

  await project.save();
}
```

Check the [ts-morph docs](https://ts-morph.com/setup/) for further information how to load your typescript project.