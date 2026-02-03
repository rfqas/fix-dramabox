
import { latest_already_aired } from "./dramabox_latest_already_aired.js";
import { getChapterDetail, getChapterList } from "./dramabox_download.js";

import fs from 'fs';

import { recommendedBooks } from "./recommended_books_data.js";

async function debug() {
    try {
        console.log("\n--- DEBUGGING RECOMMENDED BOOKS ---");

        for (const book of recommendedBooks) {
            const bookId = book.bookId;
            console.log(`\nTesting with Book: ${book.bookName} (ID: ${bookId})`);

            // Get list first
            console.log("Fetching chapter list...");
            const { chapters } = await getChapterList(bookId);
            if (chapters && chapters.length > 0) {
                console.log(`Found ${chapters.length} chapters.`);

                // Get detail of first chapter as a sample
                console.log("Fetching detail for chapter 1...");
                const detail = await getChapterDetail(bookId, 1, chapters.length);

                const filename = `chapter_dump_${bookId}.json`;
                console.log(`Writing dump to ${filename}...`);
                fs.writeFileSync(filename, JSON.stringify(detail, null, 2));
            } else {
                console.log("No chapters found for this book.");
            }
        }
        console.log("\nAll Done.");

    } catch (err) {
        console.error("Debug Error:", err);
    }
}

debug();
