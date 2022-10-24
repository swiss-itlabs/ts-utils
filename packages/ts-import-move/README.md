# @itlabs/ts-import-move

It can be a lot of work to update all imports, if you moved a class, function, component or whatever from one library of your monorepo to another.
If you are using relative paths for the imports, tools like visual studio code would ask you to perform these import updates for you. But not if you are using typescript paths aliases in your monorepo e.g.

```json
"paths": {
    "@itlabs/my-package": ["packages/my-package/src/index.ts"],
    "@itlabs/my-new-package": ["packages/my-new-package/src/index.ts"]
}
```

In this case, you just found the tool that will helps you :)

## CLI

_A CLI is coming soon._

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
