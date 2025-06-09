// TreeLayoutUtils.ts

import  { Person } from "../../../Model/Person";
import { TreeNode } from "./TreeNode";


export class TreeLayoutUtils {
  static buildTree(person: Person, visited = new Set<string>()): TreeNode {
    const node = new TreeNode(person);
    visited.add(person.id);

    const children = person.relacion.getChildren();
    node.children = children
      .filter(c => !visited.has(c.id))
      .map(c => this.buildTree(c, visited));

    return node;
  }

  static firstWalk(node: TreeNode, depth = 0, spacing = 120) {
    node.y = depth * spacing;

    if (node.children.length === 0) {
      node.x = 0;
    } else {
      node.children.forEach(child => this.firstWalk(child, depth + 1, spacing));

      const first = node.children[0];
      const last = node.children[node.children.length - 1];
      node.x = (first.x + last.x) / 2;
    }
  }

  static secondWalk(node: TreeNode, shift = 0) {
    node.x += shift;
    node.person.setPosition(node.x, node.y);

    for (const child of node.children) {
      this.secondWalk(child, shift + node.mod);
    }
  }

  static layoutFromRoot(root: Person) {
    const tree = this.buildTree(root);
    this.firstWalk(tree);
    this.secondWalk(tree);
  }
}
