import { Request } from 'express';
import {
  CssSelectorDefinition,
  CssSelectorRegistry,
} from './css-selector-registry';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as RegexTranslator from 'regex-translator';
import { parseHTML } from 'linkedom';
import { isNaN, snakeCase } from 'lodash';

import axios from 'axios';

export abstract class PageParser {
  protected abstract getURL(req: Request): string;

  protected abstract getCSSSelectors(): CssSelectorRegistry;

  // eslint-disable-next-line @typescript-eslint/ban-types
  public async parse(req: Request): Promise<Object> {
    const { data } = await axios.get(this.getURL(req)).catch((err: any) => {
      throw new Error(err.response.status);
    });
    const dom = parseHTML(data);
    let { document } = dom.window;
    const selectors = this.getCSSSelectors();
    const columns = Object.keys(selectors)
      .map((key) => {
        return PageParser.definitionNameToColumnName(key);
      })
      .filter((column) => column !== 'default');
    return columns.reduce((acc, column) => {
      const definition = PageParser.getDefinition(selectors, column);
      if (column === 'Root') {
        const context = this.handleColumn(definition, document)?.data;
        const contextDOM = parseHTML(context);
        document = contextDOM.window.document;
        return {
          ...acc,
        };
      }
      const parsed = this.handleColumn(definition, document);
      if (parsed.isPatch || column === 'Entry') {
        return {
          ...acc,
          ...(parsed.data || {}),
        };
      }
      return {
        ...acc,
        [column]: parsed.data,
      };
    }, {});
  }

  private handleColumn(
    definition: CssSelectorRegistry | CssSelectorDefinition | null,
    document: Document,
  ): { isPatch: boolean; data: any } {
    if (definition === null) {
      return { isPatch: false, data: null };
    }
    if (PageParser.isDefinition(definition)) {
      if (definition.multiple) {
        const elements: Element[] = [];
        document
          .querySelectorAll(definition.selector as any)
          .forEach((e) => elements.push(e));
        return {
          isPatch: false,
          data: elements.map((element) =>
            this.handleElement(element, definition),
          ),
        };
      }
      const element = document.querySelector(definition.selector as any);
      const data = this.handleElement(element, definition);
      return {
        isPatch: typeof data === 'object',
        data,
      };
    }
    if (definition['ROOT']) {
      return {
        isPatch: false,
        data: this.handleDefinitionWithRoot(definition, document),
      };
    }
    return {
      isPatch: false,
      data: Object.keys(definition).reduce((acc, key) => {
        const parsed = this.handleColumn(
          PageParser.getDefinition(definition, key),
          document,
        );
        if (parsed.data) {
          if (parsed.isPatch) {
            return {
              ...(acc || {}),
              ...(parsed.data || {}),
            };
          }
          return {
            ...(acc || {}),
            [PageParser.definitionNameToColumnName(key)]: parsed.data,
          };
        }
        return acc;
      }, null),
    };
  }

  private static getDefinition(
    selectors: CssSelectorRegistry,
    name: string,
  ): CssSelectorDefinition | CssSelectorRegistry | null {
    if (selectors[name.toUpperCase()]) {
      return selectors[name.toUpperCase()];
    }
    if (selectors[snakeCase(name).toUpperCase()]) {
      return selectors[snakeCase(name).toUpperCase()];
    }
    return null;
  }

  private handleElement(
    element: Element,
    definition: CssSelectorDefinition,
  ): string | number | Record<string, string | number> | null {
    if (!element) {
      return null;
    }
    let res: string;
    if (definition.attribute) {
      res = element.attributes.getNamedItem(definition.attribute)?.value || '';
    } else {
      res = element.innerHTML || '';
    }
    if (definition.regex) {
      const mediary = RegexTranslator.getMediaryObjectFromRegexString(
        definition.regex,
      );
      const regex = RegexTranslator.getRegexStringFromMediaryObject(
        mediary,
        'ecma',
      )
        .replace(/\(\?P/gm, '(?')
        .replace(/\\f\\n\\r\\t\\v/gm, '\\s\\f\\n\\r\\t\\v&nbsp;');
      const match = new RegExp(regex).exec(res);
      if (match) {
        return (
          Object.entries<any>(match.groups as Record<string, any>).reduce(
            (acc, [key, value]) => {
              if (!isNaN(value) && (+value).toString() === value) {
                value = +value;
              }
              return {
                ...acc,
                [key]: value,
              };
            },
            {},
          ) || null
        );
      }
      return null;
    }
    return (isNaN(+res) ? res : +res) || null;
  }

  private static isDefinition(
    definition: CssSelectorDefinition | CssSelectorRegistry,
  ): definition is CssSelectorDefinition {
    return definition.selector !== undefined;
  }

  private static definitionNameToColumnName(key: string): string {
    return key
      .split('_')
      .map((str) => `${str.slice(0, 1)}${str.slice(1).toLowerCase()}`)
      .join('')
      .replace(/Id/gim, 'ID');
  }

  private handleDefinitionWithRoot(
    definition: CssSelectorRegistry,
    document: Document,
  ): any {
    const { ROOT, ...definitions } = definition;
    const mainList = this.handleColumn(ROOT, document)?.data;
    if (!mainList) {
      return null;
    }
    return {
      List: mainList
        .map((element: string) => {
          const miniDOM = parseHTML(element);
          const miniDocument = miniDOM.window.document;
          return this.handleColumn(definitions, miniDocument)?.data;
        })
        .filter((row: any | null) => !!row),
    };
  }
}
