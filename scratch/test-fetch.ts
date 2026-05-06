import axios from 'axios';
import { JSDOM } from 'jsdom';

async function testFetch() {
  const url = 'https://yurekamoney.blogspot.com/2024/05/the-double-dip-masterclass.html';
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  
  try {
    const response = await axios.get(proxyUrl);
    const html = response.data.contents;
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    const selectors = ['.post-body', '[itemprop="articleBody"]', 'article', '.entry-content', 'main'];
    let content = null;
    
    for (const selector of selectors) {
      content = doc.querySelector(selector);
      if (content) {
        console.log(`Found content with selector: ${selector}`);
        break;
      }
    }
    
    if (content) {
      console.log('Content length:', content.innerHTML.length);
      // console.log('Snippet:', content.innerHTML.substring(0, 200));
    } else {
      console.log('Content not found');
    }
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}

testFetch();
