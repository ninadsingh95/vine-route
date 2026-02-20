import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { region, startDate, endDate, vibe, group, budget, regionLat, regionLng } = await request.json();

    if (!region || !startDate || !endDate || !vibe) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `You are a world-class wine travel concierge. Create a detailed 1-2 day wine trip itinerary for ${region}.

TRIP DETAILS:
- Dates: ${startDate} to ${endDate}
- Vibe: ${vibe}
- Group: ${group || "Not specified"}
- Budget: ${budget || "Not specified"}
- Region center coordinates: ${regionLat}, ${regionLng}

REQUIREMENTS:
1. Plan 4-6 stops per day (wineries, restaurants, experiences)
2. Route them logically so driving flows in one direction — NO backtracking
3. For each winery: include actual well-known wineries in this region, their wine ratings (use typical critic scores if known), whether reservations are required or walk-in, and if reservations are typically hard to get
4. Include the vibe/atmosphere of each stop (e.g. "rustic farmhouse feel", "sleek modern tasting room", "cave tastings")
5. Include 1 lunch and 1 dinner recommendation per day that fits the vibe
6. Add pro tips for each stop
7. Each stop needs approximate lat/lng coordinates (realistic for the region)
8. Include drive times between stops

Respond ONLY with a JSON object (no markdown, no backticks, no preamble) in this exact format:
{
  "title": "A catchy trip title",
  "summary": "2-3 sentence overview of the trip",
  "days": [
    {
      "dayNumber": 1,
      "title": "Day title",
      "stops": [
        {
          "name": "Winery or Restaurant Name",
          "subtitle": "Brief tagline e.g. 'Estate Cabernet Sauvignon specialist'",
          "lat": 38.50,
          "lng": -122.26,
          "time": "10:00 AM",
          "rating": "4.6",
          "vibe": "Description of the atmosphere and feel",
          "wineHighlights": "Their standout wines to try",
          "wineRating": "e.g. '94-97 pts Robert Parker for their reserve Cab'",
          "reservation": "Walk-in | Recommended | Required",
          "reservationNote": "e.g. 'Book 2-3 weeks ahead' or 'Usually available same-week'",
          "driveTime": "e.g. '12 min from previous stop'",
          "proTip": "Insider tip for this stop",
          "type": "winery | restaurant | experience"
        }
      ]
    }
  ],
  "packingTips": "Brief packing advice",
  "bestTimeToVisit": "Quick note on timing"
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .filter(Boolean)
      .join("\n");

    const clean = text.replace(/```json|```/g, "").trim();
    const itinerary = JSON.parse(clean);

    return NextResponse.json(itinerary);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Failed to generate itinerary. Please try again." },
      { status: 500 }
    );
  }
}
