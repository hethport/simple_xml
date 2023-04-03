import {XmlElementNode} from './xmlElement';
import {isXmlTextNode, XmlTextNode} from './xmlTextNode';
import {isXmlCommentNode, XmlCommentNode} from './xmlCommentNode';

export type XmlNonEmptyNode = XmlElementNode | XmlTextNode;

export type XmlNode = XmlNonEmptyNode | XmlCommentNode;

// Helper functions

export function getElementByPath(rootNode: XmlElementNode, path: number[]): XmlElementNode {
  return path.reduce(
    (acc, index) => acc.children[index] as XmlElementNode,
    rootNode
  );
}

export function findFirstXmlElementByTagName(node: XmlNode, tagName: string): XmlElementNode | undefined {
  if (isXmlTextNode(node) || isXmlCommentNode(node)) {
    return undefined;
  }

  if (node.tagName === tagName) {
    return node;
  }

  for (const child of node.children) {
    const found: XmlElementNode | undefined = findFirstXmlElementByTagName(child, tagName);

    if (found !== undefined) {
      return found;
    }
  }

  return undefined;
}
