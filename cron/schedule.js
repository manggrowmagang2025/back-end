import cron from "node-cron";
import Plant from "../models/Plant.js";
import { sendEmail } from "../services/notifier.js";

// tiap pagi 07:00 cek tanaman yang due dirawat, kirim email
cron.schedule("0 7 * * *", async ()=>{
  const now = new Date();
  const plants = await Plant.find().populate("owner");
  for(const p of plants){
    const last = p.lastWateredAt ? new Date(p.lastWateredAt) : new Date(0);
    const next = new Date(last.getTime() + (p.careIntervalDays||3)*24*60*60*1000);
    if(next <= now && p.owner?.email){
      await sendEmail(
        p.owner.email,
        `Reminder perawatan: ${p.name}`,
        `<p>Tanaman <b>${p.name}</b> waktunya dirawat hari ini.</p>`
      );
    }
  }
  console.log("Cron: reminders sent", now.toISOString());
});
