import { Project, QuoteKind } from 'ts-morph';
import { tsImportMove } from './ts-import-move';

describe('tsImportMove', () => {
  let project: Project;

  beforeEach(() => {
    project = new Project({ useInMemoryFileSystem: true, manipulationSettings: { quoteKind: QuoteKind.Single } });
  });

  it('should work with multiple import statements from the same package', async () => {
    // arrange
    const fileContent = `
    import { ObjectToMove1 } from '@p/source';
    import { ObjectToMove2, ObjectToMove3 } from '@p/source';
    import { ObjectToMove9 } from '@p/target';
    `;
    const fileName = await createFile(project, fileContent);

    // act
    tsImportMove(project, {
      imports: ['ObjectToMove1', 'ObjectToMove3'],
      sourcePackage: '@p/source',
      targetPackage: '@p/target',
    });
    await project.save();
    const result = await getFileContent(project, fileName);

    // assert
    const expectedResult = `
    import { ObjectToMove2 } from '@p/source';
    import { ObjectToMove9, ObjectToMove1, ObjectToMove3 } from '@p/target';
    `;
    expect(result.replaceAll(' ', '')).toEqual(expectedResult.replaceAll(' ', ''));
  });

  it('should work when no import statements with target package exists in the file', async () => {
    // arrange
    const fileContent = `
    import { ObjectToMove1 } from '@p/source';
    import { ObjectToMove2, ObjectToMove3 } from '@p/source';
    `;
    const fileName = await createFile(project, fileContent);

    // act
    tsImportMove(project, {
      imports: ['ObjectToMove3'],
      sourcePackage: '@p/source',
      targetPackage: '@p/target',
    });
    await project.save();
    const result = await getFileContent(project, fileName);

    // assert
    const expectedResult = `
    import { ObjectToMove1 } from '@p/source';
    import { ObjectToMove2 } from '@p/source';
    import { ObjectToMove3 } from '@p/target';
    `;
    expect(result.replaceAll(' ', '')).toEqual(expectedResult.replaceAll(' ', ''));
  });

  it('should work with unscoped imports', async () => {
    // arrange
    const fileContent = `
    import { ObjectToMove1, ObjectToMove2 } from 'some-lib';
    `;
    const fileName = await createFile(project, fileContent);

    // act
    tsImportMove(project, {
      imports: ['ObjectToMove2'],
      sourcePackage: 'some-lib',
      targetPackage: 'target-lib',
    });
    await project.save();
    const result = await getFileContent(project, fileName);

    // assert
    const expectedResult = `
    import { ObjectToMove1 } from 'some-lib';
    import { ObjectToMove2 } from 'target-lib';
    `;
    expect(result.replaceAll(' ', '')).toEqual(expectedResult.replaceAll(' ', ''));
  });

  it('should remove the complete import statement if moving the last import from it', async () => {
    // arrange
    const fileContent = `
    import { ObjectToMove1, ObjectToMove2 } from 'some-lib';
    `;
    const fileName = await createFile(project, fileContent);

    // act
    tsImportMove(project, {
      imports: ['ObjectToMove1', 'ObjectToMove2'],
      sourcePackage: 'some-lib',
      targetPackage: 'target-lib',
    });
    await project.save();
    const result = await getFileContent(project, fileName);

    // assert
    const expectedResult = `
    import { ObjectToMove1, ObjectToMove2 } from 'target-lib';
    `;
    expect(result.replaceAll(' ', '')).toEqual(expectedResult.replaceAll(' ', ''));
  });
});

async function getFileContent(project: Project, fileName: string): Promise<string> {
  const fs = project.getFileSystem();
  return await fs.readFile(fileName);
}

async function createFile(project: Project, fileContent: string): Promise<string> {
  const fileName = `${Date.now()}-${Math.floor(Math.random() * 100)}.ts`;
  const file = project.createSourceFile(fileName, fileContent);
  file.formatText();
  await file.save();
  return fileName;
}
