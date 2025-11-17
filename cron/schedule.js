import cron from "node-cron";
import Plant from "../models/Plant.js";
import User from "../models/User.js";
import { sendEmail } from "../services/notifier.js";

// tiap pagi 07:00 cek tanaman yang due dirawat, kirim email
cron.schedule("0 7 * * *", async ()=>{
  const now = new Date();
  const plants = await Plant.findAll({ include:{ model:User, as:"owner" } });
  const dayMs = 24*60*60*1000;
  for(const p of plants){
    const last = p.last_watered ? new Date(p.last_watered) : new Date(0);
    const next = new Date(last.getTime() + (p.watering_frequency || 3)*dayMs);
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
