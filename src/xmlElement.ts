import {XmlNode} from './xmlModel';

export type Attributes<A extends string = string> = { [key in A]: string | undefined };

export interface XmlElementNode<TagName extends string = string, A extends string = string> {
  tagName: TagName;
  attributes: Attributes<A>;
  children: XmlNode[];
}

export function xmlElementNode<TagName extends string = string>(
  tagName: TagName,
  attributes: Attributes = {},
  children: XmlNode[] = []
): XmlElementNode<TagName> {
  return {tagName, attributes, children};
}

export function hasTagName<S extends string>(node: XmlElementNode, s: S): node is XmlElementNode<S> {
  return node.tagName === s;
}

export const isXmlElementNode = (node: XmlNode): node is XmlElementNode => 'tagName' in node;

export const firstChildNode = ({children}: XmlElementNode): XmlNode | undefined => children[0];

export const lastChildNode = ({children}: XmlElementNode): XmlNode | undefined => children[children.length - 1];
