import {XmlNode} from './xmlModel';
import {isXmlCommentNode} from "./xmlCommentNode";
import {isXmlTextNode} from "./xmlTextNode";

export interface XmlWriteConfig {
  inlineChildrenOf: string[];
}

const emptyWriteConfig: XmlWriteConfig = {
  inlineChildrenOf: [],
};

function writeAttributeValue(value: string): string {
  return value
    .replace(/&(?!amp;)/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/ +/g, ' ');
}

const indent = (s: string, count = 2): string => ' '.repeat(count) + s;

export function writeNode(node: XmlNode, xmlWriteConfig: XmlWriteConfig = emptyWriteConfig, parentInline = false, indentCount = 2): string[] {
  if (isXmlCommentNode(node)) {
    return [`<!-- ${node.comment} -->`];
  }

  if (isXmlTextNode(node)) {
    return [node.textContent];
  }

  const {tagName, attributes, children} = node;

  const writtenAttributes = Object.entries(attributes)
    .flatMap(([name, value]) => value !== undefined ? [`${name}="${writeAttributeValue(value)}"`] : [])
    .join(' ');

  if (children.length === 0) {
    return [`<${tagName}${writtenAttributes.length === 0 ? '' : ' ' + writtenAttributes}/>`];
  }

  const firstChild = children[0];

  if (children.length === 1 && isXmlTextNode(firstChild)) {
    return [`<${tagName}${writtenAttributes.length === 0 ? '' : ' ' + writtenAttributes}>${firstChild.textContent}</${tagName}>`];
  }

  const inlineChildren = xmlWriteConfig.inlineChildrenOf.includes(tagName) || parentInline;

  const writtenChildren = children.flatMap((n) => writeNode(n, xmlWriteConfig, inlineChildren));

  const startTag = `<${tagName}${writtenAttributes.length === 0 ? '' : ' ' + writtenAttributes}>`;
  const endTag = `</${tagName}>`;

  return inlineChildren
    ? [startTag + writtenChildren.join('') + endTag]
    : [startTag, ...writtenChildren.map((c) => indent(c, indentCount)), endTag];
}
