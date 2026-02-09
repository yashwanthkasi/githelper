// ================================
// INITIALIZATION
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initScenarioCards();
    initCopyButtons();
    initOSTabs();
    initSidebarNavigation();
    initQuizzes();
    initModals();
    initCommandReference();
    updateProgress();
});

// ================================
// SCENARIO CARDS - Expand/Collapse
// ================================
function initScenarioCards() {
    const cards = document.querySelectorAll('.scenario-card');
    
    cards.forEach(card => {
        const header = card.querySelector('.card-header');
        
        header.addEventListener('click', () => {
            // Close other cards (accordion behavior - optional)
            // cards.forEach(c => c !== card && c.classList.remove('expanded'));
            
            card.classList.toggle('expanded');
        });
    });
}

// ================================
// COPY BUTTONS
// ================================
function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const textToCopy = btn.dataset.copy || 
                btn.closest('.terminal')?.querySelector('code')?.textContent || '';
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });
}

// ================================
// OS TABS
// ================================
function initOSTabs() {
    document.querySelectorAll('.os-tabs').forEach(tabGroup => {
        const tabs = tabGroup.querySelectorAll('.os-tab');
        const contents = tabGroup.parentElement.querySelectorAll('.os-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const os = tab.dataset.os;
                
                // Update tabs
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update content
                contents.forEach(c => {
                    c.classList.toggle('active', c.dataset.os === os);
                });
            });
        });
    });
}

// ================================
// SIDEBAR NAVIGATION
// ================================
function initSidebarNavigation() {
    const links = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.section');
    
    // Click handling
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll spy
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ================================
// PROGRESS TRACKING
// ================================
function updateProgress() {
    const completedQuizzes = Object.keys(localStorage)
        .filter(key => key.startsWith('quiz-module-') && key.endsWith('-completed'))
        .length;
    
    const totalModules = 8;
    const percentage = Math.round((completedQuizzes / totalModules) * 100);
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}% Complete`;
    
    // Update quiz badges
    document.querySelectorAll('.quiz-badge').forEach(badge => {
        const quizId = badge.dataset.quiz;
        if (localStorage.getItem(`quiz-${quizId}-completed`)) {
            badge.classList.add('completed');
        }
    });
}

// ================================
// MODALS
// ================================
function initModals() {
    // Command Modal
    const commandModal = document.getElementById('commandModal');
    const modalClose = document.getElementById('modalClose');
    
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            commandModal.classList.remove('active');
        });
    }
    
    // Quiz Result Modal
    const quizResultModal = document.getElementById('quizResultModal');
    const quizResultClose = document.getElementById('quizResultClose');
    const retryQuizBtn = document.getElementById('retryQuizBtn');
    
    if (quizResultClose) {
        quizResultClose.addEventListener('click', () => {
            quizResultModal.classList.remove('active');
        });
    }
    
    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// ================================
// QUIZ DATA - 80 Questions (10 per module)
// ================================
const quizData = {
    'module-1': {
        title: 'Git Foundations',
        questions: [
            {
                question: 'What is Git?',
                options: [
                    'A programming language',
                    'A distributed version control system',
                    'A cloud hosting platform',
                    'A code editor'
                ],
                correct: 1,
                explanation: 'Git is a distributed version control system that tracks changes in your code.'
            },
            {
                question: 'What is the main difference between Git and GitHub?',
                options: [
                    'They are the same thing',
                    'Git is local software, GitHub is a cloud platform',
                    'GitHub is faster than Git',
                    'Git only works with GitHub'
                ],
                correct: 1,
                explanation: 'Git is local version control software, while GitHub is a cloud platform that hosts Git repositories.'
            },
            {
                question: 'Which command verifies your Git installation?',
                options: [
                    'git check',
                    'git verify',
                    'git --version',
                    'git status'
                ],
                correct: 2,
                explanation: 'git --version displays the installed Git version.'
            },
            {
                question: 'What does the --global flag do in git config?',
                options: [
                    'Makes the setting available worldwide',
                    'Applies setting to all repositories on your machine',
                    'Shares settings with teammates',
                    'Uploads settings to GitHub'
                ],
                correct: 1,
                explanation: '--global applies the configuration to all repositories on your machine.'
            },
            {
                question: 'Which email format should Infosys developers use for git config?',
                options: [
                    'personal@gmail.com',
                    'firstname.lastname@infosys.com',
                    'any email is fine',
                    'no email needed'
                ],
                correct: 1,
                explanation: 'Infosys developers should use their corporate email: firstname.lastname@infosys.com'
            },
            {
                question: 'What happens when you run git config --list?',
                options: [
                    'Creates a new configuration',
                    'Deletes all configurations',
                    'Shows all current Git settings',
                    'Opens configuration file for editing'
                ],
                correct: 2,
                explanation: 'git config --list displays all your current Git configuration settings.'
            },
            {
                question: 'What command sets your Git username?',
                options: [
                    'git user.name "Name"',
                    'git config --global user.name "Name"',
                    'git set name "Name"',
                    'git username "Name"'
                ],
                correct: 1,
                explanation: 'git config --global user.name "Name" sets your Git username.'
            },
            {
                question: 'Why is version control important?',
                options: [
                    'It makes code run faster',
                    'It tracks changes and enables collaboration',
                    'It compiles code automatically',
                    'It creates backups daily'
                ],
                correct: 1,
                explanation: 'Version control tracks all changes and enables multiple developers to collaborate effectively.'
            },
            {
                question: 'Which of these is NOT a Git alternative?',
                options: [
                    'Mercurial',
                    'SVN',
                    'Perforce',
                    'Docker'
                ],
                correct: 3,
                explanation: 'Docker is a containerization platform, not a version control system.'
            },
            {
                question: 'Where are Git global configurations stored?',
                options: [
                    'In the project folder',
                    'In your home directory (.gitconfig)',
                    'On GitHub servers',
                    'In the Windows registry'
                ],
                correct: 1,
                explanation: 'Global Git configurations are stored in .gitconfig in your home directory.'
            }
        ]
    },
    'module-2': {
        title: 'First Repository',
        questions: [
            {
                question: 'What does git init create?',
                options: [
                    'A new GitHub repository',
                    'A .git folder that tracks the project',
                    'A new branch',
                    'A configuration file'
                ],
                correct: 1,
                explanation: 'git init creates a .git folder that contains all Git tracking information.'
            },
            {
                question: 'Which file should you create BEFORE running git init?',
                options: [
                    'README.md',
                    '.gitignore',
                    'package.json',
                    'config.yml'
                ],
                correct: 1,
                explanation: 'Create .gitignore first to prevent tracking unwanted files from the start.'
            },
            {
                question: 'What should NEVER be committed to Git?',
                options: [
                    'README files',
                    'Source code',
                    'API keys and passwords',
                    'Configuration templates'
                ],
                correct: 2,
                explanation: 'API keys, passwords, and .env files should never be committed - they are security risks.'
            },
            {
                question: 'What naming convention should Infosys repos follow?',
                options: [
                    'Any name is fine',
                    'infy-project-name',
                    'INFOSYS_PROJECT',
                    'project.infosys'
                ],
                correct: 1,
                explanation: 'Infosys repositories should follow the infy-project-name convention.'
            },
            {
                question: 'What does git clone do?',
                options: [
                    'Creates an empty repository',
                    'Copies a remote repository to your local machine',
                    'Makes a backup of your code',
                    'Uploads code to GitHub'
                ],
                correct: 1,
                explanation: 'git clone downloads a complete copy of a remote repository with all history.'
            },
            {
                question: 'After cloning, what is the remote called by default?',
                options: [
                    'main',
                    'master',
                    'origin',
                    'upstream'
                ],
                correct: 2,
                explanation: 'By default, the cloned remote is named "origin".'
            },
            {
                question: 'What does the -u flag in git push -u origin main do?',
                options: [
                    'Updates the repository',
                    'Sets the upstream branch for future pushes',
                    'Uploads all branches',
                    'Undoes the push'
                ],
                correct: 1,
                explanation: '-u sets upstream so future git push commands work without specifying the remote/branch.'
            },
            {
                question: 'Which website generates .gitignore files for any tech stack?',
                options: [
                    'github.com',
                    'gitignore.io',
                    'stackoverflow.com',
                    'gitlab.com'
                ],
                correct: 1,
                explanation: 'gitignore.io generates customized .gitignore files for any technology stack.'
            },
            {
                question: 'What is inside the .git folder?',
                options: [
                    'Your source code',
                    'All Git tracking data and history',
                    'Compiled files',
                    'User settings'
                ],
                correct: 1,
                explanation: 'The .git folder contains all version control data, commit history, and Git configuration.'
            },
            {
                question: 'When creating a GitHub repo to push existing local code, should you initialize with README?',
                options: [
                    'Yes, always',
                    'No, if you already have local commits',
                    'It does not matter',
                    'Only for private repos'
                ],
                correct: 1,
                explanation: 'Do not initialize with README if you already have local commits - it will cause conflicts.'
            }
        ]
    },
    'module-3': {
        title: 'Daily Workflow',
        questions: [
            {
                question: 'What command should you ALWAYS run first before making changes?',
                options: [
                    'git add',
                    'git commit',
                    'git status',
                    'git push'
                ],
                correct: 2,
                explanation: 'Always run git status first to see the current state of your working directory.'
            },
            {
                question: 'What does git add . do?',
                options: [
                    'Adds a single file',
                    'Stages all changes in the current directory',
                    'Commits all changes',
                    'Pushes all changes'
                ],
                correct: 1,
                explanation: 'git add . stages all modified and new files in the current directory.'
            },
            {
                question: 'Which of these is a good Infosys commit message?',
                options: [
                    'fixed stuff',
                    'update',
                    'INF-3456: Add input validation to login form',
                    'changes'
                ],
                correct: 2,
                explanation: 'Good commit messages include the ticket number and describe what was changed.'
            },
            {
                question: 'What command shows unstaged changes in your files?',
                options: [
                    'git status',
                    'git diff',
                    'git log',
                    'git show'
                ],
                correct: 1,
                explanation: 'git diff shows the actual line-by-line changes that have not been staged.'
            },
            {
                question: 'What should you do before pushing code?',
                options: [
                    'Delete the branch',
                    'Pull the latest changes',
                    'Reset your repository',
                    'Close VS Code'
                ],
                correct: 1,
                explanation: 'Always pull before push to get the latest changes and avoid conflicts.'
            },
            {
                question: 'What are the three states in Git workflow?',
                options: [
                    'Draft, Review, Published',
                    'Working Directory, Staging Area, Repository',
                    'Local, Remote, Cloud',
                    'Create, Edit, Delete'
                ],
                correct: 1,
                explanation: 'Git has three states: Working Directory (modified), Staging Area (staged), Repository (committed).'
            },
            {
                question: 'Which command combines add and commit for tracked files?',
                options: [
                    'git add-commit',
                    'git commit -am "message"',
                    'git push -ac',
                    'git save'
                ],
                correct: 1,
                explanation: 'git commit -am "message" stages and commits all tracked modified files.'
            },
            {
                question: 'What does git pull actually do?',
                options: [
                    'Only downloads changes',
                    'Downloads and merges changes',
                    'Uploads your changes',
                    'Creates a new branch'
                ],
                correct: 1,
                explanation: 'git pull is equivalent to git fetch + git merge - it downloads and merges changes.'
            },
            {
                question: 'What does "working tree clean" mean in git status?',
                options: [
                    'Git was uninstalled',
                    'No uncommitted changes exist',
                    'The repository was deleted',
                    'All files were pushed'
                ],
                correct: 1,
                explanation: 'Working tree clean means there are no modified or staged files - everything is committed.'
            },
            {
                question: 'How do you stage a specific file?',
                options: [
                    'git stage filename',
                    'git add filename',
                    'git commit filename',
                    'git push filename'
                ],
                correct: 1,
                explanation: 'git add filename stages a specific file for the next commit.'
            }
        ]
    },
    'module-4': {
        title: 'Understanding History',
        questions: [
            {
                question: 'What does git log --oneline show?',
                options: [
                    'Full commit details',
                    'Compact one-line per commit history',
                    'Only the last commit',
                    'Branch information'
                ],
                correct: 1,
                explanation: 'git log --oneline shows a compact view with commit hash and message on one line.'
            },
            {
                question: 'What does git blame do?',
                options: [
                    'Blames teammates for bugs',
                    'Shows who changed each line and when',
                    'Deletes commit history',
                    'Reports bugs to GitHub'
                ],
                correct: 1,
                explanation: 'git blame shows the last commit that modified each line of a file.'
            },
            {
                question: 'How do you see commits from a specific author?',
                options: [
                    'git log --user="Name"',
                    'git log --author="Name"',
                    'git show --author="Name"',
                    'git blame --author="Name"'
                ],
                correct: 1,
                explanation: 'git log --author="Name" filters commits by author name or email.'
            },
            {
                question: 'What does git show abc1234 display?',
                options: [
                    'All commits',
                    'Details and diff of a specific commit',
                    'Branch list',
                    'Remote URLs'
                ],
                correct: 1,
                explanation: 'git show displays the details and changes of a specific commit.'
            },
            {
                question: 'How do you see the visual branch graph?',
                options: [
                    'git log --graph',
                    'git branch --visual',
                    'git show --tree',
                    'git history'
                ],
                correct: 0,
                explanation: 'git log --graph --oneline --all shows a visual ASCII graph of branches.'
            },
            {
                question: 'What does git log -p show?',
                options: [
                    'Just commit messages',
                    'Commit history with actual diffs',
                    'Project path',
                    'Push history'
                ],
                correct: 1,
                explanation: 'git log -p shows commit history including the actual file changes (patches).'
            },
            {
                question: 'How do you search commit messages for a keyword?',
                options: [
                    'git search "keyword"',
                    'git log --grep="keyword"',
                    'git find "keyword"',
                    'git log --search="keyword"'
                ],
                correct: 1,
                explanation: 'git log --grep="keyword" searches commit messages for the specified text.'
            },
            {
                question: 'What does git blame -L 10,20 file.js do?',
                options: [
                    'Blames lines 10 to 20 only',
                    'Shows blame for lines 10 to 20',
                    'Deletes lines 10 to 20',
                    'Commits lines 10 to 20'
                ],
                correct: 1,
                explanation: '-L limits git blame to specific line ranges.'
            },
            {
                question: 'How do you see commits from the last week?',
                options: [
                    'git log --week',
                    'git log --since="1 week ago"',
                    'git log --last=7',
                    'git log --days=7'
                ],
                correct: 1,
                explanation: 'git log --since="1 week ago" shows commits from the past week.'
            },
            {
                question: 'What does -- separate in git log -p -- filename?',
                options: [
                    'Comments',
                    'Options from file paths',
                    'Different branches',
                    'Commit ranges'
                ],
                correct: 1,
                explanation: '-- separates git options from file paths to avoid ambiguity.'
            }
        ]
    },
    'module-5': {
        title: 'Branching Strategies',
        questions: [
            {
                question: 'What does git checkout -b feature/login do?',
                options: [
                    'Switches to existing branch',
                    'Creates and switches to new branch',
                    'Deletes the branch',
                    'Merges the branch'
                ],
                correct: 1,
                explanation: '-b creates a new branch and switches to it in one command.'
            },
            {
                question: 'What is the Infosys branch naming convention for features?',
                options: [
                    'feature-INF-1234',
                    'feature/INF-1234-description',
                    'INF1234_feature',
                    'feat_1234'
                ],
                correct: 1,
                explanation: 'Infosys uses feature/INF-XXXX-description format for feature branches.'
            },
            {
                question: 'What does git stash do?',
                options: [
                    'Deletes your changes',
                    'Temporarily saves uncommitted changes',
                    'Commits changes',
                    'Pushes to remote'
                ],
                correct: 1,
                explanation: 'git stash saves your uncommitted changes temporarily so you can switch branches.'
            },
            {
                question: 'How do you recover stashed changes?',
                options: [
                    'git stash get',
                    'git stash pop',
                    'git stash restore',
                    'git unstash'
                ],
                correct: 1,
                explanation: 'git stash pop applies the stashed changes and removes them from the stash list.'
            },
            {
                question: 'What is the difference between stash pop and stash apply?',
                options: [
                    'They are the same',
                    'pop removes from list, apply keeps it',
                    'apply is faster',
                    'pop works offline'
                ],
                correct: 1,
                explanation: 'pop applies and removes the stash, while apply keeps it in the stash list.'
            },
            {
                question: 'What command lists all stashes?',
                options: [
                    'git stash show',
                    'git stash list',
                    'git stash all',
                    'git stashes'
                ],
                correct: 1,
                explanation: 'git stash list shows all saved stashes with their identifiers.'
            },
            {
                question: 'How do you delete a branch locally?',
                options: [
                    'git branch -d branchname',
                    'git delete branchname',
                    'git remove branch branchname',
                    'git branch --remove branchname'
                ],
                correct: 0,
                explanation: 'git branch -d branchname deletes a local branch (-D forces deletion).'
            },
            {
                question: 'Why use branches for features?',
                options: [
                    'To make code run faster',
                    'To work in isolation without affecting main code',
                    'To save storage space',
                    'Branches are required by Git'
                ],
                correct: 1,
                explanation: 'Branches allow isolated development without affecting the stable main branch.'
            },
            {
                question: 'What type of branch is used for urgent production fixes?',
                options: [
                    'feature/',
                    'bugfix/',
                    'hotfix/',
                    'urgent/'
                ],
                correct: 2,
                explanation: 'hotfix/ branches are used for urgent production fixes that cannot wait.'
            },
            {
                question: 'What command shows all branches including remote?',
                options: [
                    'git branch',
                    'git branch -a',
                    'git branch --remote',
                    'git branches'
                ],
                correct: 1,
                explanation: 'git branch -a shows all local and remote-tracking branches.'
            }
        ]
    },
    'module-6': {
        title: 'Team Collaboration',
        questions: [
            {
                question: 'What does git fetch do compared to git pull?',
                options: [
                    'Fetches and merges',
                    'Downloads without merging',
                    'Uploads changes',
                    'Deletes remote branch'
                ],
                correct: 1,
                explanation: 'git fetch downloads remote changes but does not merge them automatically.'
            },
            {
                question: 'What does git remote -v show?',
                options: [
                    'Remote branch names',
                    'Remote URLs for fetch and push',
                    'Remote commit history',
                    'Remote user list'
                ],
                correct: 1,
                explanation: 'git remote -v shows the URLs configured for fetching and pushing.'
            },
            {
                question: 'What does <<<<<<< HEAD mean in a merge conflict?',
                options: [
                    'The conflict is resolved',
                    'Start of your current changes',
                    'End of incoming changes',
                    'Git error message'
                ],
                correct: 1,
                explanation: '<<<<<<< HEAD marks the beginning of your current branch changes in a conflict.'
            },
            {
                question: 'After resolving a conflict, what must you do?',
                options: [
                    'Run git conflict resolve',
                    'git add the file, then commit',
                    'Push immediately',
                    'Delete the file'
                ],
                correct: 1,
                explanation: 'After resolving conflicts, stage the file with git add and commit the resolution.'
            },
            {
                question: 'What causes a merge conflict?',
                options: [
                    'Network errors',
                    'Same lines modified differently in two branches',
                    'File is too large',
                    'Wrong Git version'
                ],
                correct: 1,
                explanation: 'Conflicts occur when the same lines are modified differently in branches being merged.'
            },
            {
                question: 'How do you add a new remote?',
                options: [
                    'git remote add name url',
                    'git add remote name url',
                    'git new remote name url',
                    'git remote create name url'
                ],
                correct: 0,
                explanation: 'git remote add name url adds a new remote connection.'
            },
            {
                question: 'What is a Pull Request (PR)?',
                options: [
                    'Command to download code',
                    'Request to merge your branch into another',
                    'Request for help',
                    'Automatic merge'
                ],
                correct: 1,
                explanation: 'A Pull Request is a request to review and merge your branch into another branch.'
            },
            {
                question: 'What does ======= separate in a conflict?',
                options: [
                    'Two different files',
                    'Your changes from incoming changes',
                    'Old code from new code',
                    'Comments from code'
                ],
                correct: 1,
                explanation: '======= separates your current changes (above) from incoming changes (below).'
            },
            {
                question: 'How do you see what is new on remote before merging?',
                options: [
                    'git pull --preview',
                    'git fetch then git log HEAD..origin/main',
                    'git status --remote',
                    'git diff remote'
                ],
                correct: 1,
                explanation: 'Fetch first, then compare HEAD with origin/main to see incoming commits.'
            },
            {
                question: 'What tool does VS Code provide for merge conflicts?',
                options: [
                    'No support',
                    'Accept Current/Incoming/Both buttons',
                    'Auto-resolve only',
                    'Command line only'
                ],
                correct: 1,
                explanation: 'VS Code shows Accept Current Change, Accept Incoming Change, and Accept Both buttons.'
            }
        ]
    },
    'module-7': {
        title: 'Undoing Mistakes',
        questions: [
            {
                question: 'What does git commit --amend do?',
                options: [
                    'Creates a new commit',
                    'Modifies the last commit',
                    'Deletes the last commit',
                    'Pushes the commit'
                ],
                correct: 1,
                explanation: 'git commit --amend modifies the last commit (message or content).'
            },
            {
                question: 'When should you NOT use git commit --amend?',
                options: [
                    'For typos in message',
                    'To add forgotten files',
                    'After pushing to shared branch',
                    'Before any push'
                ],
                correct: 2,
                explanation: 'Never amend pushed commits on shared branches - it rewrites history.'
            },
            {
                question: 'What does git reset --soft HEAD~1 do?',
                options: [
                    'Deletes last commit, loses changes',
                    'Undo commit, keeps changes staged',
                    'Undo commit, unstages changes',
                    'Pushes changes'
                ],
                correct: 1,
                explanation: '--soft undoes the commit but keeps your changes in the staging area.'
            },
            {
                question: 'What is the safest way to undo a published commit?',
                options: [
                    'git reset --hard',
                    'git revert',
                    'git amend',
                    'Delete and re-clone'
                ],
                correct: 1,
                explanation: 'git revert creates a new commit that undoes changes without rewriting history.'
            },
            {
                question: 'What does git reflog track?',
                options: [
                    'Only commits',
                    'All HEAD movements and operations',
                    'Remote changes',
                    'File modifications'
                ],
                correct: 1,
                explanation: 'Reflog records every movement of HEAD - commits, resets, checkouts, etc.'
            },
            {
                question: 'How long does reflog keep history by default?',
                options: [
                    '7 days',
                    '30 days',
                    '90 days',
                    'Forever'
                ],
                correct: 2,
                explanation: 'By default, reflog entries expire after 90 days.'
            },
            {
                question: 'What does git restore --staged filename do?',
                options: [
                    'Deletes the file',
                    'Unstages the file',
                    'Stages the file',
                    'Commits the file'
                ],
                correct: 1,
                explanation: 'git restore --staged removes a file from the staging area.'
            },
            {
                question: 'What is dangerous about git reset --hard?',
                options: [
                    'It is slow',
                    'It permanently discards uncommitted changes',
                    'It deletes the repo',
                    'It affects remote'
                ],
                correct: 1,
                explanation: '--hard discards all uncommitted changes permanently (unless you use reflog).'
            },
            {
                question: 'How do you recover from an accidental git reset --hard?',
                options: [
                    'Impossible to recover',
                    'Use git reflog to find commit and reset to it',
                    'Contact GitHub support',
                    'Re-clone the repository'
                ],
                correct: 1,
                explanation: 'Use git reflog to find the commit hash before the reset, then reset to it.'
            },
            {
                question: 'What does git reset (no flags) default to?',
                options: [
                    '--soft',
                    '--mixed',
                    '--hard',
                    '--keep'
                ],
                correct: 1,
                explanation: 'git reset defaults to --mixed: moves HEAD, unstages changes, keeps working directory.'
            }
        ]
    },
    'module-8': {
        title: 'Pro Techniques',
        questions: [
            {
                question: 'What does git rebase -i HEAD~4 do?',
                options: [
                    'Deletes 4 commits',
                    'Opens interactive editor to modify last 4 commits',
                    'Creates 4 new commits',
                    'Merges 4 branches'
                ],
                correct: 1,
                explanation: 'Interactive rebase lets you edit, squash, reorder, or drop the last 4 commits.'
            },
            {
                question: 'What does "squash" do in interactive rebase?',
                options: [
                    'Deletes the commit',
                    'Combines commit with previous one',
                    'Moves commit to end',
                    'Renames the commit'
                ],
                correct: 1,
                explanation: 'Squash merges a commit into the previous one, combining their changes.'
            },
            {
                question: 'When should you NOT rebase?',
                options: [
                    'On local branches',
                    'Before creating a PR',
                    'On commits already pushed to shared branches',
                    'When squashing'
                ],
                correct: 2,
                explanation: 'Never rebase pushed commits on shared branches - it rewrites history others depend on.'
            },
            {
                question: 'What does git cherry-pick do?',
                options: [
                    'Deletes a commit',
                    'Copies a specific commit to current branch',
                    'Creates a new branch',
                    'Reverts a commit'
                ],
                correct: 1,
                explanation: 'Cherry-pick applies changes from a specific commit to your current branch.'
            },
            {
                question: 'What creates an annotated tag?',
                options: [
                    'git tag v1.0.0',
                    'git tag -a v1.0.0 -m "message"',
                    'git tag --annotate v1.0.0',
                    'git create-tag v1.0.0'
                ],
                correct: 1,
                explanation: 'git tag -a creates an annotated tag with a message, author, and date.'
            },
            {
                question: 'How do you push tags to remote?',
                options: [
                    'git push (tags auto-push)',
                    'git push --tags',
                    'git tag push',
                    'git push origin tags'
                ],
                correct: 1,
                explanation: 'Tags do not push automatically; use git push --tags to push all tags.'
            },
            {
                question: 'What is the purpose of version tags?',
                options: [
                    'To mark branches',
                    'To mark release points in history',
                    'To delete old code',
                    'To track bugs'
                ],
                correct: 1,
                explanation: 'Tags mark specific points (releases) in history for easy reference.'
            },
            {
                question: 'What does "pick" mean in interactive rebase?',
                options: [
                    'Delete the commit',
                    'Keep the commit as-is',
                    'Edit the commit',
                    'Squash the commit'
                ],
                correct: 1,
                explanation: 'pick keeps the commit unchanged in the rebase operation.'
            },
            {
                question: 'What is git add -p used for?',
                options: [
                    'Add all files',
                    'Stage changes interactively (patch mode)',
                    'Add to previous commit',
                    'Add with priority'
                ],
                correct: 1,
                explanation: 'git add -p lets you stage specific parts (hunks) of changes interactively.'
            },
            {
                question: 'What does reword do in interactive rebase?',
                options: [
                    'Deletes the commit',
                    'Changes only the commit message',
                    'Combines commits',
                    'Reorders commits'
                ],
                correct: 1,
                explanation: 'reword keeps the commit but lets you change its message.'
            }
        ]
    }
};

// ================================
// QUIZ SYSTEM
// ================================
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = {};

function initQuizzes() {
    document.querySelectorAll('.quiz-section').forEach(quizSection => {
        const quizId = quizSection.dataset.quiz;
        const container = quizSection.querySelector('.quiz-container');
        
        if (!container || !quizData[quizId]) return;
        
        // Check if already completed
        if (localStorage.getItem(`quiz-${quizId}-completed`)) {
            showQuizCompleted(quizSection, quizId);
            return;
        }
        
        // Initialize quiz UI
        initQuizUI(quizId, container);
    });
}

function initQuizUI(quizId, container) {
    const quiz = quizData[quizId];
    if (!quiz) return;
    
    const questionContainer = container.querySelector('.quiz-question-container');
    const progressFill = container.querySelector('.quiz-progress-fill');
    const progressText = container.querySelector('.quiz-progress-text');
    const prevBtn = container.querySelector('.quiz-prev');
    const nextBtn = container.querySelector('.quiz-next');
    const submitBtn = container.querySelector('.quiz-submit');
    
    currentQuiz = quizId;
    currentQuestionIndex = 0;
    userAnswers[quizId] = new Array(quiz.questions.length).fill(null);
    
    function renderQuestion() {
        const q = quiz.questions[currentQuestionIndex];
        const total = quiz.questions.length;
        
        // Update progress
        progressFill.style.width = `${((currentQuestionIndex + 1) / total) * 100}%`;
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${total}`;
        
        // Render question
        questionContainer.innerHTML = `
            <div class="quiz-question">
                <h5>${currentQuestionIndex + 1}. ${q.question}</h5>
                <div class="quiz-options">
                    ${q.options.map((opt, i) => `
                        <label class="quiz-option ${userAnswers[quizId][currentQuestionIndex] === i ? 'selected' : ''}">
                            <input type="radio" name="q${currentQuestionIndex}" value="${i}" 
                                ${userAnswers[quizId][currentQuestionIndex] === i ? 'checked' : ''}>
                            ${opt}
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Add event listeners to options
        questionContainer.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', () => {
                const input = option.querySelector('input');
                input.checked = true;
                userAnswers[quizId][currentQuestionIndex] = parseInt(input.value);
                
                // Update UI
                questionContainer.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
        
        // Update navigation buttons
        prevBtn.disabled = currentQuestionIndex === 0;
        
        if (currentQuestionIndex === total - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }
    
    // Navigation
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        }
    });
    
    submitBtn.addEventListener('click', () => {
        submitQuiz(quizId);
    });
    
    // Initial render
    renderQuestion();
}

function submitQuiz(quizId) {
    const quiz = quizData[quizId];
    const answers = userAnswers[quizId];
    
    // Calculate score
    let correct = 0;
    answers.forEach((answer, i) => {
        if (answer === quiz.questions[i].correct) {
            correct++;
        }
    });
    
    const total = quiz.questions.length;
    const percentage = Math.round((correct / total) * 100);
    
    // Save completion
    localStorage.setItem(`quiz-${quizId}-completed`, 'true');
    localStorage.setItem(`quiz-${quizId}-score`, correct);
    
    // Show results modal
    showQuizResults(quizId, correct, total, percentage);
    
    // Update progress
    updateProgress();
}

function showQuizResults(quizId, correct, total, percentage) {
    const modal = document.getElementById('quizResultModal');
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreMessage = document.getElementById('scoreMessage');
    const scoreCircle = document.getElementById('scoreCircle');
    const quizReview = document.getElementById('quizReview');
    const retryBtn = document.getElementById('retryQuizBtn');
    
    scoreNumber.textContent = correct;
    
    // Set message based on score
    if (percentage >= 80) {
        scoreMessage.textContent = '🎉 Excellent! You\'ve mastered this module!';
        scoreCircle.style.background = 'var(--success-light)';
    } else if (percentage >= 60) {
        scoreMessage.textContent = '👍 Good job! Review the topics you missed.';
        scoreCircle.style.background = 'var(--warning-light)';
    } else {
        scoreMessage.textContent = '📚 Keep learning! Review this module and try again.';
        scoreCircle.style.background = 'var(--danger-light)';
    }
    
    // Generate review
    const quiz = quizData[quizId];
    const answers = userAnswers[quizId];
    
    quizReview.innerHTML = quiz.questions.map((q, i) => {
        const isCorrect = answers[i] === q.correct;
        return `
            <div class="review-item" style="padding: 0.5rem 0; border-bottom: 1px solid var(--gray-200);">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>${isCorrect ? '✅' : '❌'}</span>
                    <strong>Q${i + 1}:</strong>
                    <span style="color: var(--gray-600);">${q.question.substring(0, 50)}...</span>
                </div>
                ${!isCorrect ? `<p style="font-size: 0.85rem; color: var(--gray-600); margin: 0.25rem 0 0 1.5rem;">
                    Correct: ${q.options[q.correct]}
                </p>` : ''}
            </div>
        `;
    }).join('');
    
    // Retry button
    retryBtn.onclick = () => {
        localStorage.removeItem(`quiz-${quizId}-completed`);
        localStorage.removeItem(`quiz-${quizId}-score`);
        modal.classList.remove('active');
        
        // Re-init the quiz
        const quizSection = document.querySelector(`[data-quiz="${quizId}"]`);
        const container = quizSection.querySelector('.quiz-container');
        initQuizUI(quizId, container);
        updateProgress();
    };
    
    modal.classList.add('active');
}

function showQuizCompleted(quizSection, quizId) {
    const score = localStorage.getItem(`quiz-${quizId}-score`) || '?';
    const container = quizSection.querySelector('.quiz-container');
    
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
            <h4 style="color: var(--success); margin-bottom: 0.5rem;">Quiz Completed!</h4>
            <p style="color: var(--gray-600); margin-bottom: 1rem;">You scored ${score}/10</p>
            <button class="quiz-btn quiz-submit" onclick="retryQuiz('${quizId}')">Retake Quiz</button>
        </div>
    `;
}

function retryQuiz(quizId) {
    localStorage.removeItem(`quiz-${quizId}-completed`);
    localStorage.removeItem(`quiz-${quizId}-score`);
    location.reload();
}

// Make retryQuiz available globally
window.retryQuiz = retryQuiz;

// ================================
// COMMAND REFERENCE DATA
// ================================
const commandData = {
    'git config': {
        description: 'Configure Git settings like user name, email, and preferences',
        options: [
            {
                flag: '--global',
                description: 'Apply configuration to all repositories for this user'
            },
            {
                flag: '--local',
                description: 'Apply configuration to only this repository'
            },
            {
                flag: 'user.name',
                description: 'Set the author name for commits'
            },
            {
                flag: 'user.email',
                description: 'Set the author email for commits'
            },
            {
                flag: 'core.editor',
                description: 'Set the default text editor for Git'
            }
        ],
        example: 'git config --global user.name "Your Name"\ngit config --global user.email "your@email.com"'
    },
    'git init': {
        description: 'Initialize a new Git repository in the current directory',
        options: [
            {
                flag: '--initial-branch=<name>',
                description: 'Specify the name of the initial branch (default: master)'
            },
            {
                flag: '--bare',
                description: 'Create a bare repository (no working directory)'
            },
            {
                flag: '-q, --quiet',
                description: 'Run quietly'
            }
        ],
        example: 'git init\ngit init my-project\ngit init --initial-branch=main'
    },
    'git clone': {
        description: 'Clone a repository to create a local copy',
        options: [
            {
                flag: '<repository>',
                description: 'The URL or path of the repository to clone'
            },
            {
                flag: '<directory>',
                description: 'Directory name for the cloned repository'
            },
            {
                flag: '--depth <depth>',
                description: 'Create a shallow clone with limited history'
            },
            {
                flag: '--branch <branch>',
                description: 'Clone a specific branch'
            },
            {
                flag: '--single-branch',
                description: 'Clone only a single branch'
            }
        ],
        example: 'git clone https://github.com/user/repo.git\ngit clone https://github.com/user/repo.git my-folder\ngit clone --depth 1 <repository>'
    },
    'git status': {
        description: 'Show the working tree status and staging area',
        options: [
            {
                flag: '-s, --short',
                description: 'Show output in short format'
            },
            {
                flag: '-b, --branch',
                description: 'Show branch information'
            },
            {
                flag: '--porcelain',
                description: 'Show machine-readable format'
            },
            {
                flag: '-u[<mode>], --untracked-files[=<mode>]',
                description: 'Show untracked files'
            }
        ],
        example: 'git status\ngit status -s\ngit status --branch'
    },
    'git add': {
        description: 'Stage changes to the index for the next commit',
        options: [
            {
                flag: '<pathspec>',
                description: 'Path(s) to the files to stage'
            },
            {
                flag: '.',
                description: 'Stage all changes in the current directory'
            },
            {
                flag: '-A, --all',
                description: 'Stage all changes in the entire repository'
            },
            {
                flag: '-u, --update',
                description: 'Update only tracked files'
            },
            {
                flag: '-p, --patch',
                description: 'Interactively choose hunks to stage'
            }
        ],
        example: 'git add file.txt\ngit add .\ngit add -A\ngit add -p'
    },
    'git commit': {
        description: 'Create a new commit with the staged changes',
        options: [
            {
                flag: '-m <message>',
                description: 'Commit message (required)'
            },
            {
                flag: '-a, --all',
                description: 'Stage and commit all tracked file changes'
            },
            {
                flag: '--amend',
                description: 'Modify the previous commit'
            },
            {
                flag: '--no-verify',
                description: 'Skip pre-commit hooks'
            },
            {
                flag: '--allow-empty',
                description: 'Allow creating a commit with no changes'
            }
        ],
        example: 'git commit -m "Add new feature"\ngit commit -am "Update files"\ngit commit --amend'
    },
    'git push': {
        description: 'Update remote repository with local commits',
        options: [
            {
                flag: '<remote>',
                description: 'Remote name (usually "origin")'
            },
            {
                flag: '<branch>',
                description: 'Branch name to push'
            },
            {
                flag: '-u, --set-upstream',
                description: 'Set the upstream branch for tracking'
            },
            {
                flag: '--all',
                description: 'Push all branches'
            },
            {
                flag: '--force',
                description: 'Force push (use with caution!)'
            },
            {
                flag: '--tags',
                description: 'Push all tags'
            }
        ],
        example: 'git push\ngit push origin main\ngit push -u origin feature-branch'
    },
    'git pull': {
        description: 'Fetch from and integrate with remote repository',
        options: [
            {
                flag: '<remote>',
                description: 'Remote name (usually "origin")'
            },
            {
                flag: '<branch>',
                description: 'Branch name to pull'
            },
            {
                flag: '--rebase',
                description: 'Rebase instead of merge'
            },
            {
                flag: '--no-rebase',
                description: 'Create a merge commit'
            }
        ],
        example: 'git pull\ngit pull origin main\ngit pull --rebase'
    },
    'git log': {
        description: 'Show commit history',
        options: [
            {
                flag: '--oneline',
                description: 'Show commits in one-line format'
            },
            {
                flag: '--graph',
                description: 'Show branch structure as ASCII graph'
            },
            {
                flag: '--all',
                description: 'Show all branches'
            },
            {
                flag: '-n <number>',
                description: 'Limit output to recent commits'
            },
            {
                flag: '--author=<pattern>',
                description: 'Filter by author'
            },
            {
                flag: '--since=<date>',
                description: 'Filter commits since date'
            }
        ],
        example: 'git log\ngit log --oneline\ngit log --graph --all\ngit log -10'
    },
    'git diff': {
        description: 'Show differences between commits, branches, or working tree',
        options: [
            {
                flag: '<commit1> <commit2>',
                description: 'Show diff between two commits'
            },
            {
                flag: '--staged',
                description: 'Show diff of staged changes'
            },
            {
                flag: '--word-diff',
                description: 'Show word-level diff'
            },
            {
                flag: '--stat',
                description: 'Show statistics only'
            },
            {
                flag: '<file>',
                description: 'Show diff for specific file'
            }
        ],
        example: 'git diff\ngit diff --staged\ngit diff HEAD~1\ngit diff main develop'
    },
    'git show': {
        description: 'Show specific commit or object details',
        options: [
            {
                flag: '<commit>',
                description: 'Commit hash or ref to show'
            },
            {
                flag: '--stat',
                description: 'Show statistics only'
            },
            {
                flag: '--name-only',
                description: 'Show only changed files'
            }
        ],
        example: 'git show HEAD\ngit show abc123\ngit show HEAD~2'
    },
    'git blame': {
        description: 'Show who changed each line in a file',
        options: [
            {
                flag: '<file>',
                description: 'File to analyze'
            },
            {
                flag: '-L <start>,<end>',
                description: 'Show specific line range'
            },
            {
                flag: '--date=<format>',
                description: 'Show dates in specific format'
            }
        ],
        example: 'git blame filename.txt\ngit blame -L 10,20 filename.txt'
    },
    'git branch': {
        description: 'List, create, or delete branches',
        options: [
            {
                flag: '(no arguments)',
                description: 'List local branches'
            },
            {
                flag: '-a, --all',
                description: 'List all branches (local and remote)'
            },
            {
                flag: '<branch>',
                description: 'Create new branch'
            },
            {
                flag: '-d <branch>',
                description: 'Delete branch (safe)'
            },
            {
                flag: '-D <branch>',
                description: 'Force delete branch'
            },
            {
                flag: '-m <old> <new>',
                description: 'Rename branch'
            }
        ],
        example: 'git branch\ngit branch feature\ngit branch -a\ngit branch -d feature'
    },
    'git checkout': {
        description: 'Switch branches, restore files, or create new branches',
        options: [
            {
                flag: '<branch>',
                description: 'Switch to branch'
            },
            {
                flag: '-b <branch>',
                description: 'Create and switch to new branch'
            },
            {
                flag: '<file>',
                description: 'Restore file to HEAD state'
            },
            {
                flag: '<commit> -- <file>',
                description: 'Restore file to specific commit'
            }
        ],
        example: 'git checkout main\ngit checkout -b feature-branch\ngit checkout filename.txt'
    },
    'git merge': {
        description: 'Merge branches into current branch',
        options: [
            {
                flag: '<branch>',
                description: 'Branch to merge'
            },
            {
                flag: '--no-ff',
                description: 'Create merge commit even for fast-forward'
            },
            {
                flag: '--squash',
                description: 'Squash commits before merging'
            },
            {
                flag: '--abort',
                description: 'Abort the merge process'
            }
        ],
        example: 'git merge develop\ngit merge --no-ff feature-branch\ngit merge --abort'
    },
    'git stash': {
        description: 'Save and restore incomplete changes',
        options: [
            {
                flag: '(no arguments)',
                description: 'Stash current changes'
            },
            {
                flag: 'save <message>',
                description: 'Stash with descriptive message'
            },
            {
                flag: 'list',
                description: 'List all stashes'
            },
            {
                flag: 'pop [<stash>]',
                description: 'Apply and remove stash'
            },
            {
                flag: 'apply [<stash>]',
                description: 'Apply stash without removing'
            },
            {
                flag: 'drop [<stash>]',
                description: 'Delete stash'
            }
        ],
        example: 'git stash\ngit stash save "WIP: feature"\ngit stash list\ngit stash pop'
    },
    'git clean': {
        description: 'Remove untracked files from working directory',
        options: [
            {
                flag: '-n, --dry-run',
                description: 'Preview what would be deleted'
            },
            {
                flag: '-f, --force',
                description: 'Force deletion'
            },
            {
                flag: '-d',
                description: 'Also remove untracked directories'
            },
            {
                flag: '-x',
                description: 'Also remove ignored files'
            }
        ],
        example: 'git clean -n\ngit clean -fd\ngit clean -fdx'
    },
    'git restore': {
        description: 'Restore working tree files or staging area',
        options: [
            {
                flag: '<file>',
                description: 'File to restore (from HEAD)'
            },
            {
                flag: '--staged <file>',
                description: 'Unstage file from index'
            },
            {
                flag: '--source=<commit>',
                description: 'Restore from specific commit'
            },
            {
                flag: '--worktree',
                description: 'Restore in working directory'
            }
        ],
        example: 'git restore file.txt\ngit restore --staged file.txt\ngit restore --source=HEAD~1 file.txt'
    },
    'git reset': {
        description: 'Reset current HEAD to specified state',
        options: [
            {
                flag: '--soft HEAD~n',
                description: 'Undo commits, keep staged changes'
            },
            {
                flag: '--mixed HEAD~n',
                description: 'Undo commits, keep changes unstaged (default)'
            },
            {
                flag: '--hard HEAD~n',
                description: 'Undo commits and discard changes'
            },
            {
                flag: '<file>',
                description: 'Unstage file'
            }
        ],
        example: 'git reset --soft HEAD~1\ngit reset --hard HEAD~1\ngit reset file.txt'
    },
    'git revert': {
        description: 'Create new commits that undo specified commits',
        options: [
            {
                flag: '<commit>',
                description: 'Commit to revert'
            },
            {
                flag: '--no-edit',
                description: 'Use default commit message'
            },
            {
                flag: '--no-commit',
                description: 'Create revert but don\'t commit'
            }
        ],
        example: 'git revert abc123\ngit revert HEAD\ngit revert --no-edit abc123'
    },
    'git reflog': {
        description: 'Show history of HEAD and other reference changes',
        options: [
            {
                flag: '(no arguments)',
                description: 'Show reflog for HEAD'
            },
            {
                flag: '<ref>',
                description: 'Show reflog for specific reference'
            },
            {
                flag: 'expire --expire=now --all',
                description: 'Clear all reflog entries'
            }
        ],
        example: 'git reflog\ngit reflog show\ngit reflog expire --expire=now --all'
    },
    'git remote': {
        description: 'Manage remote repository connections',
        options: [
            {
                flag: '(no arguments)',
                description: 'List remotes'
            },
            {
                flag: '-v, --verbose',
                description: 'Show URLs for remotes'
            },
            {
                flag: 'add <name> <url>',
                description: 'Add new remote'
            },
            {
                flag: 'remove <name>',
                description: 'Remove remote'
            },
            {
                flag: 'rename <old> <new>',
                description: 'Rename remote'
            },
            {
                flag: 'set-url <name> <new-url>',
                description: 'Change remote URL'
            }
        ],
        example: 'git remote\ngit remote -v\ngit remote add origin https://github.com/user/repo.git'
    },
    'git fetch': {
        description: 'Download objects and references from remote repository',
        options: [
            {
                flag: '<remote>',
                description: 'Remote name (usually "origin")'
            },
            {
                flag: '--all',
                description: 'Fetch from all remotes'
            },
            {
                flag: '--prune',
                description: 'Remove remote-tracking branches no longer on remote'
            },
            {
                flag: '--depth <depth>',
                description: 'Fetch limited history'
            }
        ],
        example: 'git fetch\ngit fetch origin\ngit fetch --all\ngit fetch --prune'
    },
    'git rebase': {
        description: 'Reapply commits on top of another branch',
        options: [
            {
                flag: '<branch>',
                description: 'Branch to rebase onto'
            },
            {
                flag: '-i, --interactive',
                description: 'Interactive rebase for editing commits'
            },
            {
                flag: '--continue',
                description: 'Continue after resolving conflicts'
            },
            {
                flag: '--abort',
                description: 'Cancel the rebase process'
            }
        ],
        example: 'git rebase main\ngit rebase -i HEAD~3\ngit rebase --continue'
    },
    'git cherry-pick': {
        description: 'Apply specific commits to current branch',
        options: [
            {
                flag: '<commit>',
                description: 'Commit(s) to apply'
            },
            {
                flag: '--continue',
                description: 'Continue after resolving conflicts'
            },
            {
                flag: '--abort',
                description: 'Cancel the cherry-pick process'
            },
            {
                flag: '-n, --no-commit',
                description: 'Stage changes without committing'
            }
        ],
        example: 'git cherry-pick abc123\ngit cherry-pick abc123..def456\ngit cherry-pick --continue'
    },
    'git tag': {
        description: 'Create, list, and delete tags',
        options: [
            {
                flag: '(no arguments)',
                description: 'List tags'
            },
            {
                flag: '<tagname>',
                description: 'Create lightweight tag'
            },
            {
                flag: '-a <tagname>',
                description: 'Create annotated tag'
            },
            {
                flag: '-m <message>',
                description: 'Tag message (with -a)'
            },
            {
                flag: '-d <tagname>',
                description: 'Delete tag'
            }
        ],
        example: 'git tag\ngit tag v1.0.0\ngit tag -a v1.0.0 -m "Release version 1.0.0"'
    }
};

// ================================
// COMMAND REFERENCE MODAL
// ================================
function initCommandReference() {
    document.querySelectorAll('.btn-know-more').forEach(btn => {
        btn.addEventListener('click', () => {
            const command = btn.dataset.cmd;
            showCommandDetails(command);
        });
    });
}

function showCommandDetails(command) {
    const data = commandData[command];
    if (!data) return;
    
    const modal = document.getElementById('commandModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = command;
    
    let html = `<p class="cmd-description">${data.description}</p>`;
    
    if (data.options && data.options.length > 0) {
        html += '<h4 style="margin-top: 1.5rem; color: var(--primary-dark);">Options & Flags</h4>';
        html += '<div style="margin-top: 1rem;">';
        
        data.options.forEach(opt => {
            html += `
                <div class="cmd-option">
                    <div class="option-flag">
                        <code>${opt.flag}</code>
                    </div>
                    <div class="option-description">${opt.description}</div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    if (data.example) {
        html += `
            <div class="cmd-example">
                <div class="cmd-example-title">📝 Example Usage:</div>
                <code>${data.example.replace(/\n/g, '<br>')}</code>
            </div>
        `;
    }
    
    modalBody.innerHTML = html;
    modal.classList.add('active');
}

