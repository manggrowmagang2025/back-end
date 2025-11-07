// Abstraksi provider — FE kirim question, BE balas jawaban dari model pilihan.
// Default "fake" untuk dev; ganti ke OpenAI/Gemini sesuai kebutuhan.
export async function askPlantAI(question){
  const provider = process.env.AI_PROVIDER || "fake";
  if(provider==="fake"){
    return `Jawaban contoh untuk: "${question}". Tambahkan integrasi model nanti.`;
  }
  // Contoh stub (pseudocode):
  // if(provider==="openai"){
  //   const res = await fetch("https://api.openai.com/v1/chat/completions",{
  //     method:"POST",
  //     headers:{ "Authorization":`Bearer ${process.env.AI_API_KEY}`, "Content-Type":"application/json" },
  //     body: JSON.stringify({ model:"gpt-4o-mini", messages:[{role:"user", content:question}] })
  //   });
  //   const data = await res.json();
  //   return data.choices?.[0]?.message?.content || "No answer";
  // }
  return "Provider belum dikonfigurasi.";
}
