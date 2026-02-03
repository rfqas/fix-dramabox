/*
Scrape full all fitur dramabox
by WH MODS DEV
link channel wa : https://whatsapp.com/channel/0029VaZiRep4o7qHMGD3Ik06
Instagram: @one2_xyz
YouTube : coming soon

pesan : gak usah ngaku² lu ini scrape punya lu bego, kalau cuman copy paste doang gak usah sok jago, tersindir? makanya belajar yang bener lagi gak usah banyak kecot

📌 note : tinggal jalanin doang, kalau mau langsung hasil jadiin return aja, hapus bagian fs nya doang

TTD BY WH MODS DEV # JANGAN HAPUS CREDIT, YANG HAPUS CREDITS GW DOAIN BAKAL ADA MUSIBAH YANG NIMPA LU NTAR
*/
import axios from "axios";
import fs from "fs"
import { tokennya, DramaboxApp } from "./token_dramabox.js";

export async function latest_coming_soon() {
  try {
    const auth = await tokennya();
    if (!auth?.token) throw new Error("Token gagal");
    const payload = {};
    const timestamp = Date.now();
    const signString =
      `timestamp=${timestamp}` +
      JSON.stringify(payload) +
      auth.deviceid +
      auth.androidid +
      `Bearer ${auth.token}`;

    const sn = DramaboxApp.dramabox(signString);
    const response = await axios({
      method: "POST",
      url: `https://sapi.dramaboxdb.com/drama-box/he001/reserveBook?timestamp=${timestamp}`,
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
        "afid": auth.afid || "",
        "ins": auth.ins || "",
        "active-time": "59568",
        "tn": `Bearer ${auth.token}`,
        "sn": sn
      },
      data: JSON.stringify(payload)
    });

    console.log("✅ reserveBook success");

    const hasil = response.data?.data?.reserveBookList;
    console.log(hasil)


    fs.writeFileSync(
      "latest_coming_soon.json",
      JSON.stringify(
        {
          total_records: hasil.length,
          generated_at: new Date().toISOString(),
          data: hasil
        },
        null,
        2
      )
    )
    console.log(`🎉 SELESAI — total ${hasil.length} coming soon`);
    return hasil;
  } catch (err) {
    console.error(
      "RESERVE BOOK ERROR:",
      err.response?.data || err.message
    );
    throw err;
  }
}

// latest_coming_soon()