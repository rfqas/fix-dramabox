/*
Scrape full all fitur dramabox
by WH MODS DEV
link channel wa : https://whatsapp.com/channel/0029VaZiRep4o7qHMGD3Ik06
Instagram: @one2_xyz
YouTube : coming soon

pesan : gak usah ngaku² lu ini scrape punya lu bego, kalau cuman copy paste doang gak usah sok jago, tersindir? makanya belajar yang bener lagi gak usah banyak kecot

📌 note : tinggal jalanin aja, code nya asli nya gak usah di acak kocak, kalau lu gak mau pakai file json, cukup ganti bagian fs nya aja lu rubah buat jadi return, jangan pula lu ganti semua bangsat nanti error salahin gw


TTD BY WH MODS DEV # JANGAN HAPUS CREDIT, YANG HAPUS CREDITS GW DOAIN BAKAL ADA MUSIBAH YANG NIMPA LU NTAR
*/
import axios from "axios";
import fs from "fs";
import { tokennya, DramaboxApp } from "./token_dramabox.js";

// Helper headers builder
const getHeaders = (auth, sn) => ({
  "user-agent": "okhttp/4.10.0",
  "accept-encoding": "gzip",
  "content-type": "application/json; charset=UTF-8",
  "package-name": "com.storymatrix.drama",
  "version": "521",
  "vn": "5.2.1",
  "p": "51",
  "cid": "DAUAT1059100",
  "nchid": "DRA1000042",
  "pline": "ANDROID",
  "over-flow": "new-fly",
  "device-id": auth.deviceid,
  "android-id": auth.androidid,
  "brand": "OPPO",
  "mf": "OPPO",
  "ov": "7.1.1",
  "srn": "1080x2160",
  "country-code": "ID",
  "language": "in",
  "locale": "in_ID",
  "current-language": "in",
  "time-zone": "+0700",
  "tz": "-420",
  "lat": "0",
  "userid": "303954295",
  "apn": "2",
  "mcc": "510",
  "tn": `Bearer ${auth.token}`,
  "sn": sn
});

export async function getChapterList(bookId) {
  console.log(`🔍 Mendapatkan list chapter untuk Book: ${bookId}`);
  const authInitial = await tokennya();
  if (!authInitial?.token) throw new Error("Gagal mendapatkan token awal");

  const listTimestamp = Date.now();
  const listPayload = { "bookId": bookId };
  const listSignRaw = `timestamp=${listTimestamp}${JSON.stringify(listPayload)}${authInitial.deviceid}${authInitial.androidid}Bearer ${authInitial.token}`;
  const listSn = DramaboxApp.dramabox(listSignRaw);

  const listRes = await axios.post(`https://sapi.dramaboxdb.com/drama-box/chapterv2/list?timestamp=${listTimestamp}`, listPayload, {
    headers: getHeaders(authInitial, listSn)
  });

  const chapters = listRes.data?.data?.list;
  if (!chapters) throw new Error("Gagal mengambil daftar chapter");

  return { chapters, auth: authInitial }; // Return list and auth usage if needed, but mostly list
}

export async function getChapterDetail(bookId, chapterIndex, totalChapters) {
  const auth = await tokennya();

  const payload = {
    "enterReaderChapterIndex": totalChapters,
    "rid": "",
    "boundaryIndex": 0,
    "bookId": bookId,
    "pullCid": "",
    "comingPlaySectionId": -1,
    "preLoad": false,
    "currencyPlaySource": "ssym_ssjg",
    "currencyPlaySourceName": "搜索页面搜索结果",
    "index": chapterIndex,
    "needEndRecommend": 0,
    "loadDirection": 1
  };

  const timestamp = Date.now();
  const signString = `timestamp=${timestamp}${JSON.stringify(payload)}${auth.deviceid}${auth.androidid}Bearer ${auth.token}`;
  const sn = DramaboxApp.dramabox(signString);

  const response = await axios.post(
    `https://sapi.dramaboxdb.com/drama-box/chapterv2/batch/load?timestamp=${timestamp}`,
    payload,
    {
      headers: getHeaders(auth, sn)
    }
  );

  return response.data?.data?.chapterList?.[0];
}

export async function dramabox_download(bookId) {
  try {
    const { chapters } = await getChapterList(bookId);

    const maxIndex = chapters[chapters.length - 1].chapterIndex;
    console.log(`✅ Total chapter: ${chapters.length}. Index terakhir: ${maxIndex}`);

    let finalData = [];

    for (let i = 1; i <= chapters.length; i++) {
      process.stdout.write(`⏳ Mengambil index ${i}/${chapters.length}... `);

      try {
        const chapterDetail = await getChapterDetail(bookId, i, chapters.length);
        if (chapterDetail) {
          finalData.push(chapterDetail);
          console.log(`✅ [OK]`);
        } else {
          console.log(`❌ Kosong (Server mengembalikan data kosong)`);
        }
      } catch (err) {
        console.log(`❌ Error pada index ${i}: ${err.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const fileName = `result_${bookId}.json`;
    fs.writeFileSync(fileName, JSON.stringify(finalData, null, 2));
    console.log(`\n🎉 SELESAI! Total ${finalData.length} data disimpan di ${fileName}`);
    return finalData;

  } catch (err) {
    console.error("Scrape Gagal Total:", err.message);
  }
}

// Jalankan
// dramabox_download("41000122939");