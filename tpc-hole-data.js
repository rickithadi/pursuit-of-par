// TPC Sawgrass Stadium Course - Complete Hole Data
// Based on official TPC scorecards and aerial photography

class TPCHoleData {
    constructor() {
        this.courseData = this.initializeTPCHoles();
        this.aerialBaseURL = 'https://tours.skyfoxgolf.com/storage/aerials/t_p_c_sawgrass/';
    }

    initializeTPCHoles() {
        return {
            1: {
                number: 1,
                par: 4,
                name: "Opening Statement",
                description: "A challenging opening hole with water hazards and strategic bunker placement",
                yardages: {
                    black: 423,
                    blue: 394,
                    red: 360,
                    white: 360,
                    green: 292
                },
                difficulty: 13,
                features: {
                    water: "Right side lake affects approach shots",
                    bunkers: "Multiple fairway and greenside bunkers",
                    strategy: "Favor left side of fairway for best approach angle"
                },
                longestDrive: {
                    player: "Gary Woodland",
                    distance: 359,
                    year: 2023
                },
                aerialImage: "hole1_aerial.jpg"
            },
            2: {
                number: 2,
                par: 5,
                name: "The Long Dogleg",
                description: "Reachable par 5 with water protecting the green",
                yardages: {
                    black: 532,
                    blue: 507,
                    red: 507,
                    white: 469,
                    green: 381
                },
                difficulty: 8,
                features: {
                    water: "Lake guards left side of green complex",
                    bunkers: "Strategic fairway bunkers at landing zone",
                    strategy: "Three-shot strategy safer than aggressive approach"
                },
                longestDrive: {
                    player: "Cameron Young",
                    distance: 335,
                    year: 2023
                },
                aerialImage: "hole2_aerial.jpg"
            },
            3: {
                number: 3,
                par: 3,
                name: "Island Par 3",
                description: "Dramatic par 3 with water surrounding the green",
                yardages: {
                    black: 177,
                    blue: 160,
                    red: 160,
                    white: 134,
                    green: 97
                },
                difficulty: 16,
                features: {
                    water: "Complete water carry to peninsula green",
                    bunkers: "Greenside bunkers provide only safe miss",
                    strategy: "Pin position dictates club selection"
                },
                aerialImage: "hole3_aerial.jpg"
            },
            4: {
                number: 4,
                par: 4,
                name: "Water Challenge",
                description: "Strategic par 4 with water cutting through the hole",
                yardages: {
                    black: 384,
                    blue: 359,
                    red: 359,
                    white: 324,
                    green: 263
                },
                difficulty: 12,
                features: {
                    water: "Creek bisects fairway and protects green",
                    bunkers: "Multiple crossing bunkers complicate strategy",
                    strategy: "Precise distance control essential for approach"
                },
                longestDrive: {
                    player: "Patrick Rodgers",
                    distance: 326,
                    year: 2023
                },
                aerialImage: "hole4_aerial.jpg"
            },
            5: {
                number: 5,
                par: 4,
                name: "The Risk Reward",
                description: "High-risk, high-reward hole with multiple water hazards",
                yardages: {
                    black: 471,
                    blue: 446,
                    red: 422,
                    white: 422,
                    green: 360
                },
                difficulty: 4,
                features: {
                    water: "Multiple lakes create strategic decisions",
                    bunkers: "Fairway and greenside bunkers add complexity",
                    strategy: "Aggressive play can pay off but carries high risk"
                },
                longestDrive: {
                    player: "Stewart Cink",
                    distance: 358,
                    year: 2023
                },
                aerialImage: "hole5_aerial.jpg"
            },
            6: {
                number: 6,
                par: 4,
                name: "The Birdie Hole",
                description: "Shorter par 4 with opportunities for aggressive play",
                yardages: { black: 393, blue: 369, red: 369, white: 330, green: 287 },
                difficulty: 18,
                features: {
                    water: "Small pond left of green",
                    bunkers: "Strategic fairway bunkers at driving zone",
                    strategy: "Shorter hole allows for aggressive approach"
                },
                aerialImage: "hole6_aerial.jpg"
            },
            7: {
                number: 7,
                par: 4,
                name: "The Turn",
                description: "Challenging dogleg with water and strategic bunkering",
                yardages: { black: 442, blue: 421, red: 421, white: 379, green: 342 },
                difficulty: 6,
                features: {
                    water: "Water hazard affects approach angle",
                    bunkers: "Deep bunkers protect green complex",
                    strategy: "Position off tee critical for approach"
                },
                aerialImage: "hole7_aerial.jpg"
            },
            8: {
                number: 8,
                par: 5,
                name: "The Long Par 5",
                description: "Classic three-shot par 5 with risk/reward opportunities",
                yardages: { black: 537, blue: 520, red: 520, white: 466, green: 424 },
                difficulty: 14,
                features: {
                    water: "Creek crosses fairway twice",
                    bunkers: "Multiple bunker complexes guard landing areas",
                    strategy: "Three-shot approach safest for most players"
                },
                aerialImage: "hole8_aerial.jpg"
            },
            9: {
                number: 9,
                par: 4,
                name: "The Front Nine Finisher",
                description: "Strong finishing hole for the front nine",
                yardages: { black: 424, blue: 401, red: 401, white: 365, green: 319 },
                difficulty: 10,
                features: {
                    water: "Lake borders left side of hole",
                    bunkers: "Greenside bunkers demand precision",
                    strategy: "Solid par to finish front nine"
                },
                aerialImage: "hole9_aerial.jpg"
            },
            10: {
                number: 10,
                par: 4,
                name: "Back Nine Opener",
                description: "Strategic start to the challenging back nine",
                yardages: { black: 424, blue: 391, red: 391, white: 358, green: 302 },
                difficulty: 11,
                features: {
                    water: "Water right of fairway and green",
                    bunkers: "Strategic bunkering throughout",
                    strategy: "Careful positioning for back nine start"
                },
                aerialImage: "hole10_aerial.jpg"
            },
            11: {
                number: 11,
                par: 5,
                name: "The Water Carry",
                description: "Risk/reward par 5 with water challenges",
                yardages: { black: 558, blue: 535, red: 535, white: 478, green: 419 },
                difficulty: 2,
                features: {
                    water: "Multiple water hazards create strategic decisions",
                    bunkers: "Fairway bunkers at key distances",
                    strategy: "High risk, high reward approach shots"
                },
                aerialImage: "hole11_aerial.jpg"
            },
            12: {
                number: 12,
                par: 4,
                name: "The Challenge",
                description: "One of the toughest holes on the course",
                yardages: { black: 358, blue: 342, red: 342, white: 310, green: 276 },
                difficulty: 1,
                features: {
                    water: "Water hazards demand precision",
                    bunkers: "Deep bunkers surround green",
                    strategy: "Most difficult hole requires careful planning"
                },
                aerialImage: "hole12_aerial.jpg"
            },
            13: {
                number: 13,
                par: 3,
                name: "The Short Iron",
                description: "Demanding par 3 with precise distance control",
                yardages: { black: 181, blue: 165, red: 165, white: 139, green: 101 },
                difficulty: 15,
                features: {
                    water: "Water hazard short and left of green",
                    bunkers: "Greenside bunkers provide bailout",
                    strategy: "Pin position dictates target selection"
                },
                aerialImage: "hole13_aerial.jpg"
            },
            14: {
                number: 14,
                par: 4,
                name: "The Dogleg",
                description: "Strategic dogleg requiring careful club selection",
                yardages: { black: 467, blue: 467, red: 440, white: 401, green: 347 },
                difficulty: 5,
                features: {
                    water: "Lake affects both tee shot and approach",
                    bunkers: "Strategic bunker placement",
                    strategy: "Distance control crucial off tee"
                },
                aerialImage: "hole14_aerial.jpg"
            },
            15: {
                number: 15,
                par: 4,
                name: "The Precision Test",
                description: "Accuracy paramount on this challenging hole",
                yardages: { black: 449, blue: 449, red: 423, white: 381, green: 344 },
                difficulty: 7,
                features: {
                    water: "Water hazards throughout the hole",
                    bunkers: "Multiple bunker complexes",
                    strategy: "Precision over power essential"
                },
                aerialImage: "hole15_aerial.jpg"
            },
            16: {
                number: 16,
                par: 5,
                name: "The Beast",
                description: "Longest hole on the course with multiple challenges",
                yardages: { black: 507, blue: 507, red: 481, white: 433, green: 390 },
                difficulty: 3,
                features: {
                    water: "Water hazards guard green complex",
                    bunkers: "Strategic bunkering at all landing areas",
                    strategy: "Three-shot strategy recommended"
                },
                aerialImage: "hole16_aerial.jpg"
            },
            17: {
                number: 17,
                par: 3,
                name: "The Island Green",
                description: "World's most famous par 3 - the iconic island green",
                yardages: { black: 137, blue: 124, red: 124, white: 101, green: 78 },
                difficulty: 17,
                features: {
                    water: "Complete island green surrounded by water",
                    bunkers: "No bunkers - water is the only hazard",
                    strategy: "All or nothing - no safe miss"
                },
                aerialImage: "hole17_aerial.jpg",
                isSignature: true
            },
            18: {
                number: 18,
                par: 4,
                name: "The Stadium Finisher",
                description: "Championship finishing hole with grandstand atmosphere",
                yardages: { black: 447, blue: 447, red: 415, white: 374, green: 337 },
                difficulty: 9,
                features: {
                    water: "Water left of fairway and green",
                    bunkers: "Championship-caliber green complex",
                    strategy: "Demanding finish under pressure"
                },
                aerialImage: "hole18_aerial.jpg",
                isSignature: true
            }
        };
    }

    getHoleData(holeNumber) {
        return this.courseData[holeNumber];
    }

    getAerialURL(holeNumber) {
        return `${this.aerialBaseURL}hole${holeNumber}_aerial.jpg`;
    }

    getAllHoles() {
        return Object.values(this.courseData);
    }

    // Method to fetch and cache aerial images
    async loadAerialImage(holeNumber) {
        const url = this.getAerialURL(holeNumber);
        try {
            const response = await fetch(url);
            if (response.ok) {
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            }
            return null;
        } catch (error) {
            console.warn(`Failed to load aerial for hole ${holeNumber}:`, error);
            return null;
        }
    }

    // Professional tournament formatting
    formatYardage(yardage, units = 'yards') {
        if (units === 'meters') {
            return Math.round(yardage * 0.9144);
        }
        return yardage;
    }

    getDifficultyRating(holeNumber) {
        const hole = this.getHoleData(holeNumber);
        return hole ? hole.difficulty : null;
    }

    getStrategicTips(holeNumber) {
        const hole = this.getHoleData(holeNumber);
        return hole ? hole.features.strategy : "Play smart and stay in bounds";
    }
}

// Export for use in main game
if (typeof window !== 'undefined') {
    window.TPCHoleData = TPCHoleData;
} else if (typeof module !== 'undefined') {
    module.exports = TPCHoleData;
}