'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Bell, Check, ChevronDown, ChevronRight, CircleHelp, Coffee, Home, Leaf, MoreHorizontal, PackageOpen, Plus, ReceiptText, ScanLine, Settings2, ShoppingBag, Sparkles, Trash2, Upload, X } from 'lucide-react';

type Item = { name: string; emoji: string; amount: string; remaining: string; due: string; confidence: number; cadence: string; status: 'Soon' | 'This week' | 'Later'; selected: boolean };

const starterItems: Item[] = [
  { name: 'Whole milk', emoji: '🥛', amount: '1 carton', remaining: 'About 1/4 left', due: 'Tuesday', confidence: 96, cadence: 'Usually every 6 days', status: 'Soon', selected: true },
  { name: 'Eggs', emoji: '🥚', amount: '6 pack', remaining: 'About 4 left', due: 'Thursday', confidence: 91, cadence: 'Usually every 9 days', status: 'This week', selected: true },
  { name: 'Sourdough', emoji: '🍞', amount: '1 loaf', remaining: 'About 1/3 left', due: 'Wednesday', confidence: 89, cadence: 'Usually every 5 days', status: 'Soon', selected: true },
  { name: 'Coffee beans', emoji: '☕', amount: '340 g bag', remaining: 'About 1/3 left', due: 'Jul 24', confidence: 82, cadence: 'Usually every 18 days', status: 'Later', selected: true },
  { name: 'Olive oil', emoji: '🫒', amount: '500 ml', remaining: 'About half left', due: 'Jul 30', confidence: 64, cadence: 'Still learning your rhythm', status: 'Later', selected: false },
];

interface PurchaseItem {
  name: string;
  emoji: string;
  qty: number;
  price: string;
}

interface Purchase {
  date: string;
  store: string;
  itemCount: string;
  total: string;
  items: PurchaseItem[];
}

const mockPurchases: Purchase[] = [
  {
    date: 'Jul 11',
    store: 'REWE',
    itemCount: '18 items',
    total: '€64.20',
    items: [
      { name: 'Whole milk', emoji: '🥛', qty: 2, price: '€1.19' },
      { name: 'Eggs 6-pack', emoji: '🥚', qty: 1, price: '€1.99' },
      { name: 'Sourdough', emoji: '🍞', qty: 1, price: '€3.49' },
      { name: 'Coffee beans', emoji: '☕', qty: 1, price: '€8.99' },
      { name: 'Organic Bananas', emoji: '🍌', qty: 1, price: '€2.29' },
      { name: 'Avocados 2-pack', emoji: '🥑', qty: 1, price: '€2.49' },
      { name: 'Greek Yogurt 500g', emoji: '🥛', qty: 1, price: '€1.99' },
      { name: 'Spinach 250g', emoji: '🥬', qty: 1, price: '€1.49' },
      { name: 'Blueberries 125g', emoji: '🫐', qty: 1, price: '€2.29' },
      { name: 'Salmon Fillet', emoji: '🐟', qty: 1, price: '€12.99' },
      { name: 'Sparkling Water 6x1L', emoji: '💧', qty: 1, price: '€4.79' },
      { name: 'Butter', emoji: '🧈', qty: 1, price: '€2.19' },
      { name: 'Tomatoes 500g', emoji: '🍅', qty: 1, price: '€1.89' },
      { name: 'Pasta 500g', emoji: '🍝', qty: 1, price: '€1.29' },
      { name: 'Pesto Rosso', emoji: '🫙', qty: 1, price: '€2.49' },
      { name: 'Dark Chocolate', emoji: '🍫', qty: 1, price: '€1.49' },
      { name: 'Toilet paper', emoji: '🧻', qty: 1, price: '€3.99' },
      { name: 'Olive oil', emoji: '🫒', qty: 1, price: '€9.99' },
    ]
  },
  {
    date: 'Jul 4',
    store: 'REWE',
    itemCount: '14 items',
    total: '€52.80',
    items: [
      { name: 'Whole milk', emoji: '🥛', qty: 1, price: '€1.19' },
      { name: 'Eggs 6-pack', emoji: '🥚', qty: 1, price: '€1.99' },
      { name: 'Sourdough', emoji: '🍞', qty: 1, price: '€3.49' },
      { name: 'Apples 1kg', emoji: '🍎', qty: 1, price: '€2.99' },
      { name: 'Chicken Breast 400g', emoji: '🍗', qty: 1, price: '€5.99' },
      { name: 'Basmati Rice 1kg', emoji: '🌾', qty: 1, price: '€2.49' },
      { name: 'Broccoli', emoji: '🥦', qty: 1, price: '€1.29' },
      { name: 'Cheddar Cheese 200g', emoji: '🧀', qty: 1, price: '€2.89' },
      { name: 'Tortilla Chips', emoji: '🌽', qty: 1, price: '€1.79' },
      { name: 'Salsa Dip', emoji: '🫙', qty: 1, price: '€1.99' },
      { name: 'Oat Milk 1L', emoji: '🥛', qty: 2, price: '€1.99' },
      { name: 'Orange Juice 1L', emoji: '🍊', qty: 2, price: '€2.49' },
    ]
  },
  {
    date: 'Jun 27',
    store: 'EDEKA',
    itemCount: '21 items',
    total: '€71.45',
    items: [
      { name: 'Olive oil', emoji: '🫒', qty: 1, price: '€8.99' },
      { name: 'Coffee beans', emoji: '☕', qty: 1, price: '€8.99' },
      { name: 'Sourdough', emoji: '🍞', qty: 1, price: '€3.49' },
      { name: 'Whole milk', emoji: '🥛', qty: 3, price: '€1.19' },
      { name: 'Eggs 6-pack', emoji: '🥚', qty: 2, price: '€1.99' },
      { name: 'Butter', emoji: '🧈', qty: 1, price: '€2.19' },
      { name: 'Organic Lemons', emoji: '🍋', qty: 1, price: '€1.79' },
      { name: 'Avocados 2-pack', emoji: '🥑', qty: 2, price: '€2.49' },
      { name: 'Spaghetti 500g', emoji: '🍝', qty: 3, price: '€1.29' },
      { name: 'Tomato Passata', emoji: '🍅', qty: 3, price: '€0.99' },
      { name: 'Garlic bulbs', emoji: '🧄', qty: 1, price: '€1.29' },
      { name: 'Parmesan Cheese', emoji: '🧀', qty: 1, price: '€3.49' },
      { name: 'Sea Salt', emoji: '🧂', qty: 1, price: '€1.99' },
      { name: 'Toilet paper', emoji: '🧻', qty: 1, price: '€3.99' },
      { name: 'Paper towels', emoji: '🧻', qty: 1, price: '€2.99' },
    ]
  }
];

export default function HomePage() {
  const [items, setItems] = useState(starterItems);
  const [tab, setTab] = useState<'home' | 'inventory' | 'history' | 'household'>('home');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [detail, setDetail] = useState<Item | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [toast, setToast] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [household, setHousehold] = useState({ adults: '2', children: '0', pets: '1', cadence: 'Weekly', day: 'Friday', cooking: 'Most nights', preferences: 'Vegetarian-friendly' });
  const selected = useMemo(() => items.filter(i => i.selected), [items]);

  const toggle = (name: string) => setItems(previous => previous.map(i => i.name === name ? { ...i, selected: !i.selected } : i));
  const removeItem = (name: string) => setItems(previous => previous.filter(i => i.name !== name));

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const nav = (target: 'home' | 'inventory' | 'history' | 'household') => setTab(target);

  const openUpload = () => {
    setUploaded(false);
    setUploadOpen(true);
  };

  return <main className="min-h-screen bg-[#f7f8f4] text-[#17261f]">
    <header className="sticky top-0 z-20 border-b border-[#e5e9df] bg-[#f7f8f4]/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 relative">
        <button id="logo-btn" onClick={() => nav('home')} className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1d5b45] text-lg text-white">m</span><span className="text-lg font-semibold tracking-tight">milo</span></button>
        <div className="flex items-center gap-3">
          <button
            id="notif-btn"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setUnread(false);
            }}
            className="relative rounded-full p-2 hover:bg-[#edf0eb] transition duration-200 text-[#17261f]"
          >
            <Bell size={19}/>
            {unread && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#e7794b]"/>}
          </button>
          <button id="profile-btn" className="flex items-center gap-2 rounded-full border border-[#dce3d8] bg-white py-1.5 pl-2 pr-3 text-sm font-medium"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#dceedd] text-xs">MU</span>Melissa<ChevronDown size={15}/></button>
        </div>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-5 top-[68px] z-40 w-72 sm:w-80 rounded-2xl border border-[#e2e7de] bg-white p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#edf0eb]">
                <h3 className="font-bold text-sm">Notifications</h3>
                <button onClick={() => setUnread(false)} className="text-xs font-semibold text-[#28704c] hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="mt-2 divide-y divide-[#f4f6f2] max-h-60 overflow-y-auto">
                <div className="py-2.5 flex items-start gap-2.5 text-xs text-left">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#eef5eb] text-[#28704c] mt-0.5">🥛</span>
                  <div>
                    <p className="font-semibold text-[#17261f]">Whole milk is running low</p>
                    <p className="mt-0.5 text-[#718077]">Milo predicted you have 1/4 left. Added to Friday list.</p>
                    <span className="mt-1 block text-[10px] text-[#a0aaa2]">1 hour ago</span>
                  </div>
                </div>
                <div className="py-2.5 flex items-start gap-2.5 text-xs text-left">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#fff1dc] text-[#9a6419] mt-0.5">✨</span>
                  <div>
                    <p className="font-semibold text-[#17261f]">New pattern recognized</p>
                    <p className="mt-0.5 text-[#718077]">Sourdough usage has increased from every 7 days to every 5 days.</p>
                    <span className="mt-1 block text-[10px] text-[#a0aaa2]">Yesterday</span>
                  </div>
                </div>
                <div className="py-2.5 flex items-start gap-2.5 text-xs text-left">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#eef5eb] text-[#28704c] mt-0.5">📋</span>
                  <div>
                    <p className="font-semibold text-[#17261f]">Shopping list ready</p>
                    <p className="mt-0.5 text-[#718077]">Milo prepared recommendations for your upcoming shop.</p>
                    <span className="mt-1 block text-[10px] text-[#a0aaa2]">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>

    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-7 md:grid-cols-[176px_1fr]">
      <aside className="hidden md:block"><nav className="space-y-1 text-sm font-medium text-[#617067]">
        <NavButton id="nav-home" icon={<Home size={18}/>} label="Home" active={tab === 'home'} onClick={() => nav('home')}/>
        <NavButton id="nav-pantry" icon={<PackageOpen size={18}/>} label="My pantry" active={tab === 'inventory'} onClick={() => nav('inventory')}/>
        <NavButton id="nav-history" icon={<ReceiptText size={18}/>} label="Shopping history" active={tab === 'history'} onClick={() => nav('history')}/>
        <NavButton id="nav-household" icon={<Settings2 size={18}/>} label="Household" active={tab === 'household'} onClick={() => nav('household')}/>
      </nav><div className="mt-10 rounded-2xl bg-[#e7f2e7] p-4"><Sparkles size={18} className="text-[#317051]"/><p className="mt-2 text-sm font-semibold">Milo is learning</p><p className="mt-1 text-xs leading-5 text-[#5c7162]">You&apos;ve helped improve 14 predictions this month.</p></div></aside>

      <section className="min-w-0 pb-20">
        {tab === 'home' && <HomeView selected={selected} items={items} onToggle={toggle} onDetail={setDetail} onUpload={openUpload} onList={() => notify(`${selected.length} items are ready for your shopping list.`)} />}
        {tab === 'inventory' && <InventoryView items={items} onDetail={setDetail} onUpload={openUpload} />}
        {tab === 'history' && <HistoryView onUpload={openUpload} onPurchaseClick={setSelectedPurchase} />}
        {tab === 'household' && <HouseholdView household={household} onChange={(field, value) => setHousehold(current => ({ ...current, [field]: value }))} onSave={() => notify('Household settings saved. Milo will use these for future predictions.')} />}
      </section>
    </div>

    <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t border-[#e5e9df] bg-white px-5 py-2 md:hidden"><MobileNav id="m-nav-home" icon={<Home size={19}/>} label="Home" active={tab === 'home'} onClick={() => nav('home')}/><MobileNav id="m-nav-pantry" icon={<PackageOpen size={19}/>} label="Pantry" active={tab === 'inventory'} onClick={() => nav('inventory')}/><button id="m-add-receipt" onClick={openUpload} className="-mt-6 grid h-13 w-13 place-items-center rounded-full bg-[#1d5b45] text-white shadow-lg"><Plus size={23}/></button><MobileNav id="m-nav-history" icon={<ReceiptText size={19}/>} label="History" active={tab === 'history'} onClick={() => nav('history')}/><MobileNav id="m-nav-profile" icon={<Settings2 size={19}/>} label="Profile" active={tab === 'household'} onClick={() => nav('household')}/></nav>
    {uploadOpen && <UploadModal
      uploaded={uploaded}
      onClose={() => { setUploadOpen(false); setUploaded(false); }}
      onUpload={() => { setUploaded(true); window.setTimeout(() => { setUploadOpen(false); setUploaded(false); notify('7 items added to your household intelligence.'); }, 1200); }}
      onAddManualItem={(item) => {
        setItems(prev => [item, ...prev]);
        setUploadOpen(false);
        notify(`Manually added ${item.name} to pantry.`);
      }}
    />}
    {detail && <DetailModal item={detail} onClose={() => setDetail(null)} onRemove={() => { removeItem(detail.name); setDetail(null); notify(`Milo will learn from removing ${detail.name}.`); }} />}
    {selectedPurchase && <PurchaseDetailModal purchase={selectedPurchase} onClose={() => setSelectedPurchase(null)} />}
    {toast && <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#17261f] px-5 py-3 text-sm text-white shadow-xl">{toast}</div>}
  </main>;
}

function HomeView({ selected, items, onToggle, onDetail, onUpload, onList }: { selected: Item[]; items: Item[]; onToggle: (n:string)=>void; onDetail:(i:Item)=>void; onUpload:()=>void; onList:()=>void }) { return <>
  <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-medium text-[#5e7166]">Thursday, July 16</p><h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-[34px]">Good morning, Melissa.</h1></div><button id="add-receipt-btn" onClick={onUpload} className="inline-flex items-center gap-2 rounded-full border border-[#d5e1d5] bg-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-[#f2f7f0]"><Upload size={16}/>Add a receipt</button></div>
  <div className="mt-7 overflow-hidden rounded-3xl bg-[#1d5b45] p-6 text-white shadow-sm md:p-8"><div className="flex items-start justify-between"><div><span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-[#d4ead7]"><Sparkles size={13}/>Your next shop</span><h2 className="mt-4 max-w-xl text-2xl font-medium leading-tight md:text-3xl">You&apos;ll likely do groceries tomorrow.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#d7e8dc]">Based on your recent rhythm, a Friday shop is 86% likely. I&apos;ve prepared what will keep your household covered for the week ahead.</p></div><span className="hidden text-5xl md:block">🛍️</span></div><div className="mt-6 flex flex-wrap gap-3"><button id="view-list-btn" onClick={onList} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#19523f]">View shopping list <ArrowRight size={16}/></button><button id="update-bought-btn" onClick={onUpload} className="rounded-full border border-white/25 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">Update what I bought</button></div></div>
  <div className="mt-8 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-[#6c7d72]">Recommended for tomorrow</p><h2 className="mt-1 text-xl font-semibold">A little less to remember</h2></div><button id="items-selected-badge" onClick={() => onList()} className="hidden text-sm font-semibold text-[#2b6b50] sm:block">{selected.length} items selected</button></div>
  <div className="mt-4 space-y-3">{items.map(item => <Recommendation key={item.name} item={item} onToggle={onToggle} onDetail={onDetail}/>)}</div>
  <div className="mt-7 rounded-2xl border border-[#e2e7de] bg-white p-5"><div className="flex gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eef5eb] text-[#2c714e]"><CircleHelp size={18}/></div><div><h3 className="font-semibold">Why these recommendations?</h3><p className="mt-1 text-sm leading-6 text-[#67786e]">Milo combines your past purchases, estimated remaining supply, and your usual 7-day shopping rhythm. Tap any item to see the reasoning—and tell us when we&apos;re wrong.</p></div></div></div>
</> }

function Recommendation({ item, onToggle, onDetail }: { item:Item; onToggle:(n:string)=>void; onDetail:(i:Item)=>void }) { const color = item.confidence > 85 ? 'bg-[#e5f2e6] text-[#28704c]' : item.confidence > 70 ? 'bg-[#fff1dc] text-[#9a6419]' : 'bg-[#f0f1ee] text-[#6c736d]'; return <article className="group flex items-center gap-3 rounded-2xl border border-[#e2e7de] bg-white p-4 transition hover:border-[#bdceb9]"><button aria-label={`Toggle ${item.name}`} onClick={() => onToggle(item.name)} className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${item.selected ? 'border-[#28704c] bg-[#28704c] text-white' : 'border-[#bdc8be] text-transparent'}`}><Check size={15}/></button><button id={`rec-detail-${item.name.replace(/\s+/g, '-').toLowerCase()}`} onClick={() => onDetail(item)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f3f5f0] text-xl">{item.emoji}</span><span className="min-w-0"><span className="block font-semibold">{item.name}</span><span className="mt-0.5 block truncate text-sm text-[#728077]">{item.remaining} · likely out {item.due}</span></span></button><div className="hidden text-right sm:block"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{item.confidence}% sure</span><span className="mt-1.5 block text-xs text-[#78857d]">{item.cadence}</span></div><ChevronRight size={19} className="text-[#9aaba0]"/></article> }

function InventoryView({items,onDetail,onUpload}:{items:Item[];onDetail:(i:Item)=>void;onUpload:()=>void}) { return <><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-[#5e7166]">Your living inventory</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">My pantry</h1><p className="mt-2 text-sm text-[#708076]">A practical picture—not a perfect count.</p></div><button id="add-inventory-btn" onClick={onUpload} className="rounded-full bg-[#1d5b45] p-3 text-white"><Plus size={18}/></button></div><div className="mt-7 grid gap-3 sm:grid-cols-2">{items.map(i => <button id={`pantry-item-${i.name.replace(/\s+/g, '-').toLowerCase()}`} key={i.name} onClick={() => onDetail(i)} className="rounded-2xl border border-[#e2e7de] bg-white p-5 text-left hover:border-[#bdceb9]"><div className="flex items-start justify-between"><span className="text-3xl">{i.emoji}</span><span className="rounded-full bg-[#f2f4f0] px-2.5 py-1 text-xs font-medium text-[#637168]">{i.amount}</span></div><p className="mt-5 font-semibold">{i.name}</p><p className="mt-1 text-sm text-[#718076]">{i.remaining}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#edf0eb]"><div className="h-full rounded-full bg-[#6ca976]" style={{width: `${Math.max(18, 100 - i.confidence)}%`}}/></div></button>)}</div></> }

function HouseholdView({ household, onChange, onSave }: { household: { adults: string; children: string; pets: string; cadence: string; day: string; cooking: string; preferences: string }; onChange: (field: keyof { adults: string; children: string; pets: string; cadence: string; day: string; cooking: string; preferences: string }, value: string) => void; onSave: () => void }) { return <><div><p className="text-sm font-medium text-[#5e7166]">The context behind your predictions</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Your household</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#708076]">Milo uses these details to make a stronger starting estimate, then learns from what you actually buy.</p></div><div className="mt-7 space-y-5"><section className="rounded-2xl border border-[#e2e7de] bg-white p-5"><h2 className="font-semibold">Who&apos;s at home?</h2><div className="mt-4 grid grid-cols-3 gap-3"><SettingField label="Adults" value={household.adults} onChange={v => onChange('adults', v)} /><SettingField label="Children" value={household.children} onChange={v => onChange('children', v)} /><SettingField label="Pets" value={household.pets} onChange={v => onChange('pets', v)} /></div></section><section className="rounded-2xl border border-[#e2e7de] bg-white p-5"><h2 className="font-semibold">Shopping rhythm</h2><p className="mt-1 text-sm text-[#718077]">This helps Milo get started. Your actual behavior will take over.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><SelectField label="Usual frequency" value={household.cadence} options={['Weekly', 'Every 10 days', 'Every two weeks', 'It varies']} onChange={v => onChange('cadence', v)} /><SelectField label="Usual shopping day" value={household.day} options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'No usual day']} onChange={v => onChange('day', v)} /></div></section><section className="rounded-2xl border border-[#e2e7de] bg-white p-5"><h2 className="font-semibold">Everyday habits</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><SelectField label="Cooking at home" value={household.cooking} options={['Most nights', 'A few nights a week', 'Rarely']} onChange={v => onChange('cooking', v)} /><SelectField label="Food preferences" value={household.preferences} options={['Vegetarian-friendly', 'No preferences', 'Vegan', 'Gluten-free', 'Family-friendly']} onChange={v => onChange('preferences', v)} /></div></section></div><button id="save-household-btn" onClick={onSave} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1d5b45] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#174a38]"><Check size={16}/>Save household settings</button></> }

function SettingField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block text-sm font-medium text-[#596b60]">{label}<input aria-label={label} inputMode="numeric" value={value} onChange={event => onChange(event.target.value.replace(/[^0-9]/g, ''))} className="mt-2 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-3 py-2.5 text-base font-semibold text-[#17261f] outline-none focus:border-[#4b8460]" /></label> }
function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="block text-sm font-medium text-[#596b60]">{label}<select aria-label={label} value={value} onChange={event => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-3 py-2.5 text-sm font-medium text-[#17261f] outline-none focus:border-[#4b8460]">{options.map(option => <option key={option}>{option}</option>)}</select></label> }

function HistoryView({onUpload, onPurchaseClick}:{onUpload:()=>void; onPurchaseClick:(p:Purchase)=>void}) {
  return <><p className="text-sm font-medium text-[#5e7166]">What Milo has learned from</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Shopping history</h1><div className="mt-7 overflow-hidden rounded-2xl border border-[#e2e7de] bg-white">{mockPurchases.map((p,i) => <button id={`purchase-item-${i}`} onClick={() => onPurchaseClick(p)} key={p.date} className="flex w-full items-center text-left gap-4 border-b border-[#edf0eb] p-5 last:border-0 hover:bg-[#fbfdfa] active:bg-[#f4f7f2] transition duration-150 outline-none"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef5eb] text-[#28704c]"><ShoppingBag size={18}/></span><div className="flex-1"><p className="font-semibold">{p.store}</p><p className="text-sm text-[#738077]">{p.date} · {p.itemCount}</p></div><span className="text-sm font-medium">{p.total}</span><ChevronRight size={18} className="text-[#9aa79f]"/></button>)}</div><button id="scan-receipt-btn" onClick={onUpload} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#b9cbb9] bg-[#fbfdf9] p-7 text-sm font-semibold text-[#347054]"><ScanLine size={19}/>Scan another receipt</button></>
}

function UploadModal({uploaded,onClose,onUpload,onAddManualItem}:{uploaded:boolean;onClose:()=>void;onUpload:()=>void;onAddManualItem:(item:Item)=>void}) {
  const [isManual, setIsManual] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🍎');
  const [amount, setAmount] = useState('1 pack');
  const [remaining, setRemaining] = useState('About half left');
  const [due, setDue] = useState('Friday');
  const [cadence, setCadence] = useState('Usually every 7 days');

  const commonEmojis = ['🍎', '🥛', '🥚', '🍞', '☕', '🫒', '🍌', '🧀', '🍗', '🥦', '🥫', '🧻'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      window.setTimeout(() => {
        setIsUploading(false);
        onUpload();
      }, 1500);
    }
  };

  const triggerFilePicker = () => {
    document.getElementById('receipt-file-picker')?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const status = due === 'Friday' || due === 'Saturday' ? 'Soon' : 'This week';

    const newItem: Item = {
      name: name.trim(),
      emoji,
      amount,
      remaining,
      due,
      confidence: 100,
      cadence,
      status,
      selected: true
    };
    onAddManualItem(newItem);
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-end bg-[#10231a]/35 p-0 sm:place-items-center sm:p-5">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.12em] text-[#6c7e72]">Teach Milo</p>
            <h2 className="mt-1 text-xl font-semibold">
              {isManual ? 'Add product manually' : isUploading ? 'Scanning receipt...' : 'Add what you bought'}
            </h2>
          </div>
          <button id="close-upload-modal" onClick={onClose} className="rounded-full p-2 hover:bg-[#f4f6f2] transition duration-200">
            <X size={19}/>
          </button>
        </div>

        {isManual ? (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="manual-name" className="block text-sm font-semibold text-[#596b60]">Product Name</label>
              <input
                id="manual-name"
                type="text"
                required
                placeholder="e.g. Greek Yogurt, Avocados"
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-3.5 py-2.5 text-sm font-medium text-[#17261f] outline-none focus:border-[#4b8460] transition duration-150"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#596b60]">Select Icon / Emoji</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {commonEmojis.map(em => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmoji(em)}
                    className={`grid h-10 w-10 place-items-center text-xl rounded-lg border transition duration-150 ${emoji === em ? 'border-[#28704c] bg-[#eef5eb] scale-110' : 'border-[#e2e7de] bg-[#fbfdf9] hover:bg-[#f2f5f0]'}`}
                  >
                    {em}
                  </button>
                ))}
              </div>
              <input
                id="manual-custom-emoji"
                type="text"
                maxLength={2}
                placeholder="Or type custom emoji..."
                value={emoji}
                onChange={e => setEmoji(e.target.value)}
                className="mt-2 w-full max-w-[200px] text-center rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-2 py-1.5 text-sm outline-none focus:border-[#4b8460] transition duration-150"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="manual-amount" className="block text-sm font-semibold text-[#596b60]">Pack Size / Qty</label>
                <input
                  id="manual-amount"
                  type="text"
                  required
                  placeholder="e.g. 500g, 6-pack"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-3.5 py-2.5 text-sm font-medium text-[#17261f] outline-none focus:border-[#4b8460] transition duration-150"
                />
              </div>
              <div>
                <label htmlFor="manual-remaining" className="block text-sm font-semibold text-[#596b60]">Current Stock</label>
                <select
                  id="manual-remaining"
                  value={remaining}
                  onChange={e => setRemaining(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-3.5 py-2.5 text-sm font-medium text-[#17261f] outline-none focus:border-[#4b8460] transition duration-150"
                >
                  <option>Full</option>
                  <option>About half left</option>
                  <option>About 1/4 left</option>
                  <option>Empty</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="manual-due" className="block text-sm font-semibold text-[#596b60]">Next Due Day</label>
                <select
                  id="manual-due"
                  value={due}
                  onChange={e => setDue(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-3.5 py-2.5 text-sm font-medium text-[#17261f] outline-none focus:border-[#4b8460] transition duration-150"
                >
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                  <option>Sunday</option>
                </select>
              </div>
              <div>
                <label htmlFor="manual-cadence" className="block text-sm font-semibold text-[#596b60]">How often?</label>
                <select
                  id="manual-cadence"
                  value={cadence}
                  onChange={e => setCadence(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#dce5da] bg-[#fbfdf9] px-3.5 py-2.5 text-sm font-medium text-[#17261f] outline-none focus:border-[#4b8460] transition duration-150"
                >
                  <option>Usually every 3 days</option>
                  <option>Usually every 5 days</option>
                  <option>Usually every 7 days</option>
                  <option>Usually every 10 days</option>
                  <option>Usually every 14 days</option>
                  <option>Usually every 30 days</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <button
                id="cancel-manual-btn"
                type="button"
                onClick={() => setIsManual(false)}
                className="flex-1 rounded-xl border border-[#dce5da] py-3 text-sm font-semibold text-[#596b60] hover:bg-[#f4f6f2] transition duration-150"
              >
                Back
              </button>
              <button
                id="submit-manual-btn"
                type="submit"
                className="flex-1 rounded-xl bg-[#1d5b45] py-3 text-sm font-semibold text-white hover:bg-[#174a38] transition duration-150"
              >
                Add Item
              </button>
            </div>
          </form>
        ) : isUploading ? (
          <div className="py-12 text-center flex flex-col items-center">
            <span className="relative flex h-12 w-12">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2c714e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-12 w-12 bg-[#1d5b45] items-center justify-center text-white">
                <ReceiptText size={20} className="animate-bounce" />
              </span>
            </span>
            <h3 className="mt-6 text-lg font-semibold text-[#17261f]">Analyzing receipt...</h3>
            <p className="mt-2 text-sm text-[#718077]">Milo is identifying products and stock quantities.</p>
          </div>
        ) : (
          <>
            {uploaded ? (
              <div className="py-12 text-center">
                <span className="text-5xl">✨</span>
                <h3 className="mt-4 text-lg font-semibold">Receipt understood</h3>
                <p className="mt-2 text-sm text-[#6c7a72]">I found 7 products and updated your predictions.</p>
                <button
                  id="done-upload-btn"
                  onClick={onClose}
                  className="mt-6 w-full rounded-xl bg-[#1d5b45] py-3 text-sm font-semibold text-white hover:bg-[#174a38] transition duration-150 outline-none"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="receipt-file-picker"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  id="upload-receipt-modal-btn"
                  onClick={triggerFilePicker}
                  className="mt-6 grid w-full place-items-center rounded-2xl border-2 border-dashed border-[#bcd0bd] bg-[#f7fbf5] p-9 text-center hover:bg-[#f1f8ee] transition duration-150 outline-none"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#2f6e4d] shadow-sm">
                    <ReceiptText size={22}/>
                  </span>
                  <span className="mt-3 font-semibold text-base text-[#17261f]">Upload a receipt or bag photo</span>
                  <span className="mt-1 text-sm text-[#718077]">Milo will identify products and quantities</span>
                </button>
                <div className="my-5 flex items-center gap-3 text-xs text-[#a0aaa2] font-semibold">
                  <span className="h-px flex-1 bg-[#e7ebe5]"/>
                  OR
                  <span className="h-px flex-1 bg-[#e7ebe5]"/>
                </div>
                <button
                  id="add-manually-modal-btn"
                  onClick={() => setIsManual(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce5da] py-3 text-sm font-semibold text-[#1d5b45] hover:bg-[#f4f6f2] transition duration-150 outline-none"
                >
                  <Plus size={16}/>
                  Add products manually
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DetailModal({item,onClose,onRemove}:{item:Item;onClose:()=>void;onRemove:()=>void}) { return <div className="fixed inset-0 z-40 grid place-items-end bg-[#10231a]/35 sm:place-items-center"><div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"><div className="flex justify-between"><span className="text-4xl">{item.emoji}</span><button id="close-detail-modal" onClick={onClose} className="rounded-full p-2 hover:bg-[#f4f6f2]"><X size={19}/></button></div><h2 className="mt-4 text-2xl font-semibold">{item.name}</h2><p className="mt-1 text-sm text-[#718077]">Milo is {item.confidence}% confident in this prediction.</p><div className="mt-6 rounded-2xl bg-[#eff6ec] p-4"><div className="flex items-center gap-2 text-sm font-semibold text-[#28704c]"><Sparkles size={16}/>Why this is on your list</div><p className="mt-2 text-sm leading-6 text-[#52705c]">Your household typically uses {item.name.toLowerCase()} {item.cadence.replace('Usually ', '').toLowerCase()}. You last bought it 4 days ago and have {item.remaining.toLowerCase()}. At your next likely shop tomorrow, you&apos;ll be close to running out by {item.due}.</p></div><button id={`remove-item-btn-${item.name.replace(/\s+/g, '-').toLowerCase()}`} onClick={onRemove} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-[#9d4a3d] hover:bg-[#fdf1ef] transition duration-150"><Trash2 size={16}/>I don&apos;t need this</button></div></div> }

function PurchaseDetailModal({ purchase, onClose }: { purchase: Purchase; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-end bg-[#10231a]/35 p-0 sm:place-items-center sm:p-5">
      <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl animate-in fade-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between pb-4 border-b border-[#edf0eb]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eef5eb] text-[#28704c]">
                <ShoppingBag size={16} />
              </span>
              <h2 className="text-xl font-bold tracking-tight">{purchase.store}</h2>
            </div>
            <p className="mt-1 text-xs text-[#718077]">{purchase.date} • {purchase.itemCount}</p>
          </div>
          <button id="close-purchase-modal" onClick={onClose} className="rounded-full p-2 hover:bg-[#f4f6f2] transition duration-200" aria-label="Close modal">
            <X size={19} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-2.5 max-h-[40vh] pr-1">
          {purchase.items.map((item, idx) => (
            <div id={`purchase-detail-item-${idx}`} key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#f7f8f5] hover:bg-[#f1f3ee] transition duration-150">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="font-semibold text-sm text-[#17261f]">{item.name}</p>
                  <p className="text-xs text-[#718077]">Qty: {item.qty} • {item.price}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[#17261f]">
                €{(parseFloat(item.price.replace('€', '')) * item.qty).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#edf0eb]">
          <div className="flex justify-between items-center text-sm font-medium text-[#5c6b60]">
            <span>Payment Method</span>
            <span>Visa •••• 4820</span>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-[#e2e7de]">
            <span className="text-base font-semibold text-[#17261f]">Total Paid</span>
            <span className="text-2xl font-bold text-[#1d5b45]">{purchase.total}</span>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#eff6ec] p-3 text-xs text-[#28704c] font-medium">
            <Sparkles size={14} className="shrink-0" />
            <span>Milo successfully learned your consumption rate from this receipt.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavButton({icon,label,active,onClick,id}:{icon:React.ReactNode;label:string;active:boolean;onClick:()=>void;id?:string}) { return <button id={id} onClick={onClick} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${active ? 'bg-[#e7f1e5] text-[#1d5b45]' : 'hover:bg-white hover:text-[#2c4034]'}`}>{icon}{label}</button> }
function MobileNav({icon,label,active,onClick,id}:{icon:React.ReactNode;label:string;active:boolean;onClick:()=>void;id?:string}) { return <button id={id} onClick={onClick} className={`grid justify-items-center gap-0.5 text-[10px] ${active ? 'text-[#1d5b45]' : 'text-[#819087]'}`}>{icon}{label}</button> }
