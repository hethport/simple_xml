import {XmlNode} from "./xmlModel";

export interface XmlCommentNode {
  comment: string;
}

export function xmlCommentNode(comment: string): XmlCommentNode {
  return {comment};
}

export function isXmlCommentNode(node: XmlNode): node is XmlCommentNode {
  return 'comment' in node;
}
