import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
// Owner-only helper: never prints credentials, API URLs or incoming message bodies.
try{
 const token=parseEnv(readFileSync('.dev.vars','utf8')).TELEGRAM_BOT_TOKEN?.trim();
 if(!token){console.error('Enter TELEGRAM_BOT_TOKEN privately in .dev.vars first.');process.exitCode=1;}
 else{
  const response=await fetch(`https://api.telegram.org/bot${token}/getUpdates`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({limit:100,timeout:0,allowed_updates:['message']}),signal:AbortSignal.timeout(12000)});
  const data=await response.json();
  if(!response.ok||data.ok!==true){console.error(`Telegram rejected chat-ID lookup (HTTP ${response.status}). Check the token, and whether this bot has an existing webhook. No private response was printed.`);process.exitCode=1;}
  else{const chats=new Map(data.result.filter(u=>u.message?.chat).map(u=>[String(u.message.chat.id),u.message.chat.type]));if(!chats.size)console.log('No chat found. Send /start to the bot from your receiving account, then run this again.');else{console.log('Candidate chat IDs (read locally; choose your receiving account):');for(const [id,type] of chats)console.log(`${id} (${type})`);}}
 }
}catch{console.error('Chat-ID lookup failed. Check .dev.vars and your connection. No credentials or private response were printed.');process.exitCode=1;}
