// Données initiales des cours
let courses = [
    {
        id: 1,
        title: "Bases de JavaScript",
        category: "development",
        icon: "fa-brands fa-js",
        level: "Débutant",
        duration: "5h 30m",
        instructor: "Sophie Dubois",
        desc: "Apprenez les concepts fondamentaux du langage JavaScript : variables, fonctions, structures de contrôle et manipulation du DOM.",
        enrolled: true,
        progress: 60,
        lessons: [
            { id: 101, title: "1. Introduction au JavaScript", duration: "10:15", completed: true, hasQuiz: false },
            { id: 102, title: "2. Les Variables et Types", duration: "12:30", completed: true, hasQuiz: false },
            { id: 103, title: "3. Les Fonctions & Événements", duration: "15:45", completed: true, hasQuiz: false },
            { 
                id: 104, 
                title: "4. Quiz - Structures et logique", 
                duration: "05:00", 
                completed: false, 
                hasQuiz: true,
                quiz: {
                    question: "Lequel des éléments suivants déclare une variable dont la valeur ne peut pas être réassignée ?",
                    options: ["var", "let", "const"],
                    correct: 2
                }
            },
            { id: 105, title: "5. Manipulation avancée du DOM", duration: "20:00", completed: false, hasQuiz: false }
        ]
    },
    {
        id: 2,
        title: "UI/UX Fondations",
        category: "design",
        icon: "fa-solid fa-wand-magic-sparkles",
        level: "Débutant",
        duration: "8h 15m",
        instructor: "Professeur Martin",
        desc: "Découvrez les principes clés du design d'interface (UI) et d'expérience utilisateur (UX) pour concevoir des applications web interactives.",
        enrolled: true,
        progress: 75,
        lessons: [
            { id: 201, title: "1. Comprendre l'expérience utilisateur", duration: "08:30", completed: true, hasQuiz: false },
            { id: 202, title: "2. Les principes du Design Visuel", duration: "14:10", completed: true, hasQuiz: false },
            { 
                id: 203, 
                title: "3. Quiz - Théorie des Couleurs", 
                duration: "05:00", 
                completed: true, 
                hasQuiz: true,
                quiz: {
                    question: "Quelle couleur évoque généralement la confiance, la sérénité et le professionnalisme en UI design ?",
                    options: ["Le Rouge", "Le Bleu", "Le Jaune"],
                    correct: 1
                }
            },
            { id: 204, title: "4. Introduction à CSS Grid & Flexbox", duration: "18:40", completed: false, hasQuiz: false }
        ]
    },
    {
        id: 3,
        title: "React.js pour les Débutants",
        category: "development",
        icon: "fa-brands fa-react",
        level: "Intermédiaire",
        duration: "10h 45m",
        instructor: "Sophie Dubois",
        desc: "Maîtrisez la bibliothèque JavaScript la plus populaire pour construire des applications front-end modernes basées sur des composants.",
        enrolled: false,
        progress: 0,
        lessons: [
            { id: 301, title: "1. Qu'est-ce que React.js ?", duration: "12:00", completed: false, hasQuiz: false },
            { id: 302, title: "2. JSX et rendu d'éléments", duration: "15:30", completed: false, hasQuiz: false },
            { id: 303, title: "3. Les Composants et les Props", duration: "18:20", completed: false, hasQuiz: false },
            { 
                id: 304, 
                title: "4. Quiz - Comprendre l'état (State)", 
                duration: "06:00", 
                completed: false, 
                hasQuiz: true,
                quiz: {
                    question: "Quel Hook React permet d'ajouter un état local dans un composant fonctionnel ?",
                    options: ["useEffect", "useState", "useContext"],
                    correct: 1
                }
            }
        ]
    },
    {
        id: 4,
        title: "Fondations du Marketing Digital",
        category: "business",
        icon: "fa-solid fa-bullhorn",
        level: "Débutant",
        duration: "6h 20m",
        instructor: "Alex Martin",
        desc: "Apprenez les bases du marketing en ligne, du SEO aux campagnes publicitaires payantes pour augmenter la visibilité de votre produit.",
        enrolled: false,
        progress: 0,
        lessons: [
            { id: 401, title: "1. Introduction au SEO", duration: "15:00", completed: false, hasQuiz: false },
            { id: 402, title: "2. Stratégies de contenu réseaux sociaux", duration: "18:30", completed: false, hasQuiz: false },
            { 
                id: 403, 
                title: "3. Quiz - Recherche de mots clés", 
                duration: "05:00", 
                completed: false, 
                hasQuiz: true,
                quiz: {
                    question: "Que signifie le sigle 'SEO' ?",
                    options: ["Social Engine Optimization", "Search Engine Optimization", "System Engine Operation"],
                    correct: 1
                }
            }
        ]
    }
];

// État actuel de l'application
let currentActiveCourse = courses[0]; // Cours actif par défaut dans la classe
let currentActiveLessonIndex = 0;

// Au chargement du document
document.addEventListener("DOMContentLoaded", () => {
    initRouter();
    renderDashboard();
    renderCatalog();
    initClassroom();
    initInstructorPortal();
    initThemeToggle();
    showToast("Bienvenue sur AuraLMS !", "info");
});

// ==========================================
// 1. ROUTEUR SPA (Single Page Application)
// ==========================================
function initRouter() {
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".view-section");

    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = item.getAttribute("data-target");

            // Met à jour la classe active de la navigation
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");

            // Affiche la bonne section avec animation
            sections.forEach(section => {
                section.classList.remove("active");
                if (section.id === targetId) {
                    section.classList.add("active");
                }
            });

            // Rafraîchir les données en fonction de l'onglet
            if (targetId === "dashboard") {
                renderDashboard();
            } else if (targetId === "catalog") {
                renderCatalog();
            } else if (targetId === "classroom") {
                initClassroom();
            }
        });
    });
}

// ==========================================
// 2. LOGIQUE DU TABLEAU DE BORD (DASHBOARD)
// ==========================================
function renderDashboard() {
    const enrolledCourses = courses.filter(c => c.enrolled);
    
    // Calcul des statistiques
    const statCoursesCount = document.getElementById("stat-courses-count");
    const statHours = document.getElementById("stat-hours");
    const statCertificates = document.getElementById("stat-certificates");
    const statScore = document.getElementById("stat-score");

    statCoursesCount.textContent = enrolledCourses.length;
    
    // Calcul du temps d'apprentissage fictif basé sur les cours
    let totalMinutes = 0;
    enrolledCourses.forEach(c => {
        c.lessons.forEach(l => {
            if (l.completed) {
                const parts = l.duration.split(":");
                totalMinutes += parseInt(parts[0]) || 0;
            }
        });
    });
    const hoursLearned = (totalMinutes / 60).toFixed(1);
    statHours.textContent = `${parseFloat(hoursLearned) + 12}h`; // +12h base initiale

    // Certificats (cours à 100% de progression)
    const completedCoursesCount = enrolledCourses.filter(c => c.progress === 100).length;
    statCertificates.textContent = completedCoursesCount;

    // Rendu de la liste "Continuer à apprendre"
    const inProgressContainer = document.getElementById("dashboard-in-progress");
    inProgressContainer.innerHTML = "";

    const activeEnrollments = enrolledCourses.filter(c => c.progress < 100);

    if (activeEnrollments.length === 0) {
        inProgressContainer.innerHTML = `
            <div class="progress-item-card" style="justify-content: center; text-align: center; padding: 30px 10px;">
                <div>
                    <i class="fa-solid fa-graduation-cap" style="font-size: 2rem; color: var(--purple); margin-bottom: 10px;"></i>
                    <p style="margin: 0; color: var(--text-secondary);">Vous n'avez pas de cours en cours de lecture. Explorez le catalogue !</p>
                </div>
            </div>
        `;
        return;
    }

    activeEnrollments.forEach(course => {
        // Obtenir la première leçon non complétée
        const nextLesson = course.lessons.find(l => !l.completed) || course.lessons[0];

        const card = document.createElement("div");
        card.className = "progress-item-card";
        card.innerHTML = `
            <div class="progress-course-details">
                <h4>${course.title}</h4>
                <p>Prochaine leçon : ${nextLesson.title}</p>
                <div class="progress-tracker">
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${course.progress}%"></div>
                    </div>
                    <span>${course.progress}%</span>
                </div>
            </div>
            <button class="btn btn-primary start-lesson-btn" data-course-id="${course.id}">
                <i class="fa-solid fa-play"></i> Continuer
            </button>
        `;

        // Événement clic sur le bouton pour aller à la classe directement
        card.querySelector(".start-lesson-btn").addEventListener("click", () => {
            currentActiveCourse = course;
            currentActiveLessonIndex = course.lessons.indexOf(nextLesson);
            
            // Simuler un clic sur l'onglet Classe
            document.querySelector("[data-target='classroom']").click();
        });

        inProgressContainer.appendChild(card);
    });
}

// ==========================================
// 3. LOGIQUE DU CATALOGUE DE COURS
// ==========================================
function renderCatalog(filterCategory = "all", searchQuery = "") {
    const grid = document.getElementById("catalog-course-grid");
    grid.innerHTML = "";

    // Filtrer les cours
    let filteredCourses = courses.filter(course => {
        const categoryMatch = filterCategory === "all" || course.category === filterCategory;
        const searchMatch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            course.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && searchMatch;
    });

    if (filteredCourses.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
                <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 15px;"></i>
                <p>Aucun cours ne correspond à vos critères de recherche.</p>
            </div>
        `;
        return;
    }

    filteredCourses.forEach(course => {
        const card = document.createElement("div");
        card.className = "course-card";
        
        let buttonText = "S'inscrire";
        let buttonClass = "btn-gradient";
        
        if (course.enrolled) {
            if (course.progress === 100) {
                buttonText = "Revoir (100%)";
                buttonClass = "btn-secondary";
            } else {
                buttonText = `Continuer (${course.progress}%)`;
                buttonClass = "btn-primary";
            }
        }

        card.innerHTML = `
            <div class="course-card-banner ${course.category}">
                <i class="${course.icon || 'fa-solid fa-book'}"></i>
            </div>
            <div class="course-card-content">
                <div class="course-meta-tags">
                    <span class="tag-badge category">${course.category}</span>
                    <span class="tag-badge level">${course.level}</span>
                </div>
                <h3>${course.title}</h3>
                <p>${course.desc}</p>
                <div class="course-stats-row">
                    <span><i class="fa-regular fa-clock"></i> ${course.duration}</span>
                    <span><i class="fa-solid fa-circle-play"></i> ${course.lessons.length} leçons</span>
                </div>
                <button class="btn ${buttonClass} enroll-btn" data-id="${course.id}">
                    ${buttonText}
                </button>
            </div>
        `;

        // Événement d'inscription / redirection
        card.querySelector(".enroll-btn").addEventListener("click", () => {
            if (!course.enrolled) {
                course.enrolled = true;
                course.progress = 0;
                showToast(`Inscrit avec succès à "${course.title}" !`, "success");
                renderCatalog(filterCategory, searchQuery); // Rerender
            } else {
                // Aller à la classe virtuelle directement
                currentActiveCourse = course;
                currentActiveLessonIndex = course.lessons.findIndex(l => !l.completed);
                if (currentActiveLessonIndex === -1) currentActiveLessonIndex = 0;
                document.querySelector("[data-target='classroom']").click();
            }
        });

        grid.appendChild(card);
    });

    // Mettre en place les écouteurs de filtres une seule fois au chargement
    setupCatalogEventListeners();
}

function setupCatalogEventListeners() {
    // Événement de filtrage par boutons de catégorie
    const filterTabs = document.querySelectorAll(".filter-tab");
    filterTabs.forEach(tab => {
        tab.replaceWith(tab.cloneNode(true)); // Évite les doublons d'écouteurs
    });
    
    // Ré-sélectionner car cloné
    const newFilterTabs = document.querySelectorAll(".filter-tab");
    newFilterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            newFilterTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const category = tab.getAttribute("data-category");
            const searchVal = document.getElementById("catalog-search-input").value;
            renderCatalog(category, searchVal);
        });
    });

    // Événement de recherche
    const searchInput = document.getElementById("catalog-search-input");
    searchInput.replaceWith(searchInput.cloneNode(true));
    const newSearchInput = document.getElementById("catalog-search-input");
    newSearchInput.addEventListener("input", () => {
        const activeTab = document.querySelector(".filter-tab.active");
        const category = activeTab ? activeTab.getAttribute("data-category") : "all";
        renderCatalog(category, newSearchInput.value);
    });
}

// ==========================================
// 4. LOGIQUE DE LA CLASSE VIRTUELLE (CLASSROOM)
// ==========================================
function initClassroom() {
    const listContainer = document.getElementById("classroom-curriculum-list");
    const courseTitle = document.getElementById("classroom-course-title");
    const courseCategory = document.getElementById("classroom-course-category");

    // S'il n'y a aucun cours d'inscrit
    const enrolledCourses = courses.filter(c => c.enrolled);
    if (enrolledCourses.length === 0) {
        courseTitle.textContent = "Aucun cours actif";
        courseCategory.textContent = "-";
        listContainer.innerHTML = `<p class="placeholder-text">Inscrivez-vous d'abord à un cours dans le catalogue.</p>`;
        document.getElementById("classroom-lesson-title").textContent = "Classe vide";
        document.getElementById("classroom-text-content").innerHTML = "<p>Veuillez choisir un cours pour commencer.</p>";
        document.getElementById("classroom-quiz-panel").style.display = "none";
        document.getElementById("classroom-video-container").style.display = "none";
        return;
    }

    // Assurer que le cours sélectionné fait partie de la liste d'inscrits, sinon prendre le premier inscrit
    if (!currentActiveCourse || !currentActiveCourse.enrolled) {
        currentActiveCourse = enrolledCourses[0];
        currentActiveLessonIndex = 0;
    }

    // Afficher infos cours
    courseTitle.textContent = currentActiveCourse.title;
    courseCategory.textContent = currentActiveCourse.category;
    document.getElementById("classroom-video-container").style.display = "block";

    // Rendu du syllabus
    listContainer.innerHTML = "";
    
    // Titre de module simulé
    const modTitle = document.createElement("div");
    modTitle.className = "curriculum-module-title";
    modTitle.textContent = "Module 1 - Fondamentaux";
    listContainer.appendChild(modTitle);

    currentActiveCourse.lessons.forEach((lesson, index) => {
        const item = document.createElement("div");
        item.className = `curriculum-lesson-item ${index === currentActiveLessonIndex ? 'active' : ''}`;
        
        let iconClass = "fa-regular fa-circle";
        if (lesson.completed) {
            iconClass = "fa-solid fa-circle-check";
        } else if (lesson.hasQuiz) {
            iconClass = "fa-solid fa-lightbulb";
        }

        item.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${lesson.title}</span>
        `;

        item.addEventListener("click", () => {
            currentActiveLessonIndex = index;
            renderActiveLesson();
            // Mettre à jour l'apparence active dans la barre latérale
            document.querySelectorAll(".curriculum-lesson-item").forEach(el => el.classList.remove("active"));
            item.classList.add("active");
        });

        listContainer.appendChild(item);
    });

    renderActiveLesson();
    setupClassroomNavigation();
}

function renderActiveLesson() {
    const lesson = currentActiveCourse.lessons[currentActiveLessonIndex];
    if (!lesson) return;

    // Métadonnées de la leçon
    document.getElementById("classroom-lesson-meta").textContent = `Module 1 • Leçon ${currentActiveLessonIndex + 1} (${lesson.duration})`;
    document.getElementById("classroom-lesson-title").textContent = lesson.title;

    // Contenu texte factice
    const textContent = document.getElementById("classroom-text-content");
    textContent.innerHTML = `
        <h3>Contenu didactique</h3>
        <p>Dans cette leçon du cours <strong>${currentActiveCourse.title}</strong>, nous explorons les concepts fondamentaux de cette partie. Nous aborderons les structures clés et les méthodes de mise en œuvre recommandées.</p>
        <p>Prenez le temps d'étudier la vidéo de démonstration ci-dessus. Des exercices pratiques et des documentations supplémentaires sont accessibles via le panneau d'activités.</p>
    `;

    // Gestion de l'affichage du Quiz
    const quizPanel = document.getElementById("classroom-quiz-panel");
    if (lesson.hasQuiz) {
        quizPanel.style.display = "block";
        renderQuiz(lesson.quiz, lesson.completed);
    } else {
        quizPanel.style.display = "none";
    }

    // Mise à jour de l'état des boutons Précédent/Suivant
    document.getElementById("classroom-prev-btn").disabled = currentActiveLessonIndex === 0;
    const nextBtn = document.getElementById("classroom-next-btn");
    
    if (currentActiveLessonIndex === currentActiveCourse.lessons.length - 1) {
        nextBtn.innerHTML = `Terminer le cours <i class="fa-solid fa-graduation-cap"></i>`;
    } else {
        nextBtn.innerHTML = `Suivant <i class="fa-solid fa-arrow-right"></i>`;
    }
}

function renderQuiz(quiz, isAlreadyCompleted) {
    const body = document.getElementById("classroom-quiz-body");
    const feedbackText = document.getElementById("quiz-feedback-text");
    const submitBtn = document.getElementById("submit-quiz-btn");
    
    feedbackText.className = "quiz-feedback-message";
    feedbackText.textContent = "";
    
    body.innerHTML = `
        <p class="quiz-question-text">${quiz.question}</p>
        <div class="quiz-options-list">
            ${quiz.options.map((opt, i) => `
                <label class="quiz-option ${isAlreadyCompleted && i === quiz.correct ? 'correct' : ''}" data-index="${i}">
                    <input type="radio" name="classroom-quiz-opts" value="${i}" ${isAlreadyCompleted ? 'disabled' : ''} ${isAlreadyCompleted && i === quiz.correct ? 'checked' : ''}>
                    <span>${opt}</span>
                </label>
            `).join('')}
        </div>
    `;

    if (isAlreadyCompleted) {
        submitBtn.style.display = "none";
        feedbackText.textContent = "Félicitations ! Vous avez déjà validé ce quiz.";
        feedbackText.classList.add("success");
    } else {
        submitBtn.style.display = "block";
        
        // Gérer la classe CSS active au choix d'option
        const options = body.querySelectorAll(".quiz-option");
        options.forEach(opt => {
            opt.addEventListener("click", () => {
                options.forEach(o => o.classList.remove("selected"));
                opt.classList.add("selected");
            });
        });
    }
}

function setupClassroomNavigation() {
    const prevBtn = document.getElementById("classroom-prev-btn");
    const nextBtn = document.getElementById("classroom-next-btn");
    const submitQuizBtn = document.getElementById("submit-quiz-btn");

    prevBtn.replaceWith(prevBtn.cloneNode(true));
    nextBtn.replaceWith(nextBtn.cloneNode(true));
    submitQuizBtn.replaceWith(submitQuizBtn.cloneNode(true));

    const newPrevBtn = document.getElementById("classroom-prev-btn");
    const newNextBtn = document.getElementById("classroom-next-btn");
    const newSubmitQuizBtn = document.getElementById("submit-quiz-btn");

    newPrevBtn.addEventListener("click", () => {
        if (currentActiveLessonIndex > 0) {
            currentActiveLessonIndex--;
            initClassroom();
        }
    });

    newNextBtn.addEventListener("click", () => {
        const lesson = currentActiveCourse.lessons[currentActiveLessonIndex];
        
        // Bloquer si la leçon a un quiz non complété
        if (lesson.hasQuiz && !lesson.completed) {
            showToast("Vous devez d'abord valider le quiz pour continuer !", "warning");
            const feedbackText = document.getElementById("quiz-feedback-text");
            feedbackText.textContent = "Veuillez d'abord réussir le quiz.";
            feedbackText.className = "quiz-feedback-message error";
            return;
        }

        // Marquer la leçon standard comme complétée automatiquement lors du passage à la suivante
        if (!lesson.completed) {
            lesson.completed = true;
            updateCourseProgress(currentActiveCourse);
        }

        if (currentActiveLessonIndex < currentActiveCourse.lessons.length - 1) {
            currentActiveLessonIndex++;
            initClassroom();
        } else {
            // Fin du cours !
            showToast(`Félicitations ! Vous avez complété le cours "${currentActiveCourse.title}".`, "success");
            renderDashboard();
            document.querySelector("[data-target='dashboard']").click();
        }
    });

    newSubmitQuizBtn.addEventListener("click", () => {
        const selectedOpt = document.querySelector("input[name='classroom-quiz-opts']:checked");
        const feedbackText = document.getElementById("quiz-feedback-text");

        if (!selectedOpt) {
            showToast("Veuillez sélectionner une réponse !", "warning");
            return;
        }

        const answerIndex = parseInt(selectedOpt.value);
        const quiz = currentActiveCourse.lessons[currentActiveLessonIndex].quiz;
        const optionsLabels = document.querySelectorAll(".quiz-option");

        if (answerIndex === quiz.correct) {
            // Succès
            currentActiveCourse.lessons[currentActiveLessonIndex].completed = true;
            updateCourseProgress(currentActiveCourse);
            
            // Appliquer styles visuels de correction
            optionsLabels.forEach(opt => {
                const optIndex = parseInt(opt.getAttribute("data-index"));
                if (optIndex === quiz.correct) {
                    opt.className = "quiz-option correct";
                }
                opt.querySelector("input").disabled = true;
            });

            newSubmitQuizBtn.style.display = "none";
            feedbackText.textContent = "Correct ! Quiz validé avec succès.";
            feedbackText.className = "quiz-feedback-message success";
            
            showToast("Quiz validé ! Nouvelle leçon débloquée.", "success");
            
            // Rendre à nouveau pour recharger le statut dans la sidebar
            setTimeout(() => {
                initClassroom();
            }, 1000);
        } else {
            // Échec
            optionsLabels.forEach(opt => {
                const optIndex = parseInt(opt.getAttribute("data-index"));
                if (optIndex === answerIndex) {
                    opt.className = "quiz-option wrong";
                }
            });
            feedbackText.textContent = "Réponse incorrecte. Veuillez réessayer.";
            feedbackText.className = "quiz-feedback-message error";
            showToast("Mauvaise réponse. Essayez encore !", "warning");
        }
    });
}

function updateCourseProgress(course) {
    const totalLessons = course.lessons.length;
    const completedLessons = course.lessons.filter(l => l.completed).length;
    course.progress = Math.round((completedLessons / totalLessons) * 100);
}

// ==========================================
// 5. PORTAIL INSTRUCTEUR - AJOUT DE COURS
// ==========================================
function initInstructorPortal() {
    const form = document.getElementById("create-course-form");
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const title = document.getElementById("course-title").value;
        const category = document.getElementById("course-category").value;
        const level = document.getElementById("course-level").value;
        const duration = document.getElementById("course-duration").value;
        const instructor = document.getElementById("course-instructor").value;
        const desc = document.getElementById("course-desc").value;
        
        // Quiz
        const qText = document.getElementById("quiz-question").value;
        const optA = document.getElementById("quiz-opt-a").value;
        const optB = document.getElementById("quiz-opt-b").value;
        const optC = document.getElementById("quiz-opt-c").value;
        const correctOpt = parseInt(document.getElementById("quiz-correct-answer").value);

        // Icônes dynamiques basées sur la catégorie
        let icon = "fa-solid fa-graduation-cap";
        if (category === "development") icon = "fa-solid fa-code";
        else if (category === "design") icon = "fa-solid fa-palette";
        else if (category === "business") icon = "fa-solid fa-chart-line";

        // Nouveau cours
        const newCourse = {
            id: courses.length + 1,
            title: title,
            category: category,
            icon: icon,
            level: level,
            duration: duration,
            instructor: instructor,
            desc: desc,
            enrolled: false,
            progress: 0,
            lessons: [
                { id: Date.now() + 1, title: "1. Concepts d'introduction", duration: "12:15", completed: false, hasQuiz: false },
                { 
                    id: Date.now() + 2, 
                    title: "2. Quiz de validation finale", 
                    duration: "05:00", 
                    completed: false, 
                    hasQuiz: true,
                    quiz: {
                        question: qText,
                        options: [optA, optB, optC],
                        correct: correctOpt
                    }
                }
            ]
        };

        courses.push(newCourse);
        showToast(`Cours "${title}" créé et publié avec succès !`, "success");
        form.reset();
        
        // Rediriger vers le catalogue pour voir le cours
        document.querySelector("[data-target='catalog']").click();
    });
}

// ==========================================
// 6. SYSTÈME DE TOASTS & NOTIFICATIONS
// ==========================================
function showToast(message, type = "info") {
    const container = document.getElementById("toast-box");
    
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let iconClass = "fa-solid fa-circle-info";
    if (type === "success") iconClass = "fa-solid fa-circle-check";
    else if (type === "warning") iconClass = "fa-solid fa-circle-exclamation";
    
    toast.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove après 4 secondes
    setTimeout(() => {
        toast.style.animation = "slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse forwards";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// ==========================================
// 7. SÉLECTEUR DE THÈME (DARK / LIGHT)
// ==========================================
function initThemeToggle() {
    const themeBtn = document.getElementById("theme-toggle");
    
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        
        const isLightTheme = document.body.classList.contains("light-theme");
        
        if (isLightTheme) {
            themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
            showToast("Mode clair activé", "info");
        } else {
            themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
            showToast("Mode sombre activé", "info");
        }
    });
}
