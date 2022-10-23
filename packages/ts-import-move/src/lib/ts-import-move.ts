import { TsImportMoveArgs } from './models';
import { ImportDeclaration, ImportSpecifier, Project, SourceFile } from 'ts-morph';

/**
 * Moves an import of one import statement to another. See `TsImportMoveArgs`.
 * @param project The typescript project. Check https://ts-morph.com/setup/
 * @param args Instructions for the move.
 */
export function tsImportMove(project: Project, args: TsImportMoveArgs): void {
  project?.getSourceFiles().forEach((file) => {
    // get import declarations for the `sourcePackage`
    const sourceIds = getImportDeclarations(file, args.sourcePackage);
    const targetIds = getImportDeclarations(file, args.targetPackage);

    // move each of the `imports`
    args.imports.forEach((importedObjectName) => {
      const namedImport = getNamedImport(sourceIds, importedObjectName);
      // move the named import if it exists in the current `file`
      if (namedImport) {
        const importDeclaration = namedImport.getImportDeclaration();
        namedImport.remove();
        // remove also the `importDeclaration` if the `namedImport` was the last one
        if (importDeclaration.getNamedImports().length === 0) importDeclaration.remove();

        // check if the `file` has already imports for the `targetPackage`
        if (targetIds.length > 0) {
          targetIds[0].addNamedImport({ name: importedObjectName });
        } else {
          targetIds.push(
            file.addImportDeclaration({ moduleSpecifier: args.targetPackage, namedImports: [importedObjectName] })
          );
        }
      }
    });
  });
}

function getImportDeclarations(file: SourceFile, packageName: string): ImportDeclaration[] {
  const cleanText = (text: string) => text?.replaceAll('"', '')?.replaceAll(`'`, '');
  return file?.getImportDeclarations()?.filter((id) => cleanText(id.getModuleSpecifier()?.getText()) === packageName);
}

function getNamedImport(ids: ImportDeclaration[], objectName: string): ImportSpecifier | undefined {
  return ids
    ?.filter((id) => !id.wasForgotten())
    .map((id) => id.getNamedImports().find((ni) => ni.getText() === objectName))
    .find((id) => !!id);
}
