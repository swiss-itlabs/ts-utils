export interface TsImportMoveArgs {
  /** The package from which the objects, currently are imported. */
  sourcePackage: string;
  /** The package where to move the objects, declared in the `imports` array. */
  targetPackage: string;
  /** The objects to move to the import statement of the `targetPackage`. */
  imports: string[];
}
