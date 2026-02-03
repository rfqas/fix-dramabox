
import { tokennya, DramaboxApp } from "./token_dramabox.js";
import axios from "axios";

async function test_download(bookId) {
    try {
        const auth = await tokennya();
        console.log("Got token");

        // 1. Get List
        const listPayload = { "bookId": bookId };
        const listTimestamp = Date.now();
        const listSignRaw = `timestamp=${listTimestamp}${JSON.stringify(listPayload)}${auth.deviceid}${auth.androidid}Bearer ${auth.token}`;
        const listSn = DramaboxApp.dramabox(listSignRaw);

        const listRes = await axios.post(`https://sapi.dramaboxdb.com/drama-box/chapterv2/list?timestamp=${listTimestamp}`, listPayload, {
            headers: {
                "package-name": "com.storymatrix.drama",
                "version": "521",
                "device-id": auth.deviceid,
                "android-id": auth.androidid,
                "tn": `Bearer ${auth.token}`,
                "sn": listSn,
                "content-type": "application/json; charset=UTF-8"
            }
        });

        const chapters = listRes.data?.data?.list;
        if (!chapters || chapters.length === 0) {
            console.log("No chapters found");
            return;
        }
        console.log(`Found ${chapters.length} chapters.`);

        // 2. Get 1st Chapter Detail
        const i = 1;
        const payload = {
            "enterReaderChapterIndex": chapters.length,
            "rid": "",
            "boundaryIndex": 0,
            "bookId": bookId,
            "pullCid": "",
            "comingPlaySectionId": -1,
            "preLoad": false,
            "currencyPlaySource": "ssym_ssjg",
            "currencyPlaySourceName": "搜索页面搜索结果",
            "index": i,
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
                headers: {
                    "package-name": "com.storymatrix.drama",
                    "version": "521",
                    "device-id": auth.deviceid,
                    "android-id": auth.androidid,
                    "tn": `Bearer ${auth.token}`,
                    "sn": sn,
                    "content-type": "application/json; charset=UTF-8"
                }
            }
        );

        const chapterDetail = response.data?.data?.chapterList?.[0];
        console.log("--- CHAPTER DETAIL SAMPLE ---");
        console.log(JSON.stringify(chapterDetail, null, 2));

    } catch (err) {
        console.error(err);
    }
}

// Use a bookId from the screenshot (Boss Behind the Scenes Is My Husband - 42000004540)
test_download("42000004540");
