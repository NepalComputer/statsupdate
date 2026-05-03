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
    try {
      const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanWord)}&limit=1&format=json`, {
        headers: { 'User-Agent': 'NPATGameValidator/1.0 (statsupdate)' }
      });
      
      if (wikiRes.ok) {
        const contentType = wikiRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await wikiRes.json();
          if (Array.isArray(data) && data.length >= 3) {
            const [searchTerm, titles, descriptions, links] = data;
            const hasWikiMatch = titles.some((t: string) => t.toLowerCase() === cleanWord);
            
            if (hasWikiMatch) {
               const desc = (descriptions[0] || '').toLowerCase();
               if (category === 'name' && (desc.includes('name') || desc.includes('person') || desc.includes('given'))) return NextResponse.json({ isValid: true, source: 'wikipedia' });
               if (category === 'place' && (
                 desc.includes('city') || desc.includes('country') || desc.includes('town') || 
                 desc.includes('region') || desc.includes('capital') || desc.includes('district') || 
                 desc.includes('province') || desc.includes('state') || desc.includes('village') || 
                 desc.includes('municipality') || desc.includes('territory') || desc.includes('continent') || 
                 desc.includes('island') || desc.includes('lake') || desc.includes('mountain') || 
                 desc.includes('river') || desc.includes('administrative') || desc.includes('locality')
               )) return NextResponse.json({ isValid: true, source: 'wikipedia' });
               
               if (category === 'animal' && (desc.includes('species') || desc.includes('animal') || desc.includes('mammal') || desc.includes('bird') || desc.includes('fish') || desc.includes('insect') || desc.includes('reptile'))) return NextResponse.json({ isValid: true, source: 'wikipedia' });
               if (category === 'thing') return NextResponse.json({ isValid: true, source: 'wikipedia' });
            }
          }
        }
      }
    } catch (e) {
      console.warn("Wiki search failed", e);
    }

    // 2. ACTIVE SEARCH: Datamuse for dictionary/concept validation
    try {
      let datamuseUrl = `https://api.datamuse.com/words?sp=${cleanWord}&max=1`;
      if (category === 'animal') datamuseUrl = `https://api.datamuse.com/words?ml=animal&sp=${cleanWord}&max=1`;
      
      const dmRes = await fetch(datamuseUrl);
      if (dmRes.ok) {
        const dmData = await dmRes.json();
        if (dmData.length > 0 && dmData[0].word.toLowerCase() === cleanWord) {
          return NextResponse.json({ isValid: true, source: 'datamuse' });
        }
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

    return NextResponse.json({ isValid: false, reason: 'Not verified actively or in fallback' });
  } catch (error) {
    console.error("API Validation error:", error);
    return NextResponse.json({ isValid: false, error: 'Internal error' }, { status: 500 });
  }
}
