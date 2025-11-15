import{c as v,h as A,r as m,j as e,S as L,I as H,B as U}from"./index-BaYg4v0E.js";import{B as W}from"./badge-C-xAuew-.js";import{s as Z}from"./rfqQueries-HiUeWbzr.js";import{B as _}from"./bot-B7ahXivO.js";import{X as G}from"./x-BpM8QUTf.js";import{C as V}from"./circle-check-big-CeZJRltX.js";const F=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],K=v("circle-x",F);const Q=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]],Y=v("maximize-2",Q);const X=[["path",{d:"m14 10 7-7",key:"oa77jy"}],["path",{d:"M20 10h-6V4",key:"mjg0md"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M4 14h6v6",key:"rmj7iw"}]],J=v("minimize-2",X);const ee=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],te=v("send",ee),ae=async a=>{try{const r=a.trim().toUpperCase(),{data:i,error:c}=await A.from("products_data").select("*").eq("manufacturer","Amatom").ilike("productname",r).limit(1).single();if(i&&!c)return{available:!0,partNumber:i.productname,part:i,message:`✅ Great news! ${i.productname} is available in stock!`};const{data:d}=await A.from("products_data").select("*").eq("manufacturer","Amatom").or(`productname.ilike.%${r}%,description.ilike.%${r}%`).limit(5);return d&&d.length>0?{available:!0,partNumber:r,alternativeParts:d,message:`I found ${d.length} similar parts that might work for you!`}:{available:!1,partNumber:r,message:`While ${r} isn't currently in our warehouse, we can source it through our extensive supplier network!`}}catch(r){return console.error("Part lookup error:",r),{available:!1,partNumber:a,message:`Let me check with our team about ${a} and get back to you with availability and pricing.`}}},se=async a=>{try{const{data:r,error:i}=await A.from("products_data").select("*").eq("manufacturer","Amatom").or(`category.ilike.%${a}%,sub_category.ilike.%${a}%,description.ilike.%${a}%`).limit(10);if(i)throw i;return r||[]}catch(r){return console.error("Part search error:",r),[]}},re=a=>{const r=[/\b([A-Z0-9]{3,}[-_][A-Z0-9][-_0-9]+)\b/gi,/\b([A-Z]{2,}[0-9]{3,}[A-Z0-9]*)\b/gi,/\b([0-9]{4,}[-_][A-Z0-9][-_0-9]*)\b/gi];for(const i of r){const c=a.match(i);if(c&&c.length>0)return c[0].toUpperCase()}return null},ne="your-openai-api-key-here",k=async(a,r)=>{try{const i=ie(r),c=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${ne}`},body:JSON.stringify({model:"gpt-3.5-turbo",messages:[{role:"system",content:i},...a],temperature:.7,max_tokens:200})});if(!c.ok)throw new Error("OpenAI API error");return(await c.json()).choices[0].message.content}catch(i){return console.error("OpenAI API Error:",i),oe(r)}};function ie(a){let r=`You are a helpful sales assistant for ASAP-Amatom.com, a supplier of aerospace and industrial parts. 

Your goals:
1. Help customers find the parts they need
2. Check part availability in real-time
3. Gather customer information quickly
4. Convert conversations to quote requests in 3-5 messages

Tone: Professional, friendly, helpful, and persuasive.
Keep responses SHORT (2-3 sentences max).
Always be optimistic and solution-oriented.`;return a&&(a.available?r+=`

CURRENT PART STATUS:
✅ AVAILABLE: ${a.partNumber}
Category: ${a.category||"Parts"}
Subcategory: ${a.subcategory||"Various"}
${a.description?`Description: ${a.description}`:""}
${a.quantity?`Stock: ${a.quantity}+ units available`:"In stock"}

Tell the customer this part IS AVAILABLE and you can get them a competitive quote within 24 hours!`:r+=`

CURRENT PART STATUS:
⚠️ NOT IN STOCK: ${a.partNumber}

IMPORTANT: Don't say "we don't have it" directly. Instead:
1. Acknowledge the request positively
2. Say "Let me check with our procurement team"
3. Emphasize that you can SOURCE it from trusted suppliers
4. Mention 24-48 hour response time with pricing and availability
5. Say "We have extensive supplier network" or "We can arrange this for you"
6. Be confident that your team will find it

Keep customer engaged and optimistic!`),r}function oe(a){return a?a.available?`Great news! ✅ ${a.partNumber} is available in our inventory. We have ${a.quantity||"multiple"} units in stock. How many do you need?`:`I see you're looking for ${a.partNumber}. While this specific part isn't currently in our warehouse, we have an extensive supplier network and can arrange it for you. Our procurement team can source it within 24-48 hours. How many units do you need? Let me get you a competitive quote!`:"I'd be happy to help you find the right parts! Could you tell me what you're looking for?"}function he(){const[a,r]=m.useState(!1),[i,c]=m.useState(!1),[d,N]=m.useState([]),[g,$]=m.useState(""),[S,I]=m.useState(!1),[f,P]=m.useState([]),[x,b]=m.useState({}),q=m.useRef(null),R=()=>{q.current?.scrollIntoView({behavior:"smooth"})};m.useEffect(()=>{R()},[d]),m.useEffect(()=>{a&&d.length===0&&u(`👋 Hi! I'm your AI assistant with access to our complete inventory of 500,000+ parts!

I can:
✅ Check real-time availability
✅ Find specific part numbers
✅ Suggest alternatives
✅ Get you instant quotes

What can I help you find today?`)},[a]);const u=(t,n)=>{const o={id:Date.now().toString(),type:"bot",content:t,timestamp:new Date,partInfo:n};N(y=>[...y,o]),P(y=>[...y,{role:"assistant",content:t}])},E=t=>{const n={id:Date.now().toString(),type:"user",content:t,timestamp:new Date};N(o=>[...o,n]),P(o=>[...o,{role:"user",content:t}])},C=t=>{N(n=>[...n,{id:Date.now().toString(),type:"system",content:t,timestamp:new Date}])},z=async t=>{I(!0);try{const n=re(t);if(n){C(`🔍 Checking availability for ${n}...`);const s=await ae(n);if(s.available&&s.part){const l={available:!0,partNumber:s.part.productname,quantity:100,category:s.part.category,subcategory:s.part.sub_category,description:s.part.description},p=await k(f,l);u(p+`

📦 Part: ${s.part.productname}
📁 Category: ${s.part.category}
🏷️ Type: ${s.part.sub_category}

How many units do you need?`,{available:!0,partNumber:s.part.productname,part:s.part}),b(h=>({...h,partNumber:s.part.productname,requirements:t}))}else if(s.alternativeParts&&s.alternativeParts.length>0){const l=s.alternativeParts.slice(0,3),p=l.map((h,j)=>`${j+1}. ${h.productname} - ${h.sub_category}`).join(`
`);u(`I couldn't find exact match for ${n}, but I found similar parts:

${p}

Would any of these work? Or should I check with our procurement team to source the exact part?`,{available:!0,partNumber:n,alternatives:l})}else{const p=await k(f,{available:!1,partNumber:n});u(p+`

💪 Our procurement team has access to:
• 100+ trusted suppliers worldwide
• Fast sourcing (24-48 hours)
• Competitive pricing guaranteed

How many units do you need? I'll get you a quote ASAP!`),b(h=>({...h,partNumber:n,requirements:t}))}}else{const s=t.toLowerCase();if(s.includes("standoff")||s.includes("spacer")||s.includes("fastener")){const l=s.includes("standoff")?"Standoffs":s.includes("spacer")?"Spacers":"Fasteners";C(`🔍 Searching ${l}...`);const p=await se(l);if(p.length>0){const j=p.slice(0,3).map((w,B)=>`${B+1}. ${w.productname} - ${w.sub_category}`).join(`
`);u(`Great! We have ${p.length}+ ${l} available. Here are some examples:

${j}

Do you have a specific part number, or should I help you find the right one?`),b(w=>({...w,requirements:t}))}}else{const l=await k(f);u(l),f.length>=4&&!x.email&&setTimeout(()=>{u(`To send you a detailed quote, I'll need your:

📧 Email address
👤 Name
📞 Phone (optional)

Please share your contact info:`)},1e3)}}const o=M(t);o&&(b(s=>({...s,email:o})),(x.partNumber||x.requirements)&&await D({...x,email:o}));const y=O(t);y&&b(s=>({...s,quantity:y}))}catch(n){console.error("Chat error:",n),u(`I apologize for the technical difficulty. Let me connect you with our team directly:

📧 Email: quotes@asap-amatom.com
📞 Phone: +1 (714) 705-4780

Or try asking your question again?`)}finally{I(!1)}},D=async t=>{try{if(!t.email)return;const n={name:t.name||"AI Chat User",email:t.email,phone:t.phone,part_number:t.partNumber,part_description:t.requirements||"Parts inquiry via AI Chat",quantity:t.quantity||1,urgency:t.urgency||"standard",message:`Conversation via AI Chatbot
Requirements: ${t.requirements||"See part number"}`},o={sourcePage:"AI Smart Chatbot",sourceUrl:window.location.href,referrer:document.referrer||void 0,userAgent:navigator.userAgent};await Z(n,o),u(`🎉 Excellent! Your quote request has been submitted!

📧 Confirmation sent to: ${t.email}
📦 Part: ${t.partNumber||"As discussed"}
📊 Quantity: ${t.quantity||"TBD"}
⏰ Response time: Within 24 hours

Reference: #${Date.now().toString().slice(-6)}

Anything else I can help you with?`)}catch{u("There was an issue submitting your request. Please email us directly at quotes@asap-amatom.com or call +1 (714) 705-4780.")}},M=t=>{const n=/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,o=t.match(n);return o?o[0]:null},O=t=>{const n=/\b(\d{1,6})\s*(units?|pcs?|pieces?|quantity)?\b/i,o=t.match(n);return o?parseInt(o[1]):null},T=()=>{g.trim()&&(E(g),z(g),$(""))};return a?e.jsxs("div",{className:`fixed z-50 bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${i?"bottom-6 right-6 w-80 h-16":"bottom-6 right-6 w-[420px] h-[650px]"}`,children:[e.jsxs("div",{className:"bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("div",{className:"relative",children:[e.jsx(_,{className:"h-6 w-6"}),e.jsx("span",{className:"absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"font-semibold flex items-center gap-2",children:["AI Assistant",e.jsx(W,{className:"bg-green-500 text-xs",children:"GPT-Powered"})]}),e.jsx("div",{className:"text-xs text-blue-100",children:"Real-time inventory access • 500K+ parts"})]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>c(!i),className:"hover:bg-white/20 p-2 rounded-lg transition",children:i?e.jsx(Y,{className:"h-4 w-4"}):e.jsx(J,{className:"h-4 w-4"})}),e.jsx("button",{onClick:()=>r(!1),className:"hover:bg-white/20 p-2 rounded-lg transition",children:e.jsx(G,{className:"h-4 w-4"})})]})]}),!i&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white",children:[d.map(t=>e.jsx("div",{children:e.jsx("div",{className:`flex ${t.type==="user"?"justify-end":"justify-start"}`,children:t.type==="system"?e.jsxs("div",{className:"w-full flex items-center justify-center gap-2 text-xs text-gray-500 my-2",children:[e.jsx(L,{className:"h-3 w-3 animate-spin"}),t.content]}):e.jsxs("div",{className:`max-w-[85%] rounded-2xl px-4 py-3 ${t.type==="user"?"bg-gradient-to-r from-blue-600 to-indigo-600 text-white":"bg-white border-2 border-gray-100 text-gray-900 shadow-sm"}`,children:[e.jsx("p",{className:"text-sm whitespace-pre-line leading-relaxed",children:t.content}),t.partInfo&&e.jsx("div",{className:`mt-3 p-2 rounded-lg ${t.partInfo.available?"bg-green-50":"bg-yellow-50"}`,children:t.partInfo.available?e.jsxs("div",{className:"flex items-center gap-2 text-xs",children:[e.jsx(V,{className:"h-4 w-4 text-green-600"}),e.jsx("span",{className:"text-green-700 font-medium",children:"In Stock"})]}):e.jsxs("div",{className:"flex items-center gap-2 text-xs",children:[e.jsx(K,{className:"h-4 w-4 text-yellow-600"}),e.jsx("span",{className:"text-yellow-700 font-medium",children:"Can Source"})]})})]})})},t.id)),S&&e.jsx("div",{className:"flex justify-start",children:e.jsx("div",{className:"bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 shadow-sm",children:e.jsxs("div",{className:"flex gap-1",children:[e.jsx("div",{className:"w-2 h-2 bg-blue-400 rounded-full animate-bounce",style:{animationDelay:"0ms"}}),e.jsx("div",{className:"w-2 h-2 bg-blue-400 rounded-full animate-bounce",style:{animationDelay:"150ms"}}),e.jsx("div",{className:"w-2 h-2 bg-blue-400 rounded-full animate-bounce",style:{animationDelay:"300ms"}})]})})}),e.jsx("div",{ref:q})]}),e.jsxs("div",{className:"p-4 bg-white border-t rounded-b-2xl",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(H,{value:g,onChange:t=>$(t.target.value),onKeyPress:t=>t.key==="Enter"&&T(),placeholder:"Ask about part numbers, availability...",className:"flex-1 border-2 border-gray-200 focus:border-blue-500"}),e.jsx(U,{onClick:T,disabled:!g.trim()||S,className:"bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",children:e.jsx(te,{className:"h-4 w-4"})})]}),e.jsxs("div",{className:"flex items-center justify-between mt-2 text-xs text-gray-500",children:[e.jsx("span",{children:"🤖 Powered by GPT-3.5"}),e.jsx("span",{children:"⚡ Instant availability check"})]})]})]})]}):e.jsxs("button",{onClick:()=>r(!0),className:"fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform",children:[e.jsx(_,{className:"h-6 w-6"}),e.jsx("span",{className:"absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse",children:"AI"})]})}export{he as default};
