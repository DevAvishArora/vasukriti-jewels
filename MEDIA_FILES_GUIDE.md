# Media Files Setup

## Required Media Files

### 1. Video File
**Location:** `/frontend/public/videos/jewelry-craftsmanship.mp4`

**Requirements:**
- **Format:** MP4 (H.264 codec recommended)
- **Resolution:** 1920x1080 (Full HD) or 1280x720 (HD)
- **Duration:** 30-60 seconds recommended
- **File Size:** Under 10MB for web optimization
- **Content:** Showcase jewelry-making process, craftsmanship, or elegant jewelry shots

**Where to Get:**
1. **Free Stock Videos:**
   - [Pexels](https://www.pexels.com/search/videos/jewelry/) - Free jewelry videos
   - [Pixabay](https://pixabay.com/videos/search/jewelry/) - Free stock videos
   - [Videvo](https://www.videvo.net/royalty-free-jewelry-video/) - Free HD videos

2. **Custom Video:**
   - Film your jewelry-making process
   - Use smartphone camera (stabilize with tripod)
   - Good lighting is essential
   - Edit with free tools like DaVinci Resolve

**Optimization:**
```bash
# Using ffmpeg to optimize video
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
```

### 2. Background Music
**Location:** `/frontend/public/audio/ambient-music.mp3`

**Requirements:**
- **Format:** MP3
- **Duration:** 2-5 minutes (loops automatically)
- **Style:** Ambient, elegant, calming instrumental
- **Volume:** Balanced (not too loud)
- **File Size:** Under 5MB

**Where to Get (Royalty-Free):**
1. **Free Music:**
   - [Pixabay Music](https://pixabay.com/music/) - Completely free
   - [Free Music Archive](https://freemusicarchive.org/) - Creative Commons
   - [YouTube Audio Library](https://www.youtube.com/audiolibrary/) - Free downloads
   - [Uppbeat](https://uppbeat.io/) - Free with attribution

2. **Recommended Search Terms:**
   - "ambient piano luxury"
   - "elegant instrumental"
   - "calm classical"
   - "luxury shopping music"

3. **Premium Options (Paid):**
   - Epidemic Sound
   - Artlist
   - AudioJungle

**Optimization:**
```bash
# Using ffmpeg to optimize audio
ffmpeg -i input.mp3 -b:a 128k -ar 44100 output.mp3
```

## File Structure

```
frontend/
└── public/
    ├── videos/
    │   └── jewelry-craftsmanship.mp4
    ├── audio/
    │   └── ambient-music.mp4
    └── images/
        ├── placeholder-jewelry.png (for hero section)
        └── placeholder-video-poster.jpg (video thumbnail)
```

## Installation Steps

### Option 1: Using Stock Media (Quickest)

1. **Download Sample Video:**
   ```bash
   cd /Users/avish/Projects/Practice/vasukriti-jewels/frontend/public
   mkdir -p videos audio
   
   # Download from Pexels (example)
   curl -o videos/jewelry-craftsmanship.mp4 "YOUR_VIDEO_URL"
   ```

2. **Download Sample Music:**
   ```bash
   # Download from Pixabay Music (example)
   curl -o audio/ambient-music.mp3 "YOUR_MUSIC_URL"
   ```

### Option 2: Using Placeholder Until You Get Real Files

The components will gracefully handle missing files:
- Video section shows dark gradient background if video not found
- Music player won't start if audio file is missing
- No errors will be thrown

## Recommendations for Luxury Jewelry Brand

### Video Content Ideas:
1. **Craftsmanship:** Show artisan hands working on jewelry
2. **Product Showcase:** Rotating jewelry pieces with spotlights
3. **Lifestyle:** Models wearing jewelry in elegant settings
4. **Process:** From raw materials to finished piece
5. **Brand Story:** Your workshop, team, or heritage

### Music Style:
1. **Classical Piano:** Elegant and timeless
2. **Soft Strings:** Luxurious feel
3. **Ambient Soundscapes:** Modern and sophisticated
4. **Light Jazz:** Upscale shopping atmosphere

## Testing

After adding files:

1. **Check Video:**
   - Open http://localhost:3000
   - Scroll to video section
   - Video should autoplay (muted)
   - Controls should work

2. **Check Music:**
   - Music player appears bottom-right
   - Click play button
   - Adjust volume
   - Test mute/unmute

3. Speaker icon in the nav
   - The site includes a hidden global audio element at `/public/audio/ambient-music.mp3`.
   - A small speaker icon is available in the header (top-right). Click it to toggle music play/pause (no visible player UI).
   - If the audio doesn't start because of browser autoplay policies, click the speaker icon once to grant a user gesture; the audio will then play.

## License Compliance

⚠️ **Important:** Always check licensing:
- ✅ Use royalty-free or Creative Commons music
- ✅ Attribute if required
- ✅ Check commercial use permissions
- ❌ Don't use copyrighted content without permission

## File Size Guidelines

- **Video:** Aim for under 10MB
  - Too large = slow page load
  - Too small = poor quality
  - Sweet spot: 5-8MB

- **Audio:** Aim for under 5MB
  - Loops, so quality matters
  - 128kbps is good balance
  - 192kbps for premium quality

## Need Help?

If you need assistance finding or creating media:
1. I can help you optimize existing files
2. Recommend specific free resources
3. Adjust code for different video/audio formats

---

**Current Status:** 
- ✅ Components created and ready
- ⏳ Waiting for video and audio files
- 💡 Works with or without files (graceful degradation)
