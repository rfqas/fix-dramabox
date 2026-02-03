import express from 'express';
import { search } from './dramabox_search.js';
import { category_custom } from './dramabox_category.js';
import { dramabox_download, getChapterList, getChapterDetail } from './dramabox_download.js';
import { latest_already_aired } from './dramabox_latest_already_aired.js';
import { latest_coming_soon } from './dramabox_latest_coming_soon.js';
import { rank_all_fitur } from './dramabox_rank_all_fitur.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to handle async errors and responses
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Search Endpoint
// GET /search?keyword=...
app.get('/search', asyncHandler(async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }
    const result = await search(keyword);
    res.json({ success: true, data: result });
}));

// Category Endpoint
// GET /category?country=0&audio=0&access=0&genre=0&sort=1
app.get('/category', asyncHandler(async (req, res) => {
    const { country, audio, access, genre, sort } = req.query;
    // Convert query params to numbers, default to whatever the function expects
    const result = await category_custom(
        parseInt(country) || 0,
        parseInt(audio) || 0,
        parseInt(access) || 0,
        parseInt(genre) || 0,
        parseInt(sort) || 1
    );
    res.json({ success: true, count: result.length, data: result });
}));

// Download Endpoint (Full)
// GET /download?bookId=...
app.get('/download', asyncHandler(async (req, res) => {
    const { bookId } = req.query;
    if (!bookId) {
        return res.status(400).json({ error: 'bookId is required' });
    }
    const result = await dramabox_download(bookId);
    res.json({ success: true, data: result });
}));

// Chapter List Endpoint
// GET /chapter-list?bookId=...
app.get('/chapter-list', asyncHandler(async (req, res) => {
    const { bookId } = req.query;
    if (!bookId) return res.status(400).json({ error: 'bookId required' });
    const result = await getChapterList(bookId);
    res.json({ success: true, data: result });
}));

// Chapter Detail Endpoint
// GET /chapter-detail?bookId=...&index=...&total=...
app.get('/chapter-detail', asyncHandler(async (req, res) => {
    const { bookId, index, total } = req.query;
    if (!bookId || !index || !total) return res.status(400).json({ error: 'bookId, index, total required' });

    const result = await getChapterDetail(bookId, parseInt(index), parseInt(total));
    res.json({ success: true, data: result });
}));

// Latest Already Aired
// GET /latest-aired
app.get('/latest-aired', asyncHandler(async (req, res) => {
    const result = await latest_already_aired();
    res.json({ success: true, count: result.length, data: result });
}));

// Latest Coming Soon
// GET /coming-soon
app.get('/coming-soon', asyncHandler(async (req, res) => {
    const result = await latest_coming_soon();
    res.json({ success: true, count: result.length, data: result });
}));

// Default route - SERVE FRONTEND
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rank All Features
// GET /rank?type=1 (1=trending, 2=search, 3=newest)
app.get('/rank', asyncHandler(async (req, res) => {
    // Note: We need to update rank_all_fitur to accept type. 
    // For now assuming we will fix that next.
    const type = parseInt(req.query.type) || 1;
    const result = await rank_all_fitur(type);
    res.json({ success: true, count: result ? result.length : 0, data: result });
}));

app.listen(port, () => {
    console.log(`Dramabox API listening at http://localhost:${port}`);
});
