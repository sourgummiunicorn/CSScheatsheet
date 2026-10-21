'use strict';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const snippets = {
  rule: 'p {\n  color: #EA580C;\n}',
  text: '',
  position: '',
  'google-font-link': '<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">',
  'google-font-css': 'body {\n  font-family: "Roboto", Arial, sans-serif;\n}'
};
let toastTimer;
function setMascot(mood = 'happy') { const mascot = $('#planner-mascot'); if (!mascot) return; mascot.dataset.mood = mood; mascot.setAttribute('aria-label', mood === 'celebrate' ? 'A planner blob mascot cheering for you' : mood === 'night' ? 'A sleepy planner blob mascot' : 'A happy planner blob mascot'); }
function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('visible'); setMascot('celebrate'); clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.classList.remove('visible'); setMascot(document.documentElement.dataset.theme === 'dark' ? 'night' : 'happy'); }, 2200); }
async function copy(text) {
  try { await navigator.clipboard.writeText(text); toast('CSS copied. Paste it into your stylesheet.'); }
  catch { toast('Select the code and copy it with ⌘C / Ctrl+C.'); }
}
document.addEventListener('click', event => { const button = event.target.closest('[data-copy]'); if (button) copy(snippets[button.dataset.copy]); });

const textDefaults = { size: 24, family: 'Arial, Helvetica, sans-serif', text: '#c2410c', background: '#ffedd5' };
function updateTextLab() {
  const size = $('#font-size').value;
  const family = $('#font-family').value;
  const text = $('#text-color').value || textDefaults.text;
  const background = $('#background-color').value || textDefaults.background;
  const message = $('#styled-message');
  message.style.fontSize = `${size}px`; message.style.fontFamily = family; message.style.color = text;
  $('#text-live-preview').style.backgroundColor = background;
  $('#font-size-output').value = `${size}px`;
  snippets.text = `#message {\n  font-size: ${size}px;\n  font-family: ${family};\n  color: ${text};\n  background-color: ${background};\n}`;
  $('#text-code').textContent = snippets.text;
}
['font-size','font-family','text-color','background-color'].forEach(id => $(`#${id}`).addEventListener('input', updateTextLab));
$('#reset-text').addEventListener('click', () => { $('#font-size').value = textDefaults.size; $('#font-family').value = textDefaults.family; $('#text-color').value = textDefaults.text; $('#background-color').value = textDefaults.background; updateTextLab(); toast('Text styles reset.'); });

const basicSelectors = {
  element: { code: 'p {\n  color: #C2410C;\n}', message: '<code>p</code> finds both paragraph elements—every <code>p</code> in the clubhouse.' },
  id: { code: '#abc {\n  background-color: #FFEDD5;\n}', message: '<code>#abc</code> finds one element. Use an id only once on a page.' },
  class: { code: '.profiles {\n  border: 2px solid #C2410C;\n}', message: '<code>.profiles</code> finds both profiles. A class is made to be reused.' }
};
function updateBasicSelector(mode) {
  const preview = $('#basic-preview');
  preview.querySelectorAll('.is-selected').forEach(element => element.classList.remove('is-selected'));
  const matches = mode === 'element' ? [...preview.querySelectorAll('p')] : mode === 'id' ? [preview.querySelector('#abc')] : [...preview.querySelectorAll('.profiles')];
  matches.forEach(element => element.classList.add('is-selected'));
  $$('[data-basic]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.basic === mode)));
  $('#basic-code').textContent = basicSelectors[mode].code;
  $('#basic-feedback').innerHTML = basicSelectors[mode].message;
}
const combinedSelectors = {
  group: { code: 'h1, p {\n  color: #C2410C;\n}', message: 'The comma makes a group: this rule finds the heading and every paragraph.' },
  child: { code: '.card > p {\n  font-weight: 700;\n}', message: 'The <code>&gt;</code> finds only the paragraph directly inside <code>.card</code>.' },
  descendant: { code: '.card p {\n  background-color: #FFEDD5;\n}', message: 'The space finds every paragraph anywhere inside <code>.card</code>—direct or nested.' }
};
function updateCombinedSelector(mode) {
  const preview = $('#combined-preview');
  preview.querySelectorAll('.is-selected').forEach(element => element.classList.remove('is-selected'));
  const matches = mode === 'group' ? [...preview.querySelectorAll('h1, p')] : mode === 'child' ? [...preview.querySelectorAll('.card > p')] : [...preview.querySelectorAll('.card p')];
  matches.forEach(element => element.classList.add('is-selected'));
  $$('[data-combined]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.combined === mode)));
  $('#combined-code').textContent = combinedSelectors[mode].code;
  $('#combined-feedback').innerHTML = combinedSelectors[mode].message;
}
$$('[data-basic]').forEach(button => button.addEventListener('click', () => updateBasicSelector(button.dataset.basic)));
$$('[data-combined]').forEach(button => button.addEventListener('click', () => updateCombinedSelector(button.dataset.combined)));
$('#universal-toggle').addEventListener('click', () => {
  const active = $('#universal-toggle').getAttribute('aria-pressed') === 'true';
  $('#universal-toggle').setAttribute('aria-pressed', String(!active));
  $('#universal-preview').classList.toggle('show-all', !active);
  $('#universal-toggle').innerHTML = active ? 'Show what <code>*</code> selects' : 'Hide the <code>*</code> outlines';
  $('#universal-feedback').textContent = active ? 'Try the button: every element in this tiny scene gets an outline.' : 'The star found the strong text, teddy, paragraph, and their parent scene.';
});

const boxDefaults = { margin: 24, padding: 20, border: 3, radius: 12 };
function updateBoxLab() {
  const values = Object.fromEntries(['margin','padding','border','radius'].map(name => [name, Number($(`#box-${name}`).value)]));
  const preview = $('#box-preview');
  $('#margin-area').style.setProperty('--margin-size', `${values.margin}px`);
  $('#margin-label').textContent = `MARGIN / OUTSIDE SPACE / ${values.margin}px`;
  preview.style.padding = `${values.padding}px`; preview.style.borderWidth = `${values.border}px`; preview.style.borderRadius = `${values.radius}px`;
  Object.entries(values).forEach(([name,value]) => $(`#box-${name}-output`).value = `${value}px`);
  $('#box-code').textContent = `.note {\n  margin: ${values.margin}px;\n  padding: ${values.padding}px;\n  border: ${values.border}px solid #C2410C;\n  border-radius: ${values.radius}px;\n  background-color: #FFEDD5;\n}`;
}
['margin','padding','border','radius'].forEach(name => $(`#box-${name}`).addEventListener('input', updateBoxLab));
$('#reset-box').addEventListener('click', () => { Object.entries(boxDefaults).forEach(([name,value]) => $(`#box-${name}`).value = value); updateBoxLab(); toast('Box model reset.'); });

const positions = {
  static: { declaration: 'position: static;', description: 'The default: the bear stays in the normal flow, where it would naturally appear. Good for ordinary page content such as paragraphs, headings, and cards.', hint: 'Scroll the preview to see it move with the page.' },
  relative: { declaration: 'position: relative;\n  top: 12px;\n  left: 24px;', description: 'The bear moves 12px down and 24px right, but CSS leaves an empty space where the bear was before. This means the bear can overlap nearby content. Good for moving something a little without moving the other things around it.', hint: 'The small dashed rectangle shows the bear’s old spot. The empty space stays there even after the bear moves.' },
  absolute: { declaration: 'position: absolute;\n  top: 16px;\n  right: 16px;', description: 'The bear leaves the normal flow and is placed relative to the nearest positioned ancestor. Good for a badge, a close button, or an icon in one exact corner of a card.', hint: 'Here, the dashed container is that ancestor. The surrounding content closes the gap.' },
  fixed: { declaration: 'position: fixed;\n  top: 16px;\n  right: 16px;', description: 'The bear leaves the normal flow and stays in the same place relative to the viewport. Good for a help button, chat button, or other control that should always be available.', hint: 'Scroll the preview: the bear stays put in this small browser window.' },
  sticky: { declaration: 'position: sticky;\n  top: 12px;', description: 'The bear begins in the normal flow, then sticks near the top as you scroll. Good for a section heading or menu that should stay nearby while readers move through its section.', hint: 'Scroll down slowly. It stays within the dashed container and leaves when the container ends.' }
};
function updatePosition(mode) {
  const item = positions[mode];
  $$('[data-position]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.position === mode)));
  $('#position-name').textContent = mode;
  $('#position-description').textContent = item.description;
  $('#position-hint').textContent = item.hint;
  snippets.position = `${mode === 'absolute' ? '.container {\n  position: relative;\n}\n\n' : ''}.bear {\n  ${item.declaration}\n}`;
  $('#position-code').textContent = snippets.position;
  const bearStyle = item.declaration;
  $('#position-preview').srcdoc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>
    * { box-sizing: border-box; } body { margin: 0; padding: 20px; background: #fffaf4; color: #1f1a16; font: 13px/1.5 Arial, sans-serif; }
    .container { position: relative; border: 2px dashed #c2410c; border-radius: 8px; padding: 14px; min-height: 640px; }
    .label { margin: 0 0 12px; color: #7c2d12; font-size: 11px; font-weight: bold; }
    .block { background: #ffedd5; border: 1px solid #fdba74; border-radius: 5px; margin-bottom: 12px; padding: 15px; min-height: 75px; }
    .block.long { min-height: 190px; }
    .bear { ${bearStyle} width: 120px; height: 130px; margin-bottom: 12px; z-index: 1; }
    .bear svg { display: block; width: 100%; height: 100%; }
    .bear::before { content: ''; display: ${mode === 'relative' ? 'block' : 'none'}; position: absolute; top: -12px; left: -24px; width: 120px; height: 130px; border: 1px dashed #c2410c; border-radius: 12px; pointer-events: none; }
    .after { margin-top: 18px; padding: 15px; min-height: 300px; background: #ffedd5; border-radius: 5px; } </style></head><body>
    <div class="container"><p class="label">DASHED CONTAINER</p><div class="block">Content before the bear</div>
    <div class="bear" role="img" aria-label="A smiling teddy bear with an orange bow">
      <svg viewBox="0 0 120 130" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="60" cy="119" rx="46" ry="6" fill="#e8c6a7" opacity=".65"/>
        <ellipse cx="29" cy="84" rx="16" ry="12" transform="rotate(-30 29 84)" fill="#b56b3c" stroke="#7c3d20" stroke-width="2.5"/>
        <ellipse cx="91" cy="84" rx="16" ry="12" transform="rotate(30 91 84)" fill="#b56b3c" stroke="#7c3d20" stroke-width="2.5"/>
        <ellipse cx="60" cy="89" rx="32" ry="29" fill="#c77f4c" stroke="#7c3d20" stroke-width="2.5"/>
        <ellipse cx="60" cy="91" rx="19" ry="18" fill="#f5d0a6"/>
        <ellipse cx="37" cy="110" rx="18" ry="12" transform="rotate(-12 37 110)" fill="#b56b3c" stroke="#7c3d20" stroke-width="2.5"/>
        <ellipse cx="83" cy="110" rx="18" ry="12" transform="rotate(12 83 110)" fill="#b56b3c" stroke="#7c3d20" stroke-width="2.5"/>
        <ellipse cx="37" cy="110" rx="9" ry="6" fill="#f5d0a6"/><ellipse cx="83" cy="110" rx="9" ry="6" fill="#f5d0a6"/>
        <circle cx="31" cy="28" r="13" fill="#b56b3c" stroke="#7c3d20" stroke-width="2.5"/><circle cx="89" cy="28" r="13" fill="#b56b3c" stroke="#7c3d20" stroke-width="2.5"/>
        <circle cx="31" cy="28" r="6" fill="#f5d0a6"/><circle cx="89" cy="28" r="6" fill="#f5d0a6"/>
        <ellipse cx="60" cy="43" rx="36" ry="31" fill="#d28b54" stroke="#7c3d20" stroke-width="2.5"/>
        <circle cx="47" cy="40" r="3.2" fill="#3b2119"/><circle cx="73" cy="40" r="3.2" fill="#3b2119"/>
        <circle cx="39" cy="50" r="4" fill="#edaa95" opacity=".75"/><circle cx="81" cy="50" r="4" fill="#edaa95" opacity=".75"/>
        <ellipse cx="60" cy="52" rx="15" ry="11" fill="#f8d9b4"/><ellipse cx="60" cy="48" rx="5" ry="3.5" fill="#5b3020"/>
        <path d="M60 52v3m-7 1c2 4 5 4 7 1 2 3 5 3 7-1" fill="none" stroke="#5b3020" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M57 72l-12-5v12l12-5m6-2l12-5v12l-12-5" fill="#c2410c" stroke="#7c2d12" stroke-width="2" stroke-linejoin="round"/><circle cx="60" cy="73" r="4" fill="#fdb36c" stroke="#7c2d12" stroke-width="2"/>
      </svg>
    </div><div class="block long">Content after the bear<br>Keep scrolling ↓</div><div class="block long">More content inside the container</div></div><div class="after">Content after the container</div></body></html>`;
}
$$('[data-position]').forEach(button => button.addEventListener('click', () => updatePosition(button.dataset.position)));

const missions = [
  { title: 'Make the title orange', prompt: 'Change the postcard title to the guide’s orange accent. Write a rule that selects h4 and sets color to #C2410C.', hint: 'Start with h4, use curly braces, then add color: #C2410C;.', test: css => /h4\s*\{[^}]*color\s*:\s*(#c2410c|rgb\(194\s*,\s*65\s*,\s*12\))/i.test(css) },
  { title: 'Add more inside space', prompt: 'Give the postcard more padding. Write a rule that selects .mission-note and adds padding: 28px.', hint: 'A class selector starts with a period: .mission-note { padding: 28px; }', test: css => /\.mission-note\s*\{[^}]*padding\s*:\s*28px/i.test(css) },
  { title: 'Round the corners', prompt: 'Make the postcard corners rounder with border-radius: 24px.', hint: 'Use .mission-note again. You may write a second rule or add this property to your existing one.', test: css => /\.mission-note\s*\{[^}]*border-radius\s*:\s*24px/i.test(css) },
  { title: 'Center the message', prompt: 'Center the paragraph inside the postcard with text-align: center.', hint: 'Select the paragraph with .mission-note p.', test: css => /\.mission-note\s+p\s*\{[^}]*text-align\s*:\s*center/i.test(css) },
  { title: 'Style the tiny button', prompt: 'Change the button background to #7C2D12. Then hover or focus it to see the result.', hint: 'Select .mission-note button and add background-color: #7C2D12;.', test: css => /\.mission-note\s+button\s*\{[^}]*background(?:-color)?\s*:\s*#7c2d12/i.test(css) }
];
let currentMission = 0;
const drafts = missions.map(() => '');
const completed = missions.map(() => false);
function safeCSS(css) { return css.replace(/<|>|@import|url\s*\(/gi, ''); }
function renderMissionPreview() { $('#mission-preview').style.cssText = ''; const style = document.createElement('style'); style.textContent = `#mission-preview ${safeCSS(drafts.join('\n'))}`; $('#mission-preview').append(style); }
function renderMissionList() {
  $('#mission-buttons').innerHTML = missions.map((mission, index) => `<li><button type="button" data-mission="${index}" class="${completed[index] ? 'is-complete' : ''}" ${index === currentMission ? 'aria-current="step"' : ''}><span class="mission-number">${completed[index] ? '✓' : index + 1}</span><span>${mission.title}</span></button></li>`).join('');
  $('#mission-progress').textContent = `${completed.filter(Boolean).length} of ${missions.length} complete`;
  $('#mission-bar').style.width = `${(completed.filter(Boolean).length / missions.length) * 100}%`;
  $('#mission-complete').hidden = !completed.every(Boolean);
}
function selectMission(index, focus = false) {
  currentMission = index; const mission = missions[index];
  $('#mission-kicker').textContent = `MISSION ${index + 1} / ${missions.length}`;
  $('#mission-title').textContent = mission.title;
  $('#mission-prompt').textContent = mission.prompt;
  $('#mission-hint').textContent = mission.hint;
  $('#mission-editor').value = drafts[index];
  $('#mission-feedback').textContent = completed[index] ? 'Complete — your CSS rule changes the preview.' : '';
  renderMissionList(); renderMissionPreview(); if (focus) $('#mission-title').focus();
}
$('#mission-buttons').addEventListener('click', event => { const button = event.target.closest('[data-mission]'); if (button) selectMission(Number(button.dataset.mission), true); });
$('#mission-editor').addEventListener('input', event => { drafts[currentMission] = event.target.value; if (completed[currentMission] && !missions[currentMission].test(drafts[currentMission])) completed[currentMission] = false; $('#mission-feedback').textContent = ''; renderMissionList(); renderMissionPreview(); });
$('#check-mission').addEventListener('click', () => { const pass = missions[currentMission].test(drafts[currentMission]); completed[currentMission] = pass; $('#mission-feedback').textContent = pass ? 'Nice work. You changed the visible postcard with CSS.' : 'Not quite yet. Check the property name, value, and selector, then try again.'; renderMissionList(); renderMissionPreview(); if (pass && currentMission < missions.length - 1) setTimeout(() => selectMission(currentMission + 1, true), 450); });
$('#reset-mission').addEventListener('click', () => { drafts[currentMission] = ''; completed[currentMission] = false; selectMission(currentMission); $('#mission-editor').focus(); });

const accentPicker = $('#accent-picker');
const themeToggle = $('#theme-toggle');
function setTheme(theme) { const dark = theme === 'dark'; document.documentElement.dataset.theme = dark ? 'dark' : 'light'; themeToggle.setAttribute('aria-pressed', String(dark)); themeToggle.querySelector('[aria-hidden="true"]').textContent = dark ? '☀' : '☾'; themeToggle.querySelector('.theme-label').textContent = dark ? 'Light mode' : 'Night mode'; document.querySelectorAll('.hero-note,.code-window,.control-card,.preview-card,.selector-lesson,.box-controls,.box-preview-card,.position-preview-card,.mission-card,.mission-preview-card,.mission-list,.units-grid article,.optional,.font-stacks article,.font-steps article,.color-notes li,.word-table-wrap,.hover-demo,.mission-preview,.text-live-preview').forEach(card => { card.style.backgroundColor = dark ? '#2f2839' : ''; card.style.color = dark ? '#fff8ef' : ''; }); setMascot(dark ? 'night' : 'happy'); }
accentPicker.addEventListener('input', () => { document.documentElement.style.setProperty('--accent', accentPicker.value); document.documentElement.style.setProperty('--accent-soft', `color-mix(in srgb, ${accentPicker.value} 17%, var(--paper))`); document.documentElement.style.setProperty('--accent-pale', `color-mix(in srgb, ${accentPicker.value} 33%, var(--paper))`); setMascot('celebrate'); });
themeToggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
setTheme('light');

const unitModal = $('#unit-example-modal');
const unitExamples = {
  px: { title: 'Pixels stay fixed.', text: 'Move the simulated window-size slider. The window gets wider or narrower, but the orange border stays exactly 6px thick.', code: 'border: 6px solid #FDBA74;', demo: '<div class="pixel-demo-labels"><span id="pixel-window-label">Window: 360px wide</span><strong>Border: 6px (fixed)</strong></div><div id="pixel-window" class="pixel-window" style="width:360px"><div id="pixel-sample" class="modal-pixel-box">Fixed 6px border</div></div><label class="unit-slider-control" for="pixel-window-width">Window width <output id="pixel-window-width-output">360px</output><input id="pixel-window-width" type="range" min="180" max="410" value="360"></label>' },
  rem: { title: '1.25rem follows the root.', text: 'Move the root-size slider. “1.25rem” means 1.25 times the root font size, so the text grows or shrinks with the root.', code: 'font-size: 1.25rem;', demo: '<div id="rem-sample" class="modal-rem-text">1.25rem</div><div class="rem-math"><span>Root: <b id="rem-root-value">16px</b> × 1.25</span><span>Text: <b id="rem-result-value">20px</b></span></div><label class="unit-slider-control" for="rem-root-size">Root font size <output id="rem-root-size-output">16px</output><input id="rem-root-size" type="range" min="12" max="28" value="16"></label>' },
  percent: { title: '80% follows its parent.', text: 'Move the parent-width slider. The orange bar changes size too, but it always stays 80% as wide as its parent track.', code: 'width: 80%;', demo: '<div class="percent-demo-labels"><span id="percent-parent-label">Parent track: 360px</span><strong>Orange bar: 80%</strong></div><div id="percent-parent" class="modal-percent-track" style="width:360px" aria-label="A pale parent track with an orange bar that is 80 percent as wide"><span></span></div><label class="percent-width-control" for="percent-parent-width">Parent width <output id="percent-parent-width-output">360px</output><input id="percent-parent-width" type="range" min="180" max="410" value="360"></label>' },
  viewport: { title: '3vw follows the browser width.', text: 'vw means viewport width: 1vw is 1% of the browser window width. vh means viewport height: 1vh is 1% of the browser window height. Move the slider to see 3vw change.', code: 'font-size: 3vw;', demo: '<div class="vw-demo-labels"><span>Browser width: <b id="vw-browser-width">1060px</b></span><strong>3vw: <span id="vw-size-label">31.8px</span></strong></div><div id="vw-browser" class="vw-browser"><span class="vw-browser-label">SIMULATED BROWSER</span><div id="vw-sample" class="vw-sample" style="font-size:31.8px">Hello World!</div></div><label class="unit-slider-control" for="vw-browser-slider">Browser width <output id="vw-browser-slider-output">1060px</output><input id="vw-browser-slider" type="range" min="400" max="1600" value="1060"></label><p class="vw-math" id="vw-math">1060 × 0.03 = 31.8px</p><section class="vw-device-reference" aria-label="Browser size examples"><span class="vw-device-kicker">BROWSER SIZES</span><div class="vw-device-row"><div class="vw-device phone-sticker"><span class="device-visual phone" aria-hidden="true"></span><b>Phone</b><span>400px · 3vw = 12px</span></div><div class="vw-device tablet-sticker"><span class="device-visual tablet" aria-hidden="true"></span><b>Tablet</b><span>800px · 3vw = 24px</span></div><div class="vw-device laptop-sticker"><span class="device-visual laptop" aria-hidden="true"></span><b>Laptop</b><span>1200px · 3vw = 36px</span></div><div class="vw-device desktop-sticker"><span class="device-visual desktop" aria-hidden="true"></span><b>Desktop</b><span>1600px · 3vw = 48px</span></div></div></section>' }
};
$$('[data-unit-example]').forEach(button => button.addEventListener('click', () => {
  const example = unitExamples[button.dataset.unitExample];
  $('#unit-modal-title').textContent = example.title;
  $('#unit-modal-text').textContent = example.text;
  $('#unit-modal-code').textContent = example.code;
  $('#unit-modal-demo').className = `unit-modal-demo ${button.dataset.unitExample}-modal-demo`;
  $('#unit-modal-demo').innerHTML = example.demo;
  const pixelWindowWidth = $('#pixel-window-width');
  if (pixelWindowWidth) {
    const pixelWindow = $('#pixel-window');
    const pixelOutput = $('#pixel-window-width-output');
    const pixelLabel = $('#pixel-window-label');
    pixelWindowWidth.addEventListener('input', () => {
      const width = `${pixelWindowWidth.value}px`;
      pixelWindow.style.width = width;
      pixelOutput.textContent = width;
      pixelLabel.textContent = `Window: ${width} wide`;
    });
  }
  const remRootSize = $('#rem-root-size');
  if (remRootSize) {
    const remSample = $('#rem-sample');
    const remRootValue = $('#rem-root-value');
    const remResultValue = $('#rem-result-value');
    const remOutput = $('#rem-root-size-output');
    remRootSize.addEventListener('input', () => {
      const root = Number(remRootSize.value);
      const result = root * 1.25;
      remSample.style.fontSize = `${result}px`;
      remRootValue.textContent = `${root}px`;
      remResultValue.textContent = `${result}px`;
      remOutput.textContent = `${root}px`;
    });
  }
  const parentWidth = $('#percent-parent-width');
  if (parentWidth) {
    const parentTrack = $('#percent-parent');
    const widthOutput = $('#percent-parent-width-output');
    const parentLabel = $('#percent-parent-label');
    const updatePercentExample = () => {
      const width = `${parentWidth.value}px`;
      parentTrack.style.width = width;
      widthOutput.textContent = width;
      parentLabel.textContent = `Parent track: ${width}`;
    };
    parentWidth.addEventListener('input', updatePercentExample);
  }
  const viewportWidth = $('#vw-browser-slider');
  if (viewportWidth) {
    const browser = $('#vw-browser');
    const sample = $('#vw-sample');
    const widthLabel = $('#vw-browser-width');
    const sizeLabel = $('#vw-size-label');
    const output = $('#vw-browser-slider-output');
    const math = $('#vw-math');
    const updateViewportExample = () => {
      const width = Number(viewportWidth.value);
      const size = Math.round(width * 3) / 100;
      const visualWidth = 170 + ((width - 400) / 1200) * 230;
      browser.style.width = `${visualWidth}px`;
      sample.style.fontSize = `${size}px`;
      widthLabel.textContent = `${width}px`;
      sizeLabel.textContent = `${size}px`;
      output.textContent = `${width}px`;
      math.textContent = `${width} × 0.03 = ${size}px`;
    };
    viewportWidth.addEventListener('input', updateViewportExample);
  }
  unitModal.showModal();
}));
$('#unit-modal-close').addEventListener('click', () => unitModal.close());

const hoverButton = $('.demo-button');
hoverButton.addEventListener('mouseenter', () => $('#hover-status').textContent = ':hover is active: the background became dark orange.');
hoverButton.addEventListener('mouseleave', () => $('#hover-status').textContent = 'Try moving over the button, or tab to it.');
hoverButton.addEventListener('focus', () => $('#hover-status').textContent = 'Keyboard focus is visible too — that helps people navigate.');
const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) $$('.nav-inner a').forEach(link => { const active = link.hash === `#${entry.target.id}`; link.classList.toggle('active', active); link.toggleAttribute('aria-current', active); }); }); }, {rootMargin:'-15% 0px -65% 0px'});
$$('main > section[id]').forEach(section => observer.observe(section));
updateTextLab(); updateBasicSelector('element'); updateCombinedSelector('group'); updateBoxLab(); updatePosition('static'); selectMission(0);
