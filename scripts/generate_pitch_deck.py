#!/usr/bin/env python3
"""
Wasalt Investor Pitch Deck Generator.
Compiles empirical transit data, unit economics, feature suites, and strategic roadmaps
into an executive-grade 25-slide PowerPoint presentation (16:9 widescreen).
"""

import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# -----------------------------------------------------------------------------
# Color Palette & Styling Constants (Modern Executive Dark Theme)
# -----------------------------------------------------------------------------
COLOR_BG = RGBColor(15, 23, 42)          # Slate 900 (#0F172A)
COLOR_CARD_BG = RGBColor(30, 41, 59)     # Slate 800 (#1E293B)
COLOR_CARD_BORDER = RGBColor(51, 65, 85) # Slate 700 (#334155)
COLOR_PRIMARY = RGBColor(14, 165, 233)   # Sky/Cyan (#0EA5E9)
COLOR_SECONDARY = RGBColor(56, 189, 248) # Sky Light (#38BDF8)
COLOR_ACCENT_GREEN = RGBColor(16, 185, 129) # Emerald (#10B981)
COLOR_ACCENT_GOLD = RGBColor(245, 158, 11)  # Amber (#F59E0B)
COLOR_ACCENT_RED = RGBColor(239, 68, 68)    # Red (#EF4444)
COLOR_TEXT_WHITE = RGBColor(248, 250, 252)  # Slate 50 (#F8FAFC)
COLOR_TEXT_MUTED = RGBColor(148, 163, 184)  # Slate 400 (#94A3B8)
COLOR_TEXT_DIM = RGBColor(100, 116, 139)    # Slate 500 (#64748B)

FONT_HEADING = "Segoe UI"
FONT_BODY = "Segoe UI"


def create_deck():
    prs = Presentation()
    # 16:9 Widescreen standard dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]  # completely blank slide

    def set_slide_background(slide):
        bg_shape = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)
        )
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = COLOR_BG
        bg_shape.line.fill.background()
        return bg_shape

    def add_header(slide, category, title, subtitle=None):
        # Category Pill / Tag
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.7), Inches(0.35))
        tf_c = cat_box.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0
        p_c = tf_c.paragraphs[0]
        p_c.text = category.upper()
        p_c.font.name = FONT_HEADING
        p_c.font.size = Pt(10)
        p_c.font.bold = True
        p_c.font.color.rgb = COLOR_PRIMARY

        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.7))
        tf_t = t_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.name = FONT_HEADING
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_TEXT_WHITE

        if subtitle:
            p_s = tf_t.add_paragraph()
            p_s.text = subtitle
            p_s.font.name = FONT_BODY
            p_s.font.size = Pt(12)
            p_s.font.color.rgb = COLOR_TEXT_MUTED
            p_s.space_before = Pt(3)

    def add_footer(slide, slide_num):
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.733), Inches(0.35))
        tf = footer_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = "WASALT TRANSIT PLATFORM  |  CONFIDENTIAL INVESTOR PITCH DECK"
        p.font.name = FONT_BODY
        p.font.size = Pt(9)
        p.font.color.rgb = COLOR_TEXT_DIM

        # Slide Number (Right Aligned)
        num_box = slide.shapes.add_textbox(Inches(11.5), Inches(7.0), Inches(1.0), Inches(0.35))
        tf_num = num_box.text_frame
        tf_num.word_wrap = True
        p_num = tf_num.paragraphs[0]
        p_num.alignment = PP_ALIGN.RIGHT
        p_num.text = f"{slide_num:02d} / 25"
        p_num.font.name = FONT_BODY
        p_num.font.size = Pt(9)
        p_num.font.bold = True
        p_num.font.color.rgb = COLOR_PRIMARY

    def add_card(slide, left, top, width, height, title=None, border_color=COLOR_CARD_BORDER, bg_color=COLOR_CARD_BG):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.2)
        tf.margin_bottom = Inches(0.2)

        if title:
            p = tf.paragraphs[0]
            p.text = title
            p.font.name = FONT_HEADING
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = COLOR_TEXT_WHITE
            p.alignment = PP_ALIGN.LEFT
            p.space_after = Pt(8)

        return card

    # =========================================================================
    # SLIDE 1: Title Slide (Cover)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Decorative background element
    add_card(s1, Inches(0.8), Inches(1.2), Inches(11.733), Inches(5.2), border_color=COLOR_PRIMARY)

    title_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(3.8))
    tf1 = title_box.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "WASALT TRANSIT PLATFORM"
    p.font.name = FONT_HEADING
    p.font.size = Pt(38)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    p2 = tf1.add_paragraph()
    p2.text = "Digitizing Mass Transit in Greater Cairo & Egypt"
    p2.font.name = FONT_HEADING
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_TEXT_WHITE
    p2.space_before = Pt(8)

    p3 = tf1.add_paragraph()
    p3.text = "The Zero-CapEx Telematics Platform & Driver Profit-Sharing Moat"
    p3.font.name = FONT_BODY
    p3.font.size = Pt(15)
    p3.font.color.rgb = COLOR_SECONDARY
    p3.space_before = Pt(12)

    p4 = tf1.add_paragraph()
    p4.text = "Empowering 13 Million Daily Commuters  |  Turning Drivers into Partners  |  37.0% EBITDA Margin"
    p4.font.name = FONT_BODY
    p4.font.size = Pt(13)
    p4.font.color.rgb = COLOR_TEXT_MUTED
    p4.space_before = Pt(28)

    p5 = tf1.add_paragraph()
    p5.text = "Seed Stage Investment Pitch  •  September 2026  •  Confidential"
    p5.font.name = FONT_BODY
    p5.font.size = Pt(11)
    p5.font.color.rgb = COLOR_ACCENT_GOLD
    p5.space_before = Pt(16)

    # =========================================================================
    # SLIDE 2: Executive Summary
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "Executive Overview", "Wasalt at a Glance: High-Impact Urban Mobility", "Connecting millions of Egyptian commuters to reliable, real-time public transit.")
    add_footer(s2, 2)

    c1 = add_card(s2, Inches(0.8), Inches(1.8), Inches(3.7), Inches(4.8), "Massive Problem")
    tf = c1.text_frame
    p = tf.add_paragraph()
    p.text = "• 13M+ daily passengers in Greater Cairo rely on buses with zero live tracking."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(10)
    p = tf.add_paragraph()
    p.text = "• Commuters waste 35–55 minutes of idle anxiety daily waiting at stops."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(10)
    p = tf.add_paragraph()
    p.text = "• Traffic friction costs Egypt EGP 50B+ (~$8B USD) annually (4% of GDP)."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    c2 = add_card(s2, Inches(4.8), Inches(1.8), Inches(3.7), Inches(4.8), "Our Solution & Moat", border_color=COLOR_PRIMARY)
    tf = c2.text_frame
    p = tf.add_paragraph()
    p.text = "• 100% Smartphone Telematics: Zero hardware boxes installed on buses."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(10)
    p = tf.add_paragraph()
    p.text = "• 50% Driver Profit Share: Drivers earn 1,315 EGP/mo, ensuring 99%+ GPS uptime."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(10)
    p = tf.add_paragraph()
    p.text = "• Zero-Cost Cartography: OpenStreetMap integration eliminates costly map APIs."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    c3 = add_card(s2, Inches(8.8), Inches(1.8), Inches(3.7), Inches(4.8), "Investment Highlights", border_color=COLOR_ACCENT_GREEN)
    tf = c3.text_frame
    p = tf.add_paragraph()
    p.text = "• High Margins: Year 1 gross revenue of 3.15M EGP with 37.0% EBITDA margin."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(10)
    p = tf.add_paragraph()
    p.text = "• Micro-Unit Breakeven: Just 66 paying commuters fund an entire bus route."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(10)
    p = tf.add_paragraph()
    p.text = "• Defensible Beachhead: Starting with 1,800 licensed private minibuses."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 3: The Urban Problem
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "The Pain Point", "Cairo's Daily Transit Crisis: Anxiety, Blindness & Lost Hours", "Why urban transit in Africa's largest metropolis is fundamentally broken.")
    add_footer(s3, 3)

    # 4 horizontal problem cards
    p_cards = [
        ("35–55 Minutes Lost", "Commuters stand blindly at dusty stops without knowing if their bus passed 2 minutes ago or won't arrive for an hour.", COLOR_ACCENT_RED),
        ("Blind Fleet Operators", "Transit dispatchers and fleet owners have zero real-time visibility into vehicle positions, speeding, or bunching.", COLOR_ACCENT_GOLD),
        ("Severe Economic Drain", "World Bank Report 85848 established that Cairo congestion wastes EGP 50+ Billion annually (3.6% to 4.0% of GDP).", COLOR_PRIMARY),
        ("Safety & Family Anxiety", "Parents have no way to verify when their children or elderly family members safely board or arrive at their destinations.", COLOR_SECONDARY)
    ]
    for i, (title, desc, color) in enumerate(p_cards):
        x = Inches(0.8 + i * 2.95)
        card = add_card(s3, x, Inches(1.8), Inches(2.8), Inches(4.8), title, border_color=color)
        tf = card.text_frame
        p = tf.add_paragraph()
        p.text = desc
        p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 4: Why Past Competitors Failed
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "Market Teardown", "Why Previous Tracking Apps Failed: The Ghost Bus Trap", "Hardwired devices created false promises and consumer outrage.")
    add_footer(s4, 4)

    c_left = add_card(s4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "The Failed Traditional Model (Tawwaly / Mowaslat Misr)", border_color=COLOR_ACCENT_RED)
    tf = c_left.text_frame
    items_bad = [
        "1. Expensive Hardware: Installed $150–$300 OBD GPS black boxes in buses.",
        "2. Ignored the Driver: Drivers were unpaid, unmotivated, and felt surveilled.",
        "3. Deliberate Sabotage: Drivers unplugged antennas or shut off power switches.",
        "4. The Ghost Bus Outrage: Apps showed buses that never arrived, destroying public trust and leading to mass uninstalls."
    ]
    for item in items_bad:
        p = tf.add_paragraph()
        p.text = item
        p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(12)

    c_right = add_card(s4, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "The Wasalt Defensible Flywheel", border_color=COLOR_ACCENT_GREEN)
    tf = c_right.text_frame
    items_good = [
        "1. Zero Hardware ($0 CapEx): Operates purely via the driver's existing smartphone.",
        "2. Driver is a Partner: Drivers receive 50% of platform revenue (1,315 EGP/mo).",
        "3. Guaranteed 99%+ Uptime: Financial incentive makes drivers our quality champions.",
        "4. Genuine Reliability: Commuters trust live dots because verified drivers are behind every broadcast."
    ]
    for item in items_good:
        p = tf.add_paragraph()
        p.text = item
        p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_WHITE; p.space_after = Pt(12)

    # =========================================================================
    # SLIDE 5: The Wasalt Solution
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Platform Architecture", "The Wasalt Tri-Sided Transit Ecosystem", "Seamlessly unifying Commuters, Bus Drivers, and Fleet Dispatchers.")
    add_footer(s5, 5)

    tri_pillars = [
        ("1. Commuter App", "Mobile experience on iOS & Android offering live map tracking, 1-second arrival countdowns, crowding status, and family safety sharing.", COLOR_PRIMARY),
        ("2. Driver Beacon", "Ultra-simple driver HUD streaming high-precision GPS every 1 second, with automated trip management and monthly incentive earnings trackers.", COLOR_ACCENT_GREEN),
        ("3. Admin Command", "Dispatcher web portal providing multi-fleet oversight, visual route editing, driver assignments, and live emergency telemetry controls.", COLOR_SECONDARY)
    ]
    for i, (title, desc, color) in enumerate(tri_pillars):
        x = Inches(0.8 + i * 3.95)
        card = add_card(s5, x, Inches(1.8), Inches(3.8), Inches(4.8), title, border_color=color)
        tf = card.text_frame
        p = tf.add_paragraph()
        p.text = desc
        p.font.size = Pt(13); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(14)
        p = tf.add_paragraph()
        p.text = "Value Delivered:"
        p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = COLOR_TEXT_WHITE
        p = tf.add_paragraph()
        if i == 0:
            p.text = "• Eliminates wait anxiety\n• 35+ mins saved daily\n• 100% peace of mind"
        elif i == 1:
            p.text = "• Supplemental monthly income\n• Fuel & internet allowance\n• Professional dignity"
        else:
            p.text = "• Real-time fleet telematics\n• Zero hardware maintenance\n• Complete operational control"
        p.font.size = Pt(11); p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 6: The Driver Incentive Moat
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Competitive Moat", "The 50% Driver Profit Share: Turning Skeptics into Partners", "Why our unit economics solve the single greatest vulnerability in transit tech.")
    add_footer(s6, 6)

    c_moat_left = add_card(s6, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Driver Compensation Architecture")
    tf = c_moat_left.text_frame
    p = tf.add_paragraph()
    p.text = "Drivers are the heartbeat of Egyptian transit. Rather than penalizing or surveilling them, Wasalt allocates 50.0% of top-line revenue directly to active drivers."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(12)
    p = tf.add_paragraph()
    p.text = "Monthly Package (1,315 EGP / Month):"
    p.font.size = Pt(13); p.font.bold = True; p.font.color.rgb = COLOR_PRIMARY; p.space_after = Pt(6)
    p = tf.add_paragraph()
    p.text = "• 1,115 EGP Base Cash Stipend: Paid directly into driver's mobile wallet for maintaining active transmission during assigned shifts."
    p.font.size = Pt(11); p.font.color.rgb = COLOR_TEXT_WHITE; p.space_after = Pt(6)
    p = tf.add_paragraph()
    p.text = "• 200 EGP Data & Maintenance Quota: Reimburses high-speed 4G data bundles and durable windshield phone mounts."
    p.font.size = Pt(11); p.font.color.rgb = COLOR_TEXT_WHITE

    c_moat_right = add_card(s6, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Why This Creates an Unbeatable Moat", border_color=COLOR_ACCENT_GREEN)
    tf = c_moat_right.text_frame
    pts = [
        ("99%+ Verified GPS Uptime", "Drivers actively open Wasalt before turning their ignition because their stipend depends on transmission continuity."),
        ("Peer Accountability", "Drivers remind fellow depot drivers to run the app so their shared route maintains a 5-star commuter rating."),
        ("No Competitor Poaching", "Any competitor attempting to enter the market without matching this 50% driver revenue share will face immediate driver boycotts."),
        ("Zero Installation Friction", "Onboarding a driver takes 3 minutes via Google Play download — zero garage downtime or mechanic fees.")
    ]
    for title, desc in pts:
        p = tf.add_paragraph()
        p.text = f"• {title}: {desc}"
        p.font.size = Pt(11); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(8)

    # =========================================================================
    # SLIDE 7: Passenger Experience (Live Map & ETAs)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "Product Features: Passenger", "Everyday Commuter Experience: Live Map, Line Search & ETAs", "Empowering passengers to leave home exactly when their bus is approaching.")
    add_footer(s7, 7)

    f_pax = [
        ("Live Interactive Map", "Commuters see animated bus icons pulsing in real-time along actual Cairo streets with zero page reloads or lag.", COLOR_PRIMARY),
        ("Smart Line Directory", "Instant search by bus number, line code, destination landmark, or operating company (CTA, BRT, Mwaslat Misr).", COLOR_SECONDARY),
        ("High-Accuracy ETAs", "Dynamic arrival times calculated using traffic-aware transit velocity profiles tailored to Egyptian bottleneck conditions.", COLOR_ACCENT_GREEN),
        ("Egyptian Landmark Presets", "Search by real cultural landmarks (Tahrir, Ramses, Nasr City, Pyramids, Cairo Festival City) without confusing street names.", COLOR_ACCENT_GOLD)
    ]
    for i, (title, desc, color) in enumerate(f_pax):
        x = Inches(0.8 + i * 2.95)
        card = add_card(s7, x, Inches(1.8), Inches(2.8), Inches(4.8), title, border_color=color)
        tf = card.text_frame
        p = tf.add_paragraph()
        p.text = desc
        p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 8: Passenger Experience (Family Safety & Alerts)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Product Features: Family", "Peace of Mind: Proactive Notifications & Family Safety Sharing", "Turning routine commutes into transparent, stress-free daily journeys.")
    add_footer(s8, 8)

    c_fam1 = add_card(s8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Dynamic Proximity Alerts (Standard Tier)")
    tf = c_fam1.text_frame
    p = tf.add_paragraph()
    p.text = "Commuters no longer need to keep their eyes glued to the phone screen:"
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(10)
    alerts = [
        "• 'Bus is 2 Stops Away': Timely heads-up to step out of the office or cafe.",
        "• 'Approaching Destination': Wake-up reminder for sleepy commuters before their terminal.",
        "• 'Route Disruption Warning': Preemptively alerts commuters if abnormal delays occur ahead."
    ]
    for a in alerts:
        p = tf.add_paragraph()
        p.text = a; p.font.size = Pt(11); p.font.color.rgb = COLOR_TEXT_WHITE; p.space_after = Pt(8)

    c_fam2 = add_card(s8, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Live Family Safety Sharing (Family Tier)", border_color=COLOR_PRIMARY)
    tf = c_fam2.text_frame
    p = tf.add_paragraph()
    p.text = "In Egyptian culture, family safety is paramount. Wasalt Family Tier (17 EGP/user) delivers unprecedented peace of mind:"
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(10)
    fam_features = [
        "• Boarding Verification: Parents get notified the moment their child boards their designated school or university bus.",
        "• Real-Time Journey Tracking: Track loved ones safely in real time without having to call or distract them while traveling.",
        "• Geofence Arrival Confirmation: Automatic notifications when family members arrive safely at home, school, or depot.",
        "• One-Tap Emergency SOS: Instant location broadcast to family members if an emergency occurs."
    ]
    for f in fam_features:
        p = tf.add_paragraph()
        p.text = f; p.font.size = Pt(11); p.font.color.rgb = COLOR_TEXT_WHITE; p.space_after = Pt(8)

    # =========================================================================
    # SLIDE 9: Driver Experience
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "Product Features: Driver", "Frictionless Driver HUD: One-Tap Broadcast & Earnings Tracking", "Designed specifically for non-technical drivers operating in chaotic traffic.")
    add_footer(s9, 9)

    c_drv1 = add_card(s9, Inches(0.8), Inches(1.8), Inches(3.7), Inches(4.8), "1-Tap Start / Stop")
    tf = c_drv1.text_frame
    p = tf.add_paragraph()
    p.text = "• Zero Cognitive Load: Large high-contrast touch targets usable with one finger.\n\n• Line Selection: Driver chooses their assigned line from a pre-configured company dropdown.\n\n• Automated Broadcast: Starts streaming 1-second GPS immediately upon tapping 'Start Sharing'."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    c_drv2 = add_card(s9, Inches(4.8), Inches(1.8), Inches(3.7), Inches(4.8), "Live Earnings Dashboard", border_color=COLOR_ACCENT_GREEN)
    tf = c_drv2.text_frame
    p = tf.add_paragraph()
    p.text = "• Transparent Progress: Live progress ring showing monthly hours completed toward their 1,315 EGP payout.\n\n• Instant Gratification: Drivers see their estimated earnings climb with every completed shift.\n\n• Direct Mobile Payouts: Integrates with Vodafone Cash, Orange Cash, and InstaPay."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    c_drv3 = add_card(s9, Inches(8.8), Inches(1.8), Inches(3.7), Inches(4.8), "Operational Safety")
    tf = c_drv3.text_frame
    p = tf.add_paragraph()
    p.text = "• Concurrency Shield: Prevents account sharing or ghost streaming across multiple devices.\n\n• Background Resiliency: Continues streaming seamlessly even when screen locks or navigation apps overlay.\n\n• Battery Optimization: Highly tuned location service consumes <8% phone battery per 7-hour shift."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 10: Operator & Dispatch Command Portal
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "Product Features: B2B", "Wasalt Command Center: Complete Fleet Visibility for Operators", "The enterprise web console giving dispatchers real-time command over their fleets.")
    add_footer(s10, 10)

    c_adm1 = add_card(s10, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Core Dispatch Modules")
    tf = c_adm1.text_frame
    p = tf.add_paragraph()
    p.text = "• Live Fleet Overview Map: See every bus in motion across Cairo with instant status badges (Active, Idle, Delayed).\n\n• Visual Route Builder: Non-technical dispatchers can click anywhere on the map to create new bus routes or adjust terminals.\n\n• Multi-Operator Isolation: Strict role-based access allows company admins (e.g. CTA vs BRT) to view only their vehicles.\n\n• Driver Dispatch Directory: One-click line assignment, credential management, and live phone contacts."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    c_adm2 = add_card(s10, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Enterprise Safety & Control", border_color=COLOR_PRIMARY)
    tf = c_adm2.text_frame
    p = tf.add_paragraph()
    p.text = "• Emergency Broadcast Cutoff: One-click killswitch immediately stops compromised or errant vehicle location streams.\n\n• Master Admin 2FA: Hardened security gateway protected by RFC 6238 TOTP (Google/Microsoft Authenticator).\n\n• Database Hygiene Scanner: Automated detection and cleanup of corrupt or duplicate database records.\n\n• Commuter Analytics: Search and inspect passenger trip volume, peak travel hours, and route demand trends."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 11: Market Sizing (TAM / SAM / SOM)
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11)
    add_header(s11, "Market Opportunity", "Market Sizing: Capturing Africa's Densest Transit Market", "A multi-million commuter base ripe for digital transformation.")
    add_footer(s11, 11)

    m_cards = [
        ("TAM: Greater Cairo Transit", "20M+ Person-Trips / Day", "Over 20 million motorized person-trips occur daily across Cairo, Giza, and Qalyubia, with 63%–66% relying on collective mass transit.", COLOR_TEXT_WHITE),
        ("SAM: Rubber-Tire Buses", "8.5M+ Daily Commuters", "Large public buses and collective minibuses carry >68% of all mass transit journeys across 4,300+ registered transit buses.", COLOR_PRIMARY),
        ("SOM: Year 1–2 Target", "100K Daily Commuters", "Targeting 50,000 active app users across 100–120 buses operating on Cairo's top 10 high-density transit corridors.", COLOR_ACCENT_GREEN)
    ]
    for i, (title, stat, desc, color) in enumerate(m_cards):
        x = Inches(0.8 + i * 3.95)
        card = add_card(s11, x, Inches(1.8), Inches(3.8), Inches(4.8), title, border_color=color)
        tf = card.text_frame
        p = tf.add_paragraph()
        p.text = stat
        p.font.size = Pt(18); p.font.bold = True; p.font.color.rgb = color; p.space_after = Pt(14)
        p = tf.add_paragraph()
        p.text = desc
        p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 12: Target Beachhead Fleet
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12)
    add_header(s12, "Go-To-Market Focus", "Beachhead Fleet: Starting with Private Minibus Concessionaires", "Eliminating municipal red tape to achieve rapid commercial scale.")
    add_footer(s12, 12)

    c_b1 = add_card(s12, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Phase 1 Beachhead: Private Concessionaires", border_color=COLOR_ACCENT_GREEN)
    tf = c_b1.text_frame
    p = tf.add_paragraph()
    p.text = "• Target: ~1,800 licensed collective transport minibuses (مشروع النقل الجماعي).\n\n• Key Operators: Mwaslat Misr, English Bus, El-Rowad, Lotus, El-Bahr El-Ahmar.\n\n• Why They Move Fast: Private companies have immediate commercial decision-making authority without municipal bureaucracy.\n\n• Driver Alignment: Drivers are private contractors eager for 1,315 EGP supplemental monthly stipends.\n\n• Fast Rollout: 100 buses across 10 trunk lines in 60 days."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    c_b2 = add_card(s12, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Phase 2 & 3 Expansion: Municipal & BRT Fleets")
    tf = c_b2.text_frame
    p = tf.add_paragraph()
    p.text = "• Cairo Transport Authority (CTA): ~2,500 full-size public buses.\n\n• Institutional MoU: Approach the Ministry of Local Development and CTA with proven Phase 1 reliability metrics for an official digital pilot.\n\n• Ring Road BRT: 100 electric buses operating along the 106-km corridor across 49 stations.\n\n• Intercity Operators: Expand into premium long-distance coaches (Super Jet, Go Bus, West & Mid Delta)."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 13: Business & Monetization Model
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_background(s13)
    add_header(s13, "Revenue Model", "Consumer Monetization: The 3-Tier Micro-Subscription Model", "Balancing viral organic commuter adoption with recurring subscription cash flow.")
    add_footer(s13, 13)

    tiers = [
        ("Tier 1: Free (Ad-Supported)", "0 EGP", "80% of Users (40,000)", "72,000 EGP / Mo", "• Real-time map & line search\n• 1 saved favorite route\n• Monetized via non-intrusive route banners & search interstitials\n• Generates 2.4M impressions/mo", COLOR_TEXT_WHITE),
        ("Tier 2: Standard Plan", "20 EGP / Mo", "14% of Users (7,000)", "140,000 EGP / Mo", "• 100% Ad-Free experience\n• Dynamic push notifications ('Bus is 2 stops away')\n• Unlimited saved favorite lines\n• Bus crowding indicators", COLOR_PRIMARY),
        ("Tier 3: Family Safety", "17 EGP / User", "6% of Users (3,000)", "51,000 EGP / Mo", "• 15% discount (min 3 users = 51 EGP/mo)\n• Live Family Safety Sharing\n• Boarding & arrival confirmations\n• One-tap SOS emergency alert", COLOR_ACCENT_GREEN)
    ]
    for i, (title, price, share, rev, details, color) in enumerate(tiers):
        x = Inches(0.8 + i * 3.95)
        card = add_card(s13, x, Inches(1.8), Inches(3.8), Inches(4.8), title, border_color=color)
        tf = card.text_frame
        p = tf.add_paragraph()
        p.text = f"{price}  •  {share}"
        p.font.size = Pt(13); p.font.bold = True; p.font.color.rgb = color; p.space_after = Pt(4)
        p = tf.add_paragraph()
        p.text = f"Revenue: {rev}"
        p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = COLOR_TEXT_WHITE; p.space_after = Pt(12)
        p = tf.add_paragraph()
        p.text = details
        p.font.size = Pt(11); p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 14: Unit Economics per Bus
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_background(s14)
    add_header(s14, "Unit Economics", "Micro-Unit Breakeven: How 66 Passengers Fund an Entire Bus", "The power of hyper-local transit network effects.")
    add_footer(s14, 14)

    c_ue1 = add_card(s14, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Single Bus Unit Economics")
    tf = c_ue1.text_frame
    p = tf.add_paragraph()
    p.text = "• Total Monthly Bus Cost: 1,315 EGP (100% driver compensation pool).\n\n• Standard Tier Price: 20 EGP / user / month.\n\n• Paying Subscriber Breakeven: Just 66 paying commuters on that bus line fully fund the driver's monthly stipend.\n\n• Blended Community Breakeven: At our blended average revenue per user (5.26 EGP), exactly 250 total commuters (free + paid) achieve total breakeven."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    c_ue2 = add_card(s14, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Corridor Reality Check", border_color=COLOR_ACCENT_GREEN)
    tf = c_ue2.text_frame
    p = tf.add_paragraph()
    p.text = "• Cairo Daily Ridership per Bus: A single 26-seat minibus makes 6–8 round-trips daily, carrying 800 to 1,200 passengers every day.\n\n• Trivial Penetration Needed: Capturing just 250 commuters out of 1,000 daily riders represents a mere 25% route penetration.\n\n• Pure Profit Margin: Every subscriber beyond user #66 flows directly to bottom-line platform profit."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_WHITE

    # =========================================================================
    # SLIDE 15: Year 1 Pro Forma P&L
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    set_slide_background(s15)
    add_header(s15, "Financial Projections", "Year 1 Pro Forma P&L: 3.15M EGP Revenue with 37.0% EBITDA", "Asset-light software economics driving strong operating profitability.")
    add_footer(s15, 15)

    c_pl1 = add_card(s15, Inches(0.8), Inches(1.8), Inches(6.8), Inches(4.8), "Year 1 P&L Statement (100 Fleet Buses / 50k Users)")
    tf = c_pl1.text_frame
    p_data = [
        ("Gross Revenue (Ads + Subscriptions)", "+263,000 EGP", "+3,156,000 EGP", "100.0%", COLOR_ACCENT_GREEN),
        ("Driver Profit Share (50% Pool)", "(131,500 EGP)", "(1,578,000 EGP)", "50.0%", COLOR_TEXT_MUTED),
        ("Cloud & Telemetry Infrastructure", "(3,500 EGP)", "(42,000 EGP)", "1.3%", COLOR_TEXT_MUTED),
        ("Payment Gateway Processing (~3%)", "(5,730 EGP)", "(68,760 EGP)", "2.2%", COLOR_TEXT_MUTED),
        ("Operations, Community & Marketing", "(25,000 EGP)", "(300,000 EGP)", "9.5%", COLOR_TEXT_MUTED),
        ("Total Operating Expenses (OpEx)", "(165,730 EGP)", "(1,988,760 EGP)", "63.0%", COLOR_ACCENT_GOLD),
        ("Net Operating Profit (EBITDA)", "+97,270 EGP", "+1,167,240 EGP", "37.0%", COLOR_PRIMARY)
    ]
    for item, mo, yr, pct, col in p_data:
        p = tf.add_paragraph()
        p.text = f"• {item}: {mo} / mo  ({yr} / yr)  [{pct}]"
        p.font.size = Pt(11); p.font.bold = (col != COLOR_TEXT_MUTED); p.font.color.rgb = col; p.space_after = Pt(4)

    c_pl2 = add_card(s15, Inches(8.0), Inches(1.8), Inches(4.5), Inches(4.8), "Key Financial Metrics", border_color=COLOR_PRIMARY)
    tf = c_pl2.text_frame
    p = tf.add_paragraph()
    p.text = "• 37.0% EBITDA Margin: Highly cash-generative in Year 1.\n\n• Zero CapEx: No hardware depreciation or fleet debt.\n\n• Cash-Flow Positive: From Month 4 as paying subscriber tiers activate.\n\n• Negative Working Capital: Commuter subscriptions paid upfront."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 16: 3-Year Growth Roadmap
    # =========================================================================
    s16 = prs.slides.add_slide(blank_layout)
    set_slide_background(s16)
    add_header(s16, "Growth & Scaling", "3-Year Expansion Roadmap: From 100 Buses to 2,500 Fleet Scale", "A proven trajectory expanding across Greater Cairo and Egyptian intercity transit.")
    add_footer(s16, 16)

    growth_phases = [
        ("Year 1: Beachhead", "100 Buses  |  50k Users", "• Focus: 10 Cairo trunk corridors (Nasr City, Tahrir, New Cairo, Giza)\n• Revenue: 3.15M EGP / yr\n• EBITDA: 1.16M EGP (37.0%)\n• 1,800 private minibus integration", COLOR_PRIMARY),
        ("Year 2: Citywide Scale", "500 Buses  |  250k Users", "• Expansion: All Greater Cairo private concessionaires + university shuttles\n• Revenue: ~15.8M EGP / yr\n• Introduction of QR mobile ticketing\n• Government smart-city pilot", COLOR_SECONDARY),
        ("Year 3: National Transit", "2,500 Buses  |  1.2M Users", "• Full CTA municipal fleet + Ring Road BRT + Intercity coach lines\n• Revenue: ~78.0M EGP / yr\n• Swarm intelligence routing live\n• Transit data API monetization", COLOR_ACCENT_GREEN)
    ]
    for i, (title, stats, desc, color) in enumerate(growth_phases):
        x = Inches(0.8 + i * 3.95)
        card = add_card(s16, x, Inches(1.8), Inches(3.8), Inches(4.8), title, border_color=color)
        tf = card.text_frame
        p = tf.add_paragraph()
        p.text = stats
        p.font.size = Pt(13); p.font.bold = True; p.font.color.rgb = color; p.space_after = Pt(10)
        p = tf.add_paragraph()
        p.text = desc
        p.font.size = Pt(11); p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 17: Competitive Matrix
    # =========================================================================
    s17 = prs.slides.add_slide(blank_layout)
    set_slide_background(s17)
    add_header(s17, "Competitive Advantage", "Competitive Landscape: Why Wasalt Dominates the Market", "Comparing Wasalt with traditional solutions, private vans, and static apps.")
    add_footer(s17, 17)

    c_comp = add_card(s17, Inches(0.8), Inches(1.8), Inches(11.733), Inches(4.8), "Competitive Feature & Economic Comparison")
    tf = c_comp.text_frame
    comp_rows = [
        ("Feature / Metric", "Wasalt Transit", "Tawwaly / Mowaslat Misr", "Swvl", "Static Apps (Mwaslatak)"),
        ("Hardware Cost", "$0 (Smartphone)", "$150–$300 OBD Unit", "$0 (Van Contract)", "$0 (No Hardware)"),
        ("Live GPS Tracking", "Yes (1-Second Continuous)", "Broken / Disconnected", "Yes (Private Vans)", "No (Static Only)"),
        ("Driver Incentive", "Yes (50% Profit Share)", "No ($0 Additional)", "Variable Contract", "None"),
        ("Ghost Bus Risk", "Eliminated (<1%)", "Notorious (>40%)", "Low", "N/A (No Tracking)"),
        ("Affordability", "0–20 EGP / month", "Ticket Only", "600–1,200 EGP / mo", "Free"),
        ("Fleet Scalability", "Instant (App Download)", "Slow (Wiring Needed)", "Capital Intensive", "Static Data Only")
    ]
    for r in comp_rows:
        p = tf.add_paragraph()
        p.text = f"{r[0]:<25} | {r[1]:<20} | {r[2]:<22} | {r[3]:<20} | {r[4]}"
        p.font.name = "Consolas"
        p.font.size = Pt(10)
        if r[0] == "Feature / Metric":
            p.font.bold = True
            p.font.color.rgb = COLOR_PRIMARY
        else:
            p.font.color.rgb = COLOR_TEXT_MUTED
        p.space_after = Pt(4)

    # =========================================================================
    # SLIDE 18: Deep-Tech: Swarm Intelligence
    # =========================================================================
    s18 = prs.slides.add_slide(blank_layout)
    set_slide_background(s18)
    add_header(s18, "R&D Innovation: Swarm AI", "Swarm Intelligence: Dynamic Congestion Avoidance", "Turning our bus fleet into a real-time distributed urban sensor network.")
    add_footer(s18, 18)

    c_sw1 = add_card(s18, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "How Swarm Intelligence Works")
    tf = c_sw1.text_frame
    p = tf.add_paragraph()
    p.text = "• Distributed Mobile Probes: Every bus acts as a moving probe streaming velocity and location every second.\n\n• Anomaly Detection: When a leading bus experiences an unexpected 40%+ drop in speed along Abbas El-Akkad or the Ring Road, the swarm engine registers an active bottleneck.\n\n• Zero Third-Party API Dependence: We don't pay Google Traffic — our own fleet creates a hyper-accurate, real-time map of Cairo congestion."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    c_sw2 = add_card(s18, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Commuter & Dispatch Value", border_color=COLOR_PRIMARY)
    tf = c_sw2.text_frame
    p = tf.add_paragraph()
    p.text = "• Proactive Rerouting Alerts: Trailing drivers receive instant bypass recommendations on their HUD to take flyovers or parallel avenues.\n\n• Self-Healing ETAs: Passenger countdowns adjust dynamically from 5 minutes to 14 minutes before commuters get frustrated at the stop.\n\n• Municipal Congestion Heatmaps: High-value macro telematics data monetizable to urban planners and government transit ministries."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_WHITE

    # =========================================================================
    # SLIDE 19: Deep-Tech: Passenger Crowding Detection
    # =========================================================================
    s19 = prs.slides.add_slide(blank_layout)
    set_slide_background(s19)
    add_header(s19, "R&D Innovation: Crowding AI", "Automated Crowding Detection: Green, Yellow & Red Bus Density", "Solving the #1 commuter frustration: waiting for a bus that arrives completely full.")
    add_footer(s19, 19)

    c_cr1 = add_card(s19, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Multi-Sensor Edge AI Detection")
    tf = c_cr1.text_frame
    p = tf.add_paragraph()
    p.text = "How Wasalt detects passenger density without installing expensive cameras:"
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(8)
    cr_points = [
        "• Bluetooth LE Sniffing: Scans nearby broadcasting smartphone UUIDs to gauge passenger counts with 100% privacy compliance (MACs hashed, zero PII).",
        "• Cabin Acoustic Signatures: Driver phone samples ambient decibel chatter to distinguish empty vs packed cabins.",
        "• Inertial Vehicle Dynamics: Phone accelerometers measure vehicle acceleration curves to infer gross vehicle payload weight."
    ]
    for pt in cr_points:
        p = tf.add_paragraph()
        p.text = pt; p.font.size = Pt(11); p.font.color.rgb = COLOR_TEXT_WHITE; p.space_after = Pt(8)

    c_cr2 = add_card(s19, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Commuter Visual Status Indicators", border_color=COLOR_ACCENT_GREEN)
    tf = c_cr2.text_frame
    p = tf.add_paragraph()
    p.text = "• 🟢 Green (Seats Available): Commuters know they can board and find a comfortable seat.\n\n• 🟡 Yellow (Standing Room Only): Commuter can decide whether to board or wait 5 minutes for the next bus.\n\n• 🔴 Red (Completely Full): Saves commuter the frustration of signaling a bus that passes by without stopping."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 20: Deep-Tech: Anti-Bunching Driver Pacing
    # =========================================================================
    s20 = prs.slides.add_slide(blank_layout)
    set_slide_background(s20)
    add_header(s20, "R&D Innovation: Transit Physics", "Anti-Bunching Protocol: Eliminating 'Two Buses Arrive Together'", "Algorithmic headway regularization ensuring steady, predictable arrival intervals.")
    add_footer(s20, 20)

    c_ab1 = add_card(s20, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "The Classic Transit Physics Flaw")
    tf = c_ab1.text_frame
    p = tf.add_paragraph()
    p.text = "• The Vicious Cycle: When a leading bus is delayed by 3 minutes, it encounters more waiting passengers, delaying it further.\n\n• The Trailing Bus Speeds Up: Because fewer passengers wait at stops, the trailing bus speeds up until both buses arrive bumper-to-bumper.\n\n• The Commuter Disaster: Passengers experience a 45-minute void followed by two buses arriving at the exact same second."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    c_ab2 = add_card(s20, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Wasalt Headway Regularization Algorithm", border_color=COLOR_PRIMARY)
    tf = c_ab2.text_frame
    p = tf.add_paragraph()
    p.text = "• Continuous Headway Tracking: System measures dynamic interval H = t2 - t1 between consecutive buses on the line.\n\n• Pacing Guidance on Driver HUD: If headway compresses below 35% of nominal, the trailing driver receives a gentle 'Hold 90 Seconds' prompt at a major terminal.\n\n• Express Mode for Lead Bus: Leading bus is authorized to skip low-demand stops to restore ideal 8-minute intervals."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_WHITE

    # =========================================================================
    # SLIDE 21: Future Monetization: QR Micro-Ticketing
    # =========================================================================
    s21 = prs.slides.add_slide(blank_layout)
    set_slide_background(s21)
    add_header(s21, "Future Horizons", "Digital QR Micro-Ticketing: Cashless Boarding via InstaPay & Meeza", "Transitioning Egypt's mass transit from coin change to instant digital boarding.")
    add_footer(s21, 21)

    c_tkt1 = add_card(s21, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "The Cashless Commute Experience")
    tf = c_tkt1.text_frame
    p = tf.add_paragraph()
    p.text = "• 1-Tap QR Ticket: Commuters buy single-ride passes or monthly route bundles directly in the Wasalt app.\n\n• Camera Validation: The driver's existing smartphone camera scans and validates dynamic encrypted QR codes in <0.5 seconds.\n\n• Zero Extra Hardware: No card validators or RFID turnstiles to maintain or repair."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    c_tkt2 = add_card(s21, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Transaction Fee Revenue Stream", border_color=COLOR_ACCENT_GREEN)
    tf = c_tkt2.text_frame
    p = tf.add_paragraph()
    p.text = "• Automated Split: 80% paid directly to fleet operator; 20% retained by Wasalt platform.\n\n• National Payment Rails: Full integration with InstaPay (IPN), Meeza digital cards, and Vodafone/Orange/Etisalat Cash.\n\n• Massive Volume Potential: 100 buses processing 500 digital rides/day = 1.5M monthly transactions."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_WHITE

    # =========================================================================
    # SLIDE 22: Regulatory Alignment & Strategic Moats
    # =========================================================================
    s22 = prs.slides.add_slide(blank_layout)
    set_slide_background(s22)
    add_header(s22, "Strategic Defensibility", "Regulatory Alignment: Backing Egypt's Smart Cities Vision", "Building sustainable public-private partnerships under national digital transformation.")
    add_footer(s22, 22)

    c_reg1 = add_card(s22, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "National Policy Alignment")
    tf = c_reg1.text_frame
    p = tf.add_paragraph()
    p.text = "• Vision 2030 Support: Directly advances Egyptian Sustainable Development Goals (decongestion, carbon emissions reduction, cashless transition).\n\n• Zero Capital Burden: Solves the Cairo Transport Authority's telematics deficit without requiring millions in government procurement grants.\n\n• New Administrative Capital (NAC): Natural expansion corridor for intelligent electric transit tracking."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    c_reg2 = add_card(s22, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Data & Institutional Defensibility", border_color=COLOR_PRIMARY)
    tf = c_reg2.text_frame
    p = tf.add_paragraph()
    p.text = "• Ministry of Local Development MoU: Formalized digital framework for passenger information dissemination.\n\n• Proprietary Urban Transit Graph: Proprietary geospatial map of Cairo transit stop dwell times, route bottleneck indices, and hourly corridor demand.\n\n• High Switching Costs: Once drivers earn 1,315 EGP/mo and operators rely on our dispatch board, platform lock-in is permanent."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_WHITE

    # =========================================================================
    # SLIDE 23: Go-To-Market Strategy
    # =========================================================================
    s23 = prs.slides.add_slide(blank_layout)
    set_slide_background(s23)
    add_header(s23, "Execution Plan", "Go-To-Market Strategy: Corridor-by-Corridor Virality", "How we achieve 50,000 active users in 12 months with minimal CAC.")
    add_footer(s23, 23)

    gtm_steps = [
        ("Step 1: Depot Lock-In", "Onboard 10–12 private bus depots servicing Cairo's highest-volume trunk lines (Abdel Moneim Riad, Ramses, Nasr City, New Cairo).", COLOR_PRIMARY),
        ("Step 2: Bus QR Stickers", "Place high-visibility QR decals on bus windows ('Track this bus live on your phone — download Wasalt') turning every vehicle into a billboard.", COLOR_SECONDARY),
        ("Step 3: Commuter Viral Loops", "Commuters share live bus links with colleagues and family ('Bus is 5 mins away, hurry down!'), driving zero-cost organic installs.", COLOR_ACCENT_GREEN),
        ("Step 4: Micro-Subscriptions", "Offer free 30-day trials of Family Safety and Ad-Free alerts, converting 20% of free users into recurring paying subscribers.", COLOR_ACCENT_GOLD)
    ]
    for i, (title, desc, color) in enumerate(gtm_steps):
        x = Inches(0.8 + i * 2.95)
        card = add_card(s23, x, Inches(1.8), Inches(2.8), Inches(4.8), title, border_color=color)
        tf = card.text_frame
        p = tf.add_paragraph()
        p.text = desc
        p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 24: The Investment Ask & Use of Funds
    # =========================================================================
    s24 = prs.slides.add_slide(blank_layout)
    set_slide_background(s24)
    add_header(s24, "Capital Allocation", "The Investment Ask: Fueling Scale to 500 Buses", "Accelerating engineering, driver onboarding, and corridor dominance.")
    add_footer(s24, 24)

    c_ask1 = add_card(s24, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), "Seed Funding Ask: $250,000 USD (~EGP 12.5M)", border_color=COLOR_ACCENT_GREEN)
    tf = c_ask1.text_frame
    p = tf.add_paragraph()
    p.text = "• Runway: 18 months of aggressive corridor expansion.\n\n• Target Milestones:\n  - Scale from 100 to 500 active fleet buses.\n  - Grow active commuter base from 50k to 250k MAUs.\n  - Achieve $15.8M EGP annual run-rate revenue.\n  - Launch Phase 1 QR micro-ticketing with InstaPay."
    p.font.size = Pt(12); p.font.color.rgb = COLOR_TEXT_WHITE

    c_ask2 = add_card(s24, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8), "Use of Proceeds")
    tf = c_ask2.text_frame
    alloc = [
        ("40% Driver Pool & Depot Field Teams", "Initial driver incentive escrow, windshield phone mounts, and dedicated depot community managers."),
        ("30% Product & Deep-Tech Engineering", "Full-time mobile/backend engineers scaling Swarm Intelligence, Crowding AI, and QR payment gateways."),
        ("20% Corridor Marketing & Commuter Growth", "High-visibility bus exterior/interior QR decals, social proof campaigns, and university campus ambassador loops."),
        ("10% Regulatory, Legal & Working Capital", "Institutional legal structuring for government MoUs and operational contingency.")
    ]
    for title, desc in alloc:
        p = tf.add_paragraph()
        p.text = f"• {title}: {desc}"
        p.font.size = Pt(11); p.font.color.rgb = COLOR_TEXT_MUTED; p.space_after = Pt(6)

    # =========================================================================
    # SLIDE 25: Vision & Closing
    # =========================================================================
    s25 = prs.slides.add_slide(blank_layout)
    set_slide_background(s25)

    add_card(s25, Inches(0.8), Inches(1.2), Inches(11.733), Inches(5.2), border_color=COLOR_PRIMARY)

    title_box = s25.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(4.0))
    tf25 = title_box.text_frame
    tf25.word_wrap = True

    p = tf25.paragraphs[0]
    p.text = "TRANSFORMING AFRICAN MASS TRANSIT"
    p.font.name = FONT_HEADING
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY

    p2 = tf25.add_paragraph()
    p2.text = "One Bus, One Driver, and One Commuter at a Time."
    p2.font.name = FONT_HEADING
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_TEXT_WHITE
    p2.space_before = Pt(8)

    p3 = tf25.add_paragraph()
    p3.text = "Wasalt turns the chaos of Cairo transit into an orderly, predictable, dignified daily routine.\nWe invite visionary investors to partner with us in building the digital backbone of emerging market mobility."
    p3.font.name = FONT_BODY
    p3.font.size = Pt(14)
    p3.font.color.rgb = COLOR_TEXT_MUTED
    p3.space_before = Pt(18)

    p4 = tf25.add_paragraph()
    p4.text = "Kareem  •  Founder & Executive Lead  •  kareem@wasalt.eg\nJarvis  •  Lead Engineering Assistant  •  Cairo, Egypt"
    p4.font.name = FONT_BODY
    p4.font.size = Pt(13)
    p4.font.bold = True
    p4.font.color.rgb = COLOR_ACCENT_GOLD
    p4.space_before = Pt(28)

    add_footer(s25, 25)

    # Save presentation
    output_path = "Wasalt_Investor_Pitch_Deck_25_Slides.pptx"
    prs.save(output_path)
    print(f"Successfully generated {output_path} with exactly 25 slides!")


if __name__ == "__main__":
    create_deck()
