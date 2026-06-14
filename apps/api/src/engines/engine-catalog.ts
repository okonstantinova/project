import Handlebars from 'handlebars';
import Mustache from 'mustache';
import * as ejs from 'ejs';
import { Eta } from 'eta';
const doT = require('dot');

export type CompiledTemplate = (data: any) => string;

export interface EngineDefinition {
  engine: string;
  label: string;
  description: string;
  syntax: string;
  defaultTemplate: string;
  compile: (template: string) => CompiledTemplate;
}

export const SAMPLE_DATA = {
  title: 'Product Catalog',
  items: [
    { name: 'Laptop', price: 999 },
    { name: 'Mouse', price: 29 },
    { name: 'Keyboard', price: 79 },
  ],
};

const eta = new Eta();

export const ENGINES: EngineDefinition[] = [
  {
    engine: 'handlebars',
    label: 'Handlebars',
    description: 'Logic-less templates with {{mustache}} syntax and helpers.',
    syntax: 'mustache',
    defaultTemplate:
      '<h1>{{title}}</h1>\n<ul>\n{{#each items}}  <li>{{name}} - {{price}}$</li>\n{{/each}}</ul>',
    compile: (template) => {
      const fn = Handlebars.compile(template);
      return (data) => fn(data);
    },
  },
  {
    engine: 'mustache',
    label: 'Mustache',
    description: 'Minimal logic-less templating, the {{mustache}} reference engine.',
    syntax: 'mustache',
    defaultTemplate:
      '<h1>{{title}}</h1>\n<ul>\n{{#items}}  <li>{{name}} - {{price}}$</li>\n{{/items}}</ul>',
    compile: (template) => {
      Mustache.parse(template);
      return (data) => Mustache.render(template, data);
    },
  },
  {
    engine: 'ejs',
    label: 'EJS',
    description: 'Embedded JavaScript templating with <% %> scriptlets.',
    syntax: 'ejs',
    defaultTemplate:
      '<h1><%= title %></h1>\n<ul>\n<% items.forEach(function (p) { %>  <li><%= p.name %> - <%= p.price %>$</li>\n<% }) %></ul>',
    compile: (template) => {
      const fn = ejs.compile(template);
      return (data) => fn(data);
    },
  },
  {
    engine: 'eta',
    label: 'Eta',
    description: 'Lightweight, fast EJS-like engine. Data is exposed via `it`.',
    syntax: 'eta',
    defaultTemplate:
      '<h1><%= it.title %></h1>\n<ul>\n<% it.items.forEach(function (p) { %>  <li><%= p.name %> - <%= p.price %>$</li>\n<% }) %></ul>',
    compile: (template) => {
      const fn = eta.compile(template);
      return (data) => fn.call(eta, data);
    },
  },
  {
    engine: 'dot',
    label: 'doT.js',
    description: 'Very fast templating. Uses {{= }} interpolation and `it` data.',
    syntax: 'dot',
    defaultTemplate:
      '<h1>{{=it.title}}</h1>\n<ul>\n{{~it.items :p}}  <li>{{=p.name}} - {{=p.price}}$</li>\n{{~}}</ul>',
    compile: (template) => {
      const fn = doT.template(template);
      return (data) => fn(data);
    },
  },
];

export const ENGINE_MAP: Record<string, EngineDefinition> = ENGINES.reduce(
  (acc, def) => {
    acc[def.engine] = def;
    return acc;
  },
  {} as Record<string, EngineDefinition>,
);
