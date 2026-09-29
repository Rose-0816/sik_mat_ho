const AREAS = ['榕园食堂','荔园食堂','槿园食堂','若海食堂','北门外','唐家古镇','南门外'];
const TYPES = ['米饭','面食','日料','简餐','糖水','茶餐厅'];
const SEED_PLACES = [
  {id:'rong-1',name:'隆江猪脚饭',area:'榕园食堂',location:'一楼东侧',type:'米饭',priceRange:'¥15–20',tags:['管饱','咸香'],note:'赶时间嘅稳阵之选。'},
  {id:'rong-2',name:'重庆小面',area:'榕园食堂',location:'二楼西侧',type:'面食',priceRange:'¥12–18',tags:['辣','热气'],note:'落雨天特别想食。'},
  {id:'li-1',name:'照烧鸡腿饭',area:'荔园食堂',location:'二楼窗口',type:'日料',priceRange:'¥18–25',tags:['饭香','唔辣'],note:'鸡皮煎得脆先算正。'},
  {id:'li-2',name:'一人食轻食碗',area:'荔园食堂',location:'一楼南侧',type:'简餐',priceRange:'¥20–28',tags:['清爽','蔬菜'],note:'食得太滞就揀佢。'},
  {id:'jin-1',name:'广式烧腊档',area:'槿园食堂',location:'一楼中间',type:'米饭',priceRange:'¥16–24',tags:['烧味','例汤'],note:'烧鸭腿卖完就冇计。'},
  {id:'ruo-1',name:'潮汕牛肉粿条',area:'若海食堂',location:'一楼西边',type:'面食',priceRange:'¥18–23',tags:['汤粉','鲜'],note:'汤底好清，夜晚食都舒服。'},
  {id:'north-1',name:'深夜糖水铺',area:'北门外',location:'过马路右转',type:'糖水',priceRange:'¥12–22',tags:['甜品','夜宵'],note:'食完正餐仲有个位就去。'},
  {id:'north-2',name:'港味茶餐厅',area:'北门外',location:'北门步行五分钟',type:'茶餐厅',priceRange:'¥22–38',tags:['菠萝油','奶茶'],note:'下午饿到晕先考虑。'},
  {id:'tang-1',name:'古镇日式小馆',area:'唐家古镇',location:'古镇牌坊附近',type:'日料',priceRange:'¥35–60',tags:['周末','慢慢食'],note:'留返有闲情嗰日。'},
  {id:'south-1',name:'南门煲仔饭',area:'南门外',location:'南门斜对面',type:'米饭',priceRange:'¥20–30',tags:['锅巴','热辣辣'],note:'等得耐，但值得。'}
];
const DB_KEY = 'lingsik-places-v1', LOG_KEY = 'lingsik-logs-v1';
let places = JSON.parse(localStorage.getItem(DB_KEY) || 'null') || SEED_PLACES;
let logs = JSON.parse(localStorage.getItem(LOG_KEY) || 'null') || [];
let filters = {area:'',type:''}; let selectedResult = null;
const $ = (s) => document.querySelector(s);
const save = () => {localStorage.setItem(DB_KEY,JSON.stringify(places)); localStorage.setItem(LOG_KEY,JSON.stringify(logs));};
function escapeHTML(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function renderFilters(){
  $('#areaFilters').innerHTML = AREAS.map(a=>`<button class="chip ${filters.area===a?'selected':''}" data-filter="area" data-value="${a}">${a}</button>`).join('');
  $('#typeFilters').innerHTML = TYPES.map(t=>`<button class="chip ${filters.type===t?'selected':''}" data-filter="type" data-value="${t}">${t}</button>`).join('');
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filters[b.dataset.filter]=filters[b.dataset.filter]===b.dataset.value?'':b.dataset.value; renderFilters(); updateMatch();});
  document.querySelectorAll('[data-clear]').forEach(b=>b.onclick=()=>{filters[b.dataset.clear]='';renderFilters();updateMatch();}); updateMatch();
}
function matches(){return places.filter(p=>(!filters.area||p.area===filters.area)&&(!filters.type||p.type===filters.type));}
function updateMatch(){const n=matches().length;$('#matchText').innerHTML=n?`而家有 <strong>${n}</strong> 间啱你心水，等紧你。`:'呢个组合暂时未有，放宽少少条件啦。';}
function choose(){const options=matches();if(!options.length){alert('呢个组合未有收录嘅地方，试下揀少个条件？');return;} const recentIds=logs.slice(0,3).map(l=>l.placeId);const preferred=options.filter(p=>!recentIds.includes(p.id)); selectedResult=(preferred.length?preferred:options)[Math.floor(Math.random()*(preferred.length?preferred:options).length)]; showResult();}
function showResult(){const p=selectedResult;$('#resultArea').textContent=`${p.area} · ${p.location}`;$('#resultName').textContent=p.name;$('#resultMeta').textContent=`${p.type} · ${p.priceRange||'价钱未记低'}`;$('#resultTags').innerHTML=(p.tags||[]).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('');$('#resultNote').textContent=p.note?`“${p.note}”`:'今日就试下佢啦。';$('#resultCard').classList.remove('hidden');$('#resultCard').scrollIntoView({behavior:'smooth',block:'nearest'});}
function go(view){document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id===view));document.querySelectorAll('.nav-link').forEach(x=>x.classList.toggle('active',x.dataset.view===view));window.scrollTo({top:0,behavior:'smooth'});if(view==='history')renderHistory();if(view==='library')renderLibrary();}
function formatDate(d){return new Intl.DateTimeFormat('zh-CN',{month:'long',day:'numeric',weekday:'short'}).format(new Date(d));}
function renderRecent(){const recent=logs.slice(0,3);$('#recentList').innerHTML=recent.length?recent.map(l=>`<article class="recent-item"><p class="recent-date">${formatDate(l.date)}</p><p class="recent-name">${escapeHTML(l.placeName)}</p><p class="recent-meal">${escapeHTML(l.meal||'食咗一餐')}${l.mood?' · '+l.mood:''}</p></article>`).join(''):'<div class="empty">第一餐，几时开张？食完记得返嚟写低佢。</div>';}
function renderHistory(){const days=new Set(logs.map(l=>new Date(l.date).toDateString())).size;const most=logs.length?Object.entries(logs.reduce((a,l)=>(a[l.placeName]=(a[l.placeName]||0)+1,a),{})).sort((a,b)=>b[1]-a[1])[0][0]:'未有';$('#historySummary').innerHTML=[[''+logs.length,'餐已经记低'],[''+days,'日有开餐簿'],[most,'最常出现']].map(x=>`<div class="summary-card"><strong>${escapeHTML(x[0])}</strong><span>${x[1]}</span></div>`).join('');$('#timeline').innerHTML=logs.length?logs.map(l=>`<article class="timeline-item"><div class="timeline-date">${formatDate(l.date)} · ${l.mood||'唔错'}</div><h3 class="timeline-name">${escapeHTML(l.placeName)}</h3><p class="timeline-detail">${escapeHTML(l.meal||'未写食咗咩')}${l.price?' · ¥'+l.price:''}</p>${l.note?`<p class="timeline-note">“${escapeHTML(l.note)}”</p>`:''}</article>`).join(''):'<div class="empty">你嘅开餐簿仲系空白，食完第一餐就过嚟记低啦。</div>';}
function renderLibrary(){const q=$('#searchPlaces').value.trim().toLowerCase(), a=$('#libraryArea').value;const list=places.filter(p=>(!a||p.area===a)&&(!q||`${p.name}${p.area}${p.type}${p.tags.join('')}`.toLowerCase().includes(q)));$('#placeCount').textContent=`共 ${list.length} 间`;$('#placeGrid').innerHTML=list.length?list.map(p=>`<article class="place-card"><span class="place-area">${escapeHTML(p.area)}</span><h3>${escapeHTML(p.name)}</h3><p class="place-location">${escapeHTML(p.location)} · ${escapeHTML(p.priceRange||'价钱未记低')}</p><p class="place-note">${escapeHTML(p.note||'未写备注')}</p><div class="place-footer"><span class="place-type">${escapeHTML(p.type)}</span><button class="edit-place" data-id="${p.id}">编辑 ↗</button></div></article>`).join(''):'<div class="empty">未搵到，试下换个关键词。</div>';document.querySelectorAll('.edit-place').forEach(b=>b.onclick=()=>openPlace(places.find(p=>p.id===b.dataset.id)));}
function options(values,selected=''){return values.map(v=>`<option value="${v}" ${v===selected?'selected':''}>${v}</option>`).join('');}
function openRecord(placeId=''){$('#recordPlace').innerHTML=places.map(p=>`<option value="${p.id}" ${p.id===placeId?'selected':''}>${p.name} · ${p.area}</option>`).join('');$('#recordForm').reset();if(placeId)$('#recordPlace').value=placeId;setMood('正');$('#recordDialog').showModal();}
function setMood(m){document.querySelectorAll('.mood-choice').forEach(b=>b.classList.toggle('selected',b.dataset.mood===m));$('#recordForm [name=mood]').value=m;}
function openPlace(p){$('#placeDialogTitle').textContent=p?'编辑呢间':'加一间新嘢';$('#placeArea').innerHTML=options(AREAS,p?.area);$('#placeType').innerHTML=options(TYPES,p?.type);const f=$('#placeForm');f.reset();if(p){Object.entries(p).forEach(([k,v])=>{if(f.elements[k])f.elements[k].value=Array.isArray(v)?v.join(','):v;});}$('#placeDialog').showModal();}
$('#decideButton').onclick=choose;$('#redrawButton').onclick=choose;$('#eatThisButton').onclick=()=>openRecord(selectedResult?.id);$('#quickRecord').onclick=()=>openRecord();$('#historyRecord').onclick=()=>openRecord();$('#addPlace').onclick=()=>openPlace();document.querySelectorAll('[data-view]').forEach(a=>a.onclick=e=>{e.preventDefault();go(a.dataset.view);});document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
document.querySelectorAll('.mood-choice').forEach(b=>b.onclick=()=>setMood(b.dataset.mood));
$('#recordForm').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget),p=places.find(x=>x.id===d.get('placeId'));logs.unshift({id:crypto.randomUUID(),date:new Date().toISOString(),placeId:p.id,placeName:p.name,meal:d.get('meal'),price:d.get('price'),mood:d.get('mood'),note:d.get('note')});save();$('#recordDialog').close();renderRecent();renderHistory();});
$('#placeForm').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget),id=d.get('id')||crypto.randomUUID();const p={id,name:d.get('name').trim(),area:d.get('area'),type:d.get('type'),location:d.get('location').trim(),priceRange:d.get('priceRange').trim(),tags:d.get('tags').split(/[,，]/).map(x=>x.trim()).filter(Boolean),note:d.get('note').trim()};const i=places.findIndex(x=>x.id===id);i>=0?places[i]=p:places.unshift(p);save();$('#placeDialog').close();renderFilters();renderLibrary();});
$('#searchPlaces').oninput=renderLibrary;$('#libraryArea').onchange=renderLibrary;$('#libraryArea').innerHTML='<option value="">全部区域</option>'+options(AREAS);renderFilters();renderRecent();
