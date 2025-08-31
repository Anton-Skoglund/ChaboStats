from playwright.sync_api import sync_playwright
from datetime import date
import os
import requests
import html
from urllib.parse import urljoin
from colorama import Fore, Back, Style

import time

import msg # for colored output


url = "https://www.chalmersstudentbostader.se/sok-ledigt/"

# Create date-named folder
scrape_date = date.today().isoformat()
outdir = os.path.join(scrape_date)
details_dir = os.path.join(outdir, "details")
os.makedirs(details_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(url)
    page.wait_for_timeout(5000)  # wait for JS to load


    if not page.query_selector(".objectlist"):
        msg.error("No listings found on the page.")
        browser.close()
    
    # Save main listings page
    main_filename = os.path.join(outdir, f"{scrape_date}.html")
    with open(main_filename, "w", encoding="utf-8") as f:
        f.write(page.content())
    
    msg.banner(f"Saved main page to {main_filename}", msg.BannerType.SUCCESS)

    objectlists = page.query_selector_all(".objectlist")

    error_count = 0

    if len(objectlists) != 1:
        msg.banner(f"Expected one objectlists", msg.BannerType.ERROR)

    items = objectlists[0].query_selector_all("li.objektlista__listpost")

    start_time = time.time()

    for i, item in enumerate(items, start=1):
        # Get objektnummer
        objnum_raw = item.query_selector("dd.objektnummer")
        objnum = objnum_raw.inner_text().strip() if objnum_raw else None

        msg.loading(len(items), i, objnum, start_time=start_time)


        # Get link
        title_raw = item.query_selector(".objektlista__listpost__rubrik a")
        link = title_raw.get_attribute("href") if title_raw else None

        if objnum and link:            
            detail_page = browser.new_page()
            detail_page.goto(link)
            detail_page.wait_for_timeout(3000)  # wait a bit for JS

            # Save detail HTML
            detail_html = detail_page.content()
            html_path = os.path.join(details_dir, f"{objnum}.html")
            with open(html_path, "w", encoding="utf-8") as f:
                f.write(detail_html)

            # Check for floorplan PDF link
            floorplan_link = detail_page.query_selector("li.DokumentItem a.btn")
            if floorplan_link:
                raw_url = floorplan_link.get_attribute("href")
                if raw_url:
                    file_url = html.unescape(raw_url)
                    if file_url.startswith("//"):
                        file_url = "https:" + file_url
                    file_url = urljoin("https://www.chalmersstudentbostader.se", file_url)

                    try:
                        r = requests.get(file_url, timeout=15)
                        r.raise_for_status()

                        # Determine file extension from URL or Content-Type
                        ext = os.path.splitext(file_url)[1].lower()  # from URL
                        if not ext:
                            # fallback to Content-Type
                            content_type = r.headers.get("Content-Type", "")
                            if "pdf" in content_type:
                                ext = ".pdf"
                            elif "png" in content_type:
                                ext = ".png"
                            else:
                                ext = ".bin"  # unknown type

                        # Save the file
                        file_path = os.path.join(details_dir, f"{objnum}{ext}")
                        with open(file_path, "wb") as f:
                            f.write(r.content)

                    except requests.HTTPError as e:
                        msg.warn(f"Could not download file for {objnum}, status {r.status_code}")
                        error_count += 1
                    except Exception as e:
                        msg.error(f"Error downloading file for {objnum}: {e}")
                        error_count += 1
                        
            detail_page.close()


    msg.banner(f"Errors: {error_count} of {len(items)} items in objectlist", msg.BannerType.SUCCESS)

    browser.close()

