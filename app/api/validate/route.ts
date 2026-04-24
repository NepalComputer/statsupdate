import { NextResponse } from 'next/server'
import { GAME_DATA } from '@/lib/gameData'

export async function POST(req: Request) {
  try {
    const { category, word, letter } = await req.json()
    const cleanWord = word?.trim()?.toLowerCase()
    
    if (!cleanWord || cleanWord.length < 2) {
      return NextResponse.json({ isValid: false, reason: 'Too short' })
    }

    if (letter && !cleanWord.startsWith(letter.toLowerCase())) {
      return NextResponse.json({ isValid: false, reason: 'Wrong letter' })
    }

    // 1. ACTIVE SEARCH: Search Wikipedia for the term
    // Wikipedia Opensearch is great for finding if a "term" is a real entity
    try {
      const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanWord)}&limit=1&format=json`, {
        headers: { 'User-Agent': 'NPATGameValidator/1.0 (statsupdate)' }
      });
      const [searchTerm, titles, descriptions, links] = await wikiRes.json();
      
      const hasWikiMatch = titles.some((t: string) => t.toLowerCase() === cleanWord);
      
      if (hasWikiMatch) {
         // Optionally check descriptions for category markers
         const desc = (descriptions[0] || '').toLowerCase();
         
         if (category === 'name' && (desc.includes('name') || desc.includes('person') || desc.includes('given'))) return NextResponse.json({ isValid: true, source: 'wikipedia' });
         if (category === 'place' && (desc.includes('city') || desc.includes('country') || desc.includes('town') || desc.includes('region') || desc.includes('capital'))) return NextResponse.json({ isValid: true, source: 'wikipedia' });
         if (category === 'animal' && (desc.includes('species') || desc.includes('animal') || desc.includes('mammal') || desc.includes('bird') || desc.includes('fish'))) return NextResponse.json({ isValid: true, source: 'wikipedia' });
         
         // If it's a thing, we are more lenient with wikipedia matches
         if (category === 'thing') return NextResponse.json({ isValid: true, source: 'wikipedia' });
      }
    } catch (e) {
      console.warn("Wiki search failed", e);
    }

    // 2. ACTIVE SEARCH: Datamuse for dictionary/concept validation
    try {
      let datamuseUrl = `https://api.datamuse.com/words?sp=${cleanWord}&max=1`;
      if (category === 'animal') datamuseUrl = `https://api.datamuse.com/words?ml=animal&sp=${cleanWord}&max=1`;
      
      const dmRes = await fetch(datamuseUrl);
      const dmData = await dmRes.json();
      
      if (dmData.length > 0 && dmData[0].word.toLowerCase() === cleanWord) {
        return NextResponse.json({ isValid: true, source: 'datamuse' });
      }
    } catch (e) {
      console.warn("Datamuse failed", e);
    }

    // 3. FALLBACK: Local Static Data
    const listKey = `${category}s` as keyof typeof GAME_DATA;
    const localList = GAME_DATA[listKey] || [];
    const isLocalMatch = localList.some(item => item.toLowerCase() === cleanWord);
    
    if (isLocalMatch) {
      return NextResponse.json({ isValid: true, source: 'local' });
    }

    return NextResponse.json({ isValid: false, reason: 'Not verified activesly or in fallback' });
  } catch (error) {
    console.error("API Validation error:", error);
    return NextResponse.json({ isValid: false, error: 'Internal error' }, { status: 500 });
  }
}
