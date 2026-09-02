import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assessAnime, synopsisHash, publicationLinks } from '../supabase/functions/import-anime/quality.mjs';
import { parseSaved, rankDiscovery } from '../src/lib/discovery-model.ts';
import { animes } from '../src/data/animes.ts';

const rich = { id: 123, isAdult: false, title: { english: 'Test anime' },
  description: Array.from({length: 90}, (_, i) => `word${i}`).join(' '),
  format: 'TV', status: 'FINISHED', seasonYear: 2020, season: 'WINTER', episodes: 12,
  duration: 24, genres: ['Adventure'], studios: {nodes: [{name:'Studio',isAnimationStudio:true}]},
  characters: {edges: [1,2,3].map(id => ({role:'MAIN',node:{id,name:{full:`Character ${id}`}}}))},
  externalLinks: [{site:'Official site',type:'OFFICIAL',url:'https://example.org'}],
  relations: {edges: []}, synonyms: [] };
assert.equal(assessAnime(rich).readyForReview, true);
assert.equal(assessAnime(rich).content.editorial.status, 'required');
assert.equal(assessAnime(rich).content.synopsis.editorial_original, false);
assert.ok(assessAnime(rich).content.search_intents.some(q=>q.section==='characters'));
assert.ok(!assessAnime({...rich,episodes:null,relations:{edges:[]}}).content.search_intents.some(q=>q.question.includes('How many episodes') || q.section==='franchise_relations'));
assert.equal(assessAnime({...rich,description:'Short text'}).readyForReview, false);
assert.equal(assessAnime({...rich,characters:{edges:[]}}).readyForReview, false);
assert.equal(assessAnime({...rich,isAdult:true}).readyForReview, false);
assert.equal(assessAnime({...rich,externalLinks:[{type:'OFFICIAL',url:'javascript:alert(1)'}]}).readyForReview, false);
assert.equal(await synopsisHash(' Hello, WORLD! '), await synopsisHash('<p>hello world</p>'));
assert.notEqual(await synopsisHash('different story'), await synopsisHash('another story'));
const source = readFileSync(new URL('../supabase/functions/import-anime/index.ts', import.meta.url),'utf8');
assert.ok(!source.includes('gamecastle.example'));
assert.ok(!source.includes('.from("generated_pages")'));
assert.ok(!source.includes('processed * 5'));
assert.ok(source.includes('anime_content_drafts'));
assert.ok(source.includes('existing.data?.status ?? "draft"'));
const pages = JSON.parse(readFileSync(new URL('../supabase/functions/import-anime/published-links.json',import.meta.url),'utf8'));
assert.deepEqual(pages.map(p=>p.path).sort(),animes.filter(a=>!a.publicationStatus||a.publicationStatus==='published').map(a=>`/anime/${a.slug}`).sort());
const related = publicationLinks({...rich,title:{english:pages[0].title},genres:pages[0].topics},pages);
assert.equal(related.canonical,pages[0].path);
assert.ok(related.links.every(link => pages.some(page=>page.path===link.path) && link.path!==related.canonical));
const choices = [{path:'/a',title:'A',description:'',topics:['action'],locale:'en'},
  {path:'/b',title:'B',description:'',topics:['action'],locale:'en'},
  {path:'/c',title:'C',description:'',topics:['comedy'],locale:'en'},
  {path:'/ar/d',title:'D',description:'',topics:['action'],locale:'ar'}];
assert.deepEqual(rankDiscovery(choices,'/a',[],'en').map(p=>p.path),['/b','/c']);
assert.deepEqual(rankDiscovery(choices,'/', ['/a'],'en').map(p=>p.path),['/b','/c']);
assert.deepEqual(parseSaved('["/a","https://bad.test","/a"]',new Set(['/a'])),['/a']);
assert.deepEqual(parseSaved('broken',new Set()),[]);
console.log('Content-quality checks passed: completeness, attribution, draft gate, duplicate hash, URL safety, no five-page generator.');
