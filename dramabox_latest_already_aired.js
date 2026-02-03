/*
Scrape full all fitur dramabox
by WH MODS DEV
link channel wa : https://whatsapp.com/channel/0029VaZiRep4o7qHMGD3Ik06
Instagram: @one2_xyz
YouTube : coming soon

pesan : gak usah ngaku² lu ini scrape punya lu bego, kalau cuman copy paste doang gak usah sok jago, tersindir? makanya belajar yang bener lagi gak usah banyak kecot

📌 note : itu masih gw simpan jadi file json, kalau mau langsung hasil nya tinggal hapus aja bagian fs nya doang lalu jadikan return doang

TTD BY WH MODS DEV # JANGAN HAPUS CREDIT, YANG HAPUS CREDITS GW DOAIN BAKAL ADA MUSIBAH YANG NIMPA LU NTAR
*/
import axios from "axios";
import fs from "fs"
import { tokennya, DramaboxApp } from "./token_dramabox.js";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export async function latest_already_aired() {
  try {
    const auth = await tokennya();
    if (!auth?.token) throw new Error("Token gagal");

    let page = 1;
    const allRecords = [];

    while (true) {
      const payload = {
        newChannelStyle: 1,
        isNeedRank: 1,
        pageNo: page,
        index: 1,
        channelId: 43
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
        `https://sapi.dramaboxdb.com/drama-box/he001/theater?timestamp=${timestamp}`,
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
            "afid": "1760013754903-6701224066924121341",
            "ins": "1760013754914",
            "active-time": "11496",
            "tn": `Bearer ${auth.token}`,
            "sn": sn
          }
        }
      );

      const records = response.data.data.newTheaterList.records || [];

      console.log(records)

      if (records.length === 0) {
        console.log(`⛔ Page ${page} kosong → STOP`);
        break;
      }

      console.log(`✅ Page ${page} OK (${records.length})`);
      allRecords.push(...records);

      page++;
      await sleep(1000);
    }

    console.log({
      total: allRecords.length,
      data: allRecords
    })

    fs.writeFileSync(
      "latest_already_aired.json",
      JSON.stringify(
        {
          total_records: allRecords.length,
          last_page: page - 1,
          generated_at: new Date().toISOString(),
          data: allRecords
        },
        null,
        2
      )
    );

    console.log(`🎉 SELESAI — total ${allRecords.length} latest`);
    return allRecords;


  } catch (err) {
    console.error(
      "THEATER ERROR:",
      err.response?.data || err.message
    );
    throw err;
  }
}

// latest_already_aired()
