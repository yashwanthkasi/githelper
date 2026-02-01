/**
 * Git for Beginners - Interactive Learning
 * JavaScript for interactivity with Quizzes & Command Info
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initScenarioCards();
    initCopyButtons();
    initSidebarNavigation();
    initProgressTracker();
    initSmoothScroll();
    initCommandInfoModal();
    initAllQuizzes();
});

/**
 * Scenario Cards - Expand/Collapse functionality
 */
function initScenarioCards() {
    const cards = document.querySelectorAll('.scenario-card');
    
    cards.forEach(card => {
        const header = card.querySelector('.card-header');
        const expandBtn = card.querySelector('.expand-btn');
        
        // Click on header to expand/collapse
        header.addEventListener('click', (e) => {
            // Don't toggle if clicking on a button inside header
            if (e.target.closest('.copy-btn')) return;
            
            toggleCard(card);
        });
        
        // Keyboard accessibility
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCard(card);
            }
        });
    });
}

function toggleCard(card) {
    const isExpanded = card.classList.contains('expanded');
    const header = card.querySelector('.card-header');
    
    // Close all other cards (accordion behavior - optional)
    // Uncomment the following lines if you want only one card open at a time
    // const allCards = document.querySelectorAll('.scenario-card');
    // allCards.forEach(c => {
    //     c.classList.remove('expanded');
    //     c.querySelector('.card-header').setAttribute('aria-expanded', 'false');
    // });
    
    // Toggle current card
    if (isExpanded) {
        card.classList.remove('expanded');
        header.setAttribute('aria-expanded', 'false');
    } else {
        card.classList.add('expanded');
        header.setAttribute('aria-expanded', 'true');
        
        // Scroll card into view if needed
        setTimeout(() => {
            const cardRect = card.getBoundingClientRect();
            const headerHeight = 64; // var(--header-height)
            
            if (cardRect.top < headerHeight) {
                card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    }
    
    // Update progress when card is expanded (user is learning)
    if (!isExpanded) {
        updateProgress();
    }
}

/**
 * Copy to Clipboard functionality
 */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation(); // Prevent card toggle
            
            const textToCopy = btn.getAttribute('data-copy');
            
            if (!textToCopy) {
                // If no data-copy, get text from sibling pre/code
                const terminal = btn.closest('.terminal');
                const code = terminal.querySelector('code');
                if (code) {
                    await copyToClipboard(code.textContent, btn);
                }
            } else {
                await copyToClipboard(textToCopy, btn);
            }
        });
    });
}

async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        
        // Visual feedback
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        
        // Fallback for older browsers
        fallbackCopyToClipboard(text, button);
    }
}

function fallbackCopyToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Fallback copy failed:', err);
        button.textContent = 'Failed';
    }
    
    document.body.removeChild(textArea);
}

/**
 * Sidebar Navigation - Active state based on scroll
 */
function initSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.section');
    
    // Intersection Observer for active section detection
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                updateActiveLink(sectionId);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Click handler for sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const sectionId = link.getAttribute('data-section');
            updateActiveLink(sectionId);
        });
    });
}

function updateActiveLink(sectionId) {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

/**
 * Progress Tracker
 */
function initProgressTracker() {
    updateProgress();
    
    // Also update on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateProgressOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateProgress() {
    const expandedCards = document.querySelectorAll('.scenario-card.expanded').length;
    const totalCards = document.querySelectorAll('.scenario-card').length;
    
    // Store expanded cards in localStorage for persistence
    const viewedCards = JSON.parse(localStorage.getItem('gitLearningProgress') || '[]');
    
    document.querySelectorAll('.scenario-card.expanded').forEach(card => {
        const scenarioId = card.getAttribute('data-scenario');
        if (scenarioId && !viewedCards.includes(scenarioId)) {
            viewedCards.push(scenarioId);
        }
    });
    
    localStorage.setItem('gitLearningProgress', JSON.stringify(viewedCards));
    
    const progress = Math.round((viewedCards.length / totalCards) * 100);
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${progress}% Complete`;
    }
}

function updateProgressOnScroll() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Simple scroll-based progress (alternative to card-based)
    const scrollProgress = Math.round((scrollPosition / documentHeight) * 100);
    
    // You can use this for a different kind of progress tracking
    // For now, we keep the card-based progress
}

// Load saved progress on page load
function loadSavedProgress() {
    const viewedCards = JSON.parse(localStorage.getItem('gitLearningProgress') || '[]');
    
    viewedCards.forEach(scenarioId => {
        const card = document.querySelector(`.scenario-card[data-scenario="${scenarioId}"]`);
        if (card) {
            // Mark as viewed but don't expand
            card.setAttribute('data-viewed', 'true');
        }
    });
    
    updateProgress();
}

// Call on load
document.addEventListener('DOMContentLoaded', loadSavedProgress);

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = 64; // var(--header-height)
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Reset Progress (utility function)
 */
function resetProgress() {
    localStorage.removeItem('gitLearningProgress');
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = '0%';
    }
    
    if (progressText) {
        progressText.textContent = '0% Complete';
    }
    
    // Collapse all cards
    document.querySelectorAll('.scenario-card').forEach(card => {
        card.classList.remove('expanded');
        card.removeAttribute('data-viewed');
        const header = card.querySelector('.card-header');
        if (header) {
            header.setAttribute('aria-expanded', 'false');
        }
    });
    
    console.log('Progress reset!');
}

/**
 * Expand All Cards (utility function)
 */
function expandAllCards() {
    document.querySelectorAll('.scenario-card').forEach(card => {
        card.classList.add('expanded');
        const header = card.querySelector('.card-header');
        if (header) {
            header.setAttribute('aria-expanded', 'true');
        }
    });
    
    updateProgress();
}

/**
 * Collapse All Cards (utility function)
 */
function collapseAllCards() {
    document.querySelectorAll('.scenario-card').forEach(card => {
        card.classList.remove('expanded');
        const header = card.querySelector('.card-header');
        if (header) {
            header.setAttribute('aria-expanded', 'false');
        }
    });
}

// Expose utility functions globally for console access
window.gitLearning = {
    resetProgress,
    expandAllCards,
    collapseAllCards,
    getProgress: () => {
        const viewedCards = JSON.parse(localStorage.getItem('gitLearningProgress') || '[]');
        const totalCards = document.querySelectorAll('.scenario-card').length;
        return {
            viewed: viewedCards.length,
            total: totalCards,
            percentage: Math.round((viewedCards.length / totalCards) * 100)
        };
    }
};

/**
 * Keyboard Navigation
 */
document.addEventListener('keydown', (e) => {
    // Press 'E' to expand all (when not in input)
    if (e.key === 'e' && !e.target.closest('input, textarea')) {
        // Uncomment if you want this shortcut
        // expandAllCards();
    }
    
    // Press 'C' to collapse all
    if (e.key === 'c' && !e.target.closest('input, textarea')) {
        // Uncomment if you want this shortcut
        // collapseAllCards();
    }
});

/**
 * Print functionality - Expand all cards before printing
 */
window.addEventListener('beforeprint', () => {
    expandAllCards();
});

console.log('🎉 Git Learning Interactive Page Loaded!');
console.log('💡 Tip: Use gitLearning.resetProgress() to start fresh');
console.log('💡 Tip: Use gitLearning.expandAllCards() to expand all sections');

// =====================================================
// COMMAND INFO MODAL & DATA
// =====================================================
const commandData = {
    'git clone': {
        description: 'Clone a repository into a new directory',
        synopsis: 'git clone [options] <repository> [<directory>]',
        options: [
            { flag: '--depth <n>', desc: 'Create a shallow clone with history truncated to the specified number of commits' },
            { flag: '--branch <name>', desc: 'Clone only the specified branch instead of all branches' },
            { flag: '--single-branch', desc: 'Clone only the history leading to the tip of a single branch' },
            { flag: '--no-checkout', desc: 'Clone the repository but don\'t checkout HEAD (bare working directory)' },
            { flag: '--mirror', desc: 'Set up a mirror of the source repository (includes all refs)' },
            { flag: '--recurse-submodules', desc: 'Initialize and clone submodules within the project' },
            { flag: '--shallow-submodules', desc: 'Clone submodules with a depth of 1' },
            { flag: '-q, --quiet', desc: 'Operate quietly, showing only errors' },
            { flag: '-v, --verbose', desc: 'Run verbosely' },
            { flag: '--progress', desc: 'Force progress reporting even when not connected to terminal' }
        ],
        examples: [
            { desc: 'Clone a repository', code: 'git clone https://github.com/user/repo.git' },
            { desc: 'Clone to a specific folder', code: 'git clone https://github.com/user/repo.git my-folder' },
            { desc: 'Shallow clone (last 10 commits)', code: 'git clone --depth 10 https://github.com/user/repo.git' },
            { desc: 'Clone specific branch only', code: 'git clone --branch develop --single-branch https://github.com/user/repo.git' }
        ]
    },
    'git status': {
        description: 'Show the working tree status',
        synopsis: 'git status [options] [--] [<pathspec>...]',
        options: [
            { flag: '-s, --short', desc: 'Give output in short format' },
            { flag: '-b, --branch', desc: 'Show branch and tracking info even in short format' },
            { flag: '--porcelain', desc: 'Machine-readable format for scripting' },
            { flag: '-u, --untracked-files', desc: 'Show untracked files (all, normal, no)' },
            { flag: '--ignored', desc: 'Show ignored files' },
            { flag: '-v, --verbose', desc: 'Show detailed diff of staged changes' },
            { flag: '--ahead-behind', desc: 'Display how many commits ahead/behind tracking branch' }
        ],
        examples: [
            { desc: 'Check current status', code: 'git status' },
            { desc: 'Short status format', code: 'git status -s' },
            { desc: 'Show branch info with short format', code: 'git status -sb' },
            { desc: 'Include ignored files', code: 'git status --ignored' }
        ]
    },
    'git config': {
        description: 'Get and set repository or global options',
        synopsis: 'git config [--global|--system|--local] <name> [<value>]',
        options: [
            { flag: '--global', desc: 'Write to global ~/.gitconfig file' },
            { flag: '--local', desc: 'Write to repository .git/config (default)' },
            { flag: '--system', desc: 'Write to system-wide /etc/gitconfig' },
            { flag: '--list', desc: 'List all variables set in config' },
            { flag: '--edit', desc: 'Open config file in editor' },
            { flag: '--unset', desc: 'Remove a variable from config file' },
            { flag: '--get', desc: 'Get the value of a config key' },
            { flag: '--show-origin', desc: 'Show which file each config comes from' }
        ],
        examples: [
            { desc: 'Set your name globally', code: 'git config --global user.name "Your Name"' },
            { desc: 'Set your email globally', code: 'git config --global user.email "you@example.com"' },
            { desc: 'List all settings', code: 'git config --list' },
            { desc: 'Set default editor', code: 'git config --global core.editor "code --wait"' },
            { desc: 'Set default branch name', code: 'git config --global init.defaultBranch main' }
        ]
    },
    'git add': {
        description: 'Add file contents to the staging area (index)',
        synopsis: 'git add [options] [--] <pathspec>...',
        options: [
            { flag: '.', desc: 'Add all changes in current directory and subdirectories' },
            { flag: '-A, --all', desc: 'Add all changes including deletions in entire working tree' },
            { flag: '-u, --update', desc: 'Update only already-tracked files (stage modifications and deletions)' },
            { flag: '-p, --patch', desc: 'Interactive mode - choose hunks to stage' },
            { flag: '-n, --dry-run', desc: 'Show what would be added without actually adding' },
            { flag: '-f, --force', desc: 'Add ignored files' },
            { flag: '-i, --interactive', desc: 'Interactive mode for adding files' },
            { flag: '--intent-to-add', desc: 'Record only that path will be added later' }
        ],
        examples: [
            { desc: 'Stage a specific file', code: 'git add filename.js' },
            { desc: 'Stage all changes', code: 'git add .' },
            { desc: 'Stage all including deletions', code: 'git add -A' },
            { desc: 'Interactive staging (choose hunks)', code: 'git add -p' },
            { desc: 'Stage multiple files', code: 'git add file1.js file2.js' }
        ]
    },
    'git commit': {
        description: 'Record changes to the repository',
        synopsis: 'git commit [options] [--] [<pathspec>...]',
        options: [
            { flag: '-m <msg>', desc: 'Use the given message as the commit message' },
            { flag: '-a, --all', desc: 'Stage all modified and deleted files automatically' },
            { flag: '--amend', desc: 'Replace the tip of current branch by creating a new commit' },
            { flag: '--no-edit', desc: 'Use the selected commit message without editing (with --amend)' },
            { flag: '-v, --verbose', desc: 'Show diff of changes in commit message editor' },
            { flag: '--allow-empty', desc: 'Allow creating commit with no changes' },
            { flag: '--author=<author>', desc: 'Override the commit author' },
            { flag: '--date=<date>', desc: 'Override the author date' },
            { flag: '-S, --gpg-sign', desc: 'GPG-sign the commit' }
        ],
        examples: [
            { desc: 'Commit with message', code: 'git commit -m "Add login feature"' },
            { desc: 'Stage and commit all changes', code: 'git commit -am "Fix all bugs"' },
            { desc: 'Amend last commit message', code: 'git commit --amend -m "New message"' },
            { desc: 'Add to last commit without changing message', code: 'git commit --amend --no-edit' }
        ]
    },
    'git push': {
        description: 'Update remote refs along with associated objects',
        synopsis: 'git push [options] [<repository> [<refspec>...]]',
        options: [
            { flag: '-u, --set-upstream', desc: 'Set upstream (tracking) reference for future pulls/pushes' },
            { flag: '-f, --force', desc: 'Force push (DANGEROUS - overwrites remote history)' },
            { flag: '--force-with-lease', desc: 'Safer force push - fails if remote has new commits' },
            { flag: '--all', desc: 'Push all branches' },
            { flag: '--tags', desc: 'Push tags along with branches' },
            { flag: '-d, --delete', desc: 'Delete remote branches' },
            { flag: '--dry-run', desc: 'Show what would be pushed without actually pushing' },
            { flag: '-v, --verbose', desc: 'Run verbosely' }
        ],
        examples: [
            { desc: 'Push current branch', code: 'git push' },
            { desc: 'Push and set upstream', code: 'git push -u origin feature/login' },
            { desc: 'Push all branches', code: 'git push --all' },
            { desc: 'Delete remote branch', code: 'git push origin --delete old-branch' },
            { desc: 'Force push with safety', code: 'git push --force-with-lease' }
        ]
    },
    'git pull': {
        description: 'Fetch from and integrate with another repository or local branch',
        synopsis: 'git pull [options] [<repository> [<refspec>...]]',
        options: [
            { flag: '--rebase', desc: 'Rebase local commits on top of fetched branch' },
            { flag: '--no-rebase', desc: 'Merge fetched branch into current (default)' },
            { flag: '--ff-only', desc: 'Only fast-forward, fail if merge is needed' },
            { flag: '--no-commit', desc: 'Perform merge but don\'t auto-commit' },
            { flag: '--squash', desc: 'Combine incoming commits into single change' },
            { flag: '-v, --verbose', desc: 'Run verbosely' },
            { flag: '--autostash', desc: 'Stash local changes before pulling, then unstash after' }
        ],
        examples: [
            { desc: 'Pull latest changes', code: 'git pull' },
            { desc: 'Pull with rebase (cleaner history)', code: 'git pull --rebase' },
            { desc: 'Pull specific branch', code: 'git pull origin develop' },
            { desc: 'Pull and auto-stash local changes', code: 'git pull --autostash' }
        ]
    },
    'git diff': {
        description: 'Show changes between commits, commit and working tree, etc',
        synopsis: 'git diff [options] [<commit>] [--] [<path>...]',
        options: [
            { flag: '--staged, --cached', desc: 'Show staged changes (what will be committed)' },
            { flag: '--stat', desc: 'Show summary statistics instead of full diff' },
            { flag: '--name-only', desc: 'Show only names of changed files' },
            { flag: '--name-status', desc: 'Show names and status (added/modified/deleted)' },
            { flag: '-w, --ignore-all-space', desc: 'Ignore whitespace changes' },
            { flag: '--color-words', desc: 'Show word-level diff with colors' },
            { flag: '--no-color', desc: 'Turn off colored diff output' },
            { flag: '-p, --patch', desc: 'Generate patch (default)' }
        ],
        examples: [
            { desc: 'See unstaged changes', code: 'git diff' },
            { desc: 'See staged changes', code: 'git diff --staged' },
            { desc: 'Diff between two branches', code: 'git diff main..feature' },
            { desc: 'Diff specific file', code: 'git diff -- path/to/file.js' },
            { desc: 'Show only changed filenames', code: 'git diff --name-only' }
        ]
    },
    'git log': {
        description: 'Show commit logs',
        synopsis: 'git log [options] [<revision range>] [[--] <path>...]',
        options: [
            { flag: '--oneline', desc: 'Compact one-line format' },
            { flag: '-n <number>', desc: 'Limit output to n commits' },
            { flag: '--graph', desc: 'Show ASCII graph of branch structure' },
            { flag: '--all', desc: 'Show commits from all branches' },
            { flag: '--stat', desc: 'Show stats of files changed' },
            { flag: '-p, --patch', desc: 'Show full diff of each commit' },
            { flag: '--author=<pattern>', desc: 'Show commits by specific author' },
            { flag: '--since=<date>', desc: 'Show commits since date' },
            { flag: '--until=<date>', desc: 'Show commits before date' },
            { flag: '--grep=<pattern>', desc: 'Search commit messages' }
        ],
        examples: [
            { desc: 'Compact history', code: 'git log --oneline' },
            { desc: 'Last 5 commits', code: 'git log -5' },
            { desc: 'Visual branch graph', code: 'git log --oneline --graph --all' },
            { desc: 'Commits by author', code: 'git log --author="John"' },
            { desc: 'Commits from last week', code: 'git log --since="1 week ago"' }
        ]
    },
    'git branch': {
        description: 'List, create, or delete branches',
        synopsis: 'git branch [options] [<branchname>]',
        options: [
            { flag: '-a, --all', desc: 'List both remote and local branches' },
            { flag: '-r, --remotes', desc: 'List remote-tracking branches' },
            { flag: '-d, --delete', desc: 'Delete a branch (safe - checks if merged)' },
            { flag: '-D', desc: 'Force delete a branch (even if not merged)' },
            { flag: '-m, --move', desc: 'Rename a branch' },
            { flag: '-c, --copy', desc: 'Copy a branch' },
            { flag: '-v, --verbose', desc: 'Show SHA1 and commit subject for each branch' },
            { flag: '--merged', desc: 'List branches merged into current' },
            { flag: '--no-merged', desc: 'List branches not yet merged' }
        ],
        examples: [
            { desc: 'List local branches', code: 'git branch' },
            { desc: 'List all branches', code: 'git branch -a' },
            { desc: 'Create new branch', code: 'git branch feature/new-feature' },
            { desc: 'Delete merged branch', code: 'git branch -d old-branch' },
            { desc: 'Rename current branch', code: 'git branch -m new-name' }
        ]
    },
    'git checkout': {
        description: 'Switch branches or restore working tree files',
        synopsis: 'git checkout [options] <branch> | git checkout [options] [<tree-ish>] -- <pathspec>',
        options: [
            { flag: '-b <new_branch>', desc: 'Create and checkout a new branch' },
            { flag: '-B <new_branch>', desc: 'Create/reset branch and checkout' },
            { flag: '--track', desc: 'Set up tracking mode for new branch' },
            { flag: '-f, --force', desc: 'Force checkout (throw away local modifications)' },
            { flag: '--orphan <branch>', desc: 'Create new orphan branch' },
            { flag: '-p, --patch', desc: 'Interactively select hunks to discard' },
            { flag: '--', desc: 'Separator for file paths (to restore files)' }
        ],
        examples: [
            { desc: 'Switch to existing branch', code: 'git checkout main' },
            { desc: 'Create and switch to new branch', code: 'git checkout -b feature/login' },
            { desc: 'Discard changes in a file', code: 'git checkout -- filename.js' },
            { desc: 'Restore all files', code: 'git checkout -- .' },
            { desc: 'Checkout remote branch', code: 'git checkout -b local-name origin/remote-name' }
        ]
    },
    'git merge': {
        description: 'Join two or more development histories together',
        synopsis: 'git merge [options] <branch>',
        options: [
            { flag: '--no-ff', desc: 'Create merge commit even when fast-forward is possible' },
            { flag: '--ff-only', desc: 'Only fast-forward, fail if merge commit needed' },
            { flag: '--squash', desc: 'Squash all commits into a single commit (no merge commit)' },
            { flag: '--abort', desc: 'Abort the current conflict resolution and reset' },
            { flag: '--continue', desc: 'Continue after resolving conflicts' },
            { flag: '-m <msg>', desc: 'Set the merge commit message' },
            { flag: '--no-commit', desc: 'Perform merge but don\'t auto-commit' },
            { flag: '-s <strategy>', desc: 'Use specific merge strategy' }
        ],
        examples: [
            { desc: 'Merge branch into current', code: 'git merge feature/login' },
            { desc: 'Merge with commit message', code: 'git merge -m "Merge feature" feature/login' },
            { desc: 'Squash merge (combine commits)', code: 'git merge --squash feature/login' },
            { desc: 'Abort merge conflict', code: 'git merge --abort' },
            { desc: 'Always create merge commit', code: 'git merge --no-ff feature/login' }
        ]
    },
    'git stash': {
        description: 'Stash the changes in a dirty working directory away',
        synopsis: 'git stash [push | pop | list | show | drop | clear | apply] [options]',
        options: [
            { flag: 'push', desc: 'Save current changes to a new stash (default)' },
            { flag: 'pop', desc: 'Apply most recent stash and remove from stash list' },
            { flag: 'apply', desc: 'Apply most recent stash but keep it in list' },
            { flag: 'list', desc: 'List all stashed changes' },
            { flag: 'show', desc: 'Show changes in most recent stash' },
            { flag: 'drop', desc: 'Remove a stash entry from list' },
            { flag: 'clear', desc: 'Remove all stash entries' },
            { flag: '-u, --include-untracked', desc: 'Also stash untracked files' },
            { flag: '-m, --message <msg>', desc: 'Add a description to the stash' }
        ],
        examples: [
            { desc: 'Stash current changes', code: 'git stash' },
            { desc: 'Stash with message', code: 'git stash save "WIP: login feature"' },
            { desc: 'List all stashes', code: 'git stash list' },
            { desc: 'Apply and remove latest stash', code: 'git stash pop' },
            { desc: 'Apply specific stash', code: 'git stash apply stash@{2}' },
            { desc: 'Stash including untracked files', code: 'git stash -u' }
        ]
    },
    'git reset': {
        description: 'Reset current HEAD to the specified state',
        synopsis: 'git reset [options] [<commit>] [-- <path>...]',
        options: [
            { flag: '--soft', desc: 'Keep changes staged (in index)' },
            { flag: '--mixed', desc: 'Keep changes but unstaged (default)' },
            { flag: '--hard', desc: 'Discard all changes (DANGEROUS)' },
            { flag: '--merge', desc: 'Reset but keep local changes if possible' },
            { flag: '--keep', desc: 'Reset and keep working tree changes' },
            { flag: 'HEAD~n', desc: 'Go back n commits' }
        ],
        examples: [
            { desc: 'Unstage a file', code: 'git reset HEAD filename.js' },
            { desc: 'Undo last commit, keep changes staged', code: 'git reset --soft HEAD~1' },
            { desc: 'Undo last commit, keep changes unstaged', code: 'git reset HEAD~1' },
            { desc: 'Undo last commit completely (DANGER)', code: 'git reset --hard HEAD~1' },
            { desc: 'Reset to specific commit', code: 'git reset --hard abc123' }
        ]
    },
    'git revert': {
        description: 'Revert some existing commits (creates new commit to undo)',
        synopsis: 'git revert [options] <commit>...',
        options: [
            { flag: '-n, --no-commit', desc: 'Don\'t auto-commit the revert' },
            { flag: '-m <parent>', desc: 'Specify parent number for merge commits' },
            { flag: '--abort', desc: 'Cancel revert operation' },
            { flag: '--continue', desc: 'Continue after resolving conflicts' },
            { flag: '-e, --edit', desc: 'Edit commit message before committing' }
        ],
        examples: [
            { desc: 'Revert last commit', code: 'git revert HEAD' },
            { desc: 'Revert specific commit', code: 'git revert abc123' },
            { desc: 'Revert without auto-committing', code: 'git revert -n HEAD' },
            { desc: 'Revert merge commit', code: 'git revert -m 1 abc123' }
        ]
    },
    'git restore': {
        description: 'Restore working tree files',
        synopsis: 'git restore [options] [<pathspec>...]',
        options: [
            { flag: '--staged', desc: 'Restore the index (unstage files)' },
            { flag: '--worktree', desc: 'Restore working tree (default)' },
            { flag: '-s, --source=<tree>', desc: 'Restore from a specific commit' },
            { flag: '-p, --patch', desc: 'Interactively select hunks to restore' }
        ],
        examples: [
            { desc: 'Discard changes in a file', code: 'git restore filename.js' },
            { desc: 'Unstage a file', code: 'git restore --staged filename.js' },
            { desc: 'Restore file from specific commit', code: 'git restore --source=HEAD~2 filename.js' },
            { desc: 'Restore all files', code: 'git restore .' }
        ]
    },
    'git remote': {
        description: 'Manage set of tracked repositories',
        synopsis: 'git remote [options] | git remote add <name> <url>',
        options: [
            { flag: '-v, --verbose', desc: 'Show remote URLs' },
            { flag: 'add <name> <url>', desc: 'Add a new remote' },
            { flag: 'remove <name>', desc: 'Remove a remote' },
            { flag: 'rename <old> <new>', desc: 'Rename a remote' },
            { flag: 'set-url <name> <url>', desc: 'Change remote URL' },
            { flag: 'show <name>', desc: 'Show information about a remote' }
        ],
        examples: [
            { desc: 'List remotes with URLs', code: 'git remote -v' },
            { desc: 'Add a new remote', code: 'git remote add upstream https://github.com/original/repo.git' },
            { desc: 'Change remote URL', code: 'git remote set-url origin https://github.com/new/repo.git' },
            { desc: 'Remove a remote', code: 'git remote remove upstream' }
        ]
    },
    'git fetch': {
        description: 'Download objects and refs from another repository',
        synopsis: 'git fetch [options] [<repository> [<refspec>...]]',
        options: [
            { flag: '--all', desc: 'Fetch all remotes' },
            { flag: '-p, --prune', desc: 'Remove remote-tracking refs that no longer exist' },
            { flag: '--tags', desc: 'Fetch all tags' },
            { flag: '--depth=<n>', desc: 'Limit fetching to specified depth' },
            { flag: '-v, --verbose', desc: 'Run verbosely' }
        ],
        examples: [
            { desc: 'Fetch from origin', code: 'git fetch origin' },
            { desc: 'Fetch all remotes', code: 'git fetch --all' },
            { desc: 'Fetch and prune deleted branches', code: 'git fetch --prune' },
            { desc: 'Fetch specific branch', code: 'git fetch origin main' }
        ]
    },
    'git init': {
        description: 'Create an empty Git repository or reinitialize an existing one',
        synopsis: 'git init [options] [<directory>]',
        options: [
            { flag: '--bare', desc: 'Create a bare repository (no working directory)' },
            { flag: '-b, --initial-branch=<name>', desc: 'Set initial branch name' },
            { flag: '--template=<dir>', desc: 'Use template directory' },
            { flag: '-q, --quiet', desc: 'Only print error messages' }
        ],
        examples: [
            { desc: 'Initialize in current directory', code: 'git init' },
            { desc: 'Initialize in new directory', code: 'git init my-project' },
            { desc: 'Initialize with main as default branch', code: 'git init -b main' },
            { desc: 'Create bare repository', code: 'git init --bare my-project.git' }
        ]
    }
};

function initCommandInfoModal() {
    const modal = document.getElementById('commandModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    
    // Event listener for all info buttons
    document.addEventListener('click', (e) => {
        const infoBtn = e.target.closest('.info-btn, .info-btn-small');
        if (infoBtn) {
            e.stopPropagation();
            const command = infoBtn.getAttribute('data-command');
            if (command && commandData[command]) {
                showCommandInfo(command);
            }
        }
    });
    
    // Close modal
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

function showCommandInfo(command) {
    const modal = document.getElementById('commandModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const data = commandData[command];
    if (!data) return;
    
    modalTitle.textContent = command;
    
    let html = `
        <div class="command-info-section">
            <h4>Description</h4>
            <p>${data.description}</p>
        </div>
        <div class="command-info-section">
            <h4>Synopsis</h4>
            <div class="command-synopsis">${data.synopsis}</div>
        </div>
        <div class="command-info-section">
            <h4>Common Options</h4>
            <ul class="option-list">
                ${data.options.map(opt => `
                    <li class="option-item">
                        <span class="option-flag">${opt.flag}</span>
                        <span class="option-desc">${opt.desc}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
        <div class="command-info-section">
            <h4>Examples</h4>
            ${data.examples.map(ex => `
                <div class="example-block">
                    <p>${ex.desc}</p>
                    <code>${ex.code}</code>
                </div>
            `).join('')}
        </div>
    `;
    
    modalBody.innerHTML = html;
    modal.classList.add('active');
}

// =====================================================
// QUIZ SYSTEM
// =====================================================
const quizData = {
    'getting-started': [
        {
            question: "What does 'git clone' actually do?",
            options: [
                "Downloads only the latest version of files",
                "Creates a copy of the repository including all history and branches",
                "Creates a link to the remote repository",
                "Copies only the README file"
            ],
            correct: 1
        },
        {
            question: "After cloning a repository, which directory contains Git's internal data?",
            options: [
                ".github folder",
                ".gitconfig folder",
                ".git folder",
                "git-data folder"
            ],
            correct: 2
        },
        {
            question: "What does 'git status' show when it says 'working tree clean'?",
            options: [
                "There are no files in the project",
                "All files have been deleted",
                "There are no uncommitted changes",
                "Git has been uninstalled"
            ],
            correct: 2
        },
        {
            question: "Which git config scope affects ALL repositories on your machine?",
            options: [
                "--local",
                "--global",
                "--system",
                "--universal"
            ],
            correct: 1
        },
        {
            question: "If you run 'git clone repo.git my-folder', where will the files be placed?",
            options: [
                "In the current directory",
                "In a folder named 'repo'",
                "In a folder named 'my-folder'",
                "In your home directory"
            ],
            correct: 2
        },
        {
            question: "What is 'origin' in Git terminology?",
            options: [
                "The main branch name",
                "The default name for the remote repository you cloned from",
                "The first commit in the repository",
                "The original author of the code"
            ],
            correct: 1
        },
        {
            question: "Why is it important to set your email with git config?",
            options: [
                "Git won't work without it",
                "It's used for password recovery",
                "It tags your commits with your identity for attribution",
                "It enables push access"
            ],
            correct: 2
        },
        {
            question: "What command shows you the URL of your remote repository?",
            options: [
                "git remote show",
                "git remote -v",
                "git url",
                "git origin --show"
            ],
            correct: 1
        },
        {
            question: "When cloning, what does the '--depth 1' option do?",
            options: [
                "Clones only the first folder",
                "Creates a shallow clone with only the most recent commit",
                "Limits to one branch",
                "Downloads faster internet"
            ],
            correct: 1
        },
        {
            question: "What happens if you try to clone into a folder that already exists and is not empty?",
            options: [
                "It overwrites all files",
                "It merges the repositories",
                "Git shows an error and refuses to clone",
                "It creates a subfolder automatically"
            ],
            correct: 2
        }
    ],
    'daily-workflow': [
        {
            question: "What is the correct order of the basic Git workflow?",
            options: [
                "commit → add → push",
                "add → commit → push",
                "push → commit → add",
                "commit → push → add"
            ],
            correct: 1
        },
        {
            question: "What does 'git add .' do?",
            options: [
                "Adds only .txt files",
                "Adds only new files",
                "Stages all changes in current directory and subdirectories",
                "Commits all files"
            ],
            correct: 2
        },
        {
            question: "What's the difference between 'git add .' and 'git add -A'?",
            options: [
                "They are identical in all cases",
                "'git add -A' also includes deletions from the entire working tree",
                "'git add .' is faster",
                "'git add -A' only adds new files"
            ],
            correct: 1
        },
        {
            question: "What does 'git diff --staged' show?",
            options: [
                "Differences between your last two commits",
                "Changes that have been staged but not yet committed",
                "All uncommitted changes",
                "Differences between branches"
            ],
            correct: 1
        },
        {
            question: "If you run 'git pull' and see 'Already up to date', what does that mean?",
            options: [
                "There's an error with your connection",
                "Your local branch has all the commits from the remote",
                "You need to run git push first",
                "The remote repository is empty"
            ],
            correct: 1
        },
        {
            question: "What's wrong with the commit message: 'fixed stuff'?",
            options: [
                "It's too short",
                "It doesn't describe what was actually changed",
                "It should be in past tense",
                "It should start with a capital letter"
            ],
            correct: 1
        },
        {
            question: "What does 'git commit -am \"message\"' do?",
            options: [
                "Commits all files including untracked ones",
                "Stages all TRACKED modified files and commits with the message",
                "Adds all files and creates an empty commit",
                "Commits and pushes at the same time"
            ],
            correct: 1
        },
        {
            question: "What happens if you run 'git push' without having run 'git pull' first when the remote has new commits?",
            options: [
                "It works fine",
                "Git might reject the push if histories have diverged",
                "It automatically merges",
                "It deletes remote changes"
            ],
            correct: 1
        },
        {
            question: "What does 'git log --oneline -5' display?",
            options: [
                "The first 5 files in the repo",
                "The last 5 commits in a compact format",
                "5 lines of the last commit",
                "5 branches"
            ],
            correct: 1
        },
        {
            question: "In the output 'modified: README.md', what color is this typically shown in?",
            options: [
                "Green (staged)",
                "Red (unstaged/modified but not staged)",
                "Blue (new file)",
                "White (unchanged)"
            ],
            correct: 1
        }
    ],
    'branching': [
        {
            question: "What does 'git checkout -b feature/login' do?",
            options: [
                "Checks out an existing branch named feature/login",
                "Creates a new branch AND switches to it",
                "Only creates a new branch",
                "Deletes the feature/login branch"
            ],
            correct: 1
        },
        {
            question: "What's the difference between 'git branch feature' and 'git checkout -b feature'?",
            options: [
                "They are identical",
                "'git branch' creates but doesn't switch; '-b' creates AND switches",
                "'git branch' switches but doesn't create",
                "'checkout -b' only works for existing branches"
            ],
            correct: 1
        },
        {
            question: "What does 'git push -u origin feature/login' do?",
            options: [
                "Pushes and sets up tracking so future pushes don't need the branch name",
                "Updates the origin URL",
                "Uploads only to the user's folder",
                "Undoes the last push"
            ],
            correct: 0
        },
        {
            question: "What happens when you run 'git stash'?",
            options: [
                "Deletes all uncommitted changes",
                "Creates a commit with your changes",
                "Temporarily saves your uncommitted changes and cleans working directory",
                "Pushes changes to remote"
            ],
            correct: 2
        },
        {
            question: "What's the difference between 'git stash pop' and 'git stash apply'?",
            options: [
                "They are identical",
                "'pop' removes from stash list after applying; 'apply' keeps it in the list",
                "'apply' is faster",
                "'pop' only works on the first stash"
            ],
            correct: 1
        },
        {
            question: "What does 'git merge --no-ff feature' do differently than a regular merge?",
            options: [
                "It's faster",
                "It always creates a merge commit even if fast-forward is possible",
                "It doesn't merge files",
                "It merges without checking for conflicts"
            ],
            correct: 1
        },
        {
            question: "What command shows all branches including remote branches?",
            options: [
                "git branch",
                "git branch -a",
                "git branch --remote-all",
                "git branches"
            ],
            correct: 1
        },
        {
            question: "Why might 'git branch -d mybranch' fail?",
            options: [
                "The branch name is too short",
                "The branch has commits not merged to current branch",
                "You can't delete branches",
                "The branch doesn't exist"
            ],
            correct: 1
        },
        {
            question: "What does the prefix 'feature/' in branch names like 'feature/login' indicate?",
            options: [
                "It's required by Git",
                "It's a naming convention to categorize branches",
                "It creates a folder structure",
                "It enables special Git features"
            ],
            correct: 1
        },
        {
            question: "What command would you use to see your stashed changes without applying them?",
            options: [
                "git stash list",
                "git stash show",
                "git stash view",
                "git stash peek"
            ],
            correct: 1
        }
    ],
    'collaboration': [
        {
            question: "In a merge conflict, what do the '<<<<<<< HEAD' markers indicate?",
            options: [
                "The start of the file",
                "Your current branch's version of the conflicting code",
                "The remote's version",
                "A syntax error"
            ],
            correct: 1
        },
        {
            question: "What does 'git fetch origin' do compared to 'git pull origin'?",
            options: [
                "They are identical",
                "fetch downloads without merging; pull downloads AND merges",
                "fetch is for tags only",
                "pull is faster"
            ],
            correct: 1
        },
        {
            question: "When resolving a merge conflict, what should you do with the conflict markers (<<<<, ====, >>>>)?",
            options: [
                "Leave them in the file as comments",
                "Remove them after choosing/combining the code you want",
                "Replace them with your username",
                "Convert them to HTML comments"
            ],
            correct: 1
        },
        {
            question: "What does 'git merge --abort' do?",
            options: [
                "Deletes the branch being merged",
                "Cancels the merge and restores to state before merge started",
                "Forces the merge to complete",
                "Removes the merge commit"
            ],
            correct: 1
        },
        {
            question: "What's the safest way to resolve a merge conflict?",
            options: [
                "Always keep your version",
                "Always keep their version",
                "Review both versions and manually combine/choose the correct code",
                "Delete the conflicting file"
            ],
            correct: 2
        },
        {
            question: "After resolving a merge conflict, what's the next step?",
            options: [
                "git push immediately",
                "git add the resolved files, then git commit",
                "git merge again",
                "git revert the merge"
            ],
            correct: 1
        },
        {
            question: "What does 'git remote -v' show?",
            options: [
                "Version of git remote",
                "Verbose list of remote names and their URLs",
                "Valid remotes only",
                "Remote variables"
            ],
            correct: 1
        },
        {
            question: "Why might you want to use 'git fetch' instead of 'git pull'?",
            options: [
                "fetch is always faster",
                "To see incoming changes before deciding to merge them",
                "fetch doesn't require internet",
                "pull doesn't download anything"
            ],
            correct: 1
        },
        {
            question: "What causes a merge conflict?",
            options: [
                "Pushing too often",
                "Two people editing the same lines in the same file",
                "Using different Git versions",
                "Not having internet connection"
            ],
            correct: 1
        },
        {
            question: "What does '=======' represent in a merge conflict?",
            options: [
                "A divider between your changes and incoming changes",
                "Equal importance of both changes",
                "A syntax error marker",
                "The end of the file"
            ],
            correct: 0
        }
    ],
    'troubleshooting': [
        {
            question: "What's the difference between 'git reset --soft HEAD~1' and 'git reset --hard HEAD~1'?",
            options: [
                "They are identical",
                "soft keeps changes staged; hard discards ALL changes",
                "soft is faster",
                "hard only works on local branches"
            ],
            correct: 1
        },
        {
            question: "What does 'git commit --amend' do?",
            options: [
                "Creates a new commit",
                "Modifies/replaces the most recent commit",
                "Deletes the last commit",
                "Amends all commits"
            ],
            correct: 1
        },
        {
            question: "Why should you use 'git revert' instead of 'git reset' for pushed commits?",
            options: [
                "revert is faster",
                "revert creates a new commit that undoes changes, preserving history for others",
                "reset doesn't work after push",
                "They do the same thing"
            ],
            correct: 1
        },
        {
            question: "What does 'git checkout -- filename.js' do?",
            options: [
                "Creates a new file",
                "Discards uncommitted changes in that specific file",
                "Checks if the file exists",
                "Moves the file to a new branch"
            ],
            correct: 1
        },
        {
            question: "What does 'HEAD~1' refer to?",
            options: [
                "The next commit",
                "The first commit ever",
                "One commit before the current HEAD (parent commit)",
                "The head of branch 1"
            ],
            correct: 2
        },
        {
            question: "What happens if you accidentally committed a password file and pushed it?",
            options: [
                "Just delete it and push again",
                "The password is in Git history forever unless you rewrite history",
                "It's automatically encrypted",
                "Git prevents this automatically"
            ],
            correct: 1
        },
        {
            question: "What does 'git reset HEAD filename' do?",
            options: [
                "Deletes the file",
                "Unstages the file (removes from staging area but keeps changes)",
                "Reverts the file to last commit",
                "Commits the file"
            ],
            correct: 1
        },
        {
            question: "What's the modern equivalent of 'git checkout -- filename'?",
            options: [
                "git remove filename",
                "git restore filename",
                "git discard filename",
                "git undo filename"
            ],
            correct: 1
        },
        {
            question: "When would 'git reset --hard' be dangerous?",
            options: [
                "It's never dangerous",
                "When you have uncommitted changes you want to keep",
                "When working offline",
                "When the repository is large"
            ],
            correct: 1
        },
        {
            question: "What does 'git restore --staged filename' do?",
            options: [
                "Stages the file",
                "Unstages the file (moves from staging to working directory)",
                "Deletes the file",
                "Restores from backup"
            ],
            correct: 1
        }
    ],
    'commands': [
        {
            question: "Which command shows the differences between staging area and last commit?",
            options: [
                "git diff",
                "git diff --staged",
                "git diff HEAD~1",
                "git status -v"
            ],
            correct: 1
        },
        {
            question: "What does 'git log --graph --oneline --all' show?",
            options: [
                "A list of all files",
                "A visual ASCII representation of all branches and their commits",
                "Graph of contributors",
                "Online documentation"
            ],
            correct: 1
        },
        {
            question: "Which command would you use to see who changed each line in a file?",
            options: [
                "git log filename",
                "git blame filename",
                "git history filename",
                "git who filename"
            ],
            correct: 1
        },
        {
            question: "What does 'git reflog' show that 'git log' doesn't?",
            options: [
                "Reference log - history of HEAD movements including resets and rebases",
                "Logging configuration",
                "Remote logs",
                "They show the same thing"
            ],
            correct: 0
        },
        {
            question: "Which command is used to apply a specific commit from another branch?",
            options: [
                "git merge commit-hash",
                "git cherry-pick commit-hash",
                "git apply commit-hash",
                "git grab commit-hash"
            ],
            correct: 1
        },
        {
            question: "What does 'git clean -fd' do?",
            options: [
                "Cleans up commit messages",
                "Removes untracked files and directories forcefully",
                "Cleans the staging area",
                "Optimizes the repository"
            ],
            correct: 1
        },
        {
            question: "Which command combines 'git fetch' and 'git merge' into one?",
            options: [
                "git sync",
                "git pull",
                "git update",
                "git download"
            ],
            correct: 1
        },
        {
            question: "What does 'git tag v1.0.0' create?",
            options: [
                "A new branch named v1.0.0",
                "A lightweight tag pointing to current commit",
                "A folder named v1.0.0",
                "A commit message"
            ],
            correct: 1
        },
        {
            question: "Which command shows configuration settings and where they're defined?",
            options: [
                "git config --list",
                "git config --list --show-origin",
                "git settings",
                "git config --all"
            ],
            correct: 1
        },
        {
            question: "What's the difference between 'git rm file' and just deleting the file?",
            options: [
                "They are identical",
                "git rm stages the deletion; regular delete requires git add after",
                "git rm is faster",
                "Regular delete doesn't work"
            ],
            correct: 1
        }
    ]
};

let currentQuiz = null;
let quizState = {};
let quizScores = JSON.parse(localStorage.getItem('gitQuizScores') || '{}');

function initAllQuizzes() {
    const quizSections = document.querySelectorAll('.quiz-section');
    
    quizSections.forEach(section => {
        const quizId = section.getAttribute('data-quiz-id');
        initQuiz(section, quizId);
    });
    
    // Initialize quiz result modal
    initQuizResultModal();
    
    // Update sidebar badges
    updateQuizBadges();
}

function initQuiz(section, quizId) {
    const questions = quizData[quizId];
    if (!questions) return;
    
    const questionsContainer = section.querySelector('.quiz-questions');
    const prevBtn = section.querySelector('.quiz-prev');
    const nextBtn = section.querySelector('.quiz-next');
    const submitBtn = section.querySelector('.quiz-submit');
    const progressFill = section.querySelector('.quiz-progress-fill');
    const currentQSpan = section.querySelector('.current-q');
    
    // Initialize quiz state
    quizState[quizId] = {
        currentQuestion: 0,
        answers: new Array(questions.length).fill(null)
    };
    
    // Render all questions
    questionsContainer.innerHTML = questions.map((q, index) => `
        <div class="quiz-question" data-q-index="${index}" ${index === 0 ? 'class="quiz-question active"' : ''}>
            <div class="question-text">Q${index + 1}. ${q.question}</div>
            <div class="question-options">
                ${q.options.map((opt, optIndex) => `
                    <label class="option-label">
                        <input type="radio" name="quiz-${quizId}-q${index}" value="${optIndex}">
                        <span class="option-marker">${String.fromCharCode(65 + optIndex)}</span>
                        <span class="option-text">${opt}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    // Set first question as active
    const firstQuestion = questionsContainer.querySelector('.quiz-question');
    if (firstQuestion) firstQuestion.classList.add('active');
    
    // Event listeners for options
    questionsContainer.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const qIndex = parseInt(e.target.closest('.quiz-question').getAttribute('data-q-index'));
            quizState[quizId].answers[qIndex] = parseInt(e.target.value);
        });
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', () => navigateQuiz(section, quizId, -1));
    nextBtn.addEventListener('click', () => navigateQuiz(section, quizId, 1));
    submitBtn.addEventListener('click', () => submitQuiz(quizId));
    
    // Update UI
    updateQuizUI(section, quizId);
}

function navigateQuiz(section, quizId, direction) {
    const state = quizState[quizId];
    const questions = quizData[quizId];
    const newIndex = state.currentQuestion + direction;
    
    if (newIndex < 0 || newIndex >= questions.length) return;
    
    state.currentQuestion = newIndex;
    
    // Update active question
    const questionEls = section.querySelectorAll('.quiz-question');
    questionEls.forEach((el, i) => {
        el.classList.toggle('active', i === newIndex);
    });
    
    updateQuizUI(section, quizId);
}

function updateQuizUI(section, quizId) {
    const state = quizState[quizId];
    const questions = quizData[quizId];
    const current = state.currentQuestion;
    
    const prevBtn = section.querySelector('.quiz-prev');
    const nextBtn = section.querySelector('.quiz-next');
    const submitBtn = section.querySelector('.quiz-submit');
    const progressFill = section.querySelector('.quiz-progress-fill');
    const currentQSpan = section.querySelector('.current-q');
    
    // Update progress
    const progress = ((current + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    currentQSpan.textContent = current + 1;
    
    // Update buttons
    prevBtn.disabled = current === 0;
    
    if (current === questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

function submitQuiz(quizId) {
    const state = quizState[quizId];
    const questions = quizData[quizId];
    
    // Check if all questions are answered
    const unanswered = state.answers.filter(a => a === null).length;
    if (unanswered > 0) {
        alert(`Please answer all questions. You have ${unanswered} unanswered question(s).`);
        return;
    }
    
    // Calculate score
    let score = 0;
    const results = questions.map((q, i) => {
        const isCorrect = state.answers[i] === q.correct;
        if (isCorrect) score++;
        return {
            question: q.question,
            userAnswer: q.options[state.answers[i]],
            correctAnswer: q.options[q.correct],
            isCorrect
        };
    });
    
    // Save score
    quizScores[quizId] = { score, total: questions.length, timestamp: Date.now() };
    localStorage.setItem('gitQuizScores', JSON.stringify(quizScores));
    
    // Show results modal
    showQuizResults(quizId, score, questions.length, results);
    
    // Update badges
    updateQuizBadges();
}

function showQuizResults(quizId, score, total, results) {
    const modal = document.getElementById('quizResultModal');
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreMessage = document.getElementById('scoreMessage');
    const reviewContainer = document.getElementById('quizReview');
    
    scoreNumber.textContent = score;
    
    // Remove existing classes
    scoreCircle.classList.remove('excellent', 'good', 'average', 'needs-work');
    
    // Set grade and message
    const percentage = (score / total) * 100;
    if (percentage >= 90) {
        scoreCircle.classList.add('excellent');
        scoreMessage.textContent = '🌟 Excellent! You\'re a Git master!';
    } else if (percentage >= 70) {
        scoreCircle.classList.add('good');
        scoreMessage.textContent = '👍 Good job! Keep practicing!';
    } else if (percentage >= 50) {
        scoreCircle.classList.add('average');
        scoreMessage.textContent = '📚 Not bad! Review the section again.';
    } else {
        scoreCircle.classList.add('needs-work');
        scoreMessage.textContent = '💪 Keep learning! You\'ll get there!';
    }
    
    // Build review HTML
    reviewContainer.innerHTML = results.map((r, i) => `
        <div class="review-item ${r.isCorrect ? 'correct' : 'incorrect'}">
            <span class="review-icon">${r.isCorrect ? '✅' : '❌'}</span>
            <div class="review-content">
                <div class="review-question">Q${i + 1}. ${r.question}</div>
                <div class="review-answer">
                    Your answer: ${r.userAnswer}
                    ${!r.isCorrect ? `<br><strong>Correct: ${r.correctAnswer}</strong>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Store current quiz for retry
    currentQuiz = quizId;
    
    modal.classList.add('active');
}

function initQuizResultModal() {
    const modal = document.getElementById('quizResultModal');
    const closeBtn = document.getElementById('quizResultClose');
    const retryBtn = document.getElementById('retryQuizBtn');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    retryBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        if (currentQuiz) {
            resetQuiz(currentQuiz);
        }
    });
}

function resetQuiz(quizId) {
    const section = document.querySelector(`.quiz-section[data-quiz-id="${quizId}"]`);
    if (!section) return;
    
    // Reset state
    quizState[quizId] = {
        currentQuestion: 0,
        answers: new Array(quizData[quizId].length).fill(null)
    };
    
    // Clear radio selections
    section.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    
    // Reset to first question
    const questionEls = section.querySelectorAll('.quiz-question');
    questionEls.forEach((el, i) => {
        el.classList.toggle('active', i === 0);
    });
    
    updateQuizUI(section, quizId);
    
    // Scroll to quiz
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateQuizBadges() {
    const badges = document.querySelectorAll('.quiz-badge');
    
    badges.forEach(badge => {
        const quizId = badge.getAttribute('data-quiz');
        const scoreData = quizScores[quizId];
        
        if (scoreData) {
            const percentage = (scoreData.score / scoreData.total) * 100;
            badge.classList.add('completed');
            badge.classList.remove('in-progress');
            badge.textContent = `${scoreData.score}/${scoreData.total}`;
        }
    });
}
