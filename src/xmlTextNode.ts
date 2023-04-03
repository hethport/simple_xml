import {XmlNode} from './xmlModel';

export interface XmlTextNode {
  textContent: string;
}

export function xmlTextNode(textContent: string): XmlTextNode {
  return {textContent};
}

export function isXmlTextNode(node: XmlNode): node is XmlTextNode {
  return 'textContent' in node;
}
