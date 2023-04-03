import {writeNode, XmlWriteConfig} from './xmlWriting';
import {XmlElementNode, xmlElementNode} from './xmlElement';
import {xmlTextNode} from './xmlTextNode';

const tlhWordConfig: XmlWriteConfig = {
  w: {
    inlineChildren: true,
    orderAttributes: ({mrp0sel, trans, ...rest}) => [['mrp0sel', mrp0sel], ['trans', trans], ...Object.entries(rest)]
  }
};

describe('xmlWriting', (): void => {

  test.each<{ word: XmlElementNode, result: string[] }>([
    {
      word: xmlElementNode('w', {mrp1: '', mrp2: '', mrp0sel: '', trans: ''}, [xmlTextNode('a')]),
      result: ['<w mrp0sel="" trans="" mrp1="" mrp2="">a</w>']
    },
  ])(
    'it should write $word as $result',
    ({word, result}) => expect(writeNode(word, tlhWordConfig)).toEqual(result)
  );

});
