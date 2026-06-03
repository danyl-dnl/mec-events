/**
 * KTU Activity Points Mapping Utility
 * Aligned with KTU B.Tech Activity Points criteria (2019 & 2024 Schemes).
 * 
 * Target Points: 120 (Regular B.Tech), 90 (Lateral Entry)
 * Groups:
 *  - Group I: Co-curricular (Arts, Quizzing, Sports, Club membership/activities)
 *  - Group II: Professional Development (Professional Body, Workshops, Hackathons, Tech Fests)
 *  - Group III: Innovation, Research & Entrepreneurship (Startups, Product Development, Robowars, Pitching)
 */

export const KTU_GROUPS = {
  GROUP_I: {
    id: 'GROUP_I',
    name: 'Group I: Co-curricular Activities',
    description: 'NSS, NCC, NSO, Sports, Arts, Quizzing, Literary & general club activities.',
    cap: 40,
  },
  GROUP_II: {
    id: 'GROUP_II',
    name: 'Group II: Professional Development',
    description: 'Workshops, Tech Fests, Conferences, Internships, Coding hackathons, Professional Body activities (IEEE, FOSS).',
    cap: 40,
  },
  GROUP_III: {
    id: 'GROUP_III',
    name: 'Group III: Innovation & Entrepreneurship',
    description: 'Startups, Patenting, Incubator activities (IEDC), Robotics (Cyborg), Business Pitches.',
    cap: 40,
  }
};

/**
 * Returns the KTU Group and Estimated Points for a given club event.
 * @param {object} event - Event details containing clubId, category, flagship, etc.
 * @returns {object} { group: 'GROUP_I'|'GROUP_II'|'GROUP_III', points: number, groupName: string }
 */
export function getKtuPointsForEvent(event) {
  if (!event) return { group: 'GROUP_I', points: 0, groupName: KTU_GROUPS.GROUP_I.name };

  const clubId = (event.clubId || '').toLowerCase();
  const category = (event.category || '').toLowerCase();
  const isFlagship = !!event.flagship;

  let group = 'GROUP_I';
  let points = 10; // Default participation points

  // 1. Group Classification based on Club & Category
  if (clubId === 'iedc' || clubId === 'cyborg' || category === 'entrepreneurship' || category === 'robotics') {
    group = 'GROUP_III';
  } else if (
    clubId === 'ieee' ||
    clubId === 'fossmec' ||
    clubId === 'macs' ||
    clubId === 'signals' ||
    category === 'tech' ||
    category === 'coding' ||
    category === 'electronics'
  ) {
    group = 'GROUP_II';
  } else {
    // default for quizzing, arts, photography, etc.
    group = 'GROUP_I';
  }

  // 2. Points assignment
  if (isFlagship) {
    // Flagship national symposiums or hackathons (e.g. Excel, Technopreneur, DevSprint)
    points = group === 'GROUP_III' ? 20 : 15;
  } else {
    // Local college-level workshops, coding contests, quizzes, etc.
    if (category === 'coding' || category === 'robotics') {
      points = 15; // standard coding/robotics competitions
    } else {
      points = 10; // standard workshops, quizzes, photowalks
    }
  }

  return {
    group,
    points,
    groupName: KTU_GROUPS[group].name,
  };
}

/**
 * Aggregates registrations and calculates KTU summary details.
 * @param {Array} registrations - List of registered tickets/events.
 * @returns {object} Summary dashboard metrics.
 */
export function calculateKtuSummary(registrations) {
  const summary = {
    totalEstimated: 0,
    target: 120, // KTU 2024 Scheme target
    groups: {
      GROUP_I: { points: 0, cap: 40, count: 0 },
      GROUP_II: { points: 0, cap: 40, count: 0 },
      GROUP_III: { points: 0, cap: 40, count: 0 },
    },
    activities: []
  };

  if (!registrations || !registrations.length) return summary;

  registrations.forEach(reg => {
    // Reconstruct a mini event object for point calculation
    const isFlagship = reg.eventTitle?.toLowerCase().includes('excel') || 
                       reg.eventTitle?.toLowerCase().includes('technopreneur') ||
                       reg.eventTitle?.toLowerCase().includes('devsprint');
                       
    const miniEvent = {
      id: reg.eventId,
      title: reg.eventTitle,
      clubId: reg.clubName?.toLowerCase().includes('ieee') ? 'ieee' :
              reg.clubName?.toLowerCase().includes('foss') ? 'fossmec' :
              reg.clubName?.toLowerCase().includes('iedc') ? 'iedc' :
              reg.clubName?.toLowerCase().includes('illuminati') ? 'illuminati' :
              reg.clubName?.toLowerCase().includes('signals') ? 'signals' :
              reg.clubName?.toLowerCase().includes('cyborg') ? 'cyborg' :
              reg.clubName?.toLowerCase().includes('thirdeye') ? 'thirdeye' :
              reg.clubName?.toLowerCase().includes('macs') ? 'macs' : '',
      category: reg.eventTitle?.toLowerCase().includes('quiz') ? 'quizzing' :
                reg.eventTitle?.toLowerCase().includes('sprint') ? 'coding' :
                reg.eventTitle?.toLowerCase().includes('algo') ? 'coding' :
                reg.eventTitle?.toLowerCase().includes('iot') ? 'electronics' :
                reg.eventTitle?.toLowerCase().includes('robowars') ? 'robotics' :
                reg.eventTitle?.toLowerCase().includes('photo') ? 'arts' : 'tech',
      flagship: isFlagship,
    };

    const ktu = getKtuPointsForEvent(miniEvent);
    
    // Add to activity breakdown list
    summary.activities.push({
      id: reg.id,
      eventTitle: reg.eventTitle,
      clubName: reg.clubName,
      registeredAt: reg.registeredAt,
      ticketId: reg.id,
      ktuGroup: ktu.group,
      ktuGroupName: ktu.groupName,
      points: ktu.points,
    });

    // Update group scores (capping group points at 40 per group for graduation eligibility representation)
    const grp = summary.groups[ktu.group];
    if (grp) {
      grp.count += 1;
      grp.points += ktu.points;
    }
  });

  // Calculate total capped estimated points
  const cappedGroupIPoints = Math.min(summary.groups.GROUP_I.points, summary.groups.GROUP_I.cap);
  const cappedGroupIIPoints = Math.min(summary.groups.GROUP_II.points, summary.groups.GROUP_II.cap);
  const cappedGroupIIIPoints = Math.min(summary.groups.GROUP_III.points, summary.groups.GROUP_III.cap);
  
  summary.totalEstimated = cappedGroupIPoints + cappedGroupIIPoints + cappedGroupIIIPoints;

  return summary;
}
