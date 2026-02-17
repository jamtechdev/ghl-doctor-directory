# Doctor Directory for GoHighLevel

A fast, responsive, and SEO-optimized doctor directory built with Next.js, designed to be embedded in GoHighLevel (GHL) websites.

## Features

- **Real-time Search**: Search by doctor name, specialty, or condition keywords
- **Multi-select Filters**: Filter by specialty and state with real-time updates
- **Responsive Design**: Mobile-first design that works on all devices
- **SEO Optimized**: Schema.org markup, semantic HTML, and proper meta tags
- **iframe-Ready**: Optimized for embedding in GoHighLevel funnels
- **Static Generation**: Fast page loads with Next.js SSG
- **Scalable**: Easily add 50-100+ doctor profiles

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
ghl-doctor-directory/
├── app/
│   ├── layout.tsx              # Root layout with SEO meta tags
│   ├── page.tsx                 # Main directory page
│   ├── not-found.tsx            # 404 page
│   ├── doctors/
│   │   └── [slug]/
│   │       └── page.tsx         # Individual doctor profile pages
│   └── globals.css              # Global styles
├── components/
│   ├── DoctorCard.tsx           # Doctor card component
│   ├── SearchBar.tsx            # Search input with debouncing
│   ├── FilterPanel.tsx          # Multi-select filters
│   ├── DoctorGrid.tsx            # Grid container
│   └── ui/
│       └── Button.tsx            # Reusable button component
├── data/
│   └── doctors.json             # Doctor data storage
├── lib/
│   ├── search.ts                # Search logic
│   ├── filters.ts                # Filter logic
│   └── utils.ts                 # Helper functions
└── types/
    └── doctor.ts                 # TypeScript interfaces
```

## Adding and Updating Doctor Data

### How to Add a New Doctor

1. Open `data/doctors.json`
2. Add a new doctor object following this structure:

```json
{
  "id": "11",
  "slug": "dr-jane-doe",
  "name": "Dr. Jane Doe",
  "specialty": "Cardiology",
  "specialties": ["Cardiology", "Heart Failure"],
  "location": {
    "city": "New York",
    "state": "NY",
    "address": "123 Medical St",
    "zipCode": "10001"
  },
  "conditions": [
    "heart disease",
    "heart attack",
    "arrhythmia"
  ],
  "bio": "Full biography text here...",
  "image": "/images/dr-jane-doe.jpg",
  "contact": {
    "phone": "(555) 123-4567",
    "email": "jane.doe@example.com",
    "website": "https://www.drjanedoe.com"
  },
  "education": [
    {
      "degree": "MD",
      "institution": "Medical School",
      "year": 2010
    }
  ],
  "certifications": [
    {
      "name": "Board Certified",
      "issuingOrganization": "Medical Board",
      "year": 2012
    }
  ]
}
```

3. **Important**: The `slug` field must be URL-friendly (lowercase, hyphens instead of spaces)
   - Example: "Dr. John Smith" → `slug: "dr-john-smith"`

4. After adding, rebuild the site:
```bash
npm run build
```

### How to Update Existing Doctor Data

1. Open `data/doctors.json`
2. Find the doctor by `id` or `slug`
3. Update any fields as needed
4. Rebuild the site:
```bash
npm run build
```

### Data Field Descriptions

- **id**: Unique identifier (string or number)
- **slug**: URL-friendly identifier used in routes (e.g., `/doctors/dr-jane-doe`)
- **name**: Full name of the doctor
- **specialty**: Primary specialty (displayed on cards)
- **specialties**: Array of all specialties (used for filtering)
- **location**: Object with city, state, address, zipCode
- **conditions**: Array of condition/injury keywords for search functionality
- **bio**: Full biography text (displayed on profile page)
- **image**: Optional profile image URL
- **contact**: Optional contact information (phone, email, website)
- **education**: Optional array of education entries
- **certifications**: Optional array of certifications

## Search Functionality

### How Search Works

The search algorithm:
1. Splits the query into individual keywords (tokenization)
2. Searches in:
   - Doctor's name
   - Primary specialty
   - All specialties array
   - Conditions array (for condition/injury searches)
3. Uses case-insensitive partial matching
4. Requires ALL keywords to match (AND logic)

### Example Searches

- `"ACL reconstruction"` → Matches doctors with both "ACL" AND "reconstruction" in conditions
- `"john smith"` → Matches doctors with both "john" AND "smith" in name
- `"orthopedic knee"` → Matches doctors with "orthopedic" in specialty AND "knee" in conditions

## Filter Functionality

### How Filters Work

- **Within each category** (Specialty, State): OR logic (match ANY selected)
- **Between categories**: AND logic (must match ALL selected categories)

### Example

- Selected: Specialty=["Orthopedic Surgery", "Cardiology"], State=["NY", "CA"]
- Result: Doctors who are (Orthopedic Surgery OR Cardiology) AND (in NY OR CA)

## Embedding in GoHighLevel

### Step 1: Build and Deploy

1. Build the production version:
```bash
npm run build
```

2. Deploy to a hosting service (Vercel, Netlify, etc.)
   - Vercel: Connect your GitHub repo and deploy automatically
   - Netlify: Drag and drop the `.next` folder or connect via Git

### Step 2: Get Your Deployment URL

After deployment, you'll get a URL like:
- `https://your-doctor-directory.vercel.app`
- `https://your-doctor-directory.netlify.app`

### Step 3: Embed in GoHighLevel

1. In your GHL funnel, add an HTML/Code block
2. Insert an iframe:

```html
<iframe 
  src="https://your-doctor-directory.vercel.app" 
  width="100%" 
  height="800" 
  frameborder="0"
  style="border: none;"
  title="Doctor Directory"
></iframe>
```

3. Adjust the `height` attribute based on your needs
4. For full-width embedding, use:
```html
<iframe 
  src="https://your-doctor-directory.vercel.app" 
  width="100%" 
  height="100vh" 
  frameborder="0"
  style="border: none; min-height: 800px;"
  title="Doctor Directory"
></iframe>
```

### Responsive iframe Embedding

For better mobile experience, use this responsive iframe code:

```html
<div style="position: relative; padding-bottom: 100%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://your-doctor-directory.vercel.app" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    title="Doctor Directory"
    allowfullscreen
  ></iframe>
</div>
```

## SEO Features

### Implemented SEO Elements

- ✅ Semantic HTML5 structure
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ Schema.org JSON-LD markup (Doctor, Organization)
- ✅ robots.txt file
- ✅ Accessible ARIA labels

### Schema.org Markup

Each doctor profile page includes:
- `Physician` schema with name, specialty, address, contact info
- Education and certification data
- Location information

## Performance Optimizations

- **Static Site Generation (SSG)**: All pages are pre-rendered at build time
- **Debounced Search**: 300ms delay to reduce unnecessary computations
- **Memoized Calculations**: Filter and search results are memoized
- **Optimized Images**: Uses Next.js Image component (when images are added)
- **Code Splitting**: Automatic code splitting by Next.js

## Customization

### Styling

The project uses Tailwind CSS. To customize:
1. Modify `app/globals.css` for global styles
2. Update component classes for specific styling
3. Modify `tailwind.config.js` for theme customization

### Adding More Filter Options

To add more filter categories (e.g., City):
1. Update `types/doctor.ts` to include the new field
2. Update `lib/filters.ts` to handle the new filter
3. Update `components/FilterPanel.tsx` to display the new filter
4. Update `data/doctors.json` with the new field

## Troubleshooting

### Build Errors

If you get build errors after adding doctors:
- Check that all required fields are present
- Verify JSON syntax is valid
- Ensure `slug` values are unique and URL-friendly

### Search Not Working

- Check that `conditions` array includes relevant keywords
- Verify search query is being passed correctly
- Check browser console for errors

### Filters Not Updating

- Verify filter state is being managed correctly
- Check that filter options are being generated from doctor data
- Ensure filter logic matches your expectations

## Support

For issues or questions:
1. Check the inline code comments for detailed explanations
2. Review the component documentation in each file
3. Verify your JSON data structure matches the TypeScript interfaces

## License

This project is private and proprietary.
#   g h l - d o c t o r - d i r e c t o r y  
 