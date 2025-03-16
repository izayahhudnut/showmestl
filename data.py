import requests
from bs4 import BeautifulSoup
import time
import csv

BASE_URL = "https://stl.parium.org"

def extract_item(card):
    # Extract image URL (prepend BASE_URL if relative)
    img_tag = card.find("img")
    image_url = img_tag.get("src") if img_tag else ""
    if image_url.startswith("/"):
        image_url = BASE_URL + image_url

    # Extract name and URL from the <a> that wraps the name <h3>
    a_tag = card.find("a", href=True)
    name = a_tag.get_text(strip=True) if a_tag else ""
    url = a_tag["href"] if a_tag else ""
    if url.startswith("/"):
        url = BASE_URL + url

    # Extract description from the appropriate <div>
    desc_div = card.find("div", class_="p-6 py-3 px-3 sm:px-6")
    description = desc_div.get_text(strip=True) if desc_div else ""

    # Initialize fields for location, address, and tags.
    location = ""
    address = ""
    tags = []

    # The container holding location (map-pin) and tag info.
    tags_container = card.find("div", class_="items-center p-6 flex gap-2 py-0 flex-wrap px-3 sm:px-6")
    if tags_container:
        for p in tags_container.find_all("p"):
            # Look for the SVG icon classes to decide what the <p> represents.
            svg = p.find("svg")
            text = p.get_text(strip=True)
            if svg and "lucide-map-pin" in " ".join(svg.get("class", [])):
                # If the text appears to be an address (contains digits), use it as Address.
                if any(ch.isdigit() for ch in text):
                    address = text
                else:
                    location = text
            else:
                # Other icons (or missing icon) are treated as tags.
                tags.append(text)

    return {
        "image": image_url,
        "name": name,
        "description": description,
        "location": location,
        "url": url,
        "address": address,
        "tags": ", ".join(tags)
    }

def scrape_page(page_url):
    print(f"Scraping: {page_url}")
    response = requests.get(page_url)
    if response.status_code != 200:
        print(f"Error fetching {page_url}")
        return [], None

    soup = BeautifulSoup(response.text, "html.parser")

    # Find all the cards – they have a distinctive set of classes.
    cards = soup.find_all("div", class_="rounded-lg border bg-card text-card-foreground shadow-sm h-52 md:h-44 flex overflow-x-scroll overflow-y-hidden")
    items = [extract_item(card) for card in cards]

    # Look for the pagination nav and the "Next" link.
    next_link = None
    nav = soup.find("nav", {"aria-label": "pagination"})
    if nav:
        a_next = nav.find("a", {"aria-label": "Go to next page"})
        if a_next:
            href = a_next.get("href")
            next_link = BASE_URL + href if href.startswith("/") else href

    return items, next_link

def scrape_all():
    # Start with page 1.
    page_url = BASE_URL + "/things-to-do?page=1"
    all_items = []
    while page_url:
        items, next_page = scrape_page(page_url)
        all_items.extend(items)

        # Stop if one of the items is the cathedral (as a stopping condition)
        if any("cathedral" in item["name"].lower() for item in items if item["name"]):
            print("Found the cathedral, stopping the scraper.")
            break

        page_url = next_page
        time.sleep(1)  # Politeness delay

    return all_items

if __name__ == "__main__":
    data = scrape_all()
    # Save results to a CSV file.
    with open("stl_things_to_do.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "image", "description", "location", "address", "url", "tags"])
        writer.writeheader()
        for item in data:
            writer.writerow(item)
    print(f"Scraped {len(data)} items. Data saved to stl_things_to_do.csv")
