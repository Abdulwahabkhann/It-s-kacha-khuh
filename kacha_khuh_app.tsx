// @ts-nocheck
import { useState, useEffect, createContext, useContext, useReducer } from "react";
import { ShoppingCart, Home, Search, Heart, Star, Plus, Minus, X, MapPin, ArrowLeft, MessageCircle, ChevronRight, Utensils, Clock, Phone } from "lucide-react";

// ── Brand tokens ──────────────────────────────────────
const BG = '#0F172A', SURFACE = '#1E293B', ORANGE = '#FF6B2C', GREEN = '#22C55E';
const TEXT = '#F8FAFC', MUTED = '#94A3B8', BORDER = 'rgba(148,163,184,0.15)';
const glass = { background: 'rgba(30,41,59,0.78)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${BORDER}` };

// ── Data ──────────────────────────────────────────────
const SHOPS = [
  { id: 'kacha-khuh', name: 'Kacha Khuh', tagline: 'Authentic Desi Flavors', area: 'Gulshan-e-Iqbal', whatsapp: '923001234567', rating: 4.8, reviews: 234, deliveryTime: '25–35 min', banner: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700&q=80', badge: 'Popular' },
  { id: 'bun-kebab', name: 'Bun Kebab Corner', tagline: 'Street Food Done Right', area: 'Saddar, Karachi', whatsapp: '923009876543', rating: 4.5, reviews: 189, deliveryTime: '15–20 min', banner: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80', badge: 'Fast' },
  { id: 'desi-darbar', name: 'Desi Darbar', tagline: 'Home-style Cooking', area: 'North Nazimabad', whatsapp: '923331234567', rating: 4.6, reviews: 312, deliveryTime: '30–45 min', banner: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=700&q=80', badge: 'Top Rated' },
];
const PRODUCTS = {
  'kacha-khuh': [
    { id:'kk1', name:'Chicken Biryani', description:'Fragrant basmati rice with tender chicken', price:350, category:'Biryani' },
    { id:'kk2', name:'Mutton Biryani', description:'Rich slow-cooked mutton biryani', price:550, category:'Biryani' },
    { id:'kk3', name:'Chicken Karahi', description:'Wok-cooked spicy karahi for 2', price:800, category:'Karahi' },
    { id:'kk4', name:'Mutton Karahi', description:'Premium mutton in tomato masala', price:1200, category:'Karahi' },
    { id:'kk5', name:'Seekh Kebab (6 pcs)', description:'Grilled minced meat on skewers', price:420, category:'BBQ' },
    { id:'kk6', name:'Boti BBQ (500g)', description:'Marinated tender boti pieces', price:650, category:'BBQ' },
    { id:'kk7', name:'Rooh Afza Sharbat', description:'Chilled & refreshing', price:80, category:'Drinks' },
    { id:'kk8', name:'Mineral Water', description:'500ml chilled bottle', price:60, category:'Drinks' },
  ],
  'bun-kebab': [
    { id:'bk1', name:'Classic Bun Kebab', description:'Street-style egg & kebab in bun', price:120, category:'Bun Kebab' },
    { id:'bk2', name:'Double Patty Bun Kebab', description:'Extra loaded with chutney', price:180, category:'Bun Kebab' },
    { id:'bk3', name:'Zinger Burger', description:'Crispy fried chicken with mayo', price:350, category:'Burgers' },
    { id:'bk4', name:'Smash Burger', description:'Double smash patty with cheese', price:480, category:'Burgers' },
    { id:'bk5', name:'Chicken Paratha Roll', description:'Strips, veggies, chutney', price:220, category:'Rolls' },
    { id:'bk6', name:'Pepsi 500ml', description:'Ice cold can', price:90, category:'Drinks' },
  ],
  'desi-darbar': [
    { id:'dd1', name:'Daal Mash', description:'Slow-cooked lentils with tarka', price:180, category:'Daal' },
    { id:'dd2', name:'Daal Chawal', description:'Lentils with steamed white rice', price:220, category:'Rice' },
    { id:'dd3', name:'Aloo Gosht', description:'Tender mutton with potatoes', price:420, category:'Sabzi' },
    { id:'dd4', name:'Bhindi Masala', description:'Okra stir-fried in spices', price:200, category:'Sabzi' },
    { id:'dd5', name:'Tandoori Roti (x4)', description:'Fresh baked bread', price:80, category:'Roti' },
    { id:'dd6', name:'Sweet Lassi', description:'Chilled yogurt drink', price:100, category:'Drinks' },
  ],
};
const CATEGORIES = ['All','Biryani','BBQ','Burgers','Bun Kebab','Karahi','Desi'];

// ── Cart ──────────────────────────────────────────────
const CartCtx = createContext(null);
function cartReducer(s, a) {
  switch(a.type) {
    case 'ADD': {
      const ex = s.items.find(i=>i.id===a.item.id);
      if (ex) return { ...s, items: s.items.map(i=>i.id===a.item.id?{...i,qty:i.qty+1}:i) };
      if (s.shopId && s.shopId!==a.shopId) return { shopId:a.shopId, items:[{...a.item,qty:1}] };
      return { shopId:a.shopId, items:[...s.items,{...a.item,qty:1}] };
    }
    case 'INC': return {...s, items:s.items.map(i=>i.id===a.id?{...i,qty:i.qty+1}:i)};
    case 'DEC': return {...s, items:s.items.map(i=>i.id===a.id?{...i,qty:Math.max(0,i.qty-1)}:i).filter(i=>i.qty>0)};
    case 'REM': return {...s, items:s.items.filter(i=>i.id!==a.id)};
    case 'CLR': return {shopId:null,items:[]};
    case 'LOAD': return a.data;
    default: return s;
  }
}
function CartProvider({children}) {
  const [s,dispatch] = useReducer(cartReducer,{shopId:null,items:[]});
  useEffect(()=>{ try{ const d=localStorage.getItem('kk_cart'); if(d) dispatch({type:'LOAD',data:JSON.parse(d)}); }catch{} },[]);
  useEffect(()=>{ localStorage.setItem('kk_cart',JSON.stringify(s)); },[s]);
  const total=s.items.reduce((a,i)=>a+i.price*i.qty,0);
  const count=s.items.reduce((a,i)=>a+i.qty,0);
  return <CartCtx.Provider value={{...s,dispatch,total,count}}>{children}</CartCtx.Provider>;
}

// ── Utils ─────────────────────────────────────────────
const pkr = n => `PKR ${n.toLocaleString()}`;
function buildWA(shop, items, total, c) {
  const lines = items.map(i=>`• ${i.name} x${i.qty} = PKR ${(i.price*i.qty).toLocaleString()}`).join('\n');
  const msg = `Hi, I want to order from *${shop.name}*:\n\n${lines}\n\n*Total: PKR ${total.toLocaleString()}*\n\nName: ${c.name}\nPhone: ${c.phone}\nAddress: ${c.address}`;
  return `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(msg)}`;
}

// ── Navbar ────────────────────────────────────────────
function Navbar({page,onBack,title}) {
  return (
    <div style={{...glass,position:'sticky',top:0,zIndex:50,padding:'12px 16px',display:'flex',alignItems:'center',gap:12}}>
      {page!=='home' && (
        <button onClick={onBack} style={{background:'rgba(255,255,255,0.08)',border:'none',borderRadius:10,padding:'7px 10px',cursor:'pointer',color:TEXT,display:'flex'}}>
          <ArrowLeft size={20}/>
        </button>
      )}
      <span style={{fontWeight:700,fontSize:page==='home'?22:18,color:TEXT,flex:1,letterSpacing:'-0.3px'}}>
        {page==='home' ? <><span style={{color:ORANGE}}>Kacha</span> Khuh</> : title}
      </span>
      {page==='home' && (
        <div style={{width:36,height:36,borderRadius:'50%',background:`linear-gradient(135deg,${ORANGE},#FF8C42)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>
          👤
        </div>
      )}
    </div>
  );
}

// ── Bottom Nav ────────────────────────────────────────
function BottomNav({page,onNav,cartCount}) {
  const tabs = [
    {id:'home',Icon:Home,label:'Home'},
    {id:'search',Icon:Search,label:'Search'},
    {id:'cart',Icon:ShoppingCart,label:'Cart',badge:cartCount},
    {id:'saved',Icon:Heart,label:'Saved'},
  ];
  return (
    <div style={{...glass,position:'fixed',bottom:0,left:0,right:0,zIndex:50,display:'flex',maxWidth:480,margin:'0 auto'}}>
      {tabs.map(({id,Icon,label,badge})=>{
        const act = id==='cart' ? false : (page===id || (page==='shop'&&id==='home'));
        return (
          <button key={id} onClick={()=>onNav(id)} style={{flex:1,background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'10px 0 12px',position:'relative'}}>
            <div style={{position:'relative'}}>
              <Icon size={22} color={act?ORANGE:MUTED} strokeWidth={act?2.5:1.8}/>
              {badge>0&&<span style={{position:'absolute',top:-6,right:-8,background:ORANGE,color:'#fff',fontSize:10,fontWeight:700,borderRadius:999,minWidth:16,height:16,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 3px'}}>{badge}</span>}
            </div>
            <span style={{fontSize:10,color:act?ORANGE:MUTED,fontWeight:act?600:400}}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Shop Card ─────────────────────────────────────────
function ShopCard({shop,onClick}) {
  const [hov,setHov]=useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{...glass,borderRadius:18,overflow:'hidden',cursor:'pointer',marginBottom:16,
        transform:hov?'translateY(-3px)':'none',
        boxShadow:hov?'0 20px 50px rgba(0,0,0,0.55)':'0 8px 30px rgba(0,0,0,0.35)',
        transition:'all 0.22s ease'}}>
      <div style={{position:'relative',paddingTop:'52%'}}>
        <img src={shop.banner} alt={shop.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 35%,rgba(15,23,42,0.97))'}}/>
        <span style={{position:'absolute',top:12,right:12,background:ORANGE,color:'#fff',fontSize:11,fontWeight:700,padding:'4px 11px',borderRadius:20}}>{shop.badge}</span>
      </div>
      <div style={{padding:'14px 16px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
          <h3 style={{color:TEXT,fontWeight:700,fontSize:17,margin:0}}>{shop.name}</h3>
          <div style={{display:'flex',alignItems:'center',gap:4,flexShrink:0}}>
            <Star size={12} fill={ORANGE} color={ORANGE}/>
            <span style={{color:TEXT,fontSize:13,fontWeight:600}}>{shop.rating}</span>
            <span style={{color:MUTED,fontSize:12}}>({shop.reviews})</span>
          </div>
        </div>
        <p style={{color:MUTED,fontSize:13,margin:'0 0 12px'}}>{shop.tagline}</p>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:5}}>
            <MapPin size={13} color={MUTED}/>
            <span style={{color:MUTED,fontSize:12}}>{shop.area}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.25)',borderRadius:20,padding:'4px 11px'}}>
            <MessageCircle size={12} color={GREEN}/>
            <span style={{color:GREEN,fontSize:11,fontWeight:600}}>Order on WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Home Page ─────────────────────────────────────────
function HomePage({onSelect}) {
  const [q,setQ]=useState('');
  const [cat,setCat]=useState('All');
  const filtered=SHOPS.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.area.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{padding:'16px 16px 120px'}}>
      <div style={{marginBottom:20}}>
        <p style={{color:MUTED,fontSize:13,margin:'0 0 4px'}}>Good evening 👋</p>
        <h1 style={{color:TEXT,fontWeight:700,fontSize:24,margin:0,lineHeight:1.3,letterSpacing:'-0.5px'}}>
          What are you <span style={{color:ORANGE}}>craving</span> today?
        </h1>
      </div>

      <div style={{position:'relative',marginBottom:20}}>
        <Search size={18} color={MUTED} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search shops or areas..."
          style={{width:'100%',padding:'13px 14px 13px 42px',background:'rgba(30,41,59,0.85)',border:`1px solid ${BORDER}`,borderRadius:14,color:TEXT,fontSize:14,outline:'none',boxSizing:'border-box',backdropFilter:'blur(8px)'}}
          onFocus={e=>e.target.style.boxShadow=`0 0 0 2px rgba(255,107,44,0.3)`}
          onBlur={e=>e.target.style.boxShadow='none'}/>
      </div>

      <div style={{display:'flex',gap:8,overflowX:'auto',marginBottom:24,paddingBottom:4,scrollbarWidth:'none'}}>
        {CATEGORIES.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{background:cat===c?ORANGE:'rgba(30,41,59,0.7)',border:`1px solid ${cat===c?ORANGE:BORDER}`,color:cat===c?'#fff':MUTED,borderRadius:20,padding:'7px 16px',fontSize:13,fontWeight:cat===c?600:400,cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.2s',flexShrink:0}}>{c}</button>
        ))}
      </div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <h2 style={{color:TEXT,fontWeight:600,fontSize:17,margin:0}}>Nearby Shops</h2>
        <span style={{color:ORANGE,fontSize:13,fontWeight:500}}>{filtered.length} shops</span>
      </div>

      {filtered.map(s=><ShopCard key={s.id} shop={s} onClick={()=>onSelect(s)}/>)}
      {!filtered.length&&(
        <div style={{textAlign:'center',padding:'50px 0',color:MUTED}}>
          <Utensils size={40} color={MUTED} style={{marginBottom:12,opacity:0.4}}/>
          <p style={{margin:0}}>No shops found. Try another search.</p>
        </div>
      )}
    </div>
  );
}

// ── Menu Item ─────────────────────────────────────────
function MenuItem({item,shopId}) {
  const {items,dispatch}=useContext(CartCtx);
  const ci=items.find(i=>i.id===item.id);
  const [bounce,setBounce]=useState(false);
  const add=()=>{ dispatch({type:'ADD',item,shopId}); setBounce(true); setTimeout(()=>setBounce(false),350); };

  return (
    <div style={{...glass,borderRadius:14,padding:'14px',marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
      <div style={{flex:1,minWidth:0}}>
        <h4 style={{color:TEXT,fontWeight:600,fontSize:15,margin:'0 0 3px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.name}</h4>
        {item.description&&<p style={{color:MUTED,fontSize:12,margin:'0 0 8px',lineHeight:1.4}}>{item.description}</p>}
        <span style={{color:ORANGE,fontWeight:700,fontSize:16}}>{pkr(item.price)}</span>
      </div>
      {ci ? (
        <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(255,107,44,0.12)',border:'1px solid rgba(255,107,44,0.3)',borderRadius:12,padding:'7px 10px',flexShrink:0}}>
          <button onClick={()=>dispatch({type:'DEC',id:item.id})} style={{background:'none',border:'none',cursor:'pointer',color:ORANGE,display:'flex',padding:0}}><Minus size={16}/></button>
          <span style={{color:TEXT,fontWeight:700,fontSize:15,minWidth:20,textAlign:'center'}}>{ci.qty}</span>
          <button onClick={()=>dispatch({type:'INC',id:item.id})} style={{background:'none',border:'none',cursor:'pointer',color:ORANGE,display:'flex',padding:0}}><Plus size={16}/></button>
        </div>
      ) : (
        <button onClick={add} style={{background:ORANGE,border:'none',borderRadius:12,padding:'9px 14px',color:'#fff',fontWeight:600,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',gap:5,flexShrink:0,transform:bounce?'scale(1.18)':'scale(1)',transition:'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)'}}>
          <Plus size={16}/>Add
        </button>
      )}
    </div>
  );
}

// ── Shop Page ─────────────────────────────────────────
function ShopPage({shop,onCartOpen}) {
  const {count,total}=useContext(CartCtx);
  const prods=PRODUCTS[shop.id]||[];
  const cats=[...new Set(prods.map(p=>p.category))];
  const [cat,setCat]=useState(cats[0]||'');
  const filtered=prods.filter(p=>p.category===cat);

  return (
    <div style={{paddingBottom:160}}>
      <div style={{position:'relative',height:210}}>
        <img src={shop.banner} alt={shop.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(15,23,42,0.1) 0%,rgba(15,23,42,0.97) 100%)'}}/>
        <div style={{position:'absolute',bottom:16,left:16,right:16}}>
          <h2 style={{color:TEXT,fontWeight:700,fontSize:22,margin:'0 0 6px',letterSpacing:'-0.5px'}}>{shop.name}</h2>
          <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
            {[
              {Icon:Star,val:`${shop.rating} (${shop.reviews})`,fill:true},
              {Icon:Clock,val:shop.deliveryTime},
              {Icon:MapPin,val:shop.area},
            ].map(({Icon,val,fill},i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:4}}>
                <Icon size={13} color={fill?ORANGE:MUTED} fill={fill?ORANGE:'none'}/>
                <span style={{color:fill?TEXT:MUTED,fontSize:13,fontWeight:fill?600:400}}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{padding:'16px 16px 0'}}>
        <div style={{display:'flex',gap:8,overflowX:'auto',marginBottom:20,paddingBottom:4,scrollbarWidth:'none'}}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{background:cat===c?ORANGE:'rgba(30,41,59,0.7)',border:`1px solid ${cat===c?ORANGE:BORDER}`,color:cat===c?'#fff':MUTED,borderRadius:20,padding:'7px 16px',fontSize:13,fontWeight:cat===c?600:400,cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.2s',flexShrink:0}}>{c}</button>
          ))}
        </div>
        <h3 style={{color:TEXT,fontWeight:600,fontSize:16,margin:'0 0 12px'}}>{cat}</h3>
        {filtered.map(item=><MenuItem key={item.id} item={item} shopId={shop.id}/>)}
      </div>

      {count>0&&(
        <div style={{position:'fixed',bottom:74,left:12,right:12,zIndex:40,maxWidth:456,margin:'0 auto'}}>
          <button onClick={onCartOpen} style={{width:'100%',background:`linear-gradient(135deg,${GREEN},#16A34A)`,border:'none',borderRadius:16,padding:'15px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',boxShadow:'0 8px 32px rgba(34,197,94,0.4)',transition:'all 0.2s'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{background:'rgba(255,255,255,0.2)',borderRadius:8,padding:'3px 10px',color:'#fff',fontWeight:700,fontSize:14}}>{count}</div>
              <span style={{color:'#fff',fontWeight:600,fontSize:15}}>{count} item{count>1?'s':''} in cart</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:5}}>
              <span style={{color:'#fff',fontWeight:700,fontSize:15}}>{pkr(total)}</span>
              <ChevronRight size={18} color="#fff"/>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Cart Drawer ───────────────────────────────────────
function CartDrawer({open,onClose,shop}) {
  const {items,total,dispatch}=useContext(CartCtx);
  const [c,setC]=useState({name:'',phone:'',address:''});
  const [err,setErr]=useState({});
  const [done,setDone]=useState(false);

  const upd=(k,v)=>setC(p=>({...p,[k]:v}));
  const validate=()=>{
    const e={};
    if(!c.name.trim()) e.name='Required';
    if(!c.phone.trim()) e.phone='Required';
    if(!c.address.trim()) e.address='Required';
    setErr(e); return !Object.keys(e).length;
  };
  const order=()=>{
    if(!validate()||!shop) return;
    window.open(buildWA(shop,items,total,c),'_blank');
    setDone(true);
    setTimeout(()=>{ dispatch({type:'CLR'}); setDone(false); onClose(); },2200);
  };

  const inputStyle=(k)=>({
    width:'100%',padding:'11px 14px',background:'rgba(30,41,59,0.9)',
    border:`1px solid ${err[k]?'#EF4444':BORDER}`,borderRadius:12,
    color:TEXT,fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit',
  });

  return (
    <>
      <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:60,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(4px)',WebkitBackdropFilter:'blur(4px)',opacity:open?1:0,pointerEvents:open?'auto':'none',transition:'opacity 0.3s'}}/>
      <div style={{position:'fixed',top:0,right:0,bottom:0,zIndex:70,width:'100%',maxWidth:430,background:'#0A1224',borderLeft:`1px solid ${BORDER}`,transform:open?'translateX(0)':'translateX(100%)',transition:'transform 0.35s cubic-bezier(0.4,0,0.2,1)',display:'flex',flexDirection:'column',overflowY:'hidden'}}>
        
        <div style={{...glass,padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
          <div>
            <h3 style={{color:TEXT,fontWeight:700,fontSize:18,margin:0}}>Your Cart</h3>
            {shop&&<p style={{color:MUTED,fontSize:12,margin:'2px 0 0'}}>from {shop.name}</p>}
          </div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.08)',border:'none',borderRadius:10,padding:8,cursor:'pointer',color:TEXT,display:'flex'}}><X size={18}/></button>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'16px 20px'}}>
          {!items.length ? (
            <div style={{textAlign:'center',padding:'50px 0',color:MUTED}}>
              <ShoppingCart size={44} color={MUTED} style={{marginBottom:12,opacity:0.35}}/>
              <p style={{margin:0,fontSize:15}}>Your cart is empty</p>
              <p style={{color:MUTED,fontSize:13,margin:'6px 0 0'}}>Add items from a shop to get started</p>
            </div>
          ) : (
            <>
              {items.map(item=>(
                <div key={item.id} style={{...glass,borderRadius:12,padding:'12px 14px',marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{color:TEXT,fontWeight:600,fontSize:14,margin:'0 0 3px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.name}</p>
                    <span style={{color:ORANGE,fontSize:14,fontWeight:700}}>{pkr(item.price*item.qty)}</span>
                    <span style={{color:MUTED,fontSize:12,marginLeft:6}}>× {item.qty}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(255,107,44,0.1)',border:'1px solid rgba(255,107,44,0.2)',borderRadius:10,padding:'5px 8px'}}>
                      <button onClick={()=>dispatch({type:'DEC',id:item.id})} style={{background:'none',border:'none',cursor:'pointer',color:ORANGE,display:'flex',padding:0}}><Minus size={14}/></button>
                      <span style={{color:TEXT,fontWeight:700,fontSize:14,minWidth:18,textAlign:'center'}}>{item.qty}</span>
                      <button onClick={()=>dispatch({type:'INC',id:item.id})} style={{background:'none',border:'none',cursor:'pointer',color:ORANGE,display:'flex',padding:0}}><Plus size={14}/></button>
                    </div>
                    <button onClick={()=>dispatch({type:'REM',id:item.id})} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,padding:6,cursor:'pointer',color:'#EF4444',display:'flex'}}><X size={13}/></button>
                  </div>
                </div>
              ))}

              <div style={{...glass,borderRadius:12,padding:'14px 16px',margin:'16px 0'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <span style={{color:MUTED,fontSize:14}}>Subtotal</span>
                  <span style={{color:TEXT,fontSize:14}}>{pkr(total)}</span>
                </div>
                <div style={{height:1,background:BORDER,margin:'10px 0'}}/>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <span style={{color:TEXT,fontWeight:700,fontSize:16}}>Total</span>
                  <span style={{color:ORANGE,fontWeight:700,fontSize:19}}>{pkr(total)}</span>
                </div>
              </div>

              <h4 style={{color:TEXT,fontWeight:600,fontSize:15,margin:'0 0 14px'}}>Your Details</h4>
              {[{k:'name',label:'Full Name',ph:'Ali Hassan',type:'text'},{k:'phone',label:'Phone Number',ph:'0300-1234567',type:'tel'}].map(f=>(
                <div key={f.k} style={{marginBottom:12}}>
                  <label style={{color:MUTED,fontSize:12,fontWeight:500,display:'block',marginBottom:5}}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={c[f.k]} onChange={e=>upd(f.k,e.target.value)} style={inputStyle(f.k)}
                    onFocus={e=>e.target.style.boxShadow=`0 0 0 2px rgba(255,107,44,0.3)`}
                    onBlur={e=>e.target.style.boxShadow='none'}/>
                  {err[f.k]&&<p style={{color:'#EF4444',fontSize:11,margin:'3px 0 0'}}>{err[f.k]}</p>}
                </div>
              ))}
              <div style={{marginBottom:8}}>
                <label style={{color:MUTED,fontSize:12,fontWeight:500,display:'block',marginBottom:5}}>Delivery Address</label>
                <textarea placeholder="House #, Street, Area, City" value={c.address} onChange={e=>upd('address',e.target.value)} rows={3}
                  style={{...inputStyle('address'),resize:'vertical'}}
                  onFocus={e=>e.target.style.boxShadow=`0 0 0 2px rgba(255,107,44,0.3)`}
                  onBlur={e=>e.target.style.boxShadow='none'}/>
                {err.address&&<p style={{color:'#EF4444',fontSize:11,margin:'3px 0 0'}}>{err.address}</p>}
              </div>
            </>
          )}
        </div>

        {items.length>0&&(
          <div style={{padding:'16px 20px',flexShrink:0,borderTop:`1px solid ${BORDER}`}}>
            <button onClick={order} style={{width:'100%',background:done?'#16A34A':`linear-gradient(135deg,${GREEN},#16A34A)`,border:'none',borderRadius:16,padding:'16px',color:'#fff',fontWeight:700,fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,boxShadow:'0 8px 32px rgba(34,197,94,0.4)',transition:'all 0.2s'}}>
              <MessageCircle size={20}/>
              {done?'✓ Opening WhatsApp...':'Order on WhatsApp'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── App ───────────────────────────────────────────────
function AppInner() {
  const [page,setPage]=useState('home');
  const [shopId,setShopId]=useState(null);
  const [cartOpen,setCartOpen]=useState(false);
  const {count,shopId:cartShopId}=useContext(CartCtx);

  const shop=shopId?SHOPS.find(s=>s.id===shopId):null;
  const cartShop=cartShopId?SHOPS.find(s=>s.id===cartShopId):null;

  const nav=(tab)=>{
    if(tab==='cart'){ setCartOpen(true); return; }
    if(tab==='home'){ setPage('home'); }
  };

  return (
    <div style={{background:BG,minHeight:'100vh',fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",color:TEXT,maxWidth:480,margin:'0 auto',position:'relative'}}>
      <style>{`*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}input::placeholder,textarea::placeholder{color:#64748B}::-webkit-scrollbar{display:none}`}</style>
      <Navbar page={page} title={shop?.name} onBack={()=>setPage('home')}/>
      {page==='home'&&<HomePage onSelect={s=>{setShopId(s.id);setPage('shop');}}/>}
      {page==='shop'&&shop&&<ShopPage shop={shop} onCartOpen={()=>setCartOpen(true)}/>}
      <BottomNav page={page} onNav={nav} cartCount={count}/>
      <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} shop={shop||cartShop}/>
    </div>
  );
}

export default function App() {
  return <CartProvider><AppInner/></CartProvider>;
}
