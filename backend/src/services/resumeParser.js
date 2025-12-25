const pdf = require('pdf-parse');
const natural = require('natural');
const fs = require('fs');
const path = require('path');
const Skill = require('../models/Skill');

class ResumeParser {
    constructor() {
        this.tokenizer = new natural.WordTokenizer();
        this.stemmer = natural.PorterStemmer;
        
        // Common skills database
        this.skillKeywords = {
            programming: [
                'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'swift', 'kotlin',
                'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
                'spring', 'laravel', 'typescript', 'sql', 'mongodb', 'mysql', 'postgresql', 'redis'
            ],
            data_science: [
                'machine learning', 'deep learning', 'ai', 'artificial intelligence',
                'data analysis', 'data visualization', 'statistics', 'r', 'pandas', 'numpy',
                'tensorflow', 'pytorch', 'scikit-learn', 'tableau', 'power bi', 'excel',
                'big data', 'hadoop', 'spark', 'hive'
            ],
            design: [
                'ui/ux', 'user interface', 'user experience', 'figma', 'sketch', 'adobe xd',
                'photoshop', 'illustrator', 'indesign', 'prototyping', 'wireframing',
                'graphic design', 'web design', 'mobile design'
            ],
            business: [
                'project management', 'agile', 'scrum', 'kanban', 'leadership', 'team management',
                'strategic planning', 'business development', 'marketing', 'sales', 'finance',
                'accounting', 'customer service', 'communication', 'presentation'
            ],
            soft_skills: [
                'communication', 'teamwork', 'problem solving', 'critical thinking',
                'time management', 'adaptability', 'creativity', 'attention to detail',
                'leadership', 'collaboration', 'work ethic', 'interpersonal skills'
            ]
        };
        
        // Education keywords
        this.educationKeywords = [
            'bachelor', 'master', 'phd', 'degree', 'university', 'college', 'school',
            'graduation', 'gpa', 'grade', 'course', 'certificate', 'diploma'
        ];
        
        // Experience keywords
        this.experienceKeywords = [
            'experience', 'work', 'job', 'position', 'role', 'responsibilities',
            'achievements', 'projects', 'internship', 'employment', 'career'
        ];
    }

    async parseResume(filePath) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            
            // Check file type
            const ext = path.extname(filePath).toLowerCase();
            
            let parsedData = {};
            
            if (ext === '.pdf') {
                parsedData = await this.parsePDF(dataBuffer);
            } else if (ext === '.doc' || ext === '.docx') {
                parsedData = await this.parseDOC(dataBuffer);
            } else {
                throw new Error('Unsupported file format');
            }
            
            // Extract skills
            parsedData.skills = this.extractSkills(parsedData.text);
            
            // Extract education
            parsedData.education = this.extractEducation(parsedData.text);
            
            // Extract experience
            parsedData.experience = this.extractExperience(parsedData.text);
            
            // Calculate proficiency levels
            parsedData.proficiency = this.calculateProficiency(parsedData);
            
            return parsedData;
            
        } catch (error) {
            console.error('Error parsing resume:', error);
            throw error;
        }
    }

    async parsePDF(dataBuffer) {
        try {
            const data = await pdf(dataBuffer);
            
            return {
                text: data.text,
                metadata: data.metadata,
                numPages: data.numpages,
                info: data.info
            };
            
        } catch (error) {
            console.error('Error parsing PDF:', error);
            throw error;
        }
    }

    async parseDOC(dataBuffer) {
        // For DOC/DOCX files, you would use a library like mammoth
        // This is a simplified version
        try {
            // In production, use mammoth or similar library
            // For now, return mock data
            return {
                text: "This is a mock DOC file content. Skills: JavaScript, React, Node.js. Education: Bachelor of Computer Science. Experience: Software Developer at ABC Corp.",
                metadata: {},
                numPages: 1
            };
        } catch (error) {
            console.error('Error parsing DOC:', error);
            throw error;
        }
    }

    extractSkills(text) {
        const skills = new Set();
        const tokens = this.tokenizer.tokenize(text.toLowerCase());
        
        // Check for each skill category
        for (const [category, skillList] of Object.entries(this.skillKeywords)) {
            for (const skill of skillList) {
                // Check for exact match or partial match
                const skillTokens = skill.toLowerCase().split(/[\s\/]+/);
                let found = false;
                
                if (skillTokens.length === 1) {
                    // Single word skill
                    if (tokens.includes(skill.toLowerCase())) {
                        found = true;
                    }
                } else {
                    // Multi-word skill
                    const skillPattern = skill.toLowerCase();
                    if (text.toLowerCase().includes(skillPattern)) {
                        found = true;
                    }
                }
                
                if (found) {
                    skills.add(skill.toLowerCase());
                }
            }
        }
        
        // Also extract skills using NLP
        this.extractSkillsUsingNLP(text, skills);
        
        return Array.from(skills);
    }

    extractSkillsUsingNLP(text, skillsSet) {
        const sentences = text.split(/[.!?]+/);
        
        sentences.forEach(sentence => {
            const tokens = this.tokenizer.tokenize(sentence.toLowerCase());
            
            // Look for skill patterns
            tokens.forEach((token, index) => {
                // Check for "proficient in", "experienced with", etc.
                const skillIndicators = ['proficient', 'experienced', 'skilled', 'knowledge', 'familiar'];
                
                if (skillIndicators.includes(token) && index < tokens.length - 1) {
                    // The next word might be a skill
                    const potentialSkill = tokens[index + 1];
                    
                    // Check against known skills
                    for (const skillList of Object.values(this.skillKeywords)) {
                        if (skillList.some(s => 
                            s.toLowerCase().includes(potentialSkill) || 
                            potentialSkill.includes(s.toLowerCase())
                        )) {
                            skillList.forEach(s => {
                                if (s.toLowerCase().includes(potentialSkill)) {
                                    skillsSet.add(s.toLowerCase());
                                }
                            });
                        }
                    }
                }
            });
        });
    }

    extractEducation(text) {
        const education = {};
        const lines = text.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            
            // Look for education section
            if (line.includes('education') || this.educationKeywords.some(keyword => line.includes(keyword))) {
                
                // Try to extract degree
                const degreePatterns = [
                    /bachelor.*?science/i,
                    /bachelor.*?arts/i,
                    /bachelor.*?engineering/i,
                    /master.*?science/i,
                    /master.*?arts/i,
                    /master.*?business/i,
                    /ph\.?d/i,
                    /doctor.*?philosophy/i
                ];
                
                for (const pattern of degreePatterns) {
                    const match = line.match(pattern);
                    if (match) {
                        education.degree = match[0];
                        break;
                    }
                }
                
                // Try to extract university
                const universityKeywords = ['university', 'college', 'institute', 'school'];
                for (let j = i; j < Math.min(i + 5, lines.length); j++) {
                    for (const keyword of universityKeywords) {
                        if (lines[j].toLowerCase().includes(keyword)) {
                            education.university = lines[j].trim();
                            break;
                        }
                    }
                    if (education.university) break;
                }
                
                // Try to extract GPA
                const gpaMatch = line.match(/gpa.*?(\d\.\d)/i) || text.match(/grade.*?point.*?average.*?(\d\.\d)/i);
                if (gpaMatch) {
                    education.gpa = parseFloat(gpaMatch[1]);
                }
                
                // Try to extract graduation year
                const yearMatch = line.match(/(20\d{2})/) || text.match(/graduat.*?(20\d{2})/i);
                if (yearMatch) {
                    education.graduationYear = parseInt(yearMatch[1]);
                }
                
                break;
            }
        }
        
        return education;
    }

    extractExperience(text) {
        const experience = {
            years: 0,
            positions: []
        };
        
        const lines = text.split('\n');
        let inExperienceSection = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            
            // Look for experience section
            if (line.includes('experience') || line.includes('work history') || line.includes('employment')) {
                inExperienceSection = true;
                continue;
            }
            
            if (inExperienceSection) {
                // Look for job titles
                const jobTitlePatterns = [
                    /software.*?engineer/i,
                    /developer/i,
                    /intern/i,
                    /analyst/i,
                    /manager/i,
                    /designer/i,
                    /specialist/i
                ];
                
                for (const pattern of jobTitlePatterns) {
                    const match = lines[i].match(pattern);
                    if (match) {
                        experience.positions.push({
                            title: lines[i].trim(),
                            // Try to extract duration from next lines
                            duration: this.extractDuration(lines, i)
                        });
                        break;
                    }
                }
                
                // Try to extract years of experience
                const yearsMatch = line.match(/(\d+)\+?\s*(year|yr)/i);
                if (yearsMatch) {
                    experience.years = parseInt(yearsMatch[1]);
                }
                
                // Exit experience section if we hit another major section
                if (line.includes('education') || line.includes('skills') || line.includes('projects')) {
                    inExperienceSection = false;
                }
            }
        }
        
        return experience;
    }

    extractDuration(lines, startIndex) {
        for (let i = startIndex; i < Math.min(startIndex + 3, lines.length); i++) {
            const durationMatch = lines[i].match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec).*?\d{4}.*?(to|–|-).*?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present|current).*?\d{4}/i);
            if (durationMatch) {
                return durationMatch[0];
            }
            
            const yearMatch = lines[i].match(/\d{4}.*?(to|–|-).*?(\d{4}|present|current)/i);
            if (yearMatch) {
                return yearMatch[0];
            }
        }
        
        return 'Duration not specified';
    }

    calculateProficiency(parsedData) {
        const proficiency = {};
        
        // Calculate proficiency based on frequency and context
        parsedData.skills.forEach(skill => {
            let score = 0;
            
            // Check frequency in text
            const skillLower = skill.toLowerCase();
            const occurrences = (parsedData.text.toLowerCase().match(new RegExp(skillLower, 'g')) || []).length;
            
            if (occurrences > 3) {
                score += 30;
            } else if (occurrences > 1) {
                score += 20;
            } else {
                score += 10;
            }
            
            // Check if skill is mentioned in experience section
            if (parsedData.experience.positions.some(position => 
                position.title.toLowerCase().includes(skillLower)
            )) {
                score += 40;
            }
            
            // Check years of experience
            if (parsedData.experience.years > 3) {
                score += 30;
            } else if (parsedData.experience.years > 1) {
                score += 20;
            } else {
                score += 10;
            }
            
            // Convert score to proficiency level
            if (score >= 80) {
                proficiency[skill] = 'expert';
            } else if (score >= 60) {
                proficiency[skill] = 'advanced';
            } else if (score >= 40) {
                proficiency[skill] = 'intermediate';
            } else {
                proficiency[skill] = 'beginner';
            }
        });
        
        return proficiency;
    }

    // Enhanced skill extraction using database
    async extractSkillsWithDatabase(text) {
        const skills = new Set();
        
        // Get all skills from database
        const allSkills = await Skill.find({});
        
        // Convert text to lowercase for case-insensitive matching
        const textLower = text.toLowerCase();
        
        // Check each skill from database
        allSkills.forEach(skill => {
            const skillName = skill.name.toLowerCase();
            
            // Check for exact match
            if (textLower.includes(skillName)) {
                skills.add(skill.name);
            }
            
            // Check for partial matches (for skills with multiple words)
            const skillWords = skillName.split(' ');
            if (skillWords.length > 1) {
                // Check if all words appear in text (not necessarily together)
                const allWordsPresent = skillWords.every(word => textLower.includes(word));
                if (allWordsPresent) {
                    skills.add(skill.name);
                }
            }
            
            // Check for acronyms or variations
            if (skill.aliases && skill.aliases.length > 0) {
                skill.aliases.forEach(alias => {
                    if (textLower.includes(alias.toLowerCase())) {
                        skills.add(skill.name);
                    }
                });
            }
        });
        
        return Array.from(skills);
    }

    // Parse resume and update skills database
    async parseAndUpdateSkills(filePath) {
        const parsedData = await this.parseResume(filePath);
        
        // Update skill popularity in database
        for (const skillName of parsedData.skills) {
            await Skill.findOneAndUpdate(
                { name: skillName.toLowerCase() },
                { $inc: { popularity: 1 } },
                { upsert: true, new: true }
            );
        }
        
        return parsedData;
    }
}

module.exports = new ResumeParser();