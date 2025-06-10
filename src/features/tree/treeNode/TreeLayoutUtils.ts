// TreeLayoutUtils.ts

import { Person } from "../../../Model/Person";
import { TreeNode } from "./TreeNode";


export class TreeLayoutUtils {
    static buildTree(person: Person, visited = new Set<string>()): TreeNode {
        const node = new TreeNode(person);
        visited.add(person.id);

        const children: Person[] = [];

        // 👶 hijos
        children.push(...person.relacion.getChildren());

        // 💑 pareja actual
        const partner = person.relacion.getCurrentPartner();
        if (partner && !visited.has(partner.id)) {
            children.push(partner);
        }

        // 👨‍👩‍ padres
        const [p1, p2] = person.relacion.getParents();
        if (p1 && !visited.has(p1.id)) {
            children.push(p1);
        }
        if (p2 && !visited.has(p2.id)) {
            children.push(p2);
        }

        // 👀 Opción: ex-parejas
        // const exes = person.relacion.getExPartners();
        // children.push(...exes.filter(p => !visited.has(p.id)));

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

    static layoutFromRoot(root: Person, canvasWidth = window.innerWidth) {
        const tree = this.buildTree(root);
        this.firstWalk(tree);
        this.secondWalk(tree);

        // 👇 Centrado horizontal
        const all = root.relacion.getAllConnections();
        const minX = Math.min(...all.map(p => p.getPosition().x));
        const maxX = Math.max(...all.map(p => p.getPosition().x));
        const treeWidth = maxX - minX;
        const offsetX = (canvasWidth - treeWidth) / 2 - minX;

        for (const p of all) {
            const pos = p.getPosition();
            p.setPosition(pos.x + offsetX, pos.y);
        }
    }
}
