import { Transform } from "assemblyscript/dist/transform.js";

import {
  ClassDeclaration,
  NamespaceDeclaration,
  NodeKind,
  Parser,
  Statement,
  Source,
} from "assemblyscript/dist/assemblyscript.js";

import { createStrictEqualsMember } from "./createStrictEqualsMember.js";
import { createAddReflectedValueKeyValuePairsMember } from "./createAddReflectedValueKeyValuePairsMember.js";

// @ts-ignore
export default class AspectTransform extends Transform {
  /**
   * This method results in a pure AST transform that inserts a strictEquals member
   * into each ClassDeclaration.
   *
   * @param {Parser} parser - The AssemblyScript parser.
   */
  // @ts-ignore
  afterParse(parser: Parser): void {
    // For backwards compatibility
    let sources: Source[] = (parser as any).program ? (parser as any).program.sources : parser.sources;
    // for each program source
    for (const source of sources) {
      traverseStatements(source.statements);
    }
  }
}

function traverseStatements(statements: Statement[]): void {
  // for each statement in the source
  for (const statement of statements) {
    // find each class declaration
    if (statement.kind === NodeKind.CLASSDECLARATION) {
      // cast and create a strictEquals function
      const classDeclaration = <ClassDeclaration>statement;
      classDeclaration.members.push(createStrictEqualsMember(classDeclaration));
      classDeclaration.members.push(createAddReflectedValueKeyValuePairsMember(classDeclaration));
    } else if (statement.kind === NodeKind.NAMESPACEDECLARATION) {
      const namespaceDeclaration = <NamespaceDeclaration>statement;
      traverseStatements(namespaceDeclaration.members);
    }
  }
}
