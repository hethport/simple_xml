import {MyEither, MyLeft, MyRight} from './either';
import {isXmlTextNode, xmlTextNode} from './xmlTextNode';
import {XmlNode} from './xmlModel';
import {Attributes, xmlElementNode} from './xmlElement';
import {xmlCommentNode} from './xmlCommentNode';

export type LetterCorrection = [string, string][];

interface NodeReadConfig {
  letterCorrections: LetterCorrection;
  keepSpaces?: boolean;
}

export interface XmlReadConfig {
  [tagName: string]: NodeReadConfig;
}

function performCorrections(text: string, corrections: LetterCorrection): string {
  return corrections.reduce<string>(
    (acc, [key, value]) => acc.replace(new RegExp(key, 'g'), value),
    text
  );
}

function loadNode(el: ChildNode, xmlReadConfig: XmlReadConfig, parentLetterCorrections: LetterCorrection = []): XmlNode {
  if (el instanceof Comment) {
    return xmlCommentNode(el.textContent || '');
  }

  if (el instanceof Text) {
    return xmlTextNode(performCorrections(el.textContent || '', parentLetterCorrections));
  }

  if (el instanceof Element) {
    const attributes: Attributes = Array.from(el.attributes).reduce((acc, {name, value}) => ({...acc, [name]: value}), {});

    const nodeReadConfig = el.tagName in xmlReadConfig
      ? xmlReadConfig[el.tagName]
      : undefined;

    const children = Array.from(el.childNodes)
      .map((c) => loadNode(c, xmlReadConfig, nodeReadConfig?.letterCorrections))
      // Filter out empty text nodes
      .filter((node) => !isXmlTextNode(node) || (!!nodeReadConfig?.keepSpaces || node.textContent.trim().length > 0));

    return xmlElementNode(el.tagName, attributes, children);
  }

  throw new Error(`unexpected element: ${el.nodeType}`);
}

export type ParseResult = MyEither<string, XmlNode>;

export function parseXmlWithDefaultReadConfig(content: string): ParseResult {
  return parseNewXml(content, {});
}

export function parseNewXml(content: string, xmlReadConfig: XmlReadConfig): ParseResult {
  const doc = new DOMParser().parseFromString(content, 'text/xml');

  const parserErrorElement = doc.querySelector('parsererror');

  if (parserErrorElement !== null) {
    return new MyLeft(parserErrorElement.textContent || '');
  } else {
    return new MyRight(loadNode(doc.children[0], xmlReadConfig));
  }
}

export async function loadXmlWithDefaultReadConfig(file: File): Promise<ParseResult> {
  return loadNewXml(file, {});
}

export async function loadNewXml(file: File, xmlReadConfig: XmlReadConfig): Promise<ParseResult> {
  return parseNewXml(
    // non-breakable space to normal space
    (await file.text()).replace(/\xa0/g, ''),
    xmlReadConfig
  );
}

