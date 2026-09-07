// ==========================================================================
// QUEEN JIYU'S UNIVERSE - CELESTIAL REALMS DATA
// 10 Interconnected realms representing memories, milestones, Queen Jiyu's
// signature qualities (Radiance & Sanctuary), and Bollywood musical tributes
// ==========================================================================

import type { RealmDefinition, RealmId } from '../types/universe.types';

export const REALMS: Record<RealmId, RealmDefinition> = {
    'first-rhythm': {
        id: 'first-rhythm',
        order: 1,
        title: 'The First Rhythm',
        subtitle: 'Garba, Shakti & Maa Ambe’s Blessings',
        tagline: 'In the sacred circle of Navratri, Maa Ambe blessed my life with you.',
        coordinates: [-220, 120, -180],
        cameraPosition: [-220, 135, -90],
        targetLookAt: [-220, 120, -180],
        color: '#F59E0B',
        emissiveColor: '#B45309',
        accentColor: '#FEF08A',
        icon: '🌺',
        audioMood: 'first-rhythm',
        narrativePacing: {
            introDelay: 800,
            lines: [
                'Some stories begin with a casual conversation.',
                'Ours began in the sacred circle of Garba, beneath the autumn stars of Gujarat.',
                'As we danced with traditional grace and bowed our heads in prayer to Goddess Ambe Maa,',
                'I asked the divine for light and blessings...',
                'And Maa Ambe blessed my entire world by placing you in my life.'
            ]
        },
        poeticCore: 'In the rhythm of worship, Maa Ambe heard my prayer and gifted me your smile.',
        bollywoodLyric: {
            song: 'Chandaliyo Ugyo Re',
            film: 'Naadi Dosh',
            artists: 'Aishwarya Majmudar & Kedar-Bhargav',
            line: '“Chandaliyo ugyo re ho bhamariya re raaj... Hu re mane aaje taaro raang lagyo re!”',
            meaning: 'The divine moon has risen in all its glory; through the sacred blessings of Maa Ambe, your rhythm illuminated my universe.'
        }
    },

    'retina': {
        id: 'retina',
        order: 2,
        title: 'The Retina',
        subtitle: 'The Convergence of Light & Memory',
        tagline: 'The exact fraction of a second you fell into my sight.',
        coordinates: [-120, -140, -260],
        cameraPosition: [-120, -130, -170],
        targetLookAt: [-120, -140, -260],
        color: '#60A5FA',
        emissiveColor: '#1D4ED8',
        accentColor: '#E0F2FE',
        icon: '👁️',
        audioMood: 'retina',
        narrativePacing: {
            introDelay: 1000,
            lines: [
                'Some people enter your life loudly.',
                'Some simply fall into your eyes...',
                'Light passes through darkness, refracted across time.',
                '...and never really leave.',
                'Every star observed since then carries your reflection.'
            ]
        },
        poeticCore: 'A single gaze that permanently altered the optics of my entire world.',
        bollywoodLyric: {
            song: 'Aankhon Mein Teri',
            film: 'Om Shanti Om',
            artists: 'KK & Vishal-Shekhar',
            line: '“Aankhon mein teri ajab si, ajab si adaayein hain... Dil ko bana de jo patang saansein ye teri wo hawayein hain...”',
            meaning: 'In your eyes lies an effortless magic that commands the starlight without saying a word.'
        }
    },

    'river': {
        id: 'river',
        order: 3,
        title: 'The Riverfront',
        subtitle: 'Ahmedabad Nights & Sabarmati Reflections',
        tagline: 'Memories do not always live in photographs; they live in places.',
        coordinates: [180, 160, -220],
        cameraPosition: [180, 175, -130],
        targetLookAt: [180, 160, -220],
        color: '#06B6D4',
        emissiveColor: '#0891B2',
        accentColor: '#A5F3FC',
        icon: '🌊',
        audioMood: 'river',
        narrativePacing: {
            introDelay: 900,
            lines: [
                'The cool evening breeze of Ahmedabad across the Sabarmati.',
                'City lights rippling on moving water.',
                'The quiet pathway of the garden where silence felt comfortable.',
                'Moments that cannot be captured in photographs.',
                'Because the water remembers even when the night passes.'
            ]
        },
        poeticCore: 'In the stillness of the water, every unspoken thought found its mirror.',
        bollywoodLyric: {
            song: 'Iktara',
            film: 'Wake Up Sid',
            artists: 'Kavita Seth & Amit Trivedi',
            line: '“Goonja sa hai koi iktara iktara... Dheeme bole koi iktara iktara... Dil ke aakaash mein sitaare chamke...”',
            meaning: 'A quiet melody hums across the night water, lighting up the sky of my heart.'
        }
    },

    'rose': {
        id: 'rose',
        order: 4,
        title: 'The Royal Rose',
        subtitle: 'Velvet Fortitude & Unshakable Grace',
        tagline: 'A rose does not explain its beauty; it simply blooms.',
        coordinates: [260, -80, -280],
        cameraPosition: [260, -65, -190],
        targetLookAt: [260, -80, -280],
        color: '#F43F5E',
        emissiveColor: '#BE123C',
        accentColor: '#FFE4E6',
        icon: '🌹',
        audioMood: 'rose',
        narrativePacing: {
            introDelay: 1100,
            lines: [
                'A rose is delicate only to those who do not understand its thorns.',
                'Behind your softness lies an iron spine.',
                'Fierce loyalty to the people you love.',
                'You bring calmness into chaotic rooms.',
                'A quiet royalty that commands without shouting.'
            ]
        },
        poeticCore: 'Your strength does not demand an audience; it simply transforms the room.',
        bollywoodLyric: {
            song: 'Afreen Afreen',
            film: 'Coke Studio',
            artists: 'Rahat Fateh Ali Khan & Momina Mustehsan',
            line: '“Husn-e-jaana ki tareef mumkin nahi... Jaise khilta gulab, jaise shayar ka khwaab... Afreen afreen!”',
            meaning: 'Words fail to capture your timeless elegance; like a velvet royal rose, pure poetry in bloom.'
        }
    },

    'silent-language': {
        id: 'silent-language',
        order: 5,
        title: 'The Silent Language',
        subtitle: 'Signed Dialect & Soul Energy Resonance',
        tagline: 'When speech was forbidden to the air, our inner energies spoke directly.',
        coordinates: [-280, -60, -340],
        cameraPosition: [-280, -45, -250],
        targetLookAt: [-280, -60, -340],
        color: '#A855F7',
        emissiveColor: '#7E22CE',
        accentColor: '#F3E8FF',
        icon: '✨',
        audioMood: 'silent-language',
        narrativePacing: {
            introDelay: 1200,
            lines: [
                'There were times when words could not be spoken aloud.',
                'The world around demanded quiet, but our hearts refused distance.',
                'Through signed gestures, subtle hands, and the language of eyes, our conversation never stopped.',
                'And beneath the quiet, something deeper happened:',
                'Our inner energies met, aligned, and spoke soul to soul without needing a single breath.'
            ]
        },
        poeticCore: 'You didn’t just understand my words; you understood the unspoken frequency of my soul before I even began.',
        bollywoodLyric: {
            song: 'Khamoshiyan',
            film: 'Khamoshiyan',
            artists: 'Arijit Singh & Jeet Gannguli',
            line: '“Khamoshiyan aawaaz hain, tum sun’ne to aao kabhi... Chhoo kar tumhe khil jaayengi, ghar inko bulaao kabhi... Khamoshiyan...”',
            meaning: 'Silence itself becomes a voice when two souls understand each other beyond words.'
        }
    },

    'radiance': {
        id: 'radiance',
        order: 6,
        title: 'The Radiant Aura',
        subtitle: 'Her Golden Sunshine & Inexhaustible Positivity',
        tagline: 'In any crowded room or heavy storm, you bring morning light.',
        coordinates: [-80, 80, -290],
        cameraPosition: [-80, 95, -200],
        targetLookAt: [-80, 80, -290],
        color: '#FBBF24',
        emissiveColor: '#D97706',
        accentColor: '#FEF3C7',
        icon: '☀️',
        audioMood: 'radiance',
        narrativePacing: {
            introDelay: 900,
            lines: [
                'Life can often feel weighed down by doubts, routine, and cynicism.',
                'And then Queen Jiyu enters the room.',
                'Your smile is not an accident; it is an act of sovereign generosity.',
                'You transform heavy moments into warm golden mornings simply by being you.',
                'Your positivity is an energy field that protects everyone you care about.'
            ]
        },
        poeticCore: 'You are the sunlight that never asks whether the morning deserves it; you simply shine.',
        bollywoodLyric: {
            song: 'Main Agar Kahoon',
            film: 'Om Shanti Om',
            artists: 'Sonu Nigam & Shreya Ghoshal',
            line: '“Main agar kahoon tumsa haseen, kayanaat mein nahi hai kahin... Tareef ye bhi to sach hai kuch bhi nahi... Tumko paaya hai to jaise khoya hoon...”',
            meaning: 'No constellation in the universe shines with your natural light, warmth, and grace.'
        }
    },

    'sanctuary': {
        id: 'sanctuary',
        order: 7,
        title: 'The Sanctuary of Calm',
        subtitle: 'Patience, Gentle Strength & Deep Listening',
        tagline: 'The world rushes, but around you, peace settles.',
        coordinates: [90, -80, -320],
        cameraPosition: [90, -65, -230],
        targetLookAt: [90, -80, -320],
        color: '#34D399',
        emissiveColor: '#059669',
        accentColor: '#D1FAE5',
        icon: '🕊️',
        audioMood: 'sanctuary',
        narrativePacing: {
            introDelay: 900,
            lines: [
                'Everyone in this world wants to be heard, but almost no one knows how to listen.',
                'Except you.',
                'Your patience is an unshakeable harbor where restless minds find quiet.',
                'You don’t just hear the words spoken; you honor the silence between them.',
                'That calmness is your rarest royalty.'
            ]
        },
        poeticCore: 'In a universe of deafening noise, your presence is the only sanctuary where my heart feels still.',
        bollywoodLyric: {
            song: 'Tum Se Hi',
            film: 'Jab We Met',
            artists: 'Mohit Chauhan & Pritam',
            line: '“Tum se hi din hota hai, surmayi shaam aati hai... Tum se hi, tum se hi... Har ghadi saans aati hai, zindagi kehlaati hai...”',
            meaning: 'Because of your calm presence, every morning feels possible, and every evening brings peace.'
        }
    },

    'missed-days': {
        id: 'missed-days',
        order: 8,
        title: "The Days That Didn't Happen",
        subtitle: 'The Hometown Departure, The Platform & An Unbroken Promise',
        tagline: 'Even when the train departs without a goodbye, our bond only grows deeper.',
        coordinates: [120, -180, -380],
        cameraPosition: [120, -165, -290],
        targetLookAt: [120, -180, -380],
        color: '#64748B',
        emissiveColor: '#334155',
        accentColor: '#E2E8F0',
        icon: '🌧️',
        audioMood: 'missed-days',
        narrativePacing: {
            introDelay: 1000,
            lines: [
                'Everything was planned. You were returning to your hometown, and I was counting down the hours to drop you at the station.',
                'I was so excited just to walk you to the platform, stand by the coach window, and wave until the train slipped away.',
                'Circumstances intervened—reasons I understood completely and respected with all my heart—and we had to let that moment go.',
                'It ached in that quiet hour, but looking through the starlight, it taught me something beautiful:',
                'Distance and missed goodbyes can never shake what is real. My care was right beside you on every mile of that track.'
            ]
        },
        poeticCore: 'Missing you at the platform wasn’t an absence; it was the clearest proof of how deeply you hold my heart.',
        bollywoodLyric: {
            song: 'Agar Tum Saath Ho',
            film: 'Tamasha',
            artists: 'Alka Yagnik & Arijit Singh',
            line: '“Bin bole baatein tumse karoon, agar tum saath ho... Pal bhar thehar jaao, dil ye sambhal jaaye...”',
            meaning: 'Even across miles and missed farewells, knowing you are with me gives meaning to every storm.'
        }
    },

    'ascent': {
        id: 'ascent',
        order: 9,
        title: 'The Ascent',
        subtitle: 'Faith, Ambition, Company Secretary & The Mountain',
        tagline: 'Keep trusting yourself, keep faith, keep smiling, and keep hustling—the summit is yours.',
        coordinates: [0, 240, -340],
        cameraPosition: [0, 255, -240],
        targetLookAt: [0, 240, -340],
        color: '#EAB308',
        emissiveColor: '#A16207',
        accentColor: '#FEF9C3',
        icon: '🏔️',
        audioMood: 'ascent',
        narrativePacing: {
            introDelay: 900,
            lines: [
                'The mountain wind carries the weight of high expectations and endless Company Secretary modules.',
                'There are days when the pressure feels immense, and you wonder if you’re moving fast enough.',
                'So listen closely to the voice that believes in you unconditionally:',
                'Keep trusting yourself. Keep unwavering faith in your journey. Keep that radiant smile alive, and keep hustling with your sovereign spirit.',
                'That black Mercedes S-Class at sunrise and the summit of your dreams are already waiting for you.'
            ]
        },
        poeticCore: 'Keep trusting yourself, keep faith, keep smiling, and keep hustling—I never had a single doubt that you will rule the summit.',
        bollywoodLyric: {
            song: 'Aashayein',
            film: 'Iqbal',
            artists: 'KK & Salim-Sulaiman',
            line: '“Aashayein khile dil ki, ummeedein hase dil ki... Ab mushkil nahi kuch bhi, nahi kuch bhi... Kuch aisa karke dikha, khud pe garv ho!”',
            meaning: 'Keep faith, keep smiling, and keep hustling; your sovereign ambitions will conquer every peak.'
        }
    },

    'queen': {
        id: 'queen',
        order: 10,
        title: 'The Queen',
        subtitle: 'The Crown, The Sovereign & Kya Khoob Lagti Ho',
        tagline: 'You were never meant to fit inside a universe. The universe was made to celebrate Queen Jiyu.',
        coordinates: [0, 0, -420],
        cameraPosition: [0, 15, -260],
        targetLookAt: [0, 0, -420],
        color: '#FFD700',
        emissiveColor: '#B45309',
        accentColor: '#FFF8DC',
        icon: '👑',
        audioMood: 'queen',
        narrativePacing: {
            introDelay: 1500,
            lines: [
                'All ten celestial paths converge into one constellation.',
                'The rhythm, the glance, the river, the rose, the silence, the sunshine, the calm, the train, the climb.',
                'Everything collapses inward and forms the Royal Crown.',
                'And as the camera pulls backward into infinity...',
                'We discover the crown is inside the Retina. The universe is a loop.'
            ]
        },
        poeticCore: 'The universe was simply the best way I knew to tell you how important you are to me.',
        bollywoodLyric: {
            song: 'Kya Khoob Lagti Ho',
            film: 'Dharmatma',
            artists: 'Mukesh, Kanchan & Kalyanji-Anandji',
            line: '“Kya khoob lagti ho, badi sundar dikhti ho... Phir se kaho, kehte raho, achha lagta hai... Jeevan ka har sapna ab sachha lagta hai...”',
            meaning: 'You look breathtaking and sovereign, Queen Jiyu; every dream in this life feels true because you exist.'
        }
    }
};

export const REALM_IDS: RealmId[] = [
    'first-rhythm',
    'retina',
    'river',
    'rose',
    'silent-language',
    'radiance',
    'sanctuary',
    'missed-days',
    'ascent',
    'queen'
];
