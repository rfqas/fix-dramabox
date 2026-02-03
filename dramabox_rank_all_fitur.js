/*
Scrape full all fitur dramabox
by WH MODS DEV
link channel wa : https://whatsapp.com/channel/0029VaZiRep4o7qHMGD3Ik06
Instagram: @one2_xyz
YouTube : coming soon

pesan : gak usah ngaku² lu ini scrape punya lu bego, kalau cuman copy paste doang gak usah sok jago, tersindir? makanya belajar yang bener lagi gak usah banyak kecot

📌 Note : untuk rank type ada 3 angka yaitu : 1 (sedang tren), 2 (pencairan populer), 3 (terbaru)

tinggal jalanin doang, kalau mau hasil nya langsung jadiin return aja, bagian fs nya hapus

TTD BY WH MODS DEV # JANGAN HAPUS CREDIT, YANG HAPUS CREDITS GW DOAIN BAKAL ADA MUSIBAH YANG NIMPA LU NTAR
*/

import axios from "axios";
import fs from "fs"
import { tokennya, DramaboxApp } from "./token_dramabox.js";

export async function rank_all_fitur(rankType = 1) {
  try {
    const auth = await tokennya();
    if (!auth?.token) throw new Error("Token gagal");
    const payload = {
      rankType: rankType // pilih 1 / 2 / 3, kalau bingung baca note diatas
    };

    const timestamp = Date.now();
    const signString =
      `timestamp=${timestamp}` +
      JSON.stringify(payload) +
      auth.deviceid +
      auth.androidid +
      `Bearer ${auth.token}`;

    const sn = DramaboxApp.dramabox(signString);

    const response = await axios.post(
      `https://sapi.dramaboxdb.com/drama-box/he001/rank?timestamp=${timestamp}`,
      payload,
      {
        headers: {
          "user-agent": "okhttp/4.10.0",
          "accept-encoding": "gzip",
          "content-type": "application/json; charset=UTF-8",
          "package-name": "com.storymatrix.drama",
          "version": "521",
          "vn": "5.2.1",
          "p": "51",
          "cid": "DRA1000042",
          "nchid": "DRA1000042",
          "pline": "ANDROID",
          "over-flow": "new-fly",
          "device-id": auth.deviceid,
          "android-id": auth.androidid,
          "brand": "POCO",
          "mf": "XIAOMI",
          "ov": "15",
          "srn": "900x1600",
          "country-code": "ID",
          "language": "id",
          "locale": "id_ID",
          "current-language": "in",
          "time-zone": "+0700",
          "tz": "-420",
          "lat": "0",
          "userid": "298772899",
          "apn": "2",
          "mcc": "510",
          "mchid": "",
          "mbid": "",
          "afid": "1768660574408-8177467454001684134",
          "ins": "1768660574379",
          "active-time": "12000",
          "tn": `Bearer ${auth.token}`,
          "sn": sn
        }
      }
    );

    console.log("✅ RANK OK");
    const hasil = response.data?.data?.rankList;
    fs.writeFileSync(
      "rank_all_fitur.json",
      JSON.stringify(
        {
          total_hasil: hasil.length,
          generated_at: new Date().toISOString(),
          data: hasil
        },
        null,
        2
      )
    );

    console.log(`🎉 SELESAI — total ${hasil.length} RANK`);
    return hasil;

  } catch (err) {
    console.error(
      "RANK ERROR:",
      err.response?.data || err.message
    );
    throw err;
  }
}

// rank_all_fitur()