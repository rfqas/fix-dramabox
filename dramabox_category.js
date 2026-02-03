/*
Scrape full all fitur dramabox
by WH MODS DEV
link channel wa : https://whatsapp.com/channel/0029VaZiRep4o7qHMGD3Ik06
Instagram: @one2_xyz
YouTube : coming soon

pesan : gak usah ngaku² lu ini scrape punya lu bego, kalau cuman copy paste doang gak usah sok jago, tersindir? makanya belajar yang bener lagi gak usah banyak kecot


📌 note : cara gunakan fitur nya di tiap type udah gw kasih keterangan itu apa, jadi simpel kan tinggal input angka doang, nah di bot lu pada kasih keterangan sendiri lah masa buat ketika manual di menu nya gak bisa bangke

TTD BY WH MODS DEV # JANGAN HAPUS CREDIT, YANG HAPUS CREDITS GW DOAIN BAKAL ADA MUSIBAH YANG NIMPA LU NTAR
*/
import axios from "axios";
import fs from "fs";
import { tokennya, DramaboxApp } from "./token_dramabox.js";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const TYPE_1_COUNTRY = {
  0: "", // Semua
  1: "中国", // China
  2: "美国", // Amerika
  3: "韩国", // Korea Selatan
  4: "日本", // Jepang
  5: "泰国,菲律宾,印度尼西亚,德国,西语国家,葡语国家,阿拉伯国家" // Lainnya
};

const TYPE_2_AUDIO = {
  0: "",  // Semua
  1: "1", // Sulih suara
  2: "0"  // Subtitle saja
};

const TYPE_3_ACCESS = {
  0: "",  // Semua
  1: "3"  // Anggota saja
};

const TYPE_4_GENRE = {
  0: "",             // Semua
  1: "1357",         // Romansa
  2: "1361",         // Wanita kuat
  3: "1323",         // Pria dominan
  4: "1394,1337",    // Balas dendam
  5: "1324,1362",    // CEO
  6: "1348,1408",    // Keluarga
  7: "1334",         // Kekuatan khusus
  8: "1395,1338",    // Pembalikan identitas
  9: "1400,1341",    // Perselingkuhan
  10: "1405,1345",   // Terlahir kembali
  11: "1353,1319",   // Sejarah
  12: "1332",        // Tokoh legendaris
  13: "1386",        // Cinta rahasia
  14: "1411,1350",   // Intrik keluarga
  15: "1393",        // Cinta setelah menikah
  16: "1382,1663",   // Takdir cinta
  17: "1392"         // Kesempatan kedua
};

const TYPE_5_SORT = {
  1: "1", // Terpopuler
  2: "2"  // Terbaru
};

function buildTypeList({
  country = 0,
  audio = 0,
  access = 0,
  genre = 0,
  sort = 1
}) {
  return [
    { type: 1, value: TYPE_1_COUNTRY[country] ?? "" },
    { type: 2, value: TYPE_2_AUDIO[audio] ?? "" },
    { type: 3, value: TYPE_3_ACCESS[access] ?? "" },
    { type: 4, value: TYPE_4_GENRE[genre] ?? "" },
    { type: 5, value: TYPE_5_SORT[sort] ?? "1" }
  ];
}

export async function category_custom(country, audio, access, genre, sort) {
  try {
    const auth = await tokennya();
    if (!auth?.token) throw new Error("Token gagal");

    const allRecords = [];
    let page = 1;
    const MAX_LIMIT = 56;

    const categoryConfig = {
      country,
      audio,
      access,
      genre,
      sort
    };

    while (page <= MAX_LIMIT) {

      const payload = {
        typeList: buildTypeList(categoryConfig),
        showLabels: false,
        pageNo: page,
        pageSize: 15
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
        `https://sapi.dramaboxdb.com/drama-box/he001/classify?timestamp=${timestamp}`,
        payload,
        {
          headers: {
            "user-agent": "okhttp/4.10.0",
            "accept-encoding": "gzip, deflate, br",
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
            "active-time": "12000",

            "tn": `Bearer ${auth.token}`,
            "sn": sn
          }
        }
      );

      const records = response.data?.data?.classifyBookList?.records || [];

      if (records.length === 0) {
        console.log(`⛔ Page ${page} kosong → STOP`);
        break;
      }

      console.log(`✅ Page ${page} OK (${records.length})`);
      allRecords.push(...records);

      page++;
      await sleep(1000);
    }

    fs.writeFileSync(
      "classify_result_all.json",
      JSON.stringify(
        {
          category: categoryConfig,
          total_records: allRecords.length,
          last: page - 1,
          max_limit: MAX_LIMIT,
          generated_at: new Date().toISOString(),
          data: allRecords
        },
        null,
        2
      )
    );

    console.log(`🎉 SELESAI — total ${allRecords.length} Category`);
    return allRecords;

  } catch (err) {
    console.error(
      "Category ERROR:",
      err.response?.data || err.message
    );
  }
}

// category_custom(0, 1, 2, 3, 1);
