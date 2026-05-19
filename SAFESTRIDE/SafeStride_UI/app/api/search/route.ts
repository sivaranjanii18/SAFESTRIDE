import { NextRequest, NextResponse } from 'next/server'

// GET /api/search - Universal search endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // location, contact, report, all
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const queryLower = query.toLowerCase()

    // Mock search results
    const results: {
      locations: any[]
      contacts: any[]
      reports: any[]
      routes: any[]
    } = {
      locations: [],
      contacts: [],
      reports: [],
      routes: [],
    }

    // Mock locations
    const locations = [
      {
        id: 'loc1',
        name: 'Central Park',
        address: 'New York, NY 10024',
        type: 'location',
        safetyRating: 4.2,
        distance: '0.5 mi',
        tags: ['Park', 'Well-lit', 'Crowded'],
      },
      {
        id: 'loc2',
        name: 'Times Square Station',
        address: '42nd Street, New York, NY',
        type: 'location',
        safetyRating: 3.8,
        distance: '1.2 mi',
        tags: ['Transit', 'Cameras', '24/7'],
      },
      {
        id: 'loc3',
        name: 'Bryant Park',
        address: '6th Ave, New York, NY 10018',
        type: 'location',
        safetyRating: 4.5,
        distance: '0.8 mi',
        tags: ['Park', 'Security', 'Well-lit'],
      },
      {
        id: 'loc4',
        name: 'Safe Zone - Home',
        address: '123 Home St, NY',
        type: 'safe_zone',
        safetyRating: 5.0,
        distance: '0 mi',
        tags: ['Home', 'Safe Zone'],
      },
    ]

    // Mock contacts
    const contacts = [
      {
        id: 'ec1',
        name: 'Sarah Johnson',
        phone: '+1 (555) 987-6543',
        relationship: 'Sister',
        type: 'contact',
      },
      {
        id: 'ec2',
        name: 'Mike Chen',
        phone: '+1 (555) 456-7890',
        relationship: 'Friend',
        type: 'contact',
      },
    ]

    // Mock reports
    const reports = [
      {
        id: 'rep1',
        title: 'Unsafe Area Report',
        description: 'Poorly lit street corner',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'reviewed',
        type: 'report',
      },
      {
        id: 'rep2',
        title: 'Incident Report #1234',
        description: 'Harassment near subway',
        date: new Date(Date.now() - 172800000).toISOString(),
        status: 'pending',
        type: 'report',
      },
    ]

    // Filter by query
    if (!type || type === 'all' || type === 'location') {
      results.locations = locations.filter(
        l => l.name.toLowerCase().includes(queryLower) ||
             l.address.toLowerCase().includes(queryLower) ||
             l.tags.some(t => t.toLowerCase().includes(queryLower))
      ).slice(0, limit)
    }

    if (!type || type === 'all' || type === 'contact') {
      results.contacts = contacts.filter(
        c => c.name.toLowerCase().includes(queryLower) ||
             c.relationship.toLowerCase().includes(queryLower)
      ).slice(0, limit)
    }

    if (!type || type === 'all' || type === 'report') {
      results.reports = reports.filter(
        r => r.title.toLowerCase().includes(queryLower) ||
             r.description.toLowerCase().includes(queryLower)
      ).slice(0, limit)
    }

    const totalResults = 
      results.locations.length + 
      results.contacts.length + 
      results.reports.length +
      results.routes.length

    return NextResponse.json({
      success: true,
      query,
      results,
      totalResults,
      searchedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
