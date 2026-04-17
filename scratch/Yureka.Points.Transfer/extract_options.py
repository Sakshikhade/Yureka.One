import asyncio
import json
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("https://points.casa/tools/transfer-calculator/", wait_until="networkidle")
        
        # Evaluate JS to pull initial data from the page
        # HTMX sometimes keeps state or there is a script tag with the data.
        # Let's extract any Javascript object that contains the data, or all the <option> or HTMX values.
        # Wait for the select or input list
        
        options = await page.evaluate('''() => {
            const transferFromItems = Array.from(document.querySelectorAll('[data-from-option]')).map(el => ({
                id: el.getAttribute('data-value') || el.innerText.trim(),
                name: el.innerText.trim()
            }));
            const transferToItems = Array.from(document.querySelectorAll('[data-to-option]')).map(el => ({
                id: el.getAttribute('data-value') || el.innerText.trim(),
                name: el.innerText.trim()
            }));
            
            // if we don't know the selector, just query all elements with HTMX or lists
            const allItems = Array.from(document.querySelectorAll('.program-item, li, option')).map(el => el.innerText.trim());
            return { transferFromItems, transferToItems, allItems: allItems.filter(x => x.length > 0).slice(0, 50) };
        }''')
        
        print(json.dumps(options, indent=2))
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
