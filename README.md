# 2nr API Documentation

**Complete reverse-engineered documentation** of the 2nr (drugi-numer) virtual number & SIP softphone API.

All information is derived from real network traffic captures (HAR files) of the official Android application `pl.rs.sip.softphone.newapp` (version 2.1.18-prod).

## Live Site

After connecting this repository to Cloudflare Pages, the documentation will be available at your Pages URL.

## Contents

- Overview of the API architecture
- Authentication (cookie-based session tokens)
- Full Action ID system + `/config` endpoint
- Numbers API (reserve, list, remove)
- SMS API (poll, filter, mark as read)
- User details & Shop pricing
- Security notes (Play Integrity, blocked Firebase)
- Observed real-world flows and data samples

## Tech

- Pure static HTML + Tailwind CSS (CDN)
- Ready for Cloudflare Pages (no build step required)

## Disclaimer

This documentation is for **educational and research purposes only**.  
It is based on publicly observable network traffic from the official client.  
Do not use this information to abuse the service or violate its terms of service.

---

Repository created from deep analysis of HAR captures (October 2026).
