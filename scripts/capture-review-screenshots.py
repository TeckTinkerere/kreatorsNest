"""Capture dual-mode IA review screenshots via Playwright."""
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
OUT = Path(__file__).resolve().parent.parent / "docs" / "review-screenshots"
OUT.mkdir(parents=True, exist_ok=True)

VIEWPORT = {"width": 1440, "height": 900}


def shot(page, name, full_page=True):
    path = OUT / f"{name}.png"
    page.screenshot(path=str(path), full_page=full_page)
    print(f"saved {path.name}")


def clear_storage(page):
    page.goto(BASE, wait_until="domcontentloaded")
    page.evaluate("() => { localStorage.clear(); sessionStorage.clear(); }")


def set_mode(page, mode):
    page.evaluate(
        """(mode) => {
        localStorage.setItem('kn-browse-mode', JSON.stringify({
          v: 1,
          mode,
          forkDismissed: true,
          updatedAt: new Date().toISOString()
        }));
      }""",
        mode,
    )


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport=VIEWPORT)

    # 1. First-visit fork (clear storage)
    clear_storage(page)
    page.reload(wait_until="networkidle")
    page.wait_for_timeout(1500)
    shot(page, "01-home-first-visit-fork")

    # 2. Explore home
    set_mode(page, "explore")
    page.reload(wait_until="networkidle")
    page.wait_for_timeout(1500)
    shot(page, "02-explore-home-discover")

    # 3. Guided home
    set_mode(page, "guided")
    page.reload(wait_until="networkidle")
    page.wait_for_timeout(1500)
    shot(page, "03-guided-home")

    # 4. Explore sidebar + resources
    set_mode(page, "explore")
    page.goto(f"{BASE}/resources", wait_until="networkidle")
    page.wait_for_timeout(1000)
    shot(page, "04-explore-resources")

    # 5. Documents hub
    page.goto(f"{BASE}/documents", wait_until="networkidle")
    page.wait_for_timeout(1000)
    shot(page, "05-documents-hub")

    # 6. Guided essentials
    set_mode(page, "guided")
    page.goto(f"{BASE}/essentials", wait_until="networkidle")
    page.wait_for_timeout(1000)
    shot(page, "06-guided-essentials")

    # 7. Guided scenarios (simplified)
    page.goto(f"{BASE}/scenarios", wait_until="networkidle")
    page.wait_for_timeout(1000)
    shot(page, "07-guided-scenarios")

    # 8. Explore scenarios
    set_mode(page, "explore")
    page.goto(f"{BASE}/scenarios", wait_until="networkidle")
    page.wait_for_timeout(2000)
    shot(page, "08-explore-scenarios")

    # 9. Browse mode toggle close-up — explore on home
    page.goto(BASE, wait_until="networkidle")
    toggle = page.get_by_role("group", name="Browse mode")
    toggle.scroll_into_view_if_needed()
    box = toggle.bounding_box()
    if box:
        page.screenshot(
            path=str(OUT / "09-browse-mode-toggle.png"),
            clip={
                "x": max(0, box["x"] - 20),
                "y": max(0, box["y"] - 60),
                "width": min(320, box["width"] + 40),
                "height": box["height"] + 100,
            },
        )
        print("saved 09-browse-mode-toggle.png")

    # 10. Mobile explore home
    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    mobile.goto(BASE, wait_until="domcontentloaded")
    set_mode(mobile, "explore")
    mobile.goto(BASE, wait_until="networkidle")
    mobile.wait_for_timeout(1500)
    mobile.screenshot(path=str(OUT / "10-mobile-explore-home.png"), full_page=True)
    print("saved 10-mobile-explore-home.png")

    browser.close()
    print("done")
